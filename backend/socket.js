const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("./models/user");

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication error: Token missing"));
      }

      const decoded = jwt.verify(token, "secretKey");
console.log(decoded);
      const user = await User.findByPk(decoded.id);
      console.log(user);
      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      // attach user to socket
      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.user.id, socket.user.Name);

    socket.on("message", (data) => {
      console.log("Message received:", data);

      // broadcast to all clients
      io.emit("message", {user: socket.user.Name,
        message: data});
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.user.id);
    });
  });
};
