/**
 * server.js
 * --------------------------------------------
 * Backend for Real-Time Machine Metrics Simulator
 * Using Express.js + Socket.IO with:
 *   - A custom namespace:   /machines
 *   - Two rooms (within ns): "machineA" and "machineB"
 *
 * Responsibilities:
 * 1. Serve static frontend files from /public.
 * 2. Define a Socket.IO namespace for machine data.
 * 3. Allow clients to join one of two rooms:
 *      - "machineA" (Machine A)
 *      - "machineB" (Machine B)
 * 4. Generate two separate dummy data streams (A & B),
 *    each with different numeric ranges so they are
 *    clearly distinguishable at the frontend.
 * 5. Emit each stream only to its corresponding room.
 * --------------------------------------------
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// --------------------------------------------
// 1️⃣ Serve static files from /public folder
// --------------------------------------------
app.use(express.static('public'));

// --------------------------------------------
// 2️⃣ Configurable Data Emission Interval (ms)
// --------------------------------------------
// Adjust this value to change how frequently the
// backend generates and sends new dummy data.
// Example: 500 = 0.5s, 1000 = 1s, 2000 = 2s.
let EMIT_INTERVAL_MS = 1000; // default: 1 second

// --------------------------------------------
// 3️⃣ Define a custom namespace for machines
// --------------------------------------------
// Clients will connect to this namespace using:
//   const socket = io('/machines');
//
// Within this namespace, we will use rooms:
//   "machineA" and "machineB"
//
const machineNamespace = io.of('/machines');

// --------------------------------------------
// 4️⃣ Handle connections within the /machines namespace
// --------------------------------------------
// Each client can join exactly one room at a time:
//   - "machineA"
//   - "machineB"
// The frontend will send a 'joinRoom' event to
// switch between these rooms.
//
machineNamespace.on('connection', (socket) => {
  console.log('Client connected to /machines namespace:', socket.id);

  // Track which room this socket is currently in
  let currentRoom = null;

  // Listen for client requests to join a specific room
  socket.on('joinRoom', (roomName) => {
    // Basic validation for room names
    if (roomName !== 'machineA' && roomName !== 'machineB') {
      console.log(`Invalid room requested by ${socket.id}:`, roomName);
      return;
    }

    // Leave previous room (if any)
    if (currentRoom) {
      socket.leave(currentRoom);
      console.log(`Socket ${socket.id} left room: ${currentRoom}`);
    }

    // Join the new room
    socket.join(roomName);
    currentRoom = roomName;
    console.log(`Socket ${socket.id} joined room: ${currentRoom}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected from /machines namespace:', socket.id);
  });
});

// --------------------------------------------
// 5️⃣ Functions to generate dummy data
// --------------------------------------------
// Both functions return an object with the same
// structure:
//   { timestamp, RPM, Torque, Pressure }
//
// However, the numeric ranges are very different
// so that Machine A and Machine B appear visually
// distinct in the frontend.
//
// Machine A: "medium" ranges
// Machine B: "higher" ranges
// --------------------------------------------

function generateMachineAData() {
  return {
    timestamp: new Date().toISOString(),
    // Machine A RPM: roughly 1500–2000
    RPM: (1500 + Math.random() * 500).toFixed(0),
    // Machine A Torque: roughly 200–250 Nm
    Torque: (200 + Math.random() * 50).toFixed(2),
    // Machine A Pressure: roughly 5–7 bar
    Pressure: (5 + Math.random() * 2).toFixed(2)
  };
}

function generateMachineBData() {
  return {
    timestamp: new Date().toISOString(),
    // Machine B RPM: roughly 3500–5000 (much higher than A)
    RPM: (3500 + Math.random() * 1500).toFixed(0),
    // Machine B Torque: roughly 350–500 Nm (significantly higher)
    Torque: (350 + Math.random() * 150).toFixed(2),
    // Machine B Pressure: roughly 10–16 bar (also higher)
    Pressure: (10 + Math.random() * 6).toFixed(2)
  };
}

// --------------------------------------------
// 6️⃣ Periodic generation + transmission of data
// --------------------------------------------
// Every EMIT_INTERVAL_MS milliseconds:
//   - Generate Machine A data and emit ONLY to room "machineA"
//   - Generate Machine B data and emit ONLY to room "machineB"
//
// Event name: 'machineData'
//   - The frontend listens to this event to update its UI.
//
// Note: If a room has no connected sockets, the emit call
// will simply not deliver to any client, which is fine.
// --------------------------------------------

setInterval(() => {
  const dataA = generateMachineAData();
  const dataB = generateMachineBData();

  // Emit Machine A data to clients in room "machineA"
  machineNamespace.to('machineA').emit('machineData', dataA);
  console.log('Emitted Machine A data to room "machineA":', dataA);

  // Emit Machine B data to clients in room "machineB"
  machineNamespace.to('machineB').emit('machineData', dataB);
  console.log('Emitted Machine B data to room "machineB":', dataB);

}, EMIT_INTERVAL_MS);

// --------------------------------------------
// 7️⃣ Start the HTTP + WebSocket server
// --------------------------------------------
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Emitting data every ${EMIT_INTERVAL_MS / 1000} seconds`);
  console.log('Namespace in use: /machines');
  console.log('Rooms: "machineA" and "machineB"');
});
