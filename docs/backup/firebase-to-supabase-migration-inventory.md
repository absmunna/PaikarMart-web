# Firebase-to-Supabase migration inventory

## Scope and safety status

This is a source-code inventory, not a live Firebase export. It is based on
Firebase references in `apps/frontend/src` and the current Prisma schema in
`packages/database/prisma/schema.prisma`. It does not establish which
collections or fields currently contain production data.

No source or target cloud data was read, changed, or deleted for this
inventory. The live-data backup and migration are still pending. Do not run a
production cutover, delete Firebase records, or point the application at the
new database until the backup, schema review, import dry-run, and row-count
reconciliation are complete.

## Collection and model crosswalk

| Firebase collection/path | Current use in app | Candidate Supabase/Prisma destination | Migration notes |
|---|---|---|---|
| `users/{uid}` | AuthContext and user profile service | `User` | Preserve Firebase UID as primary key. Resolve `name`/`fullName`, `avatar`/`avatarUrl`, role and timestamp differences. Never import passwords or treat profile role fields as trusted authorization. |
| `sellers/{uid}` | Seller profile service/context | `VendorProfile` and/or `SellerStore` | Mapping is not one-to-one: seller profile contains store and verification data; decide canonical ownership and retain the original document ID. |
| `products/{id}` | Seller/product/upload/feed/privacy/backup services | `Product`, `TieredPrice`, possibly `DigitalAsset` | Map `sellerId` to vendor/user relations; normalize category, price, stock, images and statuses. Preserve document IDs and legacy fields in a reviewed staging format. |
| `orders/{id}` | Buyer and seller order services | `Order` and `OrderItem` | Existing app order item shape is embedded; Prisma normalizes items. Reconcile `buyerId` vs `userId`, seller/vendor IDs, payment method, address, item snapshots, statuses and money totals. |
| `categories/{id}` | Category service | `PortalCategory` or a new category table | Fields include slug/name/order/isActive/parentId; current `PortalCategory` does not represent all category fields. Decide schema before importing. |
| `posts/{id}` | Feed, upload, privacy and backup services | `Post` | Map legacy `sellerId` to `authorId`; posts have multiple historical `type` values and image/price/category fields not all present in Prisma. Preserve source JSON until mapping is approved. |
| `reels/{id}` | Upload service | `Post` (or a dedicated Reel model) | Separate collection duplicates some post media. Determine whether reel records are canonical or derived; avoid double-counting when both exist. |
| `chats/{id}` | Realtime chat service | `ChatMessage` plus a new conversation model | Parent stores participants, participantDetails, unreadCounts and product/order context; nested messages are at `chats/{id}/messages/{messageId}`. Current schema has messages only, with no conversation/unread state model. |
| `wallets/{uid}` | Wallet service | `Wallet` | Preserve UID relation, balance and timestamps. Financial balance must reconcile against transaction ledger; never derive/import balance without comparing ledger. |
| `wallets/{uid}/transactions/{id}` | Wallet service | `Transaction` and/or `WalletTransaction` | Current schema has two overlapping transaction models. Define one financial ledger model and map event type/status/reference before migration. |
| `user_privacy_settings/{uid}` | Privacy service | New privacy settings table/model | No equivalent model found in Prisma. Preserve consent fields and their timestamps. |
| `client_vault_files/{id}` | Vault/upload/privacy/backup services | New vault metadata table | Objects live in Firebase Storage. Migrate file bytes separately, preserve storage path/metadata, then replace URL references only after verification. |
| `services/{id}` | Upload/privacy/backup services | New service listing model (or reviewed Product extension) | Provider, rate/rateUnit, area and media shape do not map cleanly to current `Product`. |
| `kyc_documents/{id}` | Seller application/privacy services | New KYC document model plus private object storage | Highly sensitive ID/trade documents. Restrict access; never put public URLs or document contents in an unrestricted table/bucket. Confirm retention and access policy first. |
| `audit_logs/{id}` | Seller application service | New append-only audit log table | Define actor, action, timestamp and immutable access policy. |
| `backups/{id}` | User backup service | New backup metadata table | User-created JSON snapshots may duplicate records; keep separate from the canonical migration export. |
| `test/{id}` | Firebase startup connectivity probe | Remove after migration | Not business data. Current Firestore rules allow unauthenticated read/write; disable/remove this rule after app no longer depends on Firestore. |
| Other collections/subcollections | May exist outside the searched frontend literals or be created dynamically | Undetermined | Must be enumerated from authenticated live export before migration scope is final. |

## Firebase Storage paths found in code

- `users/{uid}/avatar/...` and `users/{uid}/cover/...`
- `{type}s/{uid}/...` for product, reel, service, demand and related uploads
- `users/{uid}/...` for client-vault uploads
- `backups/{uid}/{backupName}`

These code paths are not proof that every object uses those layouts. The
Storage export must preserve the exact object name, generation, content type,
custom metadata, size and checksums. KYC/client-vault objects require private
Supabase Storage buckets and access policies before any URL is changed.

## Identity, security and cutover constraints

1. Firebase Authentication accounts are not included in the Firestore export.
   Keep Firebase Auth as the identity provider unless a separate account
   migration is explicitly designed. Preserve Firebase UIDs as user IDs.
2. Current Supabase RLS coverage is incomplete. The existing SQL migration
   covers only a few admin tables; it does not establish safe user-scoped
   policies for the models above. Do not expose the service-role key in the
   frontend.
3. App writes must remain on the existing source until a backup is verified,
   a staging import is reconciled, all required RLS/backend authorization is
   tested, and the maintenance-window cutover plan is approved. No dual-write
   is assumed.
4. Before cutover, pause writes, take a final source export, import into
   staging/production using deterministic IDs and idempotent transactions,
   then compare per-collection document counts, relation integrity, financial
   totals, and Storage object hashes. Keep the Firebase source read-only until
   post-cutover verification and rollback sign-off.
5. A dry-run must report planned inserts/updates/rejections and validation
   errors without writing to either Firebase or Supabase.

## Next safe execution step

Complete an authenticated, read-only inventory/export of all Firestore
collections and Storage objects to the Git-ignored local backup folder. Review
that export for actual collection counts and data shapes, then finalize the
Prisma/schema crosswalk and RLS design. Do not import production data until
that review and an independent backup verification are complete.
