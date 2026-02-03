const jwt = require("jsonwebtoken");
const User = require("../models/user");


const socketAuthMiddleware = async (socket, next) => {
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
};


module.exports = socketAuthMiddleware;