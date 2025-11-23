// ------------------------------------------------------------
// server.js
// ------------------------------------------------------------
// Backend for a real-time chat app demonstrating Socket.IO namespaces.
// Each namespace (/general, /sports, /movies) acts as an isolated channel.
// This version also tracks and broadcasts the number of connected users
// in each namespace in real time.
// ------------------------------------------------------------

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ------------------------------------------------------------
// Serve static files (index.html, client.js) from the "public" folder
// ------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));

// Root route serves index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ------------------------------------------------------------
// Helper function to configure and attach handlers for a namespace
// ------------------------------------------------------------
function setupNamespace(namespaceName) {
  const nsp = io.of(namespaceName); // Create namespace object
  let clientCount = 0;              // Track users connected to this namespace

  nsp.on('connection', (socket) => {
    clientCount++;
    const clientName = `${namespaceName.slice(1)}_User${clientCount}`;
    console.log(`[${namespaceName}] ${clientName} connected`);

    // Send a welcome message only to the new client
    socket.emit('message', {
      sender: 'Server',
      text: `Welcome ${clientName} to the ${namespaceName} chat!`
    });

    // Broadcast to all other clients in this namespace
    socket.broadcast.emit('message', {
      sender: 'Server',
      text: `${clientName} has joined the ${namespaceName} chat.`
    });

    // Notify *all* clients in this namespace of the updated user count
    nsp.emit('userCountUpdate', { count: nsp.sockets.size });

    // Handle chat messages within this namespace
    socket.on('chatMessage', (msg) => {
      nsp.emit('message', { sender: clientName, text: msg });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`[${namespaceName}] ${clientName} disconnected`);
      nsp.emit('message', {
        sender: 'Server',
        text: `${clientName} has left the ${namespaceName} chat.`
      });

      // Update all clients in this namespace with the new user count
      nsp.emit('userCountUpdate', { count: nsp.sockets.size });
    });
  });
}

// ------------------------------------------------------------
// Create three distinct namespaces
// ------------------------------------------------------------
setupNamespace('/general');
setupNamespace('/sports');
setupNamespace('/movies');

// ------------------------------------------------------------
// Start the HTTP + Socket.IO server
// ------------------------------------------------------------
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Namespaces available: /general, /sports, /movies');
});
