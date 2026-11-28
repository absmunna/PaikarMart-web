# Sync `absmunna/PaikarMart` → `absmunna/PaikarMart-web`

**Do not force-overwrite `main` without backup.** Live site + catalog/security work lives on `PaikarMart-web` main.

## Why this branch exists

Branch `sync/from-paikarmart` was created from `main` so you can import the older monorepo safely, review, then merge.

Source: https://github.com/absmunna/PaikarMart  
Target: https://github.com/absmunna/PaikarMart-web

## Full tree import (local git — required for ~40MB + binary images)

GitHub file API cannot push the entire PaikarMart tree in one agent session. Run this on your PC:

```bash
# 1) Clone web (current production codebase)
git clone https://github.com/absmunna/PaikarMart-web.git
cd PaikarMart-web

# 2) Backup main
git branch backup/main-before-paikarmart-import
git push -u origin backup/main-before-paikarmart-import

# 3) Add PaikarMart as remote and fetch
git remote add paikarmart https://github.com/absmunna/PaikarMart.git
git fetch paikarmart main

# 4A) SAFE: import onto this branch for review
git checkout sync/from-paikarmart
git merge paikarmart/main --allow-unrelated-histories -m "merge: import PaikarMart main into sync/from-paikarmart"
# resolve conflicts, test, then PR into main

# 4B) HARD REPLACE main with PaikarMart only (DESTROYS web-only commits — confirm first)
# git checkout main
# git reset --hard paikarmart/main
# git push --force origin main   # only if you accept production wipe
```

## What differs (high level)

| | PaikarMart | PaikarMart-web |
|---|---|---|
| Layout | Single package monorepo | pnpm / apps structure + V2 RootLayout |
| Catalog | Mature SQL + routes | Prisma master catalog + catalogApi |
| Deploy | Same idea (Vercel/Render) | Active production |
| Security polish | Older | Recent rules + Auth hardening |

Prefer **merge selective folders** (catalog, portals UI) over full hard reset unless you want PaikarMart to fully replace web.

## After merge checklist

1. `pnpm i` / install deps  
2. Env: `VITE_API_BASE_URL`, Supabase, Firebase Auth (no Hosting)  
3. Localhost smoke: home, product detail, sell, login  
4. PR: `sync/from-paikarmart` → `main`  
5. Redeploy Vercel + Render  

Firebase **Hosting** is not required.
