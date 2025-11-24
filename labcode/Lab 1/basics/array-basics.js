
// Arrays typically contain elements of the same type
let animals = ['cat', 'dog', 'mouse', 'snake', 'rat'];
let numbers = [3, 5, 7, 9];
let booleans = [true, false, false, true, true];

// Arrays can also contain elements of mixed type
let mixedArray = ['cat', 5, 'dog', true, 'mouse', 'rat', 3.6];

// Accessing elements in an array
console.log("First element in the animals array is ", animals[0]); 
console.log("Third element in the animals array is ", animals[2]); 

// Changing the value of an element
animals[2] = 'horse';
console.log("The new content of the animals array is");
console.log(animals);

// An array is an object and has the property length
// This gives us the number of elements in the array
console.log('The number of elements in the animals array is ', animals.length); 

// We can continue to add new elements to an array 
// by specifying the index positions for the new elements
animals[5] = 'elephant';
animals[6] = 'tiger';

console.log('The number of elements in the animals array is ', animals.length); 
console.log("The new content of the animals array is ");
console.log(animals);


/* To iterate through the elements of a loop, we can either
use a normal for loop or the shorter for..of loop syntax
 */

/* For a normal for loop, we will use the loop variable as the array index
Therefore it should start from 0 and go all the way until one less than the number of elements. 
 */

for (let x = 0; x < animals.length; x++) {
    console.log ("The animal at index position " +  x + " is " + animals[x]);
}

/* The for of loop is a shorter form which is useful
when the index of the array is not required to be used
in the body of the loop
 */

for (let x of animals) {
    console.log ("The current animal is ",  x);
}
