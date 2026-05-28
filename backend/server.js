const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const { addUser, getUser, removeUser } = require("./utils/users");

app.get("/", (req, res) => {
  res.send("Whiteboard server running");
});

io.on("connection", (socket) => {
  
  // JOIN ROOM
  socket.on("userJoined", (data) => {
    const { name, userId, roomId, host, presenter } = data;

    socket.join(roomId);

    const users = addUser({
      name,
      userId,
      roomId,
      host,
      presenter,
      socketId: socket.id,
    });

    socket.emit("userIsJoined", { success: true, users });

    socket.to(roomId).emit("allUsers", users);

    socket.to(roomId).emit("userJoinedMessageBroadcasted", {
      name,
      userId,
      users,
    });
  });

  // WHITEBOARD DATA (REALTIME FIX)
  socket.on("whiteboardData", (data) => {
    const user = getUser(socket.id);
    if (!user) return;

    socket.to(user.roomId).emit("whiteBoardDataResponse", {
      imgURL: data,
    });
  });

  // CHAT
  socket.on("message", (data) => {
    const user = getUser(socket.id);
    if (!user) return;

    socket.to(user.roomId).emit("messageResponse", {
      message: data.message,
      name: user.name,
    });
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    const user = getUser(socket.id);
    if (!user) return;

    removeUser(socket.id);

    socket.to(user.roomId).emit("userLeftMessageBroadcasted", {
      name: user.name,
      userId: user.userId,
    });
  });
});

const port = process.env.PORT || 5000;

server.listen(port, () =>
  console.log("server running on port", port)
);
