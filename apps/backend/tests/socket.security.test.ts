import assert from 'node:assert/strict';
import { Server as SocketIOServer } from 'socket.io';
import { createServer } from 'node:http';
import { io as ClientIO, Socket as ClientSocket } from 'socket.io-client';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';
import { setupChatHandlers } from '../modules/chat/chat.socket';

/**
 * 🛡️ Paikar Mart Real-Time Socket.IO & Access Control Security Test Suite
 */
async function runSocketSecurityTests() {
  console.log('🚀 Starting Paikar Mart Socket.IO & Access Control Security Test Suite...\n');
  let passedCount = 0;
  let failedCount = 0;

  const httpServer = createServer();
  const io = new SocketIOServer(httpServer);
  setupChatHandlers(io);

  await new Promise<void>((resolve) => httpServer.listen(0, resolve));
  const port = (httpServer.address() as any).port;
  const serverUrl = `http://localhost:${port}`;

  const validToken = jwt.sign({ id: 'user-buyer-1', role: 'buyer', email: 'buyer1@paikarmart.com' }, JWT_SECRET, { expiresIn: '1h' });
  const validUser2Token = jwt.sign({ id: 'user-buyer-2', role: 'buyer', email: 'buyer2@paikarmart.com' }, JWT_SECRET, { expiresIn: '1h' });

  // --- Test 1: Authenticated Socket Connection ---
  try {
    const client: ClientSocket = ClientIO(serverUrl, {
      auth: { token: validToken },
      transports: ['websocket']
    });

    await new Promise<void>((resolve, reject) => {
      client.on('connect', () => {
        client.disconnect();
        resolve();
      });
      client.on('connect_error', (err) => {
        reject(err);
      });
    });

    console.log('✅ Test 1 Passed: Authenticated Socket.IO connection accepted.');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 1 Failed:', err.message);
    failedCount++;
  }

  // --- Test 2: Unauthenticated Connection Rejection in Production Mode ---
  try {
    const origEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const client: ClientSocket = ClientIO(serverUrl, {
      auth: {},
      transports: ['websocket'],
      reconnection: false
    });

    await new Promise<void>((resolve, reject) => {
      client.on('connect', () => {
        process.env.NODE_ENV = origEnv;
        client.disconnect();
        reject(new Error('Unauthenticated socket connection should have been rejected in production mode'));
      });
      client.on('connect_error', (err) => {
        process.env.NODE_ENV = origEnv;
        client.disconnect();
        resolve();
      });
    });

    console.log('✅ Test 2 Passed: Unauthenticated socket connection rejected in production mode.');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 2 Failed:', err.message);
    failedCount++;
  }

  // --- Test 3: Verified Sender Identity Binding (Spoofed Sender Overridden) ---
  try {
    const client: ClientSocket = ClientIO(serverUrl, {
      auth: { token: validToken },
      transports: ['websocket']
    });

    await new Promise<void>((resolve, reject) => {
      client.on('connect', () => {
        client.emit('chat:join', 'general');
      });

      client.on('chat:joined', () => {
        // Attempt to send message with spoofed sender name
        client.emit('chat:message', {
          room: 'general',
          message: 'Hello from verified user',
          sender: 'SPOOFED_ADMIN_ACCOUNT'
        });
      });

      client.on('chat:message', (data) => {
        try {
          // Authoritative sender should reflect verified socket identity
          assert.equal(data.sender, 'buyer1@paikarmart.com');
          assert.equal(data.senderId, 'user-buyer-1');
          client.disconnect();
          resolve();
        } catch (e) {
          client.disconnect();
          reject(e);
        }
      });
    });

    console.log('✅ Test 3 Passed: Verified socket identity bound & spoofed sender overridden.');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 3 Failed:', err.message);
    failedCount++;
  }

  // --- Test 4: Message Length Validation ---
  try {
    const client: ClientSocket = ClientIO(serverUrl, {
      auth: { token: validToken },
      transports: ['websocket']
    });

    await new Promise<void>((resolve, reject) => {
      client.on('connect', () => {
        client.emit('chat:join', 'general');
      });

      client.on('chat:joined', () => {
        // Send oversized message > 2000 chars
        const oversizedMessage = 'A'.repeat(2500);
        client.emit('chat:message', {
          room: 'general',
          message: oversizedMessage
        });
      });

      client.on('chat:error', (errData) => {
        try {
          assert.equal(errData.message.includes('maximum limit'), true);
          client.disconnect();
          resolve();
        } catch (e) {
          client.disconnect();
          reject(e);
        }
      });
    });

    console.log('✅ Test 4 Passed: Oversized socket message (>2000 chars) rejected.');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 4 Failed:', err.message);
    failedCount++;
  }

  // --- Test 5: Socket Rate Limiting ---
  try {
    const client: ClientSocket = ClientIO(serverUrl, {
      auth: { token: validToken },
      transports: ['websocket']
    });

    await new Promise<void>((resolve, reject) => {
      client.on('connect', () => {
        client.emit('chat:join', 'general');
      });

      client.on('chat:joined', () => {
        // Rapid fire 12 messages
        for (let i = 0; i < 12; i++) {
          client.emit('chat:message', { room: 'general', message: `Message ${i}` });
        }
      });

      client.on('chat:error', (errData) => {
        if (errData.message.includes('Rate limit exceeded')) {
          client.disconnect();
          resolve();
        }
      });

      setTimeout(() => {
        client.disconnect();
        reject(new Error('Rate limit error event was not triggered'));
      }, 2000);
    });

    console.log('✅ Test 5 Passed: Socket message rate limiting enforced.');
    passedCount++;
  } catch (err: any) {
    console.error('❌ Test 5 Failed:', err.message);
    failedCount++;
  }

  httpServer.close();

  // --- Test Summary ---
  console.log(`\n========================================`);
  console.log(`Socket & Rules Test Summary: ${passedCount} Passed, ${failedCount} Failed`);
  console.log(`========================================\n`);

  if (failedCount > 0) {
    process.exit(1);
  }
}

runSocketSecurityTests();
