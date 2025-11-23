// client.js
// This script demonstrates basic DOM manipulation methods and properties
// Each button corresponds to one key concept: createElement(), appendChild(), textContent, and innerHTML.

// Get references to the buttons and the main demo area from the HTML file
const btnCreate = document.getElementById('btnCreate');
const btnAppend = document.getElementById('btnAppend');
const btnTextContent = document.getElementById('btnTextContent');
const btnInnerHTML = document.getElementById('btnInnerHTML');
const demoArea = document.getElementById('demo-area');

// -----------------------------
// 1. createElement()
// -----------------------------
btnCreate.addEventListener('click', () => {
  // createElement() creates a new element node (but it is not visible yet)
  const newDiv = document.createElement('div'); // Create a new <div> element
  newDiv.textContent = "I'm a newly created DIV element!";
  newDiv.style.backgroundColor = 'skyblue';
  newDiv.style.padding = '10px';
  newDiv.style.marginTop = '10px';
  
  // Display message in console for clarity
  console.log('New element created but not yet appended to the DOM:', newDiv);

  // Temporarily store it in a global variable so it can be appended later
  window.newDivElement = newDiv;
  alert("A new <div> element has been created! Click 'Append Child' to attach it to the demo area.");
});

// -----------------------------
// 2. appendChild()
// -----------------------------
btnAppend.addEventListener('click', () => {
  // appendChild() attaches a node as the last child of a parent node.
  // Here we append the element created earlier to the demo area.
  if (window.newDivElement) {
    demoArea.appendChild(window.newDivElement);
    console.log('New element appended to demo area:', window.newDivElement);
    alert("The newly created <div> has been appended to the demo area!");
    // Once appended, remove reference so that next click on 'Create Element' makes a fresh one
    window.newDivElement = null;
  } else {
    alert("No element available to append. Please click 'Create Element' first.");
  }
});

// -----------------------------
// 3. textContent
// -----------------------------
btnTextContent.addEventListener('click', () => {
  // textContent allows reading or writing plain text of an element.
  // It ignores any HTML tags inside the element.
  const sampleParagraph = document.getElementById('sample-paragraph');

  // Show original text in console
  console.log('Original textContent:', sampleParagraph.textContent);

  // Change the text content
  sampleParagraph.textContent = "This text was changed using the textContent property!";
  sampleParagraph.style.color = 'red';
  alert("The text inside the paragraph has been replaced using textContent!");
});

// -----------------------------
// 4. innerHTML
// -----------------------------
btnInnerHTML.addEventListener('click', () => {
  // innerHTML allows reading or writing HTML markup inside an element.
  // It can be used to insert HTML tags dynamically.
  console.log('Original innerHTML of demo area:', demoArea.innerHTML);

  demoArea.innerHTML = `
    <h3 style="color: green;">Demo area content replaced using innerHTML!</h3>
    <p><b>This entire section</b> has been rewritten with new HTML tags.</p>
  `;

  alert("The entire demo area has been updated using innerHTML!");
});
