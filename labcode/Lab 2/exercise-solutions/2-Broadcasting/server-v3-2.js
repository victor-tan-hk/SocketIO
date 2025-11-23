// ----------------------------------------------
// This is the backend portion of a simple real-time
// chat application that demonstrates message broadcasting
// using the Socket.IO library.
// ----------------------------------------------

const express = require('express');      // Import the Express framework
const http = require('http');             // Node's built-in HTTP module (needed for Socket.IO integration)
const { Server } = require('socket.io');  // Import the Server class from socket.io
const path = require('path');             // Utility for handling file paths

const app = express();                    // Create an Express app
const server = http.createServer(app);    // Create an HTTP server using Express
const io = new Server(server);            // Attach a Socket.IO server instance to the HTTP server

let clientCount = 0;                      // Counter to assign each connected client a unique name

// ----------------------------------------------
// Serve static files from the 'public' folder
// This includes our index.html and client.js files
// ----------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML page when user visits the root route '/'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ----------------------------------------------
// Socket.IO connection handler
// This event is triggered each time a new client connects
// ----------------------------------------------
io.on('connection', (socket) => {
  clientCount++;                              // Increment client counter
  const clientName = `Client ${clientCount}`; // Assign an identifier name
  console.log(`${clientName} connected`);

  // Send a welcome message to this newly connected client only
  socket.emit('message', { 
    sender: 'Server', 
    text: `Welcome ${clientName}!`,
    timestamp: new Date().toLocaleTimeString() // NEW ADDITION
  
  });

  // Notify all *other* clients that a new client has joined
  socket.broadcast.emit('message', { 
    sender: 'Server', 
    text: `${clientName} joined the chat.`,
    timestamp: new Date().toLocaleTimeString() // NEW ADDITION
   }); 

  // ----------------------------------------------
  // Listen for incoming messages from this client
  // The 'chatMessage' event is sent from the frontend
  // ----------------------------------------------
  socket.on('chatMessage', (msg) => {
    // Broadcast the received message to *all* clients (including sender)
    // io.emit() sends to everyone connected
    io.emit('message', { 
      sender: clientName, 
      text: msg,
      timestamp: new Date().toLocaleTimeString() // NEW ADDITION
     });
  });

  // ----------------------------------------------
  // Handle client disconnection
  // Notify all remaining clients that someone left
  // ----------------------------------------------
  socket.on('disconnect', () => {
    console.log(`${clientName} disconnected`);
    io.emit('message', { 
      sender: 'Server', 
      text: `${clientName} left the chat.`,
      timestamp: new Date().toLocaleTimeString() // NEW ADDITION
     });
  });
});

// ----------------------------------------------
// Start the server and listen on port 3000
// ----------------------------------------------
const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on cool http://localhost:${PORT}`));
