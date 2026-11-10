// Lesson 3: functions, if/else and your own types.  Run: npm run learn:3

// An interface describes the shape of an object (like src/models/types.ts does)
interface Order {
  productId: number;
  quantity: number;
  status: 'PLACED' | 'CANCELLED';   // only these two values are allowed
  note?: string;                     // ? = optional field
}

// A function: a named block of steps. Parameters go in, a result comes out with return.
function total(price: number, quantity: number): number {
  return price * quantity;
}
console.log('total:', total(799, 2));

// An arrow function is the short way to write a function; you will see it everywhere
const isValidQuantity = (q: number): boolean => q >= 1 && q <= 10;

// if / else: do one thing or the other
for (const q of [0, 3, 11]) {
  if (isValidQuantity(q)) {
    console.log(q, '-> valid');
  } else {
    console.log(q, '-> refused with 400');
  }
}

// A default value for a parameter, used when the caller leaves it out
function describe(order: Order, prefix = 'Order'): string {
  return `${prefix}: ${order.quantity} x product ${order.productId}, ${order.status}`;
}
const order: Order = { productId: 1, quantity: 2, status: 'PLACED' };
console.log(describe(order));
console.log(describe({ ...order, status: 'CANCELLED' }, 'Cancelled order'));

export {}; // makes this file a module, so its names do not clash with the other lessons
