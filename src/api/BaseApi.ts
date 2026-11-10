import { APIRequestContext, APIResponse, test } from '@playwright/test';

// Every API class extends BaseApi. It holds the request context and the token,
// builds the headers, and logs each call into the Playwright report.
export abstract class BaseApi {
  constructor(protected readonly request: APIRequestContext, private token?: string) {}

  /** Returns a copy of this client that sends the given token. */
  withToken(token: string): this {
    const Client = this.constructor as new (r: APIRequestContext, t?: string) => this;
    return new Client(this.request, token);
  }

  protected headers(extra: Record<string, string> = {}): Record<string, string> {
    return this.token ? { Authorization: `Bearer ${this.token}`, ...extra } : extra;
  }

  protected async call(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', url: string,
                       options: { data?: unknown; params?: Record<string, string | number>; headers?: Record<string, string> } = {}): Promise<APIResponse> {
    // test.step makes every call a named step in the HTML report and the trace
    return test.step(`${method} ${url}`, async () => {
      return this.request.fetch(url, {
        method,
        data: options.data,
        params: options.params,
        headers: this.headers(options.headers),
      });
    });
  }
}
