// ============================================================
// client.js
// Demonstration of element selection methods in JavaScript DOM
// (getElementById, getElementsByTagName, getElementsByClassName)
// ============================================================

// ------------------------------------------------------------
// 1. getElementById()
// ------------------------------------------------------------
// This method selects a SINGLE element that has the specified ID.
// IDs should be unique within a web page, so it always returns ONE
// element (or null if none found).
function selectById() {
  // Retrieve the element with id="uniqueParagraph"
  const element = document.getElementById("uniqueParagraph");

  console.log("Result of getElementById('uniqueParagraph'):");

  // Always good practice to check if the element actually exists
  if (element) {
    console.log(element); // Logs the entire DOM element
    console.log("Text content:", element.textContent);
  } else {
    console.log("No element found with id 'uniqueParagraph'.");
  }
}

// ------------------------------------------------------------
// 2. getElementsByTagName()
// ------------------------------------------------------------
// This method returns a live HTMLCollection of elements with the
// specified tag name.
// Example: "p" will select all <p> elements.
// Note: HTMLCollection is "array-like" but not a real array.
function selectByTagName() {
  // Retrieve all <p> elements
  const elements = document.getElementsByTagName("p");

  console.log("Result of getElementsByTagName('p'):");
  console.log(elements); // Logs the HTMLCollection object

  // We use a classic for loop to go through each element.
  // This form is easier to understand for beginners than using
  // more advanced syntax such as spread (...) and forEach().
  for (let i = 0; i < elements.length; i++) {
    // Access the current element at index i
    const el = elements[i];

    // i starts from 0, so we add 1 when displaying a human-friendly number
    const paragraphNumber = i + 1;

    console.log("Paragraph #" + paragraphNumber + ": " + el.textContent);
  }
}

// ------------------------------------------------------------
// 3. getElementsByClassName()
// ------------------------------------------------------------
// This method returns a live HTMLCollection of all elements that have
// the specified class name (or multiple class names).
function selectByClassName() {
  // Retrieve all elements with class="highlight"
  const elements = document.getElementsByClassName("highlight");

  console.log("Result of getElementsByClassName('highlight'):");
  console.log(elements); // Logs the HTMLCollection object

  // Again, use a classic for loop to iterate over the collection.
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    const elementNumber = i + 1;

    // el.tagName gives the tag (e.g. "DIV", "P", "SPAN")
    // We convert it to lower case just for nicer display.
    const tagName = el.tagName.toLowerCase();

    console.log(
      "Element #" + elementNumber + ": <" + tagName + "> - \"" + el.textContent + "\""
    );
  }
}

// ------------------------------------------------------------
// 4. Attach Event Listeners to Buttons
// ------------------------------------------------------------
// These listeners wait for a "click" event and then call the
// corresponding selection function defined above.

// Button: getElementById() example
const btnById = document.getElementById("btnById");
btnById.addEventListener("click", selectById);

// Button: getElementsByTagName() example
const btnByTagName = document.getElementById("btnByTagName");
btnByTagName.addEventListener("click", selectByTagName);

// Button: getElementsByClassName() example
const btnByClassName = document.getElementById("btnByClassName");
btnByClassName.addEventListener("click", selectByClassName);

// Button: implement with arrow function
const alertBtn = document.getElementById("alertButton");
alertBtn.addEventListener("click", 
  () => { alert("Hi there from JavaScript"); }
);

// ------------------------------------------------------------
// END OF SCRIPT
// ------------------------------------------------------------
