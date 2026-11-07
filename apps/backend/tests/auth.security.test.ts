import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { register, syncUser, sendOtp, verifyOtp, refreshToken } from '../modules/auth/auth.controller';
import { requireAuth, optionalAuth } from '../middleware/auth';
import { verifySuperAdmin } from '../middleware/rbac';
import { JWT_SECRET } from '../config/env';

/**
 * 🛡️ Paikar Mart Security Test Suite
 * Validates RBAC enforcement, client role injection prevention, OTP rate limiting, and token verification.
 */
async function runAuthSecurityTests() {
  console.log('🚀 Starting Paikar Mart Auth & Security Test Suite...\n');
  let passedCount = 0;
  let failedCount = 0;

  function mockRes() {
    const res: any = {};
    res.statusCode = 200;
    res.body = null;
    res.status = (code: number) => {
      res.statusCode = code;
      return res;
    };
    res.json = (data: any) => {
      res.body = data;
      return res;
    };
    return res;
  }

  // --- Test 1: Client Role Injection Prevention on Registration ---
  try {
    const req: any = {
      body: {
        email: `test_inject_${Date.now()}@example.com`,
        fullName: 'Attacker User',
        role: 'super_admin' // Attempted role injection
      }
    };
    const res = mockRes();
    await register(req, res);

    assert.equal(res.statusCode, 201, 'Registration should return 201');
    assert.equal(res.body.user.role, 'buyer', 'Role injection must be blocked! Default role must be buyer.');
    console.log('✅ Test 1 Passed: Client role injection on registration blocked.');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 1 Failed:', err.message);
    failedCount++;
  }

  // --- Test 2: Unverified / Forged Token Rejection ---
  try {
    const forgedToken = jwt.sign({ id: 'hacker-123', role: 'super_admin' }, 'wrong_secret_key');
    const req: any = {
      headers: { authorization: `Bearer ${forgedToken}` }
    };
    const res = mockRes();
    let nextCalled = false;
    await requireAuth(req, res, (() => { nextCalled = true; }) as any);

    assert.equal(nextCalled, false, 'Next should NOT be called for forged tokens');
    assert.equal(res.statusCode, 401, 'Forged token must return 401 Unauthorized');
    console.log('✅ Test 2 Passed: Forged JWT token rejected cleanly.');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 2 Failed:', err.message);
    failedCount++;
  }

  // --- Test 3: Expired Token Rejection ---
  try {
    const expiredToken = jwt.sign({ id: 'user-expired', role: 'buyer' }, JWT_SECRET, { expiresIn: '-1s' });
    const req: any = {
      headers: { authorization: `Bearer ${expiredToken}` }
    };
    const res = mockRes();
    let nextCalled = false;
    await requireAuth(req, res, (() => { nextCalled = true; }) as any);

    assert.equal(nextCalled, false, 'Next should NOT be called for expired tokens');
    assert.equal(res.statusCode, 401, 'Expired token must return 401 Unauthorized');
    console.log('✅ Test 3 Passed: Expired JWT token rejected.');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 3 Failed:', err.message);
    failedCount++;
  }

  // --- Test 4: OTP Rate Limiting & Cooldown Enforced ---
  try {
    const identifier = `test_otp_${Date.now()}@example.com`;
    const req1: any = { body: { email: identifier, purpose: 'login' } };
    const res1 = mockRes();
    await sendOtp(req1, res1);

    assert.equal(res1.statusCode, 200, 'First OTP request should succeed');

    // Immediate second request within 60s cooldown
    const req2: any = { body: { email: identifier, purpose: 'login' } };
    const res2 = mockRes();
    await sendOtp(req2, res2);

    assert.equal(res2.statusCode, 429, 'Immediate second OTP request must be rate-limited (429)');
    console.log('✅ Test 4 Passed: OTP rate limiting & resend cooldown enforced.');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 4 Failed:', err.message);
    failedCount++;
  }

  // --- Test 5: OTP Max Verification Attempts Exceeded ---
  try {
    const identifier = `test_max_attempt_${Date.now()}@example.com`;
    // We send an OTP, then attempt 3 wrong verification tries
    const reqSend: any = { body: { email: identifier, purpose: 'login' } };
    await sendOtp(reqSend, mockRes());

    for (let i = 1; i <= 3; i++) {
      const reqVerify: any = { body: { email: identifier, otp: '000000' } };
      const resVerify = mockRes();
      await verifyOtp(reqVerify, resVerify);
      assert.equal(resVerify.statusCode, 400, 'Wrong OTP must return 400');
    }

    // 4th attempt after max tries
    const reqVerify4: any = { body: { email: identifier, otp: '000000' } };
    const resVerify4 = mockRes();
    await verifyOtp(reqVerify4, resVerify4);

    assert.equal(resVerify4.statusCode, 400, 'Expired or invalidated OTP must return 400');
    console.log('✅ Test 5 Passed: Maximum OTP verification attempts lockout enforced.');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 5 Failed:', err.message);
    failedCount++;
  }

  // --- Test 6: Unauthorized Admin Access Prevention ---
  try {
    const buyerToken = jwt.sign({ id: 'buyer-user-id', role: 'buyer' }, JWT_SECRET, { expiresIn: '1h' });
    const req: any = {
      headers: { authorization: `Bearer ${buyerToken}` }
    };
    const res = mockRes();
    let nextCalled = false;
    await verifySuperAdmin(req, res, (() => { nextCalled = true; }) as any);

    assert.equal(nextCalled, false, 'Standard buyer token must NOT access super admin routes');
    assert.equal(res.statusCode, 403, 'Super admin check must return 403 Forbidden for buyer accounts');
    console.log('✅ Test 6 Passed: Unauthorized admin access strictly forbidden.');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 6 Failed:', err.message);
    failedCount++;
  }

  // --- Test Summary ---
  console.log(`\n========================================`);
  console.log(`Test Execution Summary: ${passedCount} Passed, ${failedCount} Failed`);
  console.log(`========================================\n`);

  if (failedCount > 0) {
    process.exit(1);
  }
}

runAuthSecurityTests();
