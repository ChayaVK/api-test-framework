// Lesson 2: objects, arrays and loops.  Run: npm run learn:2

// An object groups named values. It looks exactly like a JSON body.
const user = { id: 1, name: 'Asha Rao', role: 'tester', active: true };
console.log(user.name, 'is a', user.role);          // read a field with a dot

// An array is an ordered list, in square brackets. Positions start at 0.
const roles = ['tester', 'developer', 'manager'];
console.log('first role:', roles[0], '| how many:', roles.length);
roles.push('admin');                                   // add to the end
console.log('includes admin?', roles.includes('admin'));

// for...of runs the block once for every item
for (const role of roles) {
  console.log(' -', role);
}

// An array of objects: what a list endpoint returns
const users = [
  { id: 1, name: 'Asha Rao', role: 'tester' },
  { id: 2, name: 'Ravi Kumar', role: 'developer' },
  { id: 4, name: 'John Mathew', role: 'tester' },
];
const testers = users.filter((u) => u.role === 'tester');   // keep only matching items
const names = testers.map((u) => u.name);                     // turn each item into something else
console.log('testers:', names);

// Spread (...) copies the fields of an object into a new one, and lets you change some
const updated = { ...user, active: false };
console.log(updated);

// JSON text <-> object
const text = JSON.stringify({ name: 'Sara', quantity: 2 });
console.log('as JSON text:', text, '| back to an object:', JSON.parse(text).quantity);

export {}; // makes this file a module, so its names do not clash with the other lessons
