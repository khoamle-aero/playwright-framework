import { test, expect } from '../../fixtures/api.fixture';

test.describe('Auth API', () => {
  test('creates a token with valid admin credentials', async ({ authApi }) => {
    const token = await authApi.createToken({
      username: 'admin',
      password: 'password123',
    });

    expect(token).toBeTruthy();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  test('rejects token creation with invalid credentials', async ({ request }) => {
    const response = await request.post('/auth', {
      data: { username: 'admin', password: 'wrong-password' },
    });

    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.reason).toBe('Bad credentials');
  });
});