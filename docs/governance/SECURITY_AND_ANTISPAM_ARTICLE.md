# PaikarMart — Security, Anti-Spam & Cyber Defense Architecture
> **Scope:** Hardening strategies against DDoS, brute-force attacks, spam bots, and unauthorized data breaches.

---

## 🔒 1. Authentication & Session Integrity
* **JWT Token Security:** Signed JSON Web Tokens with strict expiration windows and secure client-side storage (`paikarmart_token`).
* **Bcrypt Password Hashing:** All user passwords are salted and hashed before database persistence.

---

## 🚫 2. Rate Limiting & Anti-Spam Throttling
To prevent bot scrapers, brute-force logins, and chat spam:
* **Auth Endpoints (`/api/auth/*`):** Maximum 10 requests per minute per IP address.
* **Write Operations (`/api/posts/*`, `/api/orders/*`):** Maximum 30 requests per minute.
* **General API Calls:** Maximum 200 requests per minute.

---

## 🌐 3. Network & CORS Hardening
* **Production CORS Whitelist:** Wildcard (`*`) origins are strictly prohibited in production. Only authorized domains (`https://www.paikarmart.com`) are permitted.
* **HTTP Security Headers:** Helmet.js integration to protect against XSS, clickjacking, and MIME-sniffing vulnerabilities.
