// client.js
// ----------------------------------------------
// This is the client-side JavaScript code that connects
// to the backend Socket.IO server and handles sending and
// receiving chat messages in real time.
// ----------------------------------------------

// Establish a connection to the Socket.IO server
// By default, it connects back to the same host that served the page
const socket = io();

// Get references to important DOM elements
const messagesDiv = document.getElementById('messages');
const input = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

// ----------------------------------------------
// Helper function: append a message to the messages <div>
// This displays both server and client messages in the chat window
// ----------------------------------------------
function appendMessage(sender, text) {
  const msg = document.createElement('div');      // Create a new <div> for the message
  msg.textContent = `${sender}: ${text}`;         // Format as "Sender: Message"
  messagesDiv.appendChild(msg);                   // Add it to the message list
  messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll to bottom for new messages
}

// ----------------------------------------------
// Listen for incoming broadcast messages from the server
// These messages include the sender name and the message text
// ----------------------------------------------
socket.on('message', (data) => {
  appendMessage(data.sender, data.text);
});

// ----------------------------------------------
// When the "Send" button is clicked, send the message
// to the server via a 'chatMessage' event
// ----------------------------------------------
sendBtn.addEventListener('click', () => {
  const message = input.value.trim();  // Get and trim the input text
  if (message) {                       // Only send if it's not empty
    socket.emit('chatMessage', message); // Send to the server
    input.value = '';                    // Clear input box after sending
  }
});
