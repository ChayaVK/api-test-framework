import { BaseApi } from './BaseApi';

export class ProductsApi extends BaseApi {
  list(params: { category?: string; inStock?: boolean; limit?: number } = {}) {
    const p: Record<string, string | number> = {};
    for (const [k, v] of Object.entries(params)) if (v !== undefined) p[k] = typeof v === 'boolean' ? String(v) : v;
    return this.call('GET', '/api/products', { params: p });
  }
  get(id: number) {
    return this.call('GET', `/api/products/${id}`);
  }
}
