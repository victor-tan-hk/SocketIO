// ------------------------------------------------------------
// client.js
// ------------------------------------------------------------
// Demonstrates connecting to one of multiple Socket.IO namespaces
// (/general, /sports, /movies). Also displays live user counts
// and allows the user to disconnect and reselect a namespace.
// ------------------------------------------------------------


// UI elements
const connectBtn = document.getElementById('connectBtn');
const disconnectBtn = document.getElementById('disconnectBtn');
const namespaceSelect = document.getElementById('namespaceSelect');
const chatUI = document.getElementById('chatUI');
const connectUI = document.getElementById('connectUI');
const chatTitle = document.getElementById('chatTitle');
const userCountDisplay = document.getElementById('userCount');
const messagesDiv = document.getElementById('messages');
const input = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

// ------------------------------------------------------------
// Append a chat message to the display area
// ------------------------------------------------------------
function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.textContent = `${sender}: ${text}`;
  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll
}

// ------------------------------------------------------------
// Connect button handler — user selects a namespace
// ------------------------------------------------------------

let socket = null; // Socket connection reference

connectBtn.addEventListener('click', () => {
  const namespace = namespaceSelect.value; // e.g. "/sports" or "/movies"

  // Disconnect previous socket if already connected
  if (socket) {
    socket.disconnect();
  }

  // Establish a connection to the selected namespace
  socket = io(namespace);

  // Update UI
  chatTitle.textContent = `Connected to ${namespace} chat`;
  connectUI.style.display = 'none';
  chatUI.style.display = 'block';
  messagesDiv.innerHTML = '';
  userCountDisplay.textContent = 'Users online: ...';

  // ----------------------------------------------------------
  // Listen for new messages from the server (within namespace)
  // ----------------------------------------------------------
  socket.on('message', (data) => {
    appendMessage(data.sender, data.text);
  });

  // ----------------------------------------------------------
  // Receive live user count updates for this namespace
  // ----------------------------------------------------------
  socket.on('userCountUpdate', (data) => {
    userCountDisplay.textContent = `Users online in ${namespace}: ${data.count}`;
  });

  // ----------------------------------------------------------
  // Send chat messages when "Send" button is clicked
  // ----------------------------------------------------------
  sendBtn.onclick = () => {
    const message = input.value.trim();
    if (message) {
      socket.emit('chatMessage', message);
      input.value = '';
    }
  };

  // ----------------------------------------------------------
  // Handle disconnection event
  // ----------------------------------------------------------
  socket.on('disconnect', () => {
    appendMessage('Server', 'You have disconnected from the chat.');
  });
});

// ------------------------------------------------------------
// Disconnect button — allows user to leave current namespace
// ------------------------------------------------------------
disconnectBtn.addEventListener('click', () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  chatUI.style.display = 'none';
  connectUI.style.display = 'block';
});
