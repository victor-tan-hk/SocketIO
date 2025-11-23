const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

/*  
    In canvas:
    (0,0) is the TOP-LEFT corner.
    x increases to the RIGHT.
    y increases DOWNWARDS.
*/

// Draw X-axis
ctx.beginPath();
ctx.moveTo(20, 150);
ctx.lineTo(480, 150);
ctx.strokeStyle = "gray";
ctx.stroke();

// Draw Y-axis
ctx.beginPath();
ctx.moveTo(50, 20);
ctx.lineTo(50, 280);
ctx.stroke();

// Mark some coordinate points
ctx.fillStyle = "blue";
for (let x = 70; x <= 450; x += 80) {
    ctx.beginPath();
    ctx.arc(x, 150, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText("(" + x + ",150)", x - 20, 170);
}