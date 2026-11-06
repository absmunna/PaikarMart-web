import { Server as SocketIOServer } from 'socket.io';
import { io } from '../../server';

export const setupChatHandlers = (ioInstance: SocketIOServer) => {
  ioInstance.on('connection', (socket) => {
    console.log('User connected to chat:', socket.id);

    socket.on('chat:join', (room) => {
      socket.join(room);
      console.log(`User ${socket.id} joined room ${room}`);
    });

    socket.on('chat:message', (data) => {
      const { room, message, sender } = data;
      // Broadcast to room
      ioInstance.to(room).emit('chat:message', {
        message,
        sender,
        timestamp: new Date().toISOString()
      });
      // In production, save to database here
    });

    socket.on('disconnect', () => {
      console.log('User disconnected from chat');
    });
  });
};
