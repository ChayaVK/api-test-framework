// Lesson 1: values, variables and types.  Run: npm run learn:1
// Lines that start with // are comments: notes for people, ignored by the computer.

// const = a value that never changes; let = a value that can change later
const name = 'Sara Khan';        // a string (text), in quotes
const quantity = 2;              // a number, no quotes
const active = true;             // a boolean: true or false
let status = 'PLACED';
status = 'CANCELLED';            // allowed, because status is a let

// A type after the colon says what a variable may hold. TypeScript checks it before running.
const price: number = 799;
// const wrong: number = 'free';  // remove the // at the start, then run: npm run typecheck (it reports an error)

// Template string: backticks ` ` and ${...} put values inside text
console.log(`${name} ordered ${quantity} items for ${price * quantity}`);
console.log('active is', active, '| status is', status);

// Comparing: === means "is exactly equal" (same value and same type)
const status201 = 201;                 // a number, as in res.status()
const fromCsv = '201';                 // text, as every value read from a CSV file
console.log('status201 === 201 ->', status201 === 201);
console.log('fromCsv is', typeof fromCsv, '| Number(fromCsv) === 201 ->', Number(fromCsv) === 201);

export {}; // makes this file a module, so its names do not clash with the other lessons
