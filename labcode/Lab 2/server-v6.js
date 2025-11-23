// ------------------------------------------------------------
// server.js
// ------------------------------------------------------------
// Demonstrates Socket.IO namespaces + rooms + user-defined usernames.
// Each namespace (/general, /sports, /movies) is isolated,
// and within each namespace, clients can join specific rooms.
// Clients can also specify their username when joining a room.
// ------------------------------------------------------------

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ------------------------------------------------------------
// Serve static files from the "public" directory
// ------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ------------------------------------------------------------
// Helper function to configure each namespace
// ------------------------------------------------------------
function setupNamespace(namespaceName) {
  const nsp = io.of(namespaceName);
  let clientCount = 0; // Track number of connections in each namespace

  nsp.on('connection', (socket) => {
    clientCount++;
    // Create a temp username in case user does not actually enter
    // a valid username 
    const tempName = `${namespaceName.slice(1)}_User${clientCount}`;
    console.log(`[${namespaceName}] ${tempName} connected`);

    // Send welcome message to the connected client
    socket.emit('message', {
      sender: 'Server',
      text: `Welcome to ${namespaceName}! Please join a room to start chatting.`
    });

    // Broadcast namespace-level user count
    nsp.emit('userCountUpdate', { count: nsp.sockets.size });

    // --------------------------------------------------------
    // Listen for client joining a specific room + providing username
    // --------------------------------------------------------
    socket.on('joinRoom', (data) => {
      const { roomName, username } = data;

      let displayName; 
      // Check if username exists and is not an 
      // empty string after trimming spaces
      if (username && username.trim() !== '') {
        // If the user provided a valid name, use it
        displayName = username;
      } else {
        // Otherwise, fall back to the temporary name
        // we generated earlier
        displayName = tempName;
      }

      // Leave any previously joined rooms (except the socket's own private room)
      for (const r of socket.rooms) {
        if (r !== socket.id) socket.leave(r);
      }

      // Join the selected room
      socket.join(roomName);
      console.log(`[${namespaceName}] ${displayName} joined room ${roomName}`);

      // Notify only this client
      socket.emit('message', {
        sender: 'Server',
        text: `You joined "${roomName}" in ${namespaceName} as "${displayName}".`
      });

      // Notify others in the same room
      socket.to(roomName).emit('message', {
        sender: 'Server',
        text: `${displayName} has joined room "${roomName}".`
      });

      // Update room user count
      const roomSize = nsp.adapter.rooms.get(roomName)?.size || 0;
      nsp.to(roomName).emit('roomCountUpdate', { room: roomName, count: roomSize });

      // Store username and room info for later use
      socket.data.username = displayName;
      socket.data.roomName = roomName;
    });

    // --------------------------------------------------------
    // Handle incoming chat messages (room-scoped)
    // --------------------------------------------------------
    socket.on('chatMessage', (msg) => {
      const roomName = socket.data.roomName;
      const displayName = socket.data.username || tempName;

      if (!roomName) {
        socket.emit('message', {
          sender: 'Server',
          text: 'Please join a room before sending messages.'
        });
        return;
      }

      // Broadcast message within that specific room
      nsp.to(roomName).emit('message', { sender: displayName, text: msg });
    });

    // --------------------------------------------------------
    // Handle client disconnection
    // --------------------------------------------------------
    socket.on('disconnect', () => {
      const displayName = socket.data.username || tempName;
      console.log(`[${namespaceName}] ${displayName} disconnected`);
      nsp.emit('message', {
        sender: 'Server',
        text: `${displayName} left the ${namespaceName} chat.`
      });

      // Update namespace user count
      nsp.emit('userCountUpdate', { count: nsp.sockets.size });
    });
  });
}

// Create namespaces
setupNamespace('/general');
setupNamespace('/sports');
setupNamespace('/movies');

// Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Namespaces available: /general, /sports, /movies');
});
