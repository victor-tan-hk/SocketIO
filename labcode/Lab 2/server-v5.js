// ------------------------------------------------------------
// server.js
// ------------------------------------------------------------
// Backend demonstrating Socket.IO Namespaces + Rooms.
// Each namespace (/general, /sports, /movies) is isolated,
// and within each namespace, clients can join specific rooms.
// ------------------------------------------------------------

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from "public"
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ------------------------------------------------------------
// Function to set up each namespace
// ------------------------------------------------------------
function setupNamespace(namespaceName) {
  const nsp = io.of(namespaceName);
  let clientCount = 0; // track number of connected clients per namespace

  nsp.on('connection', (socket) => {
    clientCount++;
    const clientName = `${namespaceName.slice(1)}_User${clientCount}`;
    console.log(`[${namespaceName}] ${clientName} connected`);

    // Send a welcome message
    socket.emit('message', {
      sender: 'Server',
      text: `Welcome ${clientName} to ${namespaceName} chat!`
    });

    // Notify others in namespace
    socket.broadcast.emit('message', {
      sender: 'Server',
      text: `${clientName} joined the ${namespaceName} chat.`
    });

    // Broadcast current namespace user count
    nsp.emit('userCountUpdate', { count: nsp.sockets.size });

    // --------------------------------------------------------
    // Listen for when the client joins a room
    // --------------------------------------------------------
    socket.on('joinRoom', (roomName) => {
      // All sockets have a private socket room, given by it socket.id
      // Leave any previously joined rooms first (except its private socket room)
      // before joining the new room
      for (const r of socket.rooms) {
        if (r !== socket.id) 
          socket.leave(r);
      }

      socket.join(roomName); // Join the new room
      console.log(`[${namespaceName}] ${clientName} joined room ${roomName}`);

      // Notify client of successful join
      socket.emit('message', {
        sender: 'Server',
        text: `You joined room "${roomName}" within ${namespaceName}.`
      });

      // Broadcast room join message to others in the same room
      socket.to(roomName).emit('message', {
        sender: 'Server',
        text: `${clientName} has joined room "${roomName}".`
      });

      // Send updated user count in this room
      const roomSize = nsp.adapter.rooms.get(roomName)?.size || 0;
      nsp.to(roomName).emit('roomCountUpdate', {
        room: roomName,
        count: roomSize
      });
    });

    // --------------------------------------------------------
    // Handle incoming chat messages (room-specific)
    // --------------------------------------------------------
    socket.on('chatMessage', (msg) => {

      // Each socket by default has a private room that it is in
      // which is identified by its socket.id
      console.log(`Received message ** ${msg} ** from socket id : ${socket.id}`);

      // The socket.rooms property contains all the rooms the socket is in
      // We convert this property (which is a set) into an array 
      const allRooms = Array.from(socket.rooms);

      // Loop through each room in the array
      // to identify which room the socket is currently in
      let currentRoom = '';
      for (const roomName of allRooms) {

        // We are looking for rooms which are not 
        // the socket's private room, given by its id
        if (roomName !== socket.id) {
          currentRoom = roomName;
          console.log("Socket is in room : " + currentRoom);
          break;
        }
      }

      if (currentRoom === '') {
        // If user hasn't joined any room, send them a warning
        socket.emit('message', {
          sender: 'Server',
          text: 'You must join a room before sending messages.'
        });
        return;
      }
      nsp.to(currentRoom).emit('message', { sender: clientName, text: msg });
    });

    // --------------------------------------------------------
    // Handle disconnection
    // --------------------------------------------------------
    socket.on('disconnect', () => {
      console.log(`[${namespaceName}] ${clientName} disconnected`);
      nsp.emit('message', {
        sender: 'Server',
        text: `${clientName} left the ${namespaceName} chat.`
      });
      nsp.emit('userCountUpdate', { count: nsp.sockets.size });
    });
  });
}

// Setup namespaces
setupNamespace('/general');
setupNamespace('/sports');
setupNamespace('/movies');

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Namespaces: /general, /sports, /movies');
});
