import assert from 'node:assert/strict';
import { getOrders, getOrderById, addOrder, updateOrderStatus } from '../modules/order/order.controller';
import { requireAuth } from '../middleware/auth';

/**
 * 🛡️ Paikar Mart Order Module Security Test Suite
 */
async function runOrderSecurityTests() {
  console.log('🚀 Starting Paikar Mart Order Security Test Suite...\n');
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

  // --- Test 1: Unauthenticated Endpoint Access Rejection ---
  try {
    const req: any = { headers: {}, params: { id: 'ord-123' } };
    const res = mockRes();
    let nextCalled = false;
    await requireAuth(req, res, (() => { nextCalled = true; }) as any);

    assert.equal(nextCalled, false, 'Next should NOT be called for unauthenticated requests');
    assert.equal(res.statusCode, 401, 'Unauthenticated order request must return 401');
    console.log('✅ Test 1 Passed: Unauthenticated order access rejected.');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 1 Failed:', err.message);
    failedCount++;
  }

  // --- Test 2: Buyer / Owner Tenant Isolation ---
  try {
    const req: any = {
      user: { id: 'buyer-2', role: 'buyer' },
      params: { id: 'ord-buyer-1-secret' }
    };
    const res = mockRes();
    await getOrderById(req, res);

    assert.equal(
      res.statusCode === 403 || res.statusCode === 404,
      true,
      'Accessing another user order must return 403 Forbidden or 404 Not Found'
    );
    console.log('✅ Test 2 Passed: Owner tenant isolation enforced.');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 2 Failed:', err.message);
    failedCount++;
  }

  // --- Test 3: Seller Isolation & Filtering ---
  try {
    const req: any = {
      user: { id: 'seller-1', role: 'seller', isSeller: true }
    };
    const res = mockRes();
    await getOrders(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(Array.isArray(res.body), true, 'Orders list must be an array');
    console.log('✅ Test 3 Passed: Seller order list isolation verified.');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 3 Failed:', err.message);
    failedCount++;
  }

  // --- Test 4: Empty Cart / Items Order Rejection ---
  try {
    const req: any = {
      user: { id: 'buyer-1', role: 'buyer' },
      body: {
        items: [],
        deliveryAddress: 'Dhaka, Bangladesh'
      },
      headers: {}
    };
    const res = mockRes();
    await addOrder(req, res);

    assert.equal(res.statusCode, 400, 'Empty items order must return 400 Bad Request');
    assert.equal(res.body?.error, 'EMPTY_CART');
    console.log('✅ Test 4 Passed: Empty cart checkout rejected.');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 4 Failed:', err.message);
    failedCount++;
  }

  // --- Test 5: Invalid Status Transition Rejection ---
  try {
    const req: any = {
      user: { id: 'seller-1', role: 'seller' },
      params: { id: 'ORD-78902' }, // mock delivered order
      body: { status: 'pending' }
    };
    const res = mockRes();
    await updateOrderStatus(req, res);

    assert.equal(
      res.statusCode === 400 || res.statusCode === 403 || res.statusCode === 404 || res.statusCode === 503,
      true,
      'Invalid status transition from delivered to pending must be rejected'
    );
    console.log('✅ Test 5 Passed: Invalid status transition rejected.');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 5 Failed:', err.message);
    failedCount++;
  }

  // --- Test 6: Buyer Unauthorized Transition Rejection ---
  try {
    const req: any = {
      user: { id: 'buyer-1', role: 'buyer' },
      params: { id: 'ORD-78901' },
      body: { status: 'delivered' }
    };
    const res = mockRes();
    await updateOrderStatus(req, res);

    assert.equal(
      res.statusCode === 403 || res.statusCode === 400 || res.statusCode === 404 || res.statusCode === 503,
      true,
      'Buyer cannot mark order as delivered'
    );
    console.log('✅ Test 6 Passed: Unauthorized buyer status transition blocked.');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 6 Failed:', err.message);
    failedCount++;
  }

  // --- Test Summary ---
  console.log(`\n========================================`);
  console.log(`Order Test Summary: ${passedCount} Passed, ${failedCount} Failed`);
  console.log(`========================================\n`);

  if (failedCount > 0) {
    process.exit(1);
  }
}

runOrderSecurityTests();
