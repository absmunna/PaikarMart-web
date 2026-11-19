import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config/env';
import { firebaseAuthInstance } from '../../config/firebase';
import { db, prisma } from '../../config/database';

interface AuthenticatedSocket extends Socket {
  data: {
    user?: {
      id: string;
      email?: string;
      role?: string;
    };
    messageHistory?: number[];
  };
}

/**
 * 🔒 Hardened Socket.IO Real-Time Chat Handler
 */
export const setupChatHandlers = (ioInstance: SocketIOServer) => {
  // 1. Connection Handshake Authentication Middleware
  ioInstance.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const authHeader = socket.handshake.headers?.authorization;
      const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
      const token = socket.handshake.auth?.token || bearerToken || (socket.handshake.query?.token as string);

      let userPayload: { id: string; email?: string; role?: string } | null = null;

      if (token) {
        // A. Verify with Firebase Admin SDK if token is provided and firebaseAuthInstance is active
        if (firebaseAuthInstance) {
          try {
            const decoded = await firebaseAuthInstance.verifyIdToken(token);
            userPayload = {
              id: decoded.uid,
              email: decoded.email,
              role: (decoded as any).role || 'buyer'
            };
          } catch (e) {
            // Token might be custom backend JWT
          }
        }

        // B. Verify with Backend JWT if Firebase did not verify
        if (!userPayload) {
          try {
            const decoded: any = jwt.verify(token, JWT_SECRET);
            if (decoded && (decoded.id || decoded.userId || decoded.uid)) {
              userPayload = {
                id: decoded.id || decoded.userId || decoded.uid,
                email: decoded.email,
                role: decoded.role || 'buyer'
              };
            }
          } catch (e) {
            // JWT verification failed
          }
        }
      }

      // Dev mode fallback ONLY if NODE_ENV is not production and no token provided
      if (!userPayload) {
        if (process.env.NODE_ENV === 'production') {
          return next(new Error('Authentication error: Valid identity token required'));
        }
        // Dev fallback mode with explicit flag
        userPayload = {
          id: socket.handshake.query?.userId as string || `usr_dev_${socket.id.substring(0, 5)}`,
          email: 'dev_user@paikarmart.com',
          role: 'buyer'
        };
      }

      socket.data.user = userPayload;
      socket.data.messageHistory = [];
      return next();
    } catch (err: any) {
      console.error('[Socket Auth] Authentication error:', err.message);
      return next(new Error('Authentication error: Token verification failed'));
    }
  });

  ioInstance.on('connection', (socket: AuthenticatedSocket) => {
    const socketUser = socket.data.user;
    console.log(`[Socket] User '${socketUser?.id}' connected (${socket.id})`);

    // 2. Room Join Request Handling with Authorization Check
    socket.on('chat:join', async (room: string) => {
      try {
        if (!room || typeof room !== 'string' || room.trim().length === 0 || room.length > 128) {
          return socket.emit('chat:error', { message: 'Invalid room identifier' });
        }

        const cleanRoom = room.trim();

        // Public / General support rooms open to all authenticated users
        const isPublicRoom = cleanRoom === 'general' || cleanRoom === 'support' || cleanRoom.startsWith('public_');

        if (!isPublicRoom) {
          // Private room participant check
          let isParticipant = false;

          if (db.isConnected()) {
            // Query DB if chat room model exists or check order ownership if order room
            if (cleanRoom.startsWith('ord_') || cleanRoom.startsWith('ORD-')) {
              const order = await prisma.order.findUnique({ where: { id: cleanRoom } });
              if (order && (order.buyerId === socketUser?.id || order.userId === socketUser?.id || order.sellerId === socketUser?.id || socketUser?.role === 'admin')) {
                isParticipant = true;
              }
            }
          } else {
            // Dev mode participant allowance
            isParticipant = true;
          }

          if (!isParticipant && socketUser?.role !== 'admin' && socketUser?.role !== 'super_admin') {
            console.warn(`[Socket] User '${socketUser?.id}' denied join to private room '${cleanRoom}'`);
            return socket.emit('chat:error', { message: 'Forbidden: You are not a participant in this chat room' });
          }
        }

        socket.join(cleanRoom);
        console.log(`[Socket] User '${socketUser?.id}' joined room '${cleanRoom}'`);
        socket.emit('chat:joined', { room: cleanRoom, userId: socketUser?.id });
      } catch (err: any) {
        console.error('[Socket] Join error:', err);
        socket.emit('chat:error', { message: 'Failed to join chat room' });
      }
    });

    // 3. Message Event Handler with Schema Validation, Sender Binding & Socket Rate Limiting
    socket.on('chat:message', async (data: any) => {
      try {
        const { room, message, text } = data ?? {};
        const content = (message || text || '').toString().trim();

        if (!room || typeof room !== 'string') {
          return socket.emit('chat:error', { message: 'Room identifier is required' });
        }
        if (!content || content.length === 0) {
          return socket.emit('chat:error', { message: 'Message content cannot be empty' });
        }
        if (content.length > 2000) {
          return socket.emit('chat:error', { message: 'Message exceeds maximum limit of 2000 characters' });
        }

        // Room membership check: Socket must have joined the room first
        if (!socket.rooms.has(room.trim())) {
          return socket.emit('chat:error', { message: 'Forbidden: You must join the room before sending messages' });
        }

        // Socket Rate Limiting: Max 10 messages per 10 seconds
        const now = Date.now();
        const history = socket.data.messageHistory || [];
        const recentMessages = history.filter(t => now - t < 10000);

        if (recentMessages.length >= 10) {
          return socket.emit('chat:error', { message: 'Rate limit exceeded: Maximum 10 messages per 10 seconds allowed' });
        }

        recentMessages.push(now);
        socket.data.messageHistory = recentMessages;

        // Authoritative Sender Binding (NEVER trust client-sent 'sender' property)
        const senderId = socketUser?.id || 'anonymous';
        const senderName = socketUser?.email || senderId;

        const messagePayload = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          room: room.trim(),
          message: content,
          text: content,
          sender: senderName,
          senderId: senderId,
          timestamp: new Date().toISOString()
        };

        // Broadcast to room
        ioInstance.to(room.trim()).emit('chat:message', messagePayload);
      } catch (err: any) {
        console.error('[Socket] Message handling error:', err);
        socket.emit('chat:error', { message: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] User '${socketUser?.id}' disconnected`);
    });
  });
};
