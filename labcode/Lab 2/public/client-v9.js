/**
 * client.js
 * --------------------------------------------
 * Handles Socket.IO client-side logic and DOM
 * updates for the real-time dashboard.
 *
 * New in this version:
 * 1. Connects to a custom namespace: /machines
 * 2. Joins one of two rooms based on user selection:
 *      - "machineA" (Machine A)
 *      - "machineB" (Machine B)
 * 3. Provides a machine selector UI that sends
 *    'joinRoom' events to the server.
 *
 * Existing features (unchanged):
 * - Listens for 'machineData' events containing:
 *      { timestamp, RPM, Torque, Pressure }
 * - Updates numeric cards in real time.
 * - Formats timestamp into:
 *      - Date: YYYY-MM-DD
 *      - Time: HH:MM:SS
 * - Maintains history arrays (max length 10) for
 *    RPM, Torque, and Pressure.
 * - Draws simple line charts via <canvas> for
 *    the last 10 readings of each metric.
 * --------------------------------------------
 */

// 1️⃣ Establish connection with backend Socket.IO server
//    Note: We now connect specifically to the "/machines"
//    namespace defined in server.js:
//      const machineNamespace = io.of('/machines');
//
const socket = io('/machines');

// --------------------------------------------
// 2️⃣ Room selection state and DOM references
// --------------------------------------------

// Default room / machine (matches default <select> value)
let currentRoom = 'machineA';

// DOM elements for the machine selector UI
const machineSelect = document.getElementById('machine-select');
const currentMachineLabel = document.getElementById('current-machine-label');

// History arrays for trend charts
const rpmHistory = [];
const torqueHistory = [];
const pressureHistory = [];
const MAX_POINTS = 10;

// --------------------------------------------
// 3️⃣ Utility: maintain fixed-size history array
// --------------------------------------------
function addToHistory(historyArray, newValue) {
  historyArray.push(newValue);
  if (historyArray.length > MAX_POINTS) {
    historyArray.shift(); // remove oldest value
  }
}

// --------------------------------------------
// 4️⃣ Utility: format timestamp into date + time
// --------------------------------------------
function formatTimestamp(isoString) {
  const dateObj = new Date(isoString);

  // Date part in YYYY-MM-DD
  const datePart = dateObj.toISOString().slice(0, 10);

  // Time part (HH:MM:SS) in local time
  const timePart = dateObj.toTimeString().slice(0, 8);

  return { datePart, timePart };
}

// --------------------------------------------
// 5️⃣ Canvas line chart drawing function
// --------------------------------------------
function drawLineChart(canvas, data, minY, maxY) {
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // Clear previous frame
  ctx.clearRect(0, 0, width, height);

  // If we have fewer than 2 points, just clear and exit
  if (data.length < 2) {
    return;
  }

  const padding = 10;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const mapY = (value) => {
    const clamped = Math.min(Math.max(value, minY), maxY);
    const ratio = (clamped - minY) / (maxY - minY); // 0 to 1
    return padding + chartHeight - ratio * chartHeight;
  };

  const stepX = chartWidth / (data.length - 1);

  // Optional baseline
  ctx.beginPath();
  ctx.strokeStyle = '#444';
  ctx.lineWidth = 1;
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();

  // Draw the line
  ctx.beginPath();
  ctx.strokeStyle = '#00eaff';
  ctx.lineWidth = 2;

  data.forEach((value, index) => {
    const x = padding + stepX * index;
    const y = mapY(value);

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();
}

// --------------------------------------------
// 6️⃣ Utility: clear histories and reset visuals
// --------------------------------------------
// Called when switching between machines so that
// old data from Machine A does not remain visible
// when the user switches to Machine B (and vice versa).
//
function resetDataAndCharts() {
  // Clear history arrays
  rpmHistory.length = 0;
  torqueHistory.length = 0;
  pressureHistory.length = 0;

  // Reset numeric values on cards
  document.getElementById('rpm-value').textContent = '--';
  document.getElementById('torque-value').textContent = '--';
  document.getElementById('pressure-value').textContent = '--';
  document.getElementById('timestamp-date').textContent = 'Date: --';
  document.getElementById('timestamp-time').textContent = 'Time: --';

  // Clear charts by drawing with empty data arrays
  const rpmCanvas = document.getElementById('rpm-chart');
  const torqueCanvas = document.getElementById('torque-chart');
  const pressureCanvas = document.getElementById('pressure-chart');

  drawLineChart(rpmCanvas, [], 0, 1);
  drawLineChart(torqueCanvas, [], 0, 1);
  drawLineChart(pressureCanvas, [], 0, 1);
}

// --------------------------------------------
// 7️⃣ Join a Socket.IO room for a given machine
// --------------------------------------------
// Sends a 'joinRoom' event to the server. The server
// will then move this socket into the specified room
// within the /machines namespace.
//
function joinRoom(roomName) {
  currentRoom = roomName;
  socket.emit('joinRoom', roomName);

  // Update label for user feedback
  const labelText =
    roomName === 'machineA' ? 'Machine A' : 'Machine B';
  currentMachineLabel.textContent = `Currently viewing: ${labelText}`;

  // Reset data so the user only sees data from the newly
  // selected machine.
  resetDataAndCharts();
}

// --------------------------------------------
// 8️⃣ Handle UI changes for machine selection
// --------------------------------------------
// When the user changes the <select> dropdown, we
// send a request to join the corresponding room.
//
machineSelect.addEventListener('change', (event) => {
  const selectedRoom = event.target.value; // "machineA" or "machineB"
  joinRoom(selectedRoom);
});

// --------------------------------------------
// 9️⃣ Listen for 'machineData' events from server
// --------------------------------------------
// Data structure received:
//   {
//     timestamp: "2025-11-07T12:34:56.789Z",
//     RPM: "1623",
//     Torque: "215.42",
//     Pressure: "5.87"
//   }
// --------------------------------------------
socket.on('machineData', (data) => {
  console.log('Received machineData:', data);

  // (a) Update numeric card values
  document.getElementById('rpm-value').textContent = data.RPM;
  document.getElementById('torque-value').textContent = data.Torque;
  document.getElementById('pressure-value').textContent = data.Pressure;

  // (b) Format timestamp and update the timestamp card
  const { datePart, timePart } = formatTimestamp(data.timestamp);
  document.getElementById('timestamp-date').textContent = `Date: ${datePart}`;
  document.getElementById('timestamp-time').textContent = `Time: ${timePart}`;

  // (c) Update history arrays (convert strings to numbers)
  addToHistory(rpmHistory, parseFloat(data.RPM));
  addToHistory(torqueHistory, parseFloat(data.Torque));
  addToHistory(pressureHistory, parseFloat(data.Pressure));

  // (d) Redraw trend charts with the updated histories
  const rpmCanvas = document.getElementById('rpm-chart');
  const torqueCanvas = document.getElementById('torque-chart');
  const pressureCanvas = document.getElementById('pressure-chart');

  // Note: min/max values cover both Machine A and Machine B
  // ranges so the chart can accommodate both sets.
  drawLineChart(rpmCanvas, rpmHistory, 1000, 5500);
  drawLineChart(torqueCanvas, torqueHistory, 150, 550);
  drawLineChart(pressureCanvas, pressureHistory, 4, 18);
});

// --------------------------------------------
// 🔟 Optional: connection status logging
// --------------------------------------------
socket.on('connect', () => {
  console.log('Connected to /machines namespace');

  // Join the default room when the connection is established.
  // This ensures the client immediately starts receiving data
  // for the default selection (Machine A).
  joinRoom(currentRoom);
});

socket.on('disconnect', () => {
  console.log('Disconnected from /machines namespace');
});
