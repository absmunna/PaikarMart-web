# PaikarMart incremental security update — 8 November 2026

This update is based on the existing `PaikarMart-P0-Fixed.zip`. Existing project directories and file paths were preserved. No source files were moved or renamed.

## Files changed

1. `package.json`
   - Replaced the POSIX-only backend dev command with a pnpm workspace command that works on Windows and Unix shells.
   - Added the root `db:migrate:deploy` script required by the existing Render build configuration. This script is not run automatically by this update.
2. `apps/backend/modules/auth/auth.controller.ts`
   - Registration and login now require a Firebase ID token verified by Firebase Admin.
   - Registration derives the account ID, email and phone from verified Firebase claims rather than trusting request-body `uid`/`id` values.
   - Registration fails closed with HTTP 503 in production if the database is unavailable; the local fallback is development-only and still requires a verified Firebase token.
   - Removed the insecure development login fallback that accepted an arbitrary email/phone when Firebase verification was unavailable.
3. `apps/backend/modules/cart/cart.routes.ts`
   - Requires authentication for every cart route.
4. `apps/backend/modules/cart/cart.controller.ts`
   - Uses the authenticated user ID, not `x-user-id` or a fallback to the first database user.
   - Scopes cart item update/delete operations to both cart item ID and authenticated user ID.
   - Rejects invalid product IDs and quantities outside 1–99, including a combined cart quantity that would exceed 99.
   - Fails closed with HTTP 503 if the database is offline instead of returning a shared in-memory cart.
5. `apps/backend/modules/escrow/escrow.routes.ts`
   - Requires authentication and temporarily disables escrow reads/mutations with HTTP 501 until order ownership, dispute authorization and atomic settlement are implemented.
   - Existing URL paths are retained.
6. `apps/backend/server.ts`
   - Parses JSON request bodies before the sanitizer middleware, so the sanitizer can inspect parsed bodies.
7. `docs/PAIKARMART_LOCAL_SETUP_BN.md`
   - Adds the correct Windows/Bangla local start instructions and explains that Express serves the Vite frontend through middleware on port 3000.

## Important limitations

- Escrow is intentionally unavailable; no release, dispute or status operation should be treated as working in this build.
- Wallet send/recharge/withdraw, payment-provider callbacks, Prisma migration drift, multi-vendor order splitting, Firestore legacy writes, and the missing dependency lockfile remain follow-up work from the audit report.
- No production database migration, GitHub push, deployment, or live payment action was performed.
- A syntax-only TypeScript transpilation check covered all 949 `.ts`/`.tsx` source files in the archive: 0 syntax diagnostics. This is not a full TypeScript typecheck.
- JSON parsing checks passed for the root, backend, frontend and Vercel configuration files. Targeted source assertions passed for Firebase-token registration/login, authenticated cart and escrow routes, cart ownership scoping, quantity limits, and JSON-parser/sanitizer order.
- ZIP integrity check passed (`testzip()` returned no corrupt entries).
- Full TypeScript typecheck, dependency-backed test suites, frontend production build and backend production build were not run because dependencies are not installed in this environment. The archive has no committed pnpm lockfile; run `pnpm install` locally and commit the generated lockfile after review.
