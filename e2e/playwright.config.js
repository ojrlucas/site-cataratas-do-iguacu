const { defineConfig } = require('@playwright/test');
const path = require('node:path');

const raiz = path.resolve(__dirname, '..');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60000,
  workers: 1,
  fullyParallel: false,
  reporter: [['list']],
  use: { baseURL: 'http://127.0.0.1:3100', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1280, height: 800 } } },
    { name: 'celular', use: { viewport: { width: 390, height: 800 } } },
  ],
  webServer: {
    command: 'node src/server.js',
    cwd: path.join(raiz, 'backend'),
    url: 'http://127.0.0.1:3100/api/health',
    reuseExistingServer: false,
    timeout: 30000,
    env: {
      PORT: '3100',
      DATA_DIR: path.join(raiz, 'e2e', '.dados'),
      STATIC_DIR: path.join(raiz, 'frontend', 'dist', 'frontend', 'browser'),
      JWT_SECRET: 'segredo-de-teste-e2e-com-mais-de-32-caracteres',
    },
  },
});
