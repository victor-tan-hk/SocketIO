// Import the WS library
const WebSocket = require('ws');

const portToUse = 8080
// Create a WebSocket server on selected port 
const wss = new WebSocket.Server({ port: portToUse });

console.log('WebSocket server started on ws://localhost:8080');

// Listen for new client connection event
// The callback receives one argument, ws, which represents 
// the individual WebSocket connection to that specific client.

wss.on('connection', (ws) => {
  console.log('New client connected');

  // Send a welcome message to the client
  ws.send('Hello! You are connected to the WebSocket server.');

  // Listen for message events from this client
  ws.on('message', (message) => {
    const msg = message.toString();
    console.log('Received from client:', msg);

    // Check if the client wants to terminate WS connection
    // if the message received is exit
    if (msg.trim().toLowerCase() === 'exit') {
      ws.send('Goodbye! Closing connection...');
      console.log('Closing connection with client.');
      ws.close(); // Close the WebSocket connection
      return;
    }

    // Echo any other message back to the client
    ws.send(`Server received: ${msg}`);
  });

  // Handle client disconnect event
  // This event fires when:
  // a) The client closes the connection.
  // b) The server closes it (as in the Exit case).
  // c) The connection is lost (e.g., browser tab closed, network issue).
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
