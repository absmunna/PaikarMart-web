# PAIKARMART — HOME FEED UX ARCHITECTURE
*(Phase 8.1 - Super App Feed Experience)*

The PaikarMart Home Feed is not a traditional ecommerce homepage, nor a simple social timeline—it is the central nervous system of a unified Social Commerce, B2B, Retail, Demand, and Logistics Ecosystem. It combines TikTok's discovery mechanics, Facebook's engagement drivers, Amazon's conversion efficiency, and Alibaba's B2B networking capabilities into a single, seamless feed.

---

## 1. HERO SPOTLIGHT SYSTEM
Positioned at the absolute top of the Home Feed, the Hero Spotlight drives maximum visibility for the platform's highest-value content.

**Supported Content Types:**
- Viral Products
- Featured Sellers / Storefronts
- Live Commerce Streams
- Open Demands (B2B Bulk Buying Requests)
- Logistics Route Offers
- Promoted Service Providers

**Spotlight Card Blueprint:**
Every spotlight card strictly contains: 
`Media Backdrop` + `Concise Title` + `Category/Status Badge` + `Engagement Indicator (🔥)` + `High-Contrast CTA Button`.

---

## 2. MAIN FEED HIERARCHY & LAYOUT

### A. Desktop Wireframe (Bento Grid & Sidebars)
```text
┌─────────────────────────────────────────────────────────────┐
│ ≡   [Search Products, Demands, Services...]       [Cart] [User]│
├─────────┬─────────────────────────────────────────┬─────────┤
│         │          [ HERO SPOTLIGHT BENTO ]         │ TRENDING│
│ L-NAV   │ ┌────────┐ ┌────────┐ ┌───────────────┐ │         │
│ Feed    │ │ Viral  │ │ Open   │ │ Live Commerce │ │ #Winter │
│ Market  │ │ Product│ │ Demand │ │ Streaming Now │ │ #Retail │
│ B2B     │ └────────┘ └────────┘ └───────────────┘ │ #Dhaka  │
│ Services│                                         │         │
│ Demands │ ┌─────────────────────────────────────┐ │ NEARBY  │
│ Logistics │ [      PRODUCT/COMMERCE POST      ] │ │         │
│         │ └─────────────────────────────────────┘ │ • Shop A│
│         │ ┌─────────────────────────────────────┐ │ • Svc B │
│         │ │         [ SERVICE POST ]            │ │         │
│         │ └─────────────────────────────────────┘ │         │
└─────────┴─────────────────────────────────────────┴─────────┘
```

### B. Mobile Wireframe (Vertical Flow & Horizontal Swipes)
```text
┌───────────────────────────────────┐
│ ≡  [Search...]              [Cart]│
├───────────────────────────────────┤
│ [ HERO SPOTLIGHT (Swipe Track) ]  │
│ ┌───────┐ ┌───────┐ ┌───────┐     │
│ │ Viral │ │ Live  │ │ B2B   │  -> │
│ └───────┘ └───────┘ └───────┘     │
├───────────────────────────────────┤
│ ┌───────────────────────────────┐ │
│ │      PRODUCT POST CARD        │ │
│ │ [Media 1:1]                   │ │
│ │ [Title & Price]               │ │
│ │ [❤️] [💬] [🛒] [⚡] [📤] [🔖] │ │
│ └───────────────────────────────┘ │
├───────────────────────────────────┤
│ [ OPEN DEMANDS (Horizontal) ]     │
├───────────────────────────────────┤
│ ┌───────────────────────────────┐ │
│ │      SERVICE POST CARD        │ │
│ └───────────────────────────────┘ │
├───────────────────────────────────┤
│ 🏠 Home | 📦 Market | ➕ | 📋 Orders │
└───────────────────────────────────┘
```

---

## 3. PRODUCT POST CARD SYSTEM
The Product Post Card is the atomic unit of the PaikarMart feed. It is designed for maximum conversion and engagement.

**Anatomy of a Product Post:**
1. **Seller Header**: Avatar, Business Name, Verification Badge, Relative Timestamp, context menu (`...`).
2. **Media Anchor**: Strict `1:1 (Square)` Aspect Ratio for Images or Autoplaying Video (muted).
3. **Product Information**: Title, Localized Price (e.g., ৳1400), Discount Tags, Availability Status.
4. **Unified Action Bar**:
   - ❤️ `Like` (Social Signal)
   - 💬 `Comment` (Opens Discussion Layer)
   - 🛒 `Add To Cart` (Quick Commerce)
   - ⚡ `Buy Now` (Express Checkout)
   - 📤 `Share` (Virality Driver)
   - 🔖 `Save` (Bookmark/Wishlist)
5. **Context Preview**: Snippet of top Review or top Q&A.

---

## 4. COMMERCE-FIRST COMMENT SYSTEM
Traditional chronological comments fail in commerce environments. PaikarMart uses a tabbed, utility-driven discussion layer attached to every Post Card.

**Discussion Tabs:**
1. **Reviews ⭐**: Ratings, Verified Purchase Badges (`✓ Verified Buyer`), Photo/Video Attachments.
2. **Q&A ❓**: Buyer Questions answered directly by the Seller. 
   - *Example: "Is this waterproof?" -> "Yes, fully waterproof."*
3. **Comments 💬**: General social sentiment and tagging.

**Hierarchical Sorting Priority:**
1. Seller Responses (Pinned/Highlight)
2. Admin/System Automoderation Nodes
3. Verified Buyers (High Trust)
4. Normal Users (Standard)

---

## 5. POLYMORPHIC POST CAPABILITIES
The Universal Card architecture adapts to all ecosystem verticals using the *same* visual footprint but highly specialized Action Bars.

*   **PRODUCT POST**: Action = `[🛒 Add To Cart]` | `[⚡ Buy Now]`
*   **SERVICE POST**: Action = `[📅 Book Appointment]` | `[📞 Call Provider]`
*   **OPEN DEMAND POST**: Action = `[🤝 Submit Bid]` | `[✉️ Contact Buyer]`
*   **BUSINESS POST**: Action = `[🏪 Visit Storefront]` | `[➕ Follow]`
*   **LOGISTICS POST**: Action = `[🚛 Book Freight]` | `[📦 View Route]`

---

## 6. UX CONVERSION RULES & USER JOURNEYS

**Design Philosophy:**
*Commerce, Conversion, and Interaction take absolute precedence over vanity social metrics.* Every pixel serves the transition from discovery to transaction.

### Journey 1: The Impulse Buy (Social -> Commerce)
1. User scrolls feed, stops on autoplaying Video of a product.
2. Taps `⚡ Buy Now` directly from the feed card.
3. Bottom-sheet checkout wizard slides up (no full page redirect).
4. Transaction confirms. Feed resumes parsing exactly where left off.

### Journey 2: The B2B Wholesale Match (Demand -> Supplier)
1. Wholesaler sees an "Open Demand" Spotlight Card for "5000pcs Winter Jackets".
2. Taps `[🤝 Submit Bid]`.
3. Modal requests unit price and lead time. Submit bid.
4. Returns to feed.

### Journey 3: The Trust Verification Loop (Community -> Conversion)
1. User finds a high-ticket item Post Card.
2. Expands the 💬 Comment Section, defaults to `Reviews` tab.
3. Filters for `Photo Reviews` provided by `✓ Verified Buyers`.
4. Confidence secured -> Taps `🛒 Add To Cart`.

---

## 7. FEED COMPONENT TREE ARCHITECTURE (React)
```text
<FeedPortalContainer>
  <HeroSpotlightEngine>
    <SwipeTrack (mobile) | BentoGrid (desktop)>
      <SpotlightCard polymorphicType="viral|demand|live" />
    </SwipeTrack>
  </HeroSpotlightEngine>

  <MainFeedVirtualizer>
    {/* Polymorphic Post Cards */}
    <PostCard type="PRODUCT">
      <CardHeader entity="Seller" />
      <MediaCarousel ratio="1:1" />
      <ProductDetails data={...} />
      <CommerceActionBar mode="buy" />
      <DiscussionDrawer tabs={["Reviews", "Q&A", "Comments"]} />
    </PostCard>

    <PostCard type="SERVICE">
      <CardHeader entity="Provider" />
      <MediaCarousel ratio="1:1" />
      <ServiceDetails data={...} />
      <CommerceActionBar mode="book" />
      <DiscussionDrawer tabs={["Reviews", "Q&A", "Comments"]} />
    </PostCard>
  </MainFeedVirtualizer>
</FeedPortalContainer>
```
