const personalChatHandler = (io, socket) => {
  let currentRoom = null;

  socket.on("join_room", ({ receiverId }) => {
    const senderId = socket.user.id;

    const roomId =
      senderId < receiverId
        ? `${senderId}_${receiverId}`
        : `${receiverId}_${senderId}`;

    // 🚨 leave previous room
    if (currentRoom) {
      socket.leave(currentRoom);
    }

    socket.join(roomId);
    currentRoom = roomId;

    console.log(`User ${senderId} joined room ${roomId}`);
  });

  socket.on("new_message", ({ receiverId, message }) => {
    const senderId = socket.user.id;

    const roomId =
      senderId < receiverId
        ? `${senderId}_${receiverId}`
        : `${receiverId}_${senderId}`;

    io.to(roomId).emit("receive_message", {
      senderId,
      senderName: socket.user.Name,
      message
    });
  });
};

module.exports = personalChatHandler;
