// --------------------------------------------------------------
// 1. Select the canvas and get its 2D drawing context
// --------------------------------------------------------------
const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");

// --------------------------------------------------------------
// 2. Dummy hardcoded data (x and y coordinates)
//    These numbers are in logical "data space"
// --------------------------------------------------------------
const dataPoints = [
    { x: 0, y: 10 },
    { x: 10, y: 40 },
    { x: 20, y: 25 },
    { x: 30, y: 60 },
    { x: 40, y: 45 },
    { x: 50, y: 80 }
];

// --------------------------------------------------------------
// 3. Graph drawing settings
// --------------------------------------------------------------
const padding = 40;          // spacing around the graph area
const graphWidth = canvas.width - padding * 2;
const graphHeight = canvas.height - padding * 2;

// Determine maximum x and y values (for scaling)
const maxX = Math.max(...dataPoints.map(p => p.x));
const maxY = Math.max(...dataPoints.map(p => p.y));

// --------------------------------------------------------------
// 4. Draw axes
// --------------------------------------------------------------
ctx.beginPath();
ctx.moveTo(padding, padding);
ctx.lineTo(padding, canvas.height - padding);
ctx.lineTo(canvas.width - padding, canvas.height - padding);
ctx.stroke();

// --------------------------------------------------------------
// 5. Draw the line graph
// --------------------------------------------------------------
ctx.beginPath();
ctx.strokeStyle = "blue";
ctx.lineWidth = 2;

for (let i = 0; i < dataPoints.length; i++) {

    // Get current point
    const point = dataPoints[i];

    // Convert data values to canvas coordinates
    const canvasX = padding + (point.x / maxX) * graphWidth;
    const canvasY = (canvas.height - padding) - (point.y / maxY) * graphHeight;

    // If this is the first point, move to it
    if (i === 0) {
        ctx.moveTo(canvasX, canvasY);

        // Otherwise draw a line to this point
    } else {
        ctx.lineTo(canvasX, canvasY);
    }
}

ctx.stroke();

// --------------------------------------------------------------
// 6. Draw points as small circles
// --------------------------------------------------------------
ctx.fillStyle = "red";

for (let i = 0; i < dataPoints.length; i++) {

    const point = dataPoints[i];

    const canvasX = padding + (point.x / maxX) * graphWidth;
    const canvasY = (canvas.height - padding) - (point.y / maxY) * graphHeight;

    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 4, 0, Math.PI * 2);
    ctx.fill();
}
