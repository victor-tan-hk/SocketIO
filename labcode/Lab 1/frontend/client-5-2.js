const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// -----------------------
// DRAWING RECTANGLES
// -----------------------

// Filled rectangle
ctx.fillStyle = "lightblue";         // Set fill color
ctx.fillRect(20, 20, 120, 60);       // (x, y, width, height)

// Rectangle outline only (not filled)
ctx.strokeStyle = "blue";            // Set outline color
ctx.strokeRect(20, 100, 120, 60);

// -----------------------
// DRAWING A CIRCLE
// -----------------------
ctx.beginPath();
ctx.arc(250, 70, 40, 0, Math.PI * 2);   // arc(x, y, radius, startAngle, endAngle)
ctx.fillStyle = "pink";
ctx.fill();

// -----------------------
// USING PATHS
// -----------------------
ctx.beginPath();
ctx.moveTo(200, 200);      // Start point
ctx.lineTo(300, 250);      // 1st line segment
ctx.lineTo(350, 180);      // 2nd line segment
ctx.closePath();           // Close the shape (back to start)
ctx.stroke();