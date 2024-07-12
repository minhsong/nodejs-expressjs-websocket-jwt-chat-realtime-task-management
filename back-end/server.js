const dotenv = require("dotenv");
const express = require("express");
const unless = require("express-unless");
const cors = require("cors");
const userRoute = require("./Routers/user.route");
const employeeRoute = require("./Routers/employee.route");
const taskRoute = require("./Routers/task.route");
const auth = require("./Middlewares/auth");
const http = require("http");
const SocketAppInstance = require("./websocket/app.websocket");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// AUTH VERIFICATION AND UNLESS

auth.verifyToken.unless = unless;

app.use(
  auth.verifyToken.unless({
    path: [
      { url: "/user/login", method: ["POST"] },
      { url: "/user/register", method: ["POST"] },
      { url: "/socket.io/", method: ["GET"] },
      { url: "/user/access-code", method: ["POST"] },
      { url: "/user/verify-access-code", method: ["POST"] },
    ],
  })
);

// Create an HTTP server
const server = http.createServer(app);

//ROUTES

app.use("/user", userRoute);
app.use("/employee", employeeRoute);
app.use("/task", taskRoute);
// Initialize Socket.IO
SocketAppInstance.init(server);
server.listen(process.env.PORT, () => {
  console.log(`Server is online! Port: ${process.env.PORT}`);
});
