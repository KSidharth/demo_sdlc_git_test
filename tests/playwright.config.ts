import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  outputDir: '../test-results',
  testMatch: [
    'unit/**/*.spec.ts',
    'unit/**/*.test.ts',
    'system_integration/**/*.spec.ts',
    'system_integration/**/*.test.ts',
  ],
  reporter: 'json',
  use: { baseURL: process.env.BASE_URL ?? 'http://localhost:3000' },
});
