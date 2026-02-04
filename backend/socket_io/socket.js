const { Server } = require("socket.io");
const socketAuthMiddleware = require("./middleware");

const chatHandler = require("./handler/chat");
const personalChatHandler = require("./handler/personalChat");

const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    // use auth middleware
    io.use(socketAuthMiddleware);

    io.on("connection", (socket) => {
        console.log("User connected:", socket.user.id, socket.user.Name);

        socket.on("message", (data) => {
            console.log("Message received:", data);

            // broadcast to all clients
            io.emit("message", {
                user: socket.user.Name,
                message: data
            });
        });

        // attach handlers
        chatHandler(io, socket);
        personalChatHandler(io, socket);

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.user.id);
        });
    });
};


module.exports = setupSocket;