const { isEmpty } = require("lodash");
const passport = require("passport");
const { Server } = require("socket.io");
let io;
const users = {};
module.exports = {
  init: (server, sessionMiddleware) => {
    io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    }); // < Interesting!
    const wrapMiddlewareForSocketIo = (middleware) => (socket, next) =>
      middleware(socket.request, {}, next);
    io.use((socket, next) => {
      // Wrap the express middleware
      sessionMiddleware(socket.request, {}, next);
    });
    io.use(wrapMiddlewareForSocketIo(passport.initialize()));
    io.use(
      wrapMiddlewareForSocketIo(
        passport.authenticate("jwt", {
          session: true,
        })
      )
    );
    io.on("connection", (socket) => {
      if (!isEmpty(socket.request.session.passport.user)) {
        users[socket.request.session.passport.user._id] = socket.id;
      }

      socket.on("disconnecting", (reason) => {});

      socket.on("disconnect", (reason) => {
        delete users[socket.request.session.passport.user._id];
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
  users,
};
