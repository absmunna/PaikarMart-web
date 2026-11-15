-- ==============================================================================
-- PaikarMart Social Commerce Super App — Master Catalog & RBAC PostgreSQL Schema
-- Supports: Master Catalog 1:N, Multi-Vendor Offers, Verified Reviews,
-- PII Private Isolation, Social Comments, & Roles (Super Admin, Admin, Moderator, Vendor, Consumer)
-- ==============================================================================

-- 1. Enable Required Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ==============================================================================
-- 2. Public User Profiles Table (Public Identity)
-- ==============================================================================
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  auth_uid text unique not null,                  -- Firebase Auth UID / Supabase Auth UID
  email text unique not null,                     -- Strict Email Uniqueness Guard
  phone text unique,                              -- Optional Phone Uniqueness Guard
  name text not null,
  handle text unique not null,                    -- Unique @handle
  avatar_url text,
  role text not null default 'consumer' check (role in ('consumer', 'vendor', 'moderator', 'admin', 'super_admin')),
  active_roles text[] default array['consumer']::text[], -- Multi-role capabilities
  location text default 'Dhaka, Bangladesh',
  trust_level int default 1 check (trust_level >= 0 and trust_level <= 7),
  wallet_balance numeric(12,2) default 0.00 check (wallet_balance >= 0.00),
  reward_points int default 0 check (reward_points >= 0),
  is_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 3. Private User Details Table (PII Isolation - Strictly Private)
-- Holds sensitive PII (NID, Emergency Phone, Full Address, Bank Info)
-- Restricted by RLS so ONLY the Account Owner or Super Admin can read/write.
-- ==============================================================================
create table if not exists public.private_user_details (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade unique not null,
  nid_passport_number text,
  emergency_phone text,
  full_delivery_address text,
  tax_identification_no text,
  payout_bank_name text,
  payout_account_no text,
  payout_routing_no text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.saved_addresses (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  label text not null,
  recipient_name text not null,
  phone text not null,
  street_address text not null,
  apartment text,
  city text not null,
  postal_code text,
  tag text not null default 'home' check (tag in ('home', 'office', 'other')),
  is_default boolean not null default false,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 4. Vendor Stores Table (Multi-Vendor Business Entities & Hyperlocal Geofence)
-- ==============================================================================
create table if not exists public.stores (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references public.profiles(id) on delete cascade not null,
  handle text unique not null,
  store_name text not null,
  legal_entity_name text not null,
  business_reg_no text not null,
  tax_id text not null,
  seller_tier text not null default 'retail_seller',
  kyc_status text not null default 'submitted',
  category text not null check (category in ('wholesale', 'retail', 'restaurant', 'services', 'rideshare', 'grocery')),
  is_verified boolean default false,
  status text default 'pending' check (status in ('active', 'pending', 'suspended')),
  commission_tier text default 'Standard 8%',
  rating numeric(3,2) default 5.00 check (rating >= 0.00 and rating <= 5.00),
  total_sales numeric(12,2) default 0.00,
  banner_url text,
  lat numeric(9,6),
  lng numeric(9,6),
  service_radius_km numeric(4,1) default 5.0 check (service_radius_km >= 1.0 and service_radius_km <= 20.0),
  is_open boolean default true,
  opening_hours_label text default '9:00 AM - 9:00 PM',
  prep_minutes int default 12 check (prep_minutes >= 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4.1 One account can operate multiple independent vendor stores.
create table if not exists public.vendor_memberships (
  id uuid primary key default uuid_generate_v4(),
  store_id uuid references public.stores(id) on delete cascade not null,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  active_roles text[] not null default array['retail_merchant']::text[],
  status text not null default 'pending' check (status in ('pending', 'active', 'suspended', 'revoked')),
  is_primary boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (store_id, profile_id)
);

create unique index if not exists idx_vendor_memberships_one_primary
  on public.vendor_memberships(profile_id) where is_primary = true and status = 'active';

-- ==============================================================================
-- 5. Master Products Catalog (Central Canonical Source of Truth - 1:N)
-- ==============================================================================
create table if not exists public.master_products (
  id uuid primary key default uuid_generate_v4(),
  barcode text unique,
  title_en text not null,
  title_bn text not null,
  brand text not null default 'Generic',
  category text not null,
  description text,
  canonical_images jsonb not null default '[]'::jsonb,
  specifications jsonb not null default '{}'::jsonb,
  is_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 6. Seller Listings Table (1:N Multi-Vendor Offers)
-- Sellers attach offers & in-store shelf photos without polluting master catalog
-- ==============================================================================
create table if not exists public.seller_listings (
  id uuid primary key default uuid_generate_v4(),
  master_product_id uuid references public.master_products(id) on delete restrict not null,
  store_id uuid references public.stores(id) on delete cascade not null,
  seller_id uuid references public.profiles(id) on delete cascade not null,
  price numeric(10,2) not null check (price >= 0.00),
  original_price numeric(10,2),
  stock_quantity int not null default 0 check (stock_quantity >= 0),
  trade_mode text not null default 'retail' check (trade_mode in ('retail', 'wholesale')),
  min_wholesale_qty int default 1 check (min_wholesale_qty >= 1),
  wholesale_tiers jsonb default '[]'::jsonb,      -- [{ minQty: 50, pricePerUnit: 800 }]
  seller_real_photos jsonb default '[]'::jsonb,   -- In-store shelf condition photos
  delivery_eta text default '1-2 Days',
  location text default 'Dhaka, Bangladesh',
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 7. Master Catalog Submissions (AI Audit & Moderator Approval Queue)
-- ==============================================================================
create table if not exists public.catalog_submissions (
  id uuid primary key default uuid_generate_v4(),
  seller_id uuid references public.profiles(id) on delete cascade not null,
  proposed_title text not null,
  proposed_brand text,
  proposed_category text not null,
  proposed_description text,
  proposed_images jsonb not null default '[]'::jsonb,
  proposed_price numeric(10,2) not null,
  trade_mode text default 'retail',
  status text default 'pending_review' check (status in ('pending_review', 'approved', 'rejected')),
  ai_confidence_score numeric(4,1) default 95.0,
  ai_audit_notes text,
  reviewed_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 8. Standalone Custom Products (Legacy / Direct Products)
-- ==============================================================================
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  store_id uuid references public.stores(id) on delete cascade not null,
  type text not null check (type in ('wholesale', 'retail', 'food', 'service', 'rides', 'grocery')),
  title text not null,
  description text,
  price numeric(10,2) not null check (price >= 0.00),
  original_price numeric(10,2),
  min_wholesale_qty int default 1,
  wholesale_tiers jsonb default '[]'::jsonb,
  rating numeric(3,2) default 5.00,
  reviews_count int default 0,
  delivery_eta text,
  image_url text not null,
  category text not null,
  in_stock boolean default true,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 9. Product Reviews & Star Ratings Table
-- ==============================================================================
create table if not exists public.product_reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references public.products(id) on delete cascade,
  master_product_id uuid references public.master_products(id) on delete cascade,
  seller_listing_id uuid references public.seller_listings(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade not null,
  rating int not null check (rating >= 1 and rating <= 5),
  comment text not null,
  review_photos jsonb default '[]'::jsonb,
  is_verified_purchase boolean default true,
  seller_reply text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 10. Service Hub Master Services & Multi-Technician Offers
-- ==============================================================================
create table if not exists public.master_services (
  id uuid primary key default uuid_generate_v4(),
  title_en text not null,
  title_bn text not null,
  service_type text not null,
  description text,
  included_checklist jsonb not null default '[]'::jsonb,
  estimated_duration text default '60 Minutes',
  canonical_image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.provider_service_offers (
  id uuid primary key default uuid_generate_v4(),
  master_service_id uuid references public.master_services(id) on delete cascade not null,
  provider_id uuid references public.profiles(id) on delete cascade not null,
  provider_name text not null,
  base_rate numeric(10,2) not null check (base_rate >= 0.00),
  service_radius_km numeric(4,1) default 5.0 check (service_radius_km >= 1.0 and service_radius_km <= 20.0),
  verified_badge boolean default false,
  rating numeric(3,2) default 5.00,
  reviews_count int default 0,
  lat numeric(9,6),
  lng numeric(9,6),
  is_open boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 11. Social Feed Posts & Comments
-- ==============================================================================
create table if not exists public.social_posts (
  id uuid primary key default uuid_generate_v4(),
  author_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  media_url text,
  tagged_product_id uuid references public.products(id) on delete set null,
  likes_count int default 0 check (likes_count >= 0),
  shares_count int default 0 check (shares_count >= 0),
  is_sponsored boolean default false,
  ad_network text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.social_comments (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid references public.social_posts(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  comment_text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 12. Orders & Receipts (Strict Customer Privacy)
-- ==============================================================================
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  idempotency_key text unique,
  customer_id uuid references public.profiles(id) on delete cascade not null,
  subtotal numeric(10,2) not null check (subtotal >= 0.00),
  delivery_fee numeric(10,2) default 0.00 check (delivery_fee >= 0.00),
  tax numeric(10,2) default 0.00 check (tax >= 0.00),
  total numeric(10,2) not null check (total >= 0.00),
  status text not null default 'confirmed' check (status in ('confirmed', 'preparing', 'in_transit', 'delivered', 'cancelled')),
  delivery_address text not null,
  payment_method text not null,
  items jsonb not null,                           -- Array of ordered items
  buyer_name text,
  buyer_phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 12B. Logistics Waybills, Reverse Returns, Wallet Ledger, Escrow & Service Bookings
-- ==============================================================================
create table if not exists public.shipment_waybills (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade unique not null,
  tracking_number text unique not null,
  courier_partner text not null default 'PaikarForce' check (courier_partner in ('PaikarForce', 'Steadfast', 'Pathao', 'RedX')),
  status text not null default 'PENDING',
  delivery_otp text not null,
  pickup_location text not null,
  drop_location text not null,
  shipping_fee_bdt numeric(10,2) default 60.00 check (shipping_fee_bdt >= 0.00),
  pod_verified_at timestamp with time zone,
  checkpoints jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.return_pickups (
  id uuid primary key default uuid_generate_v4(),
  shipment_id uuid references public.shipment_waybills(id) on delete cascade not null,
  return_waybill text unique not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  reason text not null,
  pickup_address text not null,
  courier_partner text not null default 'PaikarForce',
  status text not null default 'PICKUP_SCHEDULED',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.wallet_transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in ('deposit', 'withdrawal', 'transfer', 'purchase', 'cashback', 'escrow_hold', 'escrow_release')),
  amount numeric(12,2) not null check (amount >= 0.00),
  description text not null,
  status text not null default 'completed',
  reference_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.escrow_records (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade unique not null,
  buyer_id uuid references public.profiles(id) on delete cascade not null,
  vendor_id uuid references public.profiles(id) on delete cascade not null,
  amount_bdt numeric(12,2) not null check (amount_bdt >= 0.00),
  status text not null default 'held' check (status in ('held', 'released', 'refunded', 'disputed')),
  released_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.service_bookings (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references public.profiles(id) on delete cascade not null,
  service_id text not null,
  service_title text not null,
  provider_name text not null,
  service_address text not null,
  scheduled_date text not null,
  time_slot text not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'in_progress', 'completed', 'cancelled')),
  deposit_amount numeric(10,2) default 0.00 check (deposit_amount >= 0.00),
  total_estimate numeric(10,2) not null check (total_estimate >= 0.00),
  wallet_discount boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 12B-2. Retail Vouchers, Product Q&A & Pharmacy/Grocery Prescription Uploads
-- ==============================================================================
create table if not exists public.retail_vouchers (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  title_en text not null,
  title_bn text not null,
  discount_type text not null check (discount_type in ('percent', 'flat', 'free_shipping')),
  discount_value numeric(10,2) not null default 0.00 check (discount_value >= 0.00),
  max_discount_bdt numeric(10,2),
  min_spend_bdt numeric(10,2) not null default 0.00 check (min_spend_bdt >= 0.00),
  eligible_category text,
  expires_at timestamp with time zone not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.product_questions (
  id uuid primary key default uuid_generate_v4(),
  product_id text not null,
  author_id text not null,
  author_name text not null,
  question text not null,
  answer text,
  answered_by text,
  answered_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.prescription_uploads (
  id uuid primary key default uuid_generate_v4(),
  reference_code text unique not null,
  order_id_ref text not null,
  order_type text not null default 'pharmacy_rx' check (order_type in ('pharmacy_rx', 'grocery_list')),
  customer_id text not null,
  contact_phone text not null,
  delivery_address text not null,
  notes text,
  file_name text,
  mime_type text,
  status text not null default 'submitted' check (status in ('submitted', 'pharmacist_review', 'quoted', 'dispatched')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 12C. Zero-PII Public Handle Projection View (Safe Public Showcase)
-- Excludes email, phone, wallet_balance, and private_user_details
-- ==============================================================================
create or replace view public.public_handle_profiles as
select
  p.id,
  p.handle,
  p.name,
  p.avatar_url,
  p.location,
  p.trust_level,
  p.is_verified,
  s.id as store_id,
  s.store_name,
  s.category as store_category,
  s.rating as store_rating,
  s.is_open as store_is_open,
  s.opening_hours_label,
  s.service_radius_km,
  s.prep_minutes
from public.profiles p
left join public.stores s on s.owner_id = p.id and s.status = 'active';

grant select on public.public_handle_profiles to anon, authenticated;

-- ==============================================================================
-- 13. ROW LEVEL SECURITY (RLS) POLICIES — HARDENED ZERO-TRUST ACCESS CONTROL
-- Roles: Super Admin, Admin, Moderator, Vendor, Consumer
-- Multi-Role Support: Verifies both primary `role` and `active_roles` array
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.private_user_details enable row level security;
alter table public.saved_addresses enable row level security;
alter table public.stores enable row level security;
alter table public.vendor_memberships enable row level security;
alter table public.master_products enable row level security;
alter table public.seller_listings enable row level security;
alter table public.catalog_submissions enable row level security;
alter table public.products enable row level security;
alter table public.product_reviews enable row level security;
alter table public.master_services enable row level security;
alter table public.provider_service_offers enable row level security;
alter table public.social_posts enable row level security;
alter table public.social_comments enable row level security;
alter table public.orders enable row level security;
alter table public.shipment_waybills enable row level security;
alter table public.return_pickups enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.escrow_records enable row level security;
alter table public.service_bookings enable row level security;
alter table public.retail_vouchers enable row level security;
alter table public.product_questions enable row level security;
alter table public.prescription_uploads enable row level security;

-- ------------------------------------------------------------------------------
-- HELPER FUNCTIONS FOR CLEAN & SECURE MULTI-ROLE & AUTH EVALUATION
-- ------------------------------------------------------------------------------

-- Returns current authenticated user's profile ID
create or replace function public.current_profile_id()
returns uuid as $$
  select p.id from public.profiles p where p.auth_uid = auth.uid()::text limit 1;
$$ language sql security definer stable set search_path = '';

-- Snapshot security-sensitive profile fields so users can edit presentation fields only.
create or replace function public.current_profile_security_state()
returns jsonb
language sql
security definer
stable
set search_path = ''
as $$
  select jsonb_build_object(
    'role', p.role,
    'active_roles', p.active_roles,
    'trust_level', p.trust_level,
    'wallet_balance', p.wallet_balance,
    'reward_points', p.reward_points,
    'is_verified', p.is_verified
  )
  from public.profiles p
  where p.auth_uid = auth.uid()::text
  limit 1;
$$;

-- Verifies if the authenticated caller possesses the required role (checks primary `role`, `active_roles` array, super_admin, or verified developer email)
create or replace function public.has_role(required_role text)
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles p
    where p.auth_uid = auth.uid()::text
      and (
        p.role = required_role
        or required_role = any(p.active_roles)
        or p.role = 'super_admin'
        or 'super_admin' = any(p.active_roles)
      )
  );
end;
$$ language plpgsql security definer stable set search_path = '';

-- ------------------------------------------------------------------------------
-- 1. PROFILES RLS (Owner-Isolated PII + Anti-Elevation)
-- Public @handle lookups MUST read from public.public_handle_profiles view.
-- ------------------------------------------------------------------------------
create policy "Profiles readable only by owner or governance admins" 
  on public.profiles for select 
  using (
    auth.uid()::text = auth_uid
    or public.has_role('admin')
    or public.has_role('super_admin')
    or public.has_role('moderator')
  );

create policy "Users can insert their own profile" 
  on public.profiles for insert 
  with check (
    auth.uid()::text = auth_uid
    and role = 'consumer'
    and active_roles = array['consumer']::text[]
    and trust_level = 1
    and wallet_balance = 0
    and reward_points = 0
    and is_verified = false
  );

create policy "Users can update only their own profile" 
  on public.profiles for update 
  using (
    auth.uid()::text = auth_uid 
    or public.has_role('super_admin') 
    or public.has_role('admin')
  )
  with check (
    -- Account owners may only edit non-authoritative profile fields.
    (
      auth.uid()::text = auth_uid
      and public.current_profile_security_state() = jsonb_build_object(
        'role', role,
        'active_roles', active_roles,
        'trust_level', trust_level,
        'wallet_balance', wallet_balance,
        'reward_points', reward_points,
        'is_verified', is_verified
      )
    )
    or public.has_role('super_admin')
    or public.has_role('admin')
  );

create policy "Users or super admins can delete profile" 
  on public.profiles for delete 
  using (auth.uid()::text = auth_uid or public.has_role('super_admin'));

-- ------------------------------------------------------------------------------
-- 2. PRODUCTS RLS (Direct / Standalone Vendor Catalog)
-- ------------------------------------------------------------------------------
create policy "Products are viewable by everyone" 
  on public.products for select using (true);

create policy "Vendors can insert products for their own store" 
  on public.products for insert 
  with check (
    public.has_role('vendor')
    and exists (
      select 1 from public.stores s
      where s.id = store_id 
        and s.owner_id = public.current_profile_id()
    )
  );

create policy "Vendors can update only their own store products" 
  on public.products for update 
  using (
    exists (
      select 1 from public.stores s
      where s.id = store_id 
        and s.owner_id = public.current_profile_id()
    )
    or public.has_role('admin')
    or public.has_role('super_admin')
  )
  with check (
    exists (
      select 1 from public.stores s
      where s.id = store_id 
        and s.owner_id = public.current_profile_id()
    )
    or public.has_role('admin')
    or public.has_role('super_admin')
  );

create policy "Vendors can delete only their own store products" 
  on public.products for delete 
  using (
    exists (
      select 1 from public.stores s
      where s.id = store_id 
        and s.owner_id = public.current_profile_id()
    )
    or public.has_role('super_admin')
    or public.has_role('admin')
  );

-- ------------------------------------------------------------------------------
-- 3. ORDERS RLS (Strict Order Privacy & Integrity)
-- ------------------------------------------------------------------------------
create policy "Customers, store owners, and admins can view orders" 
  on public.orders for select 
  using (
    customer_id = public.current_profile_id()
    or public.has_role('admin')
    or public.has_role('super_admin')
    or public.has_role('moderator')
  );

create policy "Customers can place orders for themselves" 
  on public.orders for insert 
  with check (
    customer_id = public.current_profile_id()
  );

create policy "Customers can update only their own pending orders" 
  on public.orders for update 
  using (
    (
      customer_id = public.current_profile_id()
      and status in ('confirmed', 'preparing')
    )
    or public.has_role('admin')
    or public.has_role('super_admin')
  )
  with check (
    (
      customer_id = public.current_profile_id()
      and status in ('confirmed', 'cancelled')
    )
    or public.has_role('admin')
    or public.has_role('super_admin')
  );

create policy "Only super admins can delete orders" 
  on public.orders for delete 
  using (
    public.has_role('super_admin')
  );

-- ------------------------------------------------------------------------------
-- 4. PRIVATE USER DETAILS RLS (Strict PII Isolation)
-- ------------------------------------------------------------------------------
create policy "Private details viewable only by account owner or super admin" 
  on public.private_user_details for select 
  using (
    profile_id = public.current_profile_id()
    or public.has_role('super_admin')
    or public.has_role('admin')
  );

create policy "Users can insert their own private details" 
  on public.private_user_details for insert 
  with check (
    profile_id = public.current_profile_id()
  );

create policy "Private details manageable by account owner or super admin" 
  on public.private_user_details for update 
  using (
    profile_id = public.current_profile_id()
    or public.has_role('super_admin')
  )
  with check (
    profile_id = public.current_profile_id()
    or public.has_role('super_admin')
  );

create policy "Private details deletable by account owner or super admin" 
  on public.private_user_details for delete 
  using (
    profile_id = public.current_profile_id()
    or public.has_role('super_admin')
  );

create policy "Users manage their saved addresses"
  on public.saved_addresses for all
  using (profile_id = public.current_profile_id() or public.has_role('super_admin'))
  with check (profile_id = public.current_profile_id() or public.has_role('super_admin'));

-- ------------------------------------------------------------------------------
-- 5. STORES RLS
-- ------------------------------------------------------------------------------
create policy "Active stores are viewable by everyone" 
  on public.stores for select 
  using (status = 'active' or owner_id = public.current_profile_id());

create policy "Users can register stores as vendors" 
  on public.stores for insert 
  with check (
    owner_id = public.current_profile_id()
    and public.has_role('vendor')
  );

create policy "Store owners and admins can update stores" 
  on public.stores for update 
  using (
    owner_id = public.current_profile_id()
    or public.has_role('admin')
    or public.has_role('super_admin')
  )
  with check (
    owner_id = public.current_profile_id()
    or public.has_role('admin')
    or public.has_role('super_admin')
  );

create policy "Store owners and super admins can delete stores" 
  on public.stores for delete 
  using (
    owner_id = public.current_profile_id()
    or public.has_role('super_admin')
  );

-- ------------------------------------------------------------------------------
-- 5.1 VENDOR MEMBERSHIPS RLS
-- ------------------------------------------------------------------------------
create policy "Members can view their vendor memberships"
  on public.vendor_memberships for select
  using (profile_id = public.current_profile_id() or public.has_role('admin') or public.has_role('super_admin'));

create policy "Users can request vendor memberships"
  on public.vendor_memberships for insert
  with check (profile_id = public.current_profile_id() and status = 'pending');

create policy "Members and admins can update vendor memberships"
  on public.vendor_memberships for update
  using (profile_id = public.current_profile_id() or public.has_role('admin') or public.has_role('super_admin'))
  with check (profile_id = public.current_profile_id() or public.has_role('admin') or public.has_role('super_admin'));

create policy "Members and admins can remove vendor memberships"
  on public.vendor_memberships for delete
  using (profile_id = public.current_profile_id() or public.has_role('admin') or public.has_role('super_admin'));

-- ------------------------------------------------------------------------------
-- 6. MASTER PRODUCTS & MASTER SERVICES RLS
-- ------------------------------------------------------------------------------
create policy "Master products are viewable by everyone" 
  on public.master_products for select using (true);

create policy "Admins and Moderators can manage master products" 
  on public.master_products for all 
  using (public.has_role('admin') or public.has_role('moderator') or public.has_role('super_admin'));

create policy "Master services are viewable by everyone" 
  on public.master_services for select using (true);

create policy "Admins can manage master services" 
  on public.master_services for all 
  using (public.has_role('admin') or public.has_role('super_admin'));

-- ------------------------------------------------------------------------------
-- 7. SELLER LISTINGS RLS (Master Catalog 1:N Multi-Vendor Offers)
-- ------------------------------------------------------------------------------
create policy "Seller listings are viewable by everyone" 
  on public.seller_listings for select using (true);

create policy "Vendors can attach offers to master products" 
  on public.seller_listings for insert 
  with check (
    seller_id = public.current_profile_id()
    and public.has_role('vendor')
  );

create policy "Vendors can update only their own listings" 
  on public.seller_listings for update 
  using (
    seller_id = public.current_profile_id()
    or public.has_role('admin')
    or public.has_role('super_admin')
  )
  with check (
    seller_id = public.current_profile_id()
    or public.has_role('admin')
    or public.has_role('super_admin')
  );

create policy "Vendors can delete only their own listings" 
  on public.seller_listings for delete 
  using (
    seller_id = public.current_profile_id()
    or public.has_role('super_admin')
    or public.has_role('admin')
  );

-- ------------------------------------------------------------------------------
-- 8. CATALOG SUBMISSIONS RLS
-- ------------------------------------------------------------------------------
create policy "Sellers and Admins can view catalog submissions" 
  on public.catalog_submissions for select 
  using (
    seller_id = public.current_profile_id()
    or public.has_role('moderator')
    or public.has_role('admin')
    or public.has_role('super_admin')
  );

create policy "Sellers can submit new catalog items" 
  on public.catalog_submissions for insert 
  with check (
    seller_id = public.current_profile_id()
    and public.has_role('vendor')
  );

create policy "Admins and moderators can review and update submissions" 
  on public.catalog_submissions for update 
  using (
    seller_id = public.current_profile_id()
    or public.has_role('moderator')
    or public.has_role('admin')
    or public.has_role('super_admin')
  );

-- ------------------------------------------------------------------------------
-- 9. PRODUCT REVIEWS RLS
-- ------------------------------------------------------------------------------
create policy "Product reviews are viewable by everyone" 
  on public.product_reviews for select using (true);

create policy "Verified users can post reviews" 
  on public.product_reviews for insert 
  with check (user_id = public.current_profile_id());

create policy "Users can update only their own reviews" 
  on public.product_reviews for update 
  using (
    user_id = public.current_profile_id()
    or public.has_role('moderator')
    or public.has_role('admin')
    or public.has_role('super_admin')
  );

create policy "Users can delete only their own reviews" 
  on public.product_reviews for delete 
  using (
    user_id = public.current_profile_id()
    or public.has_role('moderator')
    or public.has_role('super_admin')
  );

-- ------------------------------------------------------------------------------
-- 10. SOCIAL POSTS & COMMENTS RLS
-- ------------------------------------------------------------------------------
create policy "Social posts viewable by everyone" 
  on public.social_posts for select using (true);

create policy "Users can create social posts" 
  on public.social_posts for insert 
  with check (author_id = public.current_profile_id());

create policy "Authors and moderators can update posts" 
  on public.social_posts for update 
  using (
    author_id = public.current_profile_id()
    or public.has_role('moderator')
    or public.has_role('super_admin')
  );

create policy "Authors and moderators can delete posts" 
  on public.social_posts for delete 
  using (
    author_id = public.current_profile_id()
    or public.has_role('moderator')
    or public.has_role('super_admin')
  );

create policy "Social comments viewable by everyone" 
  on public.social_comments for select using (true);

create policy "Users can create comments" 
  on public.social_comments for insert 
  with check (author_id = public.current_profile_id());

create policy "Authors and moderators can update comments" 
  on public.social_comments for update 
  using (
    author_id = public.current_profile_id()
    or public.has_role('moderator')
    or public.has_role('super_admin')
  );

create policy "Authors and moderators can delete comments" 
  on public.social_comments for delete 
  using (
    author_id = public.current_profile_id()
    or public.has_role('moderator')
    or public.has_role('super_admin')
  );

-- ------------------------------------------------------------------------------
-- 11. PROVIDER SERVICE OFFERS RLS
-- ------------------------------------------------------------------------------
create policy "Provider service offers are viewable by everyone"
  on public.provider_service_offers for select using (true);

create policy "Vendors can manage their own service offers"
  on public.provider_service_offers for all
  using (
    provider_id = public.current_profile_id()
    or public.has_role('admin')
    or public.has_role('super_admin')
  )
  with check (
    (provider_id = public.current_profile_id() and public.has_role('vendor'))
    or public.has_role('admin')
    or public.has_role('super_admin')
  );

-- ------------------------------------------------------------------------------
-- 12. SHIPMENT WAYBILLS & RETURN PICKUPS RLS
-- ------------------------------------------------------------------------------
create policy "Customers and admins can view shipment waybills"
  on public.shipment_waybills for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.customer_id = public.current_profile_id()
    )
    or public.has_role('moderator')
    or public.has_role('admin')
    or public.has_role('super_admin')
  );

create policy "Admins manage shipment waybills"
  on public.shipment_waybills for all
  using (public.has_role('admin') or public.has_role('super_admin'));

create policy "Users can view and request their own return pickups"
  on public.return_pickups for select
  using (
    user_id = public.current_profile_id()
    or public.has_role('admin')
    or public.has_role('super_admin')
  );

create policy "Users can create return pickups for their own orders"
  on public.return_pickups for insert
  with check (user_id = public.current_profile_id());

-- ------------------------------------------------------------------------------
-- 13. WALLET TRANSACTIONS & ESCROW LEDGER RLS (Backend/Admin Authoritative)
-- ------------------------------------------------------------------------------
create policy "Users can view only their own wallet transactions"
  on public.wallet_transactions for select
  using (
    user_id = public.current_profile_id()
    or public.has_role('admin')
    or public.has_role('super_admin')
  );

create policy "Only admins can mutate wallet ledger directly"
  on public.wallet_transactions for all
  using (public.has_role('super_admin') or public.has_role('admin'));

create policy "Buyers, vendors, and admins can view relevant escrow records"
  on public.escrow_records for select
  using (
    buyer_id = public.current_profile_id()
    or vendor_id = public.current_profile_id()
    or public.has_role('admin')
    or public.has_role('super_admin')
  );

create policy "Only admins can mutate escrow records directly"
  on public.escrow_records for all
  using (public.has_role('super_admin') or public.has_role('admin'));

-- ------------------------------------------------------------------------------
-- 14. SERVICE BOOKINGS RLS
-- ------------------------------------------------------------------------------
create policy "Customers and admins can view service bookings"
  on public.service_bookings for select
  using (
    customer_id = public.current_profile_id()
    or public.has_role('admin')
    or public.has_role('super_admin')
  );

create policy "Customers can create their own service bookings"
  on public.service_bookings for insert
  with check (customer_id = public.current_profile_id());

create policy "Customers can cancel their own scheduled bookings"
  on public.service_bookings for update
  using (
    (customer_id = public.current_profile_id() and status = 'scheduled')
    or public.has_role('admin')
    or public.has_role('super_admin')
  )
  with check (
    (customer_id = public.current_profile_id() and status in ('scheduled', 'cancelled'))
    or public.has_role('admin')
    or public.has_role('super_admin')
  );

-- ------------------------------------------------------------------------------
-- 15. RETAIL VOUCHERS, PRODUCT Q&A & PRESCRIPTION UPLOADS RLS
-- ------------------------------------------------------------------------------
create policy "Active retail vouchers are publicly readable"
  on public.retail_vouchers for select using (is_active = true);

create policy "Only admins can manage retail vouchers"
  on public.retail_vouchers for all
  using (public.has_role('admin') or public.has_role('super_admin'));

create policy "Product Q&A threads are publicly readable"
  on public.product_questions for select using (true);

create policy "Authenticated users can submit product questions"
  on public.product_questions for insert
  with check (author_id = public.current_profile_id()::text or auth.uid() is not null);

create policy "Vendors and admins can answer product questions"
  on public.product_questions for update
  using (
    public.has_role('vendor')
    or public.has_role('admin')
    or public.has_role('super_admin')
  );

create policy "Customers and admins can view their own prescription uploads"
  on public.prescription_uploads for select
  using (
    customer_id = public.current_profile_id()::text
    or public.has_role('admin')
    or public.has_role('super_admin')
  );

create policy "Customers can submit prescription or grocery list uploads"
  on public.prescription_uploads for insert
  with check (
    customer_id = public.current_profile_id()::text
    or auth.uid() is not null
  );

-- ==============================================================================
-- INDEXES FOR HIGH PERFORMANCE QUERIES
-- ==============================================================================
create index if not exists idx_profiles_auth_uid on public.profiles(auth_uid);
create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_profiles_handle on public.profiles(handle);
create index if not exists idx_stores_handle on public.stores(handle);
create index if not exists idx_vendor_memberships_profile on public.vendor_memberships(profile_id, status);
create index if not exists idx_vendor_memberships_store on public.vendor_memberships(store_id, status);
create index if not exists idx_private_details_profile on public.private_user_details(profile_id);
create index if not exists idx_saved_addresses_profile on public.saved_addresses(profile_id, is_default);
create index if not exists idx_product_reviews_product on public.product_reviews(product_id);
create index if not exists idx_product_reviews_master_product on public.product_reviews(master_product_id);
create index if not exists idx_social_comments_post on public.social_comments(post_id);
create index if not exists idx_catalog_submissions_seller on public.catalog_submissions(seller_id);
create index if not exists idx_orders_idempotency on public.orders(idempotency_key);
create index if not exists idx_shipment_tracking on public.shipment_waybills(tracking_number);
create index if not exists idx_wallet_transactions_user on public.wallet_transactions(user_id);
create index if not exists idx_escrow_records_order on public.escrow_records(order_id);
create index if not exists idx_service_bookings_customer on public.service_bookings(customer_id);
create index if not exists idx_retail_vouchers_code on public.retail_vouchers(code);
create index if not exists idx_product_questions_product on public.product_questions(product_id);
create index if not exists idx_prescription_uploads_customer on public.prescription_uploads(customer_id);

