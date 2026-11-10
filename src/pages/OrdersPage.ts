import { Page, Locator } from '@playwright/test';

export class OrdersPage {
  readonly heading: Locator;
  readonly signedInAs: Locator;
  readonly rows: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'My Orders' });
    this.signedInAs = page.locator('#who');
    this.rows = page.locator('#orders tbody tr');
  }

  /** The table row of one order, found by its id. */
  row(orderId: number): Locator {
    return this.page.locator(`#orders tbody tr[data-order-id="${orderId}"]`);
  }

  status(orderId: number): Locator {
    return this.row(orderId).locator('.status');
  }
}
