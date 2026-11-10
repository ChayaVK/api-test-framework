// Lesson 5: async and await. Every request and every browser action in Playwright uses them.
// Run: npm run learn:5

// A request takes time. Here we pretend: this function answers after a delay.
function fakeRequest(path: string, ms: number): Promise<string> {
  return new Promise((resolve) => setTimeout(() => resolve(`200 OK from ${path}`), ms));
}

// "async" marks a function that waits for things; "await" waits for one result before going on
async function main() {
  console.log('1. sending GET /api/users ...');
  const answer = await fakeRequest('/api/users', 300);       // wait here until it answers
  console.log('2.', answer);

  // Without await you only get a Promise ("a result that comes later"), not the result itself
  const notWaited = fakeRequest('/api/orders', 100);
  console.log('3. without await:', notWaited instanceof Promise ? 'a Promise, not the answer' : notWaited);
  console.log('4. with await:', await notWaited);

  // try / catch: handle an error instead of crashing
  try {
    await Promise.reject(new Error('connect ECONNREFUSED 127.0.0.1:3000'));
  } catch (err) {
    console.log('5. caught an error:', (err as Error).message);
  }
}

main();

export {}; // makes this file a module, so its names do not clash with the other lessons
