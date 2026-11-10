import { BaseApi } from './BaseApi';

export class OrdersApi extends BaseApi {
  list() {
    return this.call('GET', '/api/orders');
  }
  get(id: number) {
    return this.call('GET', `/api/orders/${id}`);
  }
  place(productId: number, quantity: number) {
    return this.call('POST', '/api/orders', { data: { productId, quantity } });
  }
  cancel(id: number) {
    return this.call('DELETE', `/api/orders/${id}`);
  }
}
