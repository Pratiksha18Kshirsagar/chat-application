const chatHandler = (io, socket) => {
  // public message
  socket.on("message", (data) => {
    console.log("Public message:", data);

    io.emit("message", {
      user: socket.user.Name,
      message: data
    });
  });
};

module.exports = chatHandler;
