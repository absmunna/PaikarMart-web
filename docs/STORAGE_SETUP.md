# 🗄️ Paikar Mart - Cloud Storage Setup Guide (Supabase Storage)

This guide documents the architecture, configuration, and security model for file storage in Paikar Mart.

---

## 🏗️ Storage Architecture
Instead of using paid Firebase Storage (Blaze plan), Paikar Mart utilizes **Supabase Storage** on the free tier (1 GB storage, 2 GB monthly bandwidth, 50MB file limit) via backend proxying with the `service_role` key.

### Buckets
1. **`public-media` (Public Bucket)**:
   - **Purpose**: Product photos, vendor banners, user avatars, feed media.
   - **Access**: Read is public. Write requires authentication via the backend API (`POST /api/v1/storage/upload/image`).
   - **Limits**: Maximum 2 MB per image. Allowed formats: JPEG, PNG, WEBP, GIF, SVG.
   - **Output**: Permanent public CDN URL.

2. **`digital-products` (Private Bucket)**:
   - **Purpose**: Paid downloadable digital goods (PDF ebooks, ZIP source codes, software, presets, MP3 audio, MP4 tutorials).
   - **Access**: Strictly private! Direct public URLs are NEVER generated or exposed.
   - **Upload**: Requires `seller`, `digital_seller`, `vendor`, or `admin` role (`POST /api/v1/storage/upload/digital`).
   - **Download**: Delivered **only** through short-lived signed URLs (`GET /api/v1/storage/file/:id/signed-url`).
   - **Expiration**: Default expiration is 15 minutes (900 seconds), maximum 1 hour.
   - **Authorization**: Only the file owner, an administrator, or a buyer who has a completed order can generate download links.

---

## 🛠️ Supabase Dashboard Configuration

### Step 1: Create Buckets in Supabase
1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open your Paikar Mart project.
3. In the left navigation, click on **Storage**.
4. Click **New bucket**:
   - **Name**: `public-media`
   - **Public bucket**: Toggle **ON** (checked).
   - Click **Save**.
5. Click **New bucket** again:
   - **Name**: `digital-products`
   - **Public bucket**: Toggle **OFF** (unchecked - private bucket).
   - Click **Save**.

### Step 2: Retrieve the Service Role Key
1. Go to **Project Settings** (gear icon) -> **API**.
2. Scroll to **Project API keys**.
3. Locate the `service_role` `secret` key.
   *(⚠️ Warning: The `service_role` key bypasses Row Level Security and has full admin rights. NEVER expose this key in client-side code, Git, or Vercel! It must ONLY be set on the backend on Render).*

---

## 🔐 Environment Variables

Add these to your environment (Render Dashboard & local `.env`):
```env
# Supabase URL (also used by client)
SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co

# Supabase Service Role Secret Key (Backend ONLY)
SUPABASE_SERVICE_ROLE_KEY=eyJh...[YOUR-SERVICE-ROLE-KEY]

# Optional bucket name overrides (defaults to public-media and digital-products)
SUPABASE_STORAGE_PUBLIC_BUCKET=public-media
SUPABASE_STORAGE_PRIVATE_BUCKET=digital-products
```

---

## 📡 API Endpoints

### 1. Upload Public Image
- **Endpoint**: `POST /api/v1/storage/upload/image`
- **Headers**:
  - `Authorization: Bearer <jwt_or_firebase_token>`
  - `Content-Type: multipart/form-data`
- **Body**:
  - `file`: Image binary (Max 2 MB, JPEG/PNG/WEBP/GIF/SVG)
  - `purpose`: (Optional, e.g. `product_image`, `avatar`, `banner`)
- **Response**:
  ```json
  {
    "ok": true,
    "message": "Image uploaded successfully",
    "file": {
      "id": "uuid",
      "url": "https://[ref].supabase.co/storage/v1/object/public/public-media/images/user1/timestamp-safe_name.webp",
      "path": "images/user1/timestamp-safe_name.webp",
      "mimeType": "image/webp",
      "size": 450200,
      "isPrivate": false
    }
  }
  ```

### 2. Upload Digital Product (Private)
- **Endpoint**: `POST /api/v1/storage/upload/digital`
- **Headers**:
  - `Authorization: Bearer <token_with_seller_or_admin_role>`
  - `Content-Type: multipart/form-data`
- **Body**:
  - `file`: Digital product binary (Max 25 MB, PDF/ZIP/EPUB/MP3/MP4/TXT)
- **Response**:
  ```json
  {
    "ok": true,
    "message": "Digital product uploaded to secure private storage. Access is granted via signed URLs only.",
    "file": {
      "id": "uuid",
      "url": null,
      "isPrivate": true,
      "path": "digital-goods/user1/timestamp-product.zip",
      "mimeType": "application/zip",
      "size": 14200500
    }
  }
  ```

### 3. Generate Signed Expiring Download Link
- **Endpoint**: `GET /api/v1/storage/file/:id/signed-url?expiresIn=900`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "ok": true,
    "fileId": "uuid",
    "fileName": "handbook.pdf",
    "signedUrl": "https://[ref].supabase.co/storage/v1/object/sign/digital-products/digital-goods/user1/timestamp-handbook.pdf?token=...",
    "expiresIn": 900,
    "expiresAt": "2026-10-31T21:30:00.000Z"
  }
  ```

### 4. Get File Metadata
- **Endpoint**: `GET /api/v1/storage/file/:id`
- **Response**: Returns file metadata. For private assets, `url` is always `null`.

### 5. Delete File
- **Endpoint**: `DELETE /api/v1/storage/file/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Authorization**: File owner or administrator only.
