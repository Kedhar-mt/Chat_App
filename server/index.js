const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let roomUsers = {};  // To keep track of users in each room

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Event when a user joins a room
  socket.on("join_room", ({ room, username }) => {
    socket.join(room);
    socket.username = username;
    
    // Add user to the roomUsers list
    if (!roomUsers[room]) {
      roomUsers[room] = [];
    }
    roomUsers[room].push(username);

    // Notify all users in the room about the new user
    io.to(room).emit("user_joined", `${username} has joined the room!`);
    
    // Emit the updated list of users in the room
    io.to(room).emit("room_users", { users: roomUsers[room] });

    // Send a welcome message to the user who joined
    socket.emit("receive_message", { message: `Welcome ${username}!`, username, timestamp: new Date(), delivered: true });
  });

  // Event to send a message to the room
  socket.on("send_message", ({ message, room, username }) => {
    const timestamp = new Date();
    io.to(room).emit("receive_message", { message, room, username, timestamp, delivered: true, seen: false });
  });

  // Event when a user is typing
  socket.on("typing", ({ room, username }) => {
    socket.to(room).emit("typing", { username });
  });

  // Handle message seen status
  socket.on("message_seen", ({ room, username }) => {
    io.to(room).emit("receive_message", { message: `${username} has seen the message.`, room, username, seen: true });
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    // Remove user from all rooms they were part of
    for (let room in roomUsers) {
      if (roomUsers[room].includes(socket.username)) {
        roomUsers[room] = roomUsers[room].filter(user => user !== socket.username);

        // Emit the updated users list in the room
        io.to(room).emit("room_users", { users: roomUsers[room] });
        
        // Notify all users that this user left the room
        io.to(room).emit("user_left", `${socket.username} has left the room!`);
      }
    }
  });
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});
