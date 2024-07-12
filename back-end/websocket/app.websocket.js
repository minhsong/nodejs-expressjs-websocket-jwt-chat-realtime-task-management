const socketIo = require("socket.io");
const { jwtDecode } = require("../helpers/jwthelper");
var io;
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./users.websocket");
const { generateMessage } = require("../helpers/messages");
const { userOnline, userOffline } = require("../Services/user.service");
const users = {};
module.exports = {
  init: (server) => {
    // Initialize Socket.IO
    io = socketIo(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    // Middleware to check authentication
    io.use(async (socket, next) => {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication error"));
      }

      const payload = await jwtDecode(token);

      if (!payload) {
        return next(new Error("Authentication error"));
      }
      socket.user = payload;

      next();
    });

    // Handle a connection event
    io.on("connection", (socket) => {
      userOnline(socket.user.id);

      users[socket.user.id] = socket.id;
      socket.broadcast.emit("user.online", socket.user);
      socket.on("message.created", (message, callback) => {
        const result = generateMessage(
          socket.user,
          message.content,
          message.to
        );
        if (message.to && message.to !== "general") {
          const user = users[message.to];
          if (user) {
            io.to(user).emit("message.created", {
              ...result,
              room: socket.user.id,
            });
            socket.emit("message.created", {
              ...result,
              room: message.to,
            });
          }
        } else {
          io.sockets.emit("message.created", result);
        }
        callback(result);
      });
      // Handle a disconnect event
      socket.on("disconnect", () => {
        delete users[socket.user.id];
        socket.broadcast.emit("user.offline", socket.user);
        userOffline(socket.user.id);
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};
