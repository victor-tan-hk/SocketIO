/****************************************************
 * client.js — updated version
 * -----------------------------------------------
 * New behaviour:
 * - "Adding item in 3 seconds" is shown inside <p id="message">
 * - Message disappears after 3 seconds
 * - Then the <li> is added
 ****************************************************/


/****************************************************
 * STEP 1: Select DOM elements
 ****************************************************/
const itemsList = document.getElementById("items");
const inputField = document.getElementById("newItem");
const addButton = document.getElementById("addBtn");

const messagePara = document.getElementById("message");

const addHTMLBtn = document.getElementById("addHTML");
const panelDiv = document.getElementById("panel");

// Track whether the DIV currently contains generated content
let isPanelFilled = false;


/****************************************************
 * STEP 2: Add item with 3-second delay
 * Message now appears inside <p id="message">
 ****************************************************/
addButton.addEventListener("click", function () {

    const newItemText = inputField.value;

    // Prevent adding empty items
    if (newItemText.trim() === "") {
        alert("Please enter a menu item first.");
        return;
    }

    // Show message
    messagePara.textContent = "Adding item in 3 seconds...";
    messagePara.style.color = "blue";
    messagePara.style.fontWeight = "bold";

    // Wait 3 seconds before performing the addition
    setTimeout(() => {

        // Clear the message
        messagePara.textContent = "";

        // Create and append new <li>
        const newListItem = document.createElement("li");
        newListItem.textContent = newItemText;
        itemsList.appendChild(newListItem);

        // Clear input field
        inputField.value = "";

    }, 3000);
});



/****************************************************
 * STEP 3: Toggle Add/Remove Random HTML in <div id="panel">
 ****************************************************/
addHTMLBtn.addEventListener("click", function () {

    // If panel is currently empty → ADD random content
    if (!isPanelFilled) {

        // Insert random HTML using innerHTML
        panelDiv.innerHTML = `
        <h2>This is a new header added dynamically</h2>
        <p>This paragraph was also created and added using innerHTML.</p>
        `;

        // Change button text
        addHTMLBtn.textContent = "Remove headers / paragraphs from DIV";

        isPanelFilled = true;
    }

    // If it already contains content → REMOVE it
    else {

        // Clear the DIV
        panelDiv.innerHTML = "";

        // Reset button text
        addHTMLBtn.textContent = "Add headers / paragraphs to DIV";

        isPanelFilled = false;
    }
});
