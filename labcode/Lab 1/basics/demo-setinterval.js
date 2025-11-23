// =============================================
// Arrow Function with setInterval()
// =============================================

// setInterval() executes the callback function PERIODICALLY 
// at fixed time intervals
let count = 0;

// Assign setInterval function call to a variable timer
// so that we can clear it later on
const timer = setInterval(
  () => {
    count++;
    console.log(`setInterval: Count = ${count}`);

    if (count === 5) {
      // Use the clearInterval function call
      // to stop the repeated execution of the 
      // setInterval callback function
      clearInterval(timer);
      console.log("Interval stopped after 5 counts");
    }
  }, 1000); // run every 1 second

console.log("Continuing program execution");