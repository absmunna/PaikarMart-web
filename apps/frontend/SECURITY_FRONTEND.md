# PaikarMart Frontend Security Notes

## Public repo + live production

Client Firebase `apiKey` / `projectId` are **not secrets** (web SDK design). Real protection:

1. **Firebase Console → Authentication → Settings → Authorized domains**  
   Only production domain(s) + `localhost`.

2. **App Check** (reCAPTCHA v3) on Auth / Firestore / Storage.

3. **API key restrictions** (Google Cloud Console) — HTTP referrer = your Vercel domain.

4. **Publish `firestore.rules`** (see `apps/frontend/firestore.rules`) from Firebase Console.  
   Client role flags (`isAdmin`, `promoteToSeller`) are **UX only**. Role elevation must go through backend + Admin SDK.

5. **Vercel env (frontend)**  
   Prefer:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_FIRESTORE_DATABASE_ID` (if named DB)
   - `VITE_API_BASE_URL`
   - `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` (anon only)

   **Never** set `VITE_` on: `FIREBASE_PRIVATE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `JWT_SECRET`.

6. **Render (backend)** holds service account, DB URL, payment secrets.

7. **Seed data** (`seedData.ts`) runs only when `import.meta.env.DEV` is true.

8. **Role promote / switch persona** on the client does not write elevated roles to Firestore; seller upgrade must use backend API after KYC.
