import { fileURLToPath } from 'node:url';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    define: {
        'process.env': {},
    },
    plugins: [svelte()],
    resolve: {
        alias: {
            'plasma-test': fileURLToPath(new URL('./test/src/index.ts', import.meta.url)),
        },
    },
    test: {
        globals: true,
        alias: {
            '@testing-library/svelte': '@testing-library/svelte/svelte5',
        },
        browser: {
            name: 'chromium',
            enabled: true,
            headless: true,
            provider: 'playwright',
        },
    },
});
