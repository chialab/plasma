import { fileURLToPath } from 'node:url';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [svelte({ hot: !process.env.VITEST })],
    resolve: {
        alias: {
            'plasma-test': fileURLToPath(new URL('./test/src/index.ts', import.meta.url)),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
    },
});