// Lesson 4: classes, the building block of API clients and page objects.  Run: npm run learn:4

// A class is a blueprint. "new" makes an object from it.
class Counter {
  private count = 0;                  // a field, hidden from outside code (private)

  constructor(private readonly label: string) {}   // runs once, when the object is made

  add(by = 1): void {                 // a method: a function that belongs to the class
    this.count += by;                 // "this" means "this object"
  }

  report(): string {
    return `${this.label}: ${this.count}`;
  }
}

const orders = new Counter('orders placed');
orders.add();
orders.add(2);
console.log(orders.report());

// extends: a class that reuses everything from another one, and adds its own methods.
// This is exactly how UsersApi extends BaseApi in the framework.
class BaseClient {
  constructor(protected readonly baseUrl: string) {}
  protected url(path: string): string {
    return this.baseUrl + path;
  }
}
class UsersClient extends BaseClient {
  userUrl(id: number): string {
    return this.url(`/api/users/${id}`);
  }
}
console.log(new UsersClient('http://localhost:3000').userUrl(7));

export {}; // makes this file a module, so its names do not clash with the other lessons
