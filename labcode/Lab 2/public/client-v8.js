/**
 * client.js
 * --------------------------------------------
 * Handles Socket.IO client-side logic and DOM
 * updates for the real-time dashboard.
 *
 * Features:
 * 1. Establish a Socket.IO connection to backend.
 * 2. Listen for 'machineData' events:
 *      { timestamp, RPM, Torque, Pressure }
 * 3. Update numeric cards with the latest values.
 * 4. Convert timestamp into a readable date + time:
 *      - Date: YYYY-MM-DD
 *      - Time: HH:MM:SS
 *    (without the 'T' and 'Z' from ISO format)
 * 5. Maintain history arrays (max length 10) for
 *    RPM, Torque, and Pressure.
 * 6. Draw simple line charts on <canvas> elements
 *    using only plain JavaScript.
 * --------------------------------------------
 */

// 1️⃣ Establish connection with backend Socket.IO server
const socket = io();

// --------------------------------------------
// 2️⃣ History arrays for trend charts
// --------------------------------------------
// Each array stores the last 10 readings for the
// corresponding metric. New values are pushed at
// the end, and old values are removed from the front.
//
const rpmHistory = [];
const torqueHistory = [];
const pressureHistory = [];

// Maximum number of points to keep for each history
const MAX_POINTS = 10;

// --------------------------------------------
// 3️⃣ Utility function: maintain fixed-size history
// --------------------------------------------
function addToHistory(historyArray, newValue) {
  historyArray.push(newValue);
  if (historyArray.length > MAX_POINTS) {
    historyArray.shift(); // remove oldest value
  }
}

// --------------------------------------------
// 4️⃣ Utility function: format timestamp
// --------------------------------------------
// Input: ISO string, e.g. "2025-11-07T12:34:56.789Z"
// Output: separate strings for date and time:
//   - datePart = "2025-11-07"
//   - timePart = "12:34:56"
//
// Note: new Date(...) will convert to local time,
// and we then extract a human-friendly time string.
//
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
// Draws a simple line chart for the given data array.
// - canvas: the HTMLCanvasElement to draw into
// - data:   array of numeric values
// - minY:   minimum expected value (for scaling)
// - maxY:   maximum expected value (for scaling)
//
function drawLineChart(canvas, data, minY, maxY) {
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // Clear previous frame
  ctx.clearRect(0, 0, width, height);

  // If we have fewer than 2 points, there's no line to draw
  if (data.length < 2) {
    return;
  }

  // Padding inside the chart area to keep line away from edges
  const padding = 10;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Helper to map a data value to a y-coordinate in the chart
  // Higher values should appear higher in the canvas (smaller y)
  const mapY = (value) => {
    const clamped = Math.min(Math.max(value, minY), maxY);
    const ratio = (clamped - minY) / (maxY - minY); // 0 to 1
    return padding + chartHeight - ratio * chartHeight;
  };

  // x-spacing between points
  const stepX = chartWidth / (data.length - 1);

  // Draw a subtle grid baseline (optional)
  ctx.beginPath();
  ctx.strokeStyle = '#444';
  ctx.lineWidth = 1;
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();

  // Draw the line for the data
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
// 6️⃣ Listen for 'machineData' events from server
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
  console.log('Received data:', data);

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

  // Note: min/max values are chosen based on the ranges
  // simulated in server.js to give reasonable scaling.
  drawLineChart(rpmCanvas, rpmHistory, 1400, 2100);
  drawLineChart(torqueCanvas, torqueHistory, 180, 260);
  drawLineChart(pressureCanvas, pressureHistory, 4, 8);
});

// --------------------------------------------
// 7️⃣ Optional: connection status logging
// --------------------------------------------
socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
