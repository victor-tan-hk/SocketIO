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
// Retrieve the element with id="uniqueParagraph"


const element = document.getElementById("uniqueParagraph");

console.log("Result of getElementById('uniqueParagraph'):");

// Always good practice to check if the element actually exists
if (element) {
  console.log(element); // Logs the entire DOM element
  console.log(`Text content:  ${element.textContent}`);
} else {
  console.log("No element found with id 'uniqueParagraph'.");
}

// ------------------------------------------------------------
// 2. getElementsByTagName()
// ------------------------------------------------------------
// This method returns a live HTMLCollection of elements with the
// specified tag name.
// Example: "p" will select all <p> elements.

// Retrieve all <p> elements
let elements = document.getElementsByTagName("p");

console.log("Result of getElementsByTagName('p'):");
console.log(elements); // Logs the HTMLCollection object

// We use a classic for loop to go through each element.
for (let i = 0; i < elements.length; i++) {
  // Access the current element at index i
  const el = elements[i];

  // i starts from 0, so we add 1 when displaying a human-friendly number
  const paragraphNumber = i + 1;

  console.log("Paragraph #" + paragraphNumber + ": " + el.textContent);
}


// ------------------------------------------------------------
// 3. getElementsByClassName()
// ------------------------------------------------------------
// This method returns a live HTMLCollection of all elements that have
// the specified class name (or multiple class names).
// Retrieve all elements with class="highlight"

elements = document.getElementsByClassName("highlight");

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


