/* 
    This script handles the following functionality:

    - Retrieves the values from two numeric input fields
    - Adds the numbers when the button is clicked
    - Dynamically displays:
        * The sum
        * Whether the sum is below 0, equal to 0, or above 0
    - Clears both input fields after processing
*/

// Select all relevant DOM elements
const num1Field = document.getElementById("num1");     // First numeric input field
const num2Field = document.getElementById("num2");     // Second numeric input field
const addButton = document.getElementById("addBtn");   // Button that triggers the addition
const resultPara = document.getElementById("result");  // Paragraph where the sum will be displayed
const messagePara = document.getElementById("message"); // Paragraph where the message is displayed

// Attach an event listener to the button
// This event listener waits for the user to click the button and then runs the function below.
addButton.addEventListener("click", function() {

    // Convert input values from strings to numbers using Number()
    const num1 = Number(num1Field.value);
    const num2 = Number(num2Field.value);

    // Calculate the sum
    const sum = num1 + num2;

    // Display the sum dynamically inside the result paragraph
    resultPara.textContent = `The sum is: ${sum}`;

    // Determine if the sum is negative, zero, or positive
    if (sum < 0) {
        messagePara.textContent = "The sum is below 0.";
    } else if (sum === 0) {
        messagePara.textContent = "The sum is exactly 0.";
    } else {
        messagePara.textContent = "The sum is above 0.";
    }

    // Clear the input fields after calculation
    num1Field.value = "";
    num2Field.value = "";

    // OPTIONAL: move focus back to the first field for convenience
    num1Field.focus();
});
