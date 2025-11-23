// Establish a connection to the Socket.IO server
// By default, it connects back to the same host that served the page
const socket = io();

// Get references to important DOM elements
const logDiv = document.getElementById('log');
const sendBtn = document.getElementById('sendBtn');
const messageInput = document.getElementById('messageInput');

// Function to append messages to the log box
function log(message) {
  const p = document.createElement('p');
  p.textContent = message;
  logDiv.appendChild(p);
  logDiv.scrollTop = logDiv.scrollHeight;
}

// Listen for connection event to the server
socket.on('connect', () => {
  log('Connected to Socket.IO server.');
});

// Listen for incoming messages from the server
socket.on('message', (msg) => {
  log('Received from server: ' + msg);
});

// Listen for disconnection event and display event 
socket.on('disconnect', (reason) => {
  log('Disconnected from server. Reason: ' + reason);
});

// Send message when button clicked
sendBtn.addEventListener('click', () => {
  const text = messageInput.value.trim();

  // Check if connection is active
  if (!socket.connected) {
    log('Cannot send: Socket.IO connection is not active. Please refresh or reconnect.');
    return;
  }

  if (text) {
    // Send message to server using emit
    socket.emit('message', text);
    log('Sent to server: ' + text);
    messageInput.value = '';
  } else {
    log('Please type a message before sending.');
  }
});

