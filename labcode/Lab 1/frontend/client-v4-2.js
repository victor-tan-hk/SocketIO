// -----------------------------------------------------------
// client.js
// This script handles interactivity for the live text display page.
// -----------------------------------------------------------

// 1. SELECT IMPORTANT DOM ELEMENTS
// We use document.getElementById() to obtain references to DOM elements.
const userInput = document.getElementById("userInput");  // The text field
const displayArea = document.getElementById("displayArea"); // Paragraph for showing text
const clearBtn = document.getElementById("clearBtn");  // The "Clear Text" button


// 2. LIVE TEXT UPDATE FUNCTIONALITY
// -----------------------------------------------------------
// We add an event listener to the text field.
// The "input" event fires every time the user types, deletes, or pastes text.
userInput.addEventListener("input", function () {

    // textContent updates the visible text inside the <p> element.
    displayArea.textContent = userInput.value;

    // If the text field becomes empty, we show placeholder text again.
    if (userInput.value === "") {
        displayArea.textContent = "(nothing to display)";
    }
});
// -----------------------------------------------------------


// 3. CLEAR BUTTON FUNCTIONALITY
// -----------------------------------------------------------
// This event listener runs when the Clear Text button is clicked.
clearBtn.addEventListener("click", function () {

    // Clear the input field
    userInput.value = "";

    // Reset the displayed text
    displayArea.textContent = "Your text will appear here...";

    // OPTIONAL: Put cursor back into the text field for convenience
    userInput.focus();
});
// -----------------------------------------------------------
