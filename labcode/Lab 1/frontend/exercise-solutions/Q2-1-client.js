/****************************************************
 * client.js
 * -----------------------------------------------
 * This script demonstrates basic DOM manipulation:
 * 1. Adding a new <li> item to a <ul> when a button is clicked.
 * 2. Adding header and paragraph elements into a <div> when
 *    another button is clicked.
 ****************************************************/


/****************************************************
 * STEP 1: Select all required DOM elements
 ****************************************************/

// Select the <ul> element where new <li> elements will be added
const itemsList = document.getElementById("items");

// Select the text input field where the user types the new item name
const inputField = document.getElementById("newItem");

// Select the button that adds a new item to the <ul>
const addButton = document.getElementById("addBtn");

// Select the button that adds HTML content into the <div>
const addHTMLBtn = document.getElementById("addHTML");

// Select the <div> panel where new headers and paragraphs will be inserted
const panelDiv = document.getElementById("panel");



/****************************************************
 * STEP 2: Add CLICK EVENT for the "Add item to menu" button
 ****************************************************/
addButton.addEventListener("click", function () {

    // Read the text entered in the input field
    const newItemText = inputField.value;

    // If the input field is empty, do nothing
    if (newItemText.trim() === "") {
        alert("Please enter a menu item first.");
        return;
    }

    // Create a new <li> element
    const newListItem = document.createElement("li");

    // Set the text inside the new <li>
    newListItem.textContent = newItemText;

    // Append the new <li> to the <ul>
    itemsList.appendChild(newListItem);

    // Clear the input field after adding the item
    inputField.value = "";
});



/****************************************************
 * STEP 3: Add CLICK EVENT for the "Add HTML" button
 ****************************************************/
addHTMLBtn.addEventListener("click", function () {

    // Append new HTML directly using innerHTML +=
    panelDiv.innerHTML += `
        <h2>This is a new header added dynamically</h2>
        <p>This paragraph was also created and added using innerHTML.</p>
    `;
});

