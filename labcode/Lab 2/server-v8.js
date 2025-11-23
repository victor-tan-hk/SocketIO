/**
 * server.js
 * --------------------------------------------
 * Backend for Real-Time Machine Metrics Simulator
 * Using Express.js + Socket.IO
 * --------------------------------------------
 * Responsibilities:
 * 1. Serve static frontend files from /public.
 * 2. Generate dummy machine metrics:
 *      - timestamp
 *      - RPM
 *      - Torque
 *      - Pressure
 * 3. Emit these metrics at a configurable interval
 *    to all connected clients via Socket.IO.
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// --------------------------------------------
// Serve static files from /public folder
// --------------------------------------------
app.use(express.static('public'));

// --------------------------------------------
// Configurable Data Emission Interval (ms)
// --------------------------------------------
// Adjust this value to change how frequently the
// backend generates and sends new dummy data.
// Example: 500 = 0.5s, 1000 = 1s, 2000 = 2s.
let EMIT_INTERVAL_MS = 1000; // default: 1 second

// --------------------------------------------
// 3️⃣ Function to generate random machine metrics
// --------------------------------------------
// This function returns a JavaScript object with
// the 4 required properties:
//
//  - timestamp (ISO string, e.g. "2025-11-07T12:34:56.789Z")
//  - RPM       (stringified number, e.g. "1623")
//  - Torque    (stringified number, e.g. "215.42")
//  - Pressure  (stringified number, e.g. "5.87")
//
// These values simulate real machine readings with
// reasonable ranges and small random fluctuations.
//
function generateMachineData() {
  return {
    timestamp: new Date().toISOString(),
    RPM: (1500 + Math.random() * 500).toFixed(0),      // ~ 1500–2000
    Torque: (200 + Math.random() * 50).toFixed(2),     // ~ 200–250 Nm
    Pressure: (5 + Math.random() * 2).toFixed(2)       // ~ 5–7 bar
  };
}

// --------------------------------------------
// 4️⃣ Periodic generation + transmission of data
// --------------------------------------------
// This interval clearly delineates where dummy data
// is generated and broadcast in real time.
//
// Every EMIT_INTERVAL_MS milliseconds:
//  - Call generateMachineData() to produce
//    a new data object.
//  - Transmit that object via Socket.IO using
//    the event name 'machineData'.
//  - All connected clients listening on that
//    event will receive the new data.
//
setInterval(() => {
  const data = generateMachineData();
  io.emit('machineData', data); // broadcast to all clients
  console.log('Emitted data:', data);
}, EMIT_INTERVAL_MS);

// --------------------------------------------
// 5️⃣ Socket.IO connection handling
// --------------------------------------------
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// --------------------------------------------
// 6️⃣ Start the HTTP + WebSocket server
// --------------------------------------------
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Emitting data every ${EMIT_INTERVAL_MS / 1000} seconds`);
});
