import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { initiatePayment, verifyPayment, handlePaymentCallback, getPaymentProviders } from '../modules/payment/payment.controller';
import { requireAuth } from '../middleware/auth';
import { JWT_SECRET } from '../config/env';

/**
 * 🛡️ Paikar Mart Payment Module Security Test Suite
 */
async function runPaymentSecurityTests() {
  console.log('🚀 Starting Paikar Mart Payment Security Test Suite...\n');
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

  // --- Test 1: Unauthenticated Initiation Rejection ---
  try {
    const req: any = { headers: {}, body: { orderId: 'ord-123', providerName: 'bkash' } };
    const res = mockRes();
    let nextCalled = false;
    await requireAuth(req, res, (() => { nextCalled = true; }) as any);

    assert.equal(nextCalled, false, 'Next should NOT be called for unauthenticated payment initiation');
    assert.equal(res.statusCode, 401, 'Unauthenticated request must return 401 Unauthorized');
    console.log('✅ Test 1 Passed: Unauthenticated payment initiation rejected.');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 1 Failed:', err.message);
    failedCount++;
  }

  // --- Test 2: Spoofed Callback Wallet Credit Prevention ---
  try {
    const origEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const req: any = {
      params: { provider: 'rocket' },
      body: {
        userId: 'hacker-user-id',
        amount: 1000000,
        tx: 'FAKE_ROCKET_TX'
      }
    };
    const res = mockRes();
    try {
      await handlePaymentCallback(req, res);
    } finally {
      process.env.NODE_ENV = origEnv;
    }

    // Should fail in production or fail server-to-server verification for unverified raw body
    assert.equal(res.statusCode === 400 || res.statusCode === 500, true, 'Spoofed callback must be rejected');
    console.log('✅ Test 2 Passed: Spoofed callback wallet credit prevented.');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 2 Failed:', err.message);
    failedCount++;
  }

  // --- Test 3: Provider Verification Failure Response ---
  try {
    const origEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const req: any = {
      user: { id: 'buyer-1', role: 'buyer' },
      body: {
        transactionId: 'INVALID_TX_9999',
        providerName: 'bkash',
        orderId: 'ord-test-999'
      }
    };
    const res = mockRes();
    try {
      await verifyPayment(req, res);
    } finally {
      process.env.NODE_ENV = origEnv;
    }

    // If provider verification fails or DB offline, handle correctly without fake success
    assert.equal(res.statusCode === 400 || res.statusCode === 500 || (res.body && res.body.status === 'failed'), true);
    console.log('✅ Test 3 Passed: Verification failure status handled safely.');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 3 Failed:', err.message);
    failedCount++;
  }

  // --- Test 4: Active Payment Providers List Accuracy ---
  try {
    const req: any = { user: { id: 'buyer-1' } };
    const res = mockRes();
    await getPaymentProviders(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(Array.isArray(res.body.providers), true);
    const bkash = res.body.providers.find((p: any) => p.id === 'bkash');
    assert.equal(Boolean(bkash), true, 'bKash must be present in providers list');
    console.log('✅ Test 4 Passed: Provider listing accuracy verified.');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 4 Failed:', err.message);
    failedCount++;
  }

  // --- Test Summary ---
  console.log(`\n========================================`);
  console.log(`Payment Test Summary: ${passedCount} Passed, ${failedCount} Failed`);
  console.log(`========================================\n`);

  if (failedCount > 0) {
    process.exit(1);
  }
}

runPaymentSecurityTests();
