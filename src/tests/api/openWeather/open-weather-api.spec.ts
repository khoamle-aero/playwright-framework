const { test, expect } = require('@playwright/test');

// Configurations
const API_KEY = process.env.OPENWEATHER_API_KEY || 'a7b26b7f75b09c2f31a5bd0470f5de19';

test.describe('OpenWeather API Tests', () => {

  test('Should return current weather data for a valid city', async ({ request }) => {
    // 1. Send GET request
    const response = await request.get('/data/2.5/weather', {
      params: {
        q: 'Chicago',
        appid: API_KEY,
        units: 'metric'
      }
    });

    // 2. Assert status code is 200 OK
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    // 3. Parse and validate JSON structure
    const body = await response.json();
    console.log(body);
    expect(body.name).toBe('Chicago');
    expect(body.sys.country).toBe('US');
    expect(body.main).toHaveProperty('temp');
    expect(body.weather[0]).toHaveProperty('description');
  });

  test('Should return 401 Unauthorized when API key is missing or invalid', async ({ request }) => {
    const response = await request.get('/data/2.5/weather', {
      params: {
        q: 'London',
        appid: 'INVALID_API_KEY'
      }
    });

    // Assert authentication failure
    expect(response.status()).toBe(401);
    
    const body = await response.json();
    expect(body.message).toContain('Invalid API key');
  });

  test('Should return 404 Not Found for a non-existent city', async ({ request }) => {
    const response = await request.get('/data/2.5/weather', {
      params: {
        q: 'NonExistentCity12345',
        appid: API_KEY
      }
    });

    // Assert city not found
    expect(response.status()).toBe(404);
    
    const body = await response.json();
    expect(body.message).toBe('city not found');
  });

  test('Should return correct units when imperial parameter is passed', async ({ request }) => {
    const response = await request.get('/data/2.5/weather', {
      params: {
        q: 'New York',
        appid: API_KEY,
        units: 'imperial' // Requesting Fahrenheit
      }
    });

    expect(response.status()).toBe(200);
    
    const body = await response.json();
    // Verify schema or logical boundaries if specific values vary
    expect(body.main.temp).toBeDefined();
    expect(typeof body.main.temp).toBe('number');
  });
});
