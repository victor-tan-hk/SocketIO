
let numbers = [10, 20, 30, 40, 50];
console.log("The original content of numbers is ", numbers);

// Lets say we want to create a new array 
// whose elements are produced by adding 5 to all 
// existing elements in the original array

let newNumbers = [];
for (let i = 0; i < numbers.length; i++) {
  newNumbers[i] = numbers[i] + 5;
}
console.log("The content of newNumbers is ", newNumbers);

/* 
We can use the map method of an array 
This accepts a single callback function as a parameter
Each element of the original array is passed as an argument to this function
The result returned from this function is added as
an element to a new array
The result is a new array with the same number of elements 
as the original array
Each element in the new array is a transformation of the corresponding
element in the original array
*/

// This callback function passed to map
// will add 5 to all elements of the original array
// The returned result is added to a new array
// which is the final outcome of the map method invocation
let myNumbers = numbers.map(
  function (x) {
    return x + 5;
  }
);
console.log("The content of myNumbers is ", myNumbers);

// We can use an arrow function to further
// simplify the definition of the callback function

let mapNumbers = numbers.map(x => x + 5);
console.log("The content of someNumbers is ", mapNumbers);


// Lets say we want to find all the numbers that are 
// less than 20 from the array below

numbers = [60, 17, 36, 44, 6, 11, 53];
console.log("\n\nThe original content of numbers is ", numbers);

/* 
We can use the filter method of an array 
This accepts a single callback function as a parameter
Each element of the original array is passed as an argument to this function
The result returned from this function is a boolean 
If it is true, the original element is added to the new array
If it is false, the original element is excluded
The final result is a new array that contains lesser elements
than the original array
However, the elements are not transformed,
as they would be in the case of map
*/

let smallNumbers = numbers.filter(
  function (x) {
    return x < 20;
  }
);
console.log("The content of smallNumbers is ", smallNumbers);

// The above callback function could also have been rewritten as an arrow function
let filterNumbers = numbers.filter(x => x < 20);
console.log("The content of filterNumbers is", filterNumbers);


