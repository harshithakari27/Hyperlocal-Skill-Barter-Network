const Message = require('../models/Message');

function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join-room', (matchId) => {
      socket.join(matchId);
    });

    socket.on('send-message', async (data) => {
      try {
        const { matchId, senderId, senderName, text } = data;
        const message = await Message.create({ matchId, senderId, senderName, text });
        io.to(matchId).emit('receive-message', message);
      } catch (err) {
        console.log('Error saving message:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });
}

module.exports = socketHandler;