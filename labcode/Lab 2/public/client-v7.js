// ------------------------------------------------------------
// client.js
// ------------------------------------------------------------
// Demonstrates Socket.IO Namespaces + Rooms + Usernames
// plus auto-reconnection handling.
//
// Two reconnection approaches are demonstrated:
//
//   OPTION A – Manual Prompt Rejoin
//     • On reconnect, the user is alerted to manually select a room again.
//
//   OPTION B – Automatic Rejoin
//     • On reconnect, the client automatically re-joins the
//       previous room and namespace using stored variables.
//
// Students can switch between them by commenting/uncommenting
// the relevant section near the bottom of this file.
// ------------------------------------------------------------

let socket = null;
let currentNamespace = null;
let currentRoom = null;
let currentUsername = null;

// ------------------------------------------------------------
// UI Element References
// ------------------------------------------------------------
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
// Helper function: Append chat messages to the chat window
// ------------------------------------------------------------
function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.textContent = `${sender}: ${text}`;
  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
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

  // Disconnect an existing socket if already connected
  if (socket) socket.disconnect();

  // Create a new socket connection to the selected namespace
  socket = io(namespace);

  // Update UI
  connectUI.style.display = 'none';
  roomUI.style.display = 'block';
  chatUI.style.display = 'none';
  messagesDiv.innerHTML = '';
  chatTitle.textContent = `Connected to ${namespace} namespace`;

  // ----------------------------------------------------------
  // Core socket event listeners
  // ----------------------------------------------------------

  // Standard message handler
  socket.on('message', (data) => appendMessage(data.sender, data.text));

  // Namespace-level user count
  socket.on('userCountUpdate', (data) => {
    userCountDisplay.textContent = `Users in ${namespace}: ${data.count}`;
  });

  // Room-level user count
  socket.on('roomCountUpdate', (data) => {
    if (data.room === currentRoom)
      roomCountDisplay.textContent = `Users in room "${data.room}": ${data.count}`;
  });

  // Handle disconnection notice
  socket.on('disconnect', (reason) => {
    appendMessage('System', `Disconnected: ${reason}`);
  });

  // ----------------------------------------------------------
  // AUTO-RECONNECTION EVENT HANDLING
  // ----------------------------------------------------------

  // When reconnection attempts start
  socket.io.on('reconnect_attempt', (attempt) => {
    appendMessage('System', `Reconnection attempt #${attempt}...`);
  });

  // ----------------------------------------------------------
  // When the client successfully reconnects to the namespace
  // ----------------------------------------------------------
  socket.io.on('reconnect', (attemptNumber) => {
    appendMessage('System', `Reconnected to ${currentNamespace} after ${attemptNumber} attempts.`);

    // ======================================================
    // === OPTION A – Manual Prompt Rejoin ==================
    // ======================================================
    // Comment out this section if using Option B below.
    // ------------------------------------------------------
    /*
    alert('Reconnected to the server. Please re-select and join a room.');
    roomUI.style.display = 'block';   // Show the room selection UI again
    chatUI.style.display = 'none';    // Hide the chat UI until room joined
    */

    // ======================================================
    // === OPTION B – Automatic Rejoin =======================
    // ======================================================
    // Uncomment this section if you want automatic rejoin.
    // ------------------------------------------------------
    if (currentRoom && currentUsername) {
      appendMessage('System', `Automatically rejoining ${currentRoom}...`);
      socket.emit('joinRoom', {
        roomName: currentRoom,
        username: currentUsername
      });
    } else {
      appendMessage('System', 'Please join a room again.');
      roomUI.style.display = 'block';
      chatUI.style.display = 'none';
    }
  });

  // When all reconnection attempts fail
  socket.io.on('reconnect_failed', () => {
    appendMessage('System', 'Reconnection failed. Please refresh the page.');
  });
});

// ------------------------------------------------------------
// Step 2: Join a room (sends both room name and username)
// ------------------------------------------------------------
joinRoomBtn.addEventListener('click', () => {
  if (!socket) return;

  const roomName = roomSelect.value;
  currentRoom = roomName;

  socket.emit('joinRoom', { roomName, username: currentUsername });

  // Update UI
  roomUI.style.display = 'none';
  chatUI.style.display = 'block';
  roomTitle.textContent = `Room: ${roomName}`;
  connectionInfo.textContent =
    `You are logged in as "${currentUsername}" in namespace "${currentNamespace}", room "${currentRoom}".`;
  messagesDiv.innerHTML = '';
});

// ------------------------------------------------------------
// Step 3: Send a room-specific chat message
// ------------------------------------------------------------
sendBtn.addEventListener('click', () => {
  const message = input.value.trim();
  if (message) {
    socket.emit('chatMessage', message);
    input.value = '';
  }
});

// ------------------------------------------------------------
// Step 4: Disconnect manually
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
