/// <reference types="vitest" />
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/tests/setup.ts'],
        exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/playwright-report/**',
            '**/test-results/**',
            'src/tests/visual-regression/**',
            '**/temp-export-staging/**'
        ]
    },
});
