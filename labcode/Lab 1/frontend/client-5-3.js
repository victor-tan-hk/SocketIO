const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// -----------------------
// LINE COLORS & WIDTHS
// -----------------------
ctx.strokeStyle = "green";     // Color of the line
ctx.lineWidth = 4;             // Thickness of the line

ctx.beginPath();
ctx.moveTo(50, 50);
ctx.lineTo(250, 50);
ctx.stroke();

// -----------------------
// FONTS & TEXT
// -----------------------
ctx.font = "20px Arial";       // Set font
ctx.fillStyle = "black";       // Text color
ctx.fillText("Hello Canvas!", 50, 100);

ctx.strokeStyle = "red";
ctx.strokeText("Outlined Text", 50, 150);