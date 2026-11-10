import { test, expect } from '../../src/fixtures/test';
import { expectSchema } from '../../src/utils/schema';
import { Order, Product } from '../../src/models/types';
import cases from '../../data/orders.json';

test.describe('Orders', () => {
  test('place, read and cancel an order (chained requests) @smoke', async ({ productsApi, ordersApi }) => {
    // 1. find a product in stock and remember its price
    const product: Product = (await (await productsApi.list({ inStock: true, limit: 1 })).json()).data[0];

    // 2. place an order for 2 of them
    const placed = await ordersApi.place(product.id, 2);
    expect(placed.status()).toBe(201);
    const order: Order = await placed.json();
    expectSchema(order, 'order');
    expect(order).toMatchObject({ productId: product.id, quantity: 2, status: 'PLACED' });
    expect(order.total).toBe(product.price * 2);

    // 3. read it back by the id from step 2
    const read = await ordersApi.get(order.id);
    expect(await read.json()).toEqual(order);

    // 4. clean up: cancel it
    const cancelled = await ordersApi.cancel(order.id);
    expect(cancelled.status()).toBe(200);
    expect((await cancelled.json()).status).toBe('CANCELLED');
  });

  test('a cancelled order cannot be cancelled again', async ({ ordersApi }) => {
    const order: Order = await (await ordersApi.place(1, 1)).json();
    await ordersApi.cancel(order.id);

    const again = await ordersApi.cancel(order.id);
    expect(again.status()).toBe(409);
  });

  // Data-driven from a JSON file: valid and invalid orders side by side
  for (const c of cases) {
    test(`order rules: ${c.case} -> ${c.expectedStatus}`, async ({ ordersApi, cleanup }) => {
      const res = await ordersApi.place(c.productId, c.quantity);

      expect(res.status()).toBe(c.expectedStatus);
      const body = await res.json();
      if (res.status() === 201) {
        cleanup.add(`cancel order ${body.id}`, () => ordersApi.cancel(body.id));
      } else {
        expectSchema(body, 'error');
        expect(body.error.code).toBe(c.expectedCode);
      }
    });
  }
});
