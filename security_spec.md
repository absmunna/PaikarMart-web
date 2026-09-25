# Security Specification & Security TDD (Paikar Mart)

## 1. Data Invariants
- A user document `/users/{userId}` can only be read or created/updated by the authenticated user whose `request.auth.uid == userId`, or read/managed by verified admins.
- User identity spoofing (`uid != request.auth.uid`) is strictly forbidden.
- An order document `/orders/{orderId}` can only be read by the owner (`resource.data.userId == request.auth.uid`) or admins.
- Updates cannot bypass validation helper schemas (`isValidUserProfile`, `isValidOrder`).
- Unbounded writes and shadow properties outside the schema are rejected.

## 2. The Dirty Dozen Payloads (Rejection Matrix)
1. **Unauthenticated User Read**: Attempt to read `/users/user-123` with `request.auth = null` -> `PERMISSION_DENIED`.
2. **Cross-User Profile Read (PII Leaking)**: User B (`uid: "user-456"`) attempts to read `/users/user-123` -> `PERMISSION_DENIED`.
3. **Identity Spoofing on User Create**: User A (`uid: "user-123"`) submits `{ uid: "admin-999", role: "admin" }` to `/users/user-123` -> `PERMISSION_DENIED`.
4. **ID Path Mismatch Poisoning**: User A attempts to write to `/users/user-456` with valid payload -> `PERMISSION_DENIED`.
5. **Junk Character ID Injection**: Request targeting `/users/user@@@###$$$%%%` -> `PERMISSION_DENIED`.
6. **Shadow Field Injection**: User writes `{ uid: "user-123", email: "a@b.com", name: "A", role: "buyer", isSuperAdmin: true }` -> `PERMISSION_DENIED`.
7. **Order Hijack Attack**: User B attempts to read `/orders/ord-999` where `userId: "user-123"` -> `PERMISSION_DENIED`.
8. **Malicious Order Tamper**: User B attempts to update or delete order owned by User A -> `PERMISSION_DENIED`.
9. **Blanket Query Scraping**: Client queries `/orders` without scoping `userId == request.auth.uid` -> `PERMISSION_DENIED`.
10. **Type Poisoning**: Submitting `totalAmount: "ten thousand"` instead of number -> `PERMISSION_DENIED`.
11. **Excessive String Payload (Denial of Wallet)**: Submitting a 50KB name string exceeding limits -> `PERMISSION_DENIED`.
12. **Self-Escalated Admin Role**: Ordinary user creating a profile with `role: "admin"` -> `PERMISSION_DENIED`.
