const personalChatHandler = (io, socket) => {

  // 🔹 Join a private room
  socket.on("join_room", ({ roomId }) => {
    socket.join(roomId);
    console.log(`${socket.user.Name} joined room ${roomId}`);
  });

  // 🔹 Send private message
  socket.on("new_message", ({ roomId, message }) => {
    io.to(roomId).emit("receive_message", {
      text: message,
      user: socket.user.Name,
      email: socket.user.Email,
      time: new Date().toLocaleTimeString()
    });
  });

  socket.on("media_message_sent", ({ roomId, mediaUrl, fileType }) => {
    io.to(roomId).emit("media_message", {
      senderName: socket.user.Name,
      mediaUrl,
      email: socket.user.Email,
      fileType
    });
  });


}

module.exports = personalChatHandler;