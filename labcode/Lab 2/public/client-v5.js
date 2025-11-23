// ------------------------------------------------------------
// client.js
// ------------------------------------------------------------
// Demonstrates Socket.IO Namespaces + Rooms.
// Users first choose a namespace, then choose a room within
// that namespace. Chat messages stay within the room.
// ------------------------------------------------------------

let socket = null;
let currentNamespace = null;
let currentRoom = null;

// UI references
const connectBtn = document.getElementById('connectBtn');
const namespaceSelect = document.getElementById('namespaceSelect');
const joinRoomBtn = document.getElementById('joinRoomBtn');
const roomSelect = document.getElementById('roomSelect');
const chatUI = document.getElementById('chatUI');
const connectUI = document.getElementById('connectUI');
const roomUI = document.getElementById('roomUI');
const chatTitle = document.getElementById('chatTitle');
const roomTitle = document.getElementById('roomTitle');
const userCountDisplay = document.getElementById('userCount');
const roomCountDisplay = document.getElementById('roomCount');
const messagesDiv = document.getElementById('messages');
const input = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const disconnectBtn = document.getElementById('disconnectBtn');

// ------------------------------------------------------------
// Append message helper
// ------------------------------------------------------------
function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.textContent = `${sender}: ${text}`;
  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// ------------------------------------------------------------
// Step 1: Connect to namespace
// ------------------------------------------------------------
connectBtn.addEventListener('click', () => {
  const namespace = namespaceSelect.value;
  if (socket) socket.disconnect();

  socket = io(namespace);
  currentNamespace = namespace;

  connectUI.style.display = 'none';
  roomUI.style.display = 'block';
  chatUI.style.display = 'none';
  messagesDiv.innerHTML = '';
  chatTitle.textContent = `Connected to ${namespace} namespace`;

  // Listen for messages from this namespace
  socket.on('message', (data) => appendMessage(data.sender, data.text));

  // Namespace user count
  socket.on('userCountUpdate', (data) => {
    userCountDisplay.textContent = `Users online in ${namespace}: ${data.count}`;
  });

  // Room user count updates
  socket.on('roomCountUpdate', (data) => {
    if (data.room === currentRoom)
      roomCountDisplay.textContent = `Users in room "${data.room}": ${data.count}`;
  });

  socket.on('disconnect', () => {
    appendMessage('Server', 'Disconnected from server.');
  });
});

// ------------------------------------------------------------
// Step 2: Join a room within the namespace
// ------------------------------------------------------------
joinRoomBtn.addEventListener('click', () => {
  const roomName = roomSelect.value;
  if (!socket) return;

  currentRoom = roomName;
  socket.emit('joinRoom', roomName);

  roomUI.style.display = 'none';
  chatUI.style.display = 'block';
  roomTitle.textContent = `Room: ${roomName}`;
  messagesDiv.innerHTML = '';
});

// ------------------------------------------------------------
// Step 3: Send chat messages (room-scoped)
// ------------------------------------------------------------
sendBtn.addEventListener('click', () => {
  const message = input.value.trim();
  if (message) {
    socket.emit('chatMessage', message);
    input.value = '';
  }
});

// ------------------------------------------------------------
// Step 4: Disconnect from namespace
// ------------------------------------------------------------
disconnectBtn.addEventListener('click', () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  chatUI.style.display = 'none';
  roomUI.style.display = 'none';
  connectUI.style.display = 'block';
  currentNamespace = null;
  currentRoom = null;
});
