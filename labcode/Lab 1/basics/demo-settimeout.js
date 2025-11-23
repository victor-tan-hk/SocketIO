// =============================================
// Arrow Function with setTimeout()
// =============================================


// setTimeout() executes the callback function ONCE after a 
// countdown (in milliseconds)

// Example 1: Using an normal function with setTimeout()
// --------------------------------------------------------

function showMessage() {
  console.log("setTimeout: using normal function");
}

// The callback function showMessage is invoked after a 
// countdown of 3 seconds

setTimeout(showMessage, 3000);

console.log("After the first setTimeout");

// Example 2: Using an arrow function with setTimeout()
// --------------------------------------------------------
// We specify the arrow function explicitly within the setTimeout
// function call.

setTimeout(
  () => {
    console.log("setTimeout: using arrow function");
  }, 3000);

// The callback function specified as an arrow function
//  is invoked after a countdown of 3 seconds

console.log("After the second setTimeout");


