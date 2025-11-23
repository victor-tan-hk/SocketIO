// Uses both Express.js and Socket.IO libraries

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Create Express app
const app = express();

// Create HTTP server and attach Express to it
const server = http.createServer(app);

// Attach Socket.IO to the HTTP server
const io = new Server(server);

// Serve static files from 'public' folder
app.use(express.static('public'));

// Serve the HTML page from root route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Listen for incoming Socket.IO connections
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  // Send welcome message to client
  socket.emit('message', 'Hello! You are connected to the Socket.IO server.');

  // Listen for messages event from the client
  socket.on('message', (msg) => {
    console.log('Received from client:', msg);

    // Check for Exit command
    if (msg.trim().toLowerCase() === 'exit') {
      socket.emit('message', 'Goodbye! Closing connection...');
      console.log('Closing connection with client:', socket.id);
      socket.disconnect(true);
      return;
    }

    // Echo message back
    socket.emit('message', `Server received: ${msg}`);
  });

  // When the client disconnects event
  socket.on('disconnect', (reason) => {
    console.log(`Client ${socket.id} disconnected (${reason})`);
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
