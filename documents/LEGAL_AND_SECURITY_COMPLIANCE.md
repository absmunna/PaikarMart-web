# Legal & Security Compliance Framework

PaikarMart operates at the intersection of social networking and global ecommerce. This document outlines the regulatory rules and security implementations required for various jurisdictions.

## 1. Global Ecommerce Regulatory Rules
To ensure multi-country compliance, PaikarMart implements the following:
- **Consumer Protection Laws**: Transparent pricing, clear refund policies, and verified seller badges.
- **Tax Compliance**: Support for Tax Identification Numbers (TIN/VAT/EIN) during vendor onboarding.
- **Trade Licensing**: Mandatory trade license validation for wholesale and B2B entities.

## 2. Social Network Laws & Privacy
- **GDPR (EU) & CCPA (California)**:
  - User-controlled data (Delete account functionality).
  - Explicit consent for marketing communications.
- **Content Moderation**: Terms of Service agreements for all vendors to prevent illegal or counterfeit goods.

## 3. Security Implementation
- **Supabase Row Level Security (RLS)**:
  - Ensures users can only access their own private orders.
  - Public can only select from `active` stores and products.
- **Firebase Authentication**:
  - Secure JWT-based sessions.
  - Multi-factor authentication (MFA) ready architecture.
- **Data Encryption**: All data transmitted over HTTPS (Vercel/Render automatic TLS).

## 4. Localized Compliance Checklist
- [ ] **Bangladesh**: Support for local mobile wallets (bKash/Nagad) and VAT registration validation.
- [ ] **United States**: State-specific sales tax calculation and LLC verification.
- [ ] **European Union**: VAT OSS compliance and "Right to be Forgotten" implementation.

---

*PaikarMart is designed to be "Legally Secure by Default". Any new feature must be audited against this framework.*
