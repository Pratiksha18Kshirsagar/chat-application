const express = require("express");
const http = require("http");
const cors = require("cors");
const sequelize = require("./utils/db");
const setupSocket = require("./socket_io/socket");

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const mediaRoutes = require("./routes/mediaRoute");

require("./models/index");

const app = express();
const PORT = 4000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/media", mediaRoutes);

// routes
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);

// create http server
const server = http.createServer(app);

// attach socket.io
setupSocket(server);

// start server after DB sync
sequelize
  .sync({ alter: true })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database sync failed:", err);
  });

module.exports = app;
