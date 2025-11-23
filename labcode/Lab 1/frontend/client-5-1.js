// STEP 1: Select the canvas element
const canvas = document.getElementById("myCanvas");

// STEP 2: Get the 2D drawing context
// This object provides all drawing commands for lines, shapes, text, etc.
const ctx = canvas.getContext("2d");

/*  
    In canvas:
    (0,0) is the TOP-LEFT corner.
    x increases to the RIGHT.
    y increases DOWNWARDS.
*/


// STEP 3: Begin drawing a line
ctx.beginPath();          // Start a new drawing path
ctx.moveTo(20, 20);       // Move the “pen” to the starting point (x=20, y=20)
ctx.lineTo(200, 100);     // Draw a line from the starting point to this point
ctx.stroke();             // Actually render (draw) the line on the canvas