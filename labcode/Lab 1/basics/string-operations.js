
// A String is essentially an array of characters 
// and we can access the individual characters using basic array notation.
let  greeting = "Hello Western Digital !";
console.log("The number of characters in greeting is ", greeting.length);
console.log("The character at index position 4 is ", greeting[4]);

// The ES6 string template literal allows us to work 
// with strings in a more flexible way.

console.log("\nDemonstrating string literals");

// It allows us to create multiline strings
// and include double and single quotes without the 
// need for escape characters
let multilineText = 
`
This text can contain "double quotes"
and 'single quotes' and
can span multiple lines
I mean ... how cool is that ???
`;

console.log(multilineText);

// We can also include variables directly into the string using string
// interpolation syntax

let firstName = 'Peter',
    lastName = 'Parker';

// Without using ES6 string template literal
let sayHi = 'Hi ' + firstName + ", your last name is " + lastName;
console.log(sayHi);


//Using ES6 string template with interpolation syntax
// removes the need for excessive + operators 
sayHi = `Hi ${firstName}, your last name is ${lastName}`;
console.log(sayHi);


// These are some examples of useful string methods
// There are many more useful methods available  
console.log("\nDemonstrating useful string methods");

let fruits = "Apple, Banana, Kiwi";
let firstPart = fruits.slice(7, 13);
console.log("firstPart is ", firstPart);

let secondPart = fruits.substr(0, 5);
console.log("secondPart is ", secondPart);

let text = "Please visit Microsoft!";
let newText = text.replace("Microsoft", "W3Schools");
console.log("newText is ", newText);

let upperText = text.toUpperCase();
let lowerText = text.toLowerCase();

console.log("upperText is ", upperText);
console.log("lowerText is ", lowerText);

let longText = "      Hello World!      ";
let trimText = longText.trim();
console.log("trimText is ", "*"+trimText+"*");

let firstChar = text.charAt(2);
console.log("firstChar is ", firstChar);

let microsoftLocation = text.indexOf("Microsoft");
console.log("Microsoft is found in text at location ", microsoftLocation);

