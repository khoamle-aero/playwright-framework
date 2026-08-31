import { APIRequestContext, APIResponse } from '@playwright/test';

export class BaseApiClient {
  constructor(protected readonly request: APIRequestContext) {}

  protected async get(url: string, headers: Record<string, string> = {}): Promise<APIResponse> {
    return this.request.get(url, { headers });
  }

  protected async post(
    url: string,
    data: unknown,
    headers: Record<string, string> = {}
  ): Promise<APIResponse> {
    return this.request.post(url, {
      data,
      headers: { 'Content-Type': 'application/json', ...headers },
    });
  }

  protected async put(
    url: string,
    data: unknown,
    headers: Record<string, string> = {}
  ): Promise<APIResponse> {
    return this.request.put(url, {
      data,
      headers: { 'Content-Type': 'application/json', ...headers },
    });
  }

  protected async patch(
    url: string,
    data: unknown,
    headers: Record<string, string> = {}
  ): Promise<APIResponse> {
    return this.request.patch(url, {
      data,
      headers: { 'Content-Type': 'application/json', ...headers },
    });
  }

  protected async delete(url: string, headers: Record<string, string> = {}): Promise<APIResponse> {
    return this.request.delete(url, { headers });
  }

  protected async expectJson<T>(response: APIResponse, expectedStatus: number | number[]): Promise<T> {
    const expected = Array.isArray(expectedStatus) ? expectedStatus : [expectedStatus];
    if (!expected.includes(response.status())) {
      const body = await response.text();
      throw new Error(
        `Expected status ${expected.join(' or ')} but got ${response.status()} for ${response.url()}.\nBody: ${body}`
      );
    }
    return response.json() as Promise<T>;
  }
}