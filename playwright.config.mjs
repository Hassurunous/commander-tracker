import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './test/browser',
    workers: 1,
    use: { channel: 'msedge', headless: true, baseURL: 'http://127.0.0.1:4174' },
    webServer: { command: 'npm run dev -- --host 127.0.0.1 --port 4174 --strictPort', url: 'http://127.0.0.1:4174', reuseExistingServer: false },
    reporter: [['list']],
});
