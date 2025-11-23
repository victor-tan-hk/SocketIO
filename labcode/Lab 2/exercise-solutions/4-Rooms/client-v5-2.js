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
// NEW UI reference for the "Join New Room" button
// (added in index.html for requirement (b))
// ------------------------------------------------------------
const switchRoomBtn = document.getElementById('switchRoomBtn'); // NEW


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
  roomUI.style.display = 'block';   // show room selection UI
  chatUI.style.display = 'none';    // hide chat until a room is joined
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
    if (data.room === currentRoom) {
      roomCountDisplay.textContent = `Users in room "${data.room}": ${data.count}`;
    }
  });

  socket.on('disconnect', () => {
    appendMessage('Server', 'Disconnected from server.');
  });
});


// ------------------------------------------------------------
// Step 2: Join a room within the namespace
// ------------------------------------------------------------
// This handler is used BOTH for the FIRST join and when
// switching to a NEW room after clicking "Join New Room".
// ------------------------------------------------------------
joinRoomBtn.addEventListener('click', () => {
  const roomName = roomSelect.value;
  if (!socket) return;

  // --------------------------------------------------------
  // NEW LOGIC:
  // If the user already has a currentRoom, we ensure that
  // the newly selected room is DIFFERENT. This enforces the
  // requirement that the user "explicitly choose a new value".
  // --------------------------------------------------------
  if (currentRoom && roomName === currentRoom) {
    alert(`You are already in "${roomName}". Please select a different room from the dropdown before joining.`);
    return;
  }

  // Update the current room to the newly chosen room
  currentRoom = roomName;

  // Emit joinRoom to server. The server code will:
  // - Make the socket leave any previously joined room
  // - Join the socket to this new room
  socket.emit('joinRoom', roomName);

  // Update the UI: hide room selection and show chat
  roomUI.style.display = 'none';
  chatUI.style.display = 'block';
  roomTitle.textContent = `Room: ${roomName}`;
  messagesDiv.innerHTML = '';  // clear old messages when entering a room
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
// Step 4: Disconnect from namespace completely
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


// ------------------------------------------------------------
// NEW FEATURE (b) REFACTORED:
// "Join New Room" using the existing <select id="roomSelect">
// ------------------------------------------------------------
// NEW behavior:
//   - When the button is clicked, we:
//       1) Hide the chat UI
//       2) Re-display the room selection UI (with dropdown)
//       3) Ask the user (via title/message) to pick a NEW room
//   - The actual switch happens when the user then clicks
//     the EXISTING "Join Room" button, which now enforces that
//     the new selection != currentRoom.
// ------------------------------------------------------------
switchRoomBtn.addEventListener('click', () => {
  if (!socket) return;  // must be connected to a namespace

  // Show the room selection UI again so that user can explicitly
  // choose a new room from the dropdown.
  roomUI.style.display = 'block';
  chatUI.style.display = 'none';

  // Optional: update title to make the UX clearer
  chatTitle.textContent =
    `Connected to ${currentNamespace} namespace - please select a NEW room to join.`;

  // We do NOT change currentRoom here.
  // The actual room switch happens in the joinRoomBtn handler,
  // which will:
  //   - check that the new room is different,
  //   - emit 'joinRoom' to the server,
  //   - update currentRoom and the chat UI.
});
