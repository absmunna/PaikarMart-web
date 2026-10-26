# PaikarMart — Bangladesh Payment, Settlement & Logistics Standards
> **Scope:** Integration of local payment gateways (bKash, Nagad, SSLCommerz), Cash-on-Delivery (COD) reconciliation, BD Address hierarchy, and logistics fulfillment.

---

## ৳ 1. Local Payment & Financial Settlements
* **Mobile Financial Services (MFS):** Native support for bKash (`#e2136e`), Nagad (`#f37021`), and Rocket with secure merchant API routing.
* **Cash-on-Delivery (COD) Reconciliation:** Riders collect physical cash upon successful OTP delivery verification; funds are logged in the rider's ledger (`useWalletStore`) for automated payout settlement to sellers.
* **Automatic Tax & VAT:** 5% standard VAT calculation applied automatically during universal checkout.

---

## 🗺️ 2. Standardized BD Address Hierarchy
To ensure error-free deliveries across 64 districts in Bangladesh, all user and merchant addresses adhere to a strict 5-tier selector:
```
Division (বিভাগ) ➔ District (জেলা) ➔ Upazila (উপজেলা) ➔ Area (এলাকা) ➔ ZIP Code (পোস্ট কোড)
```
This single address source is shared uniformly across checkout, pickup, and delivery dispatch modules.
