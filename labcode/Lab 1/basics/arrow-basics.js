// =====================================================
// Demonstration of Arrow Functions vs Traditional Functions
// =====================================================

//  Basic Function Returning a Value
//-----------------------------------------------------

// Traditional function declaration
// with 2 parameters
function addTraditional(a, b) {
  return a + b;
};

// Equivalent arrow function 
// If there only one statement in the arrow function
// the return statement is implied
const addArrow = (a, b) => a + b;

console.log("Basic Function :");
console.log("Traditional:", addTraditional(2, 3)); // 5
console.log("Arrow:", addArrow(2, 3));             // 5


// Single Parameter Function
//-----------------------------------------------------

// Traditional
function squareTraditional(x) {
  return x * x;
};

// Arrow function — parentheses can be omitted if only one parameter
const squareArrow = x => x * x;

console.log("Single Parameter:");
console.log("Traditional:", squareTraditional(4)); // 16
console.log("Arrow:", squareArrow(4));             // 16

// Functions without parameters
//-----------------------------------------------------

// Traditional
function greetTraditional() {
  return "Hello!";
};

// Arrow function — must include empty parentheses
// if there is no argument
const greetArrow = () => "Hello!";

console.log("\nNo Parameters:");
console.log("Traditional:", greetTraditional()); // "Hello!"
console.log("Arrow:", greetArrow());             // "Hello!"


// Multi-line Function Body (Explicit return required)
//-----------------------------------------------------

// Traditional
function multiplyTraditional(a, b) {
  const result = a * b;
  return result;
};

// Arrow function — requires {} and explicit return
const multiplyArrow = (a, b) => {
  const result = a * b;
  return result;
};

console.log("\nMulti-line Function:");
console.log("Traditional:", multiplyTraditional(3, 4)); // 12
console.log("Arrow:", multiplyArrow(3, 4));             // 12


