// ------------------------------------------------------------
// client.js
// ------------------------------------------------------------
// Demonstrates Socket.IO Namespaces + Rooms + Usernames.
// Users choose a namespace, enter a username, join a room,
// and chat. The UI displays the connected username,
// namespace, and room for clarity.
// ------------------------------------------------------------

let socket = null;
let currentNamespace = null;
let currentRoom = null;
let currentUsername = null;

// Get references to key UI elements
const connectBtn = document.getElementById('connectBtn');
const namespaceSelect = document.getElementById('namespaceSelect');
const usernameInput = document.getElementById('usernameInput');
const joinRoomBtn = document.getElementById('joinRoomBtn');
const roomSelect = document.getElementById('roomSelect');
const chatUI = document.getElementById('chatUI');
const connectUI = document.getElementById('connectUI');
const roomUI = document.getElementById('roomUI');
const chatTitle = document.getElementById('chatTitle');
const roomTitle = document.getElementById('roomTitle');
const userCountDisplay = document.getElementById('userCount');
const roomCountDisplay = document.getElementById('roomCount');
const connectionInfo = document.getElementById('connectionInfo');
const messagesDiv = document.getElementById('messages');
const input = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const disconnectBtn = document.getElementById('disconnectBtn');

// ------------------------------------------------------------
// Helper function: Append chat messages to chat area
// ------------------------------------------------------------
function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.textContent = `${sender}: ${text}`;
  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll
}

// ------------------------------------------------------------
// Step 1: Connect to a namespace
// ------------------------------------------------------------
connectBtn.addEventListener('click', () => {
  const namespace = namespaceSelect.value;
  const username = usernameInput.value.trim();

  if (username === '') {
    alert('Please enter a username before connecting.');
    return;
  }

  currentUsername = username;
  currentNamespace = namespace;

  // If already connected, disconnect first
  if (socket) socket.disconnect();

  // Connect to selected namespace
  socket = io(namespace);

  // Update UI
  connectUI.style.display = 'none';
  roomUI.style.display = 'block';
  chatUI.style.display = 'none';
  messagesDiv.innerHTML = '';
  chatTitle.textContent = `Connected to ${namespace} namespace`;

  // Listen for messages
  socket.on('message', (data) => appendMessage(data.sender, data.text));

  // Namespace user count update
  socket.on('userCountUpdate', (data) => {
    userCountDisplay.textContent = `Users in ${namespace}: ${data.count}`;
  });

  // Room user count update
  socket.on('roomCountUpdate', (data) => {
    if (data.room === currentRoom)
      roomCountDisplay.textContent = `Users in room "${data.room}": ${data.count}`;
  });

  socket.on('disconnect', () => {
    appendMessage('Server', 'Disconnected from server.');
  });
});

// ------------------------------------------------------------
// Step 2: Join a room (send username + room name)
// ------------------------------------------------------------
joinRoomBtn.addEventListener('click', () => {
  if (!socket) return;

  const roomName = roomSelect.value;
  currentRoom = roomName;

  // Emit event with both room name and username
  socket.emit('joinRoom', { roomName : roomName, username: currentUsername });

  // Update UI
  roomUI.style.display = 'none';
  chatUI.style.display = 'block';
  roomTitle.textContent = `Room: ${roomName}`;
  connectionInfo.textContent = `You are logged in as "${currentUsername}" in namespace "${currentNamespace}", room "${currentRoom}".`;
  messagesDiv.innerHTML = '';
});

// ------------------------------------------------------------
// Step 3: Send room-specific message
// ------------------------------------------------------------
sendBtn.addEventListener('click', () => {
  const message = input.value.trim();
  if (message) {
    socket.emit('chatMessage', message);
    input.value = '';
  }
});

// ------------------------------------------------------------
// Step 4: Disconnect from server
// ------------------------------------------------------------
disconnectBtn.addEventListener('click', () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  chatUI.style.display = 'none';
  roomUI.style.display = 'none';
  connectUI.style.display = 'block';
  connectionInfo.textContent = 'Not connected.';
});
