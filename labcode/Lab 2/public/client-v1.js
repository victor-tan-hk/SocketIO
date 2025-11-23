
const portToUse = 8080

// Connect to the WebSocket server at the designated port
// Uses the native WebSocket object
const socket = new WebSocket(`ws://localhost:${portToUse}`);

// Obtain references to the relevant elements in the HML
const logDiv = document.getElementById('log');
const sendBtn = document.getElementById('sendBtn');
const messageInput = document.getElementById('messageInput');

// Simple function to display message for log output
// by creating a new <p> element and placing text content in it
// then appending it as a child to the logDiv element
function log(message) {
  const p = document.createElement('p');
  p.textContent = message;
  logDiv.appendChild(p);
  logDiv.scrollTop = logDiv.scrollHeight;
}

// Add event listener for handling initiation of connection
socket.addEventListener('open', () => {
  log('Connected to WebSocket server.');
});

// Add event listener for handling message received from server
socket.addEventListener('message', (event) => {
  log('Received from server: ' + event.data);
});

// Add event listener for handling closing of connection
socket.addEventListener('close', () => {
  log('Disconnected from WebSocket server.');
});

// Add event listener for handling an error
socket.addEventListener('error', (error) => {
  log('WebSocket error: ' + error);
});

// Send a message when button is clicked
sendBtn.addEventListener('click', () => {
  const text = messageInput.value;
  
  // Check that there is content in the text field before sending
  // otherwise, give warning message
  if (!text) {
    log('Please type a message before sending.');
  }
  // Check that the WebSocket connection is actually open
  // before sending
  else if (text && socket.readyState === WebSocket.OPEN) {
    socket.send(text);
    log('Sent to server: ' + text);
    messageInput.value = '';
  } else {
    log('Cannot send: WebSocket is not open.');
  }
});
