/// <reference types="vitest" />
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

// Mutation testing specific config - only runs seededRng tests
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
        // Only include the seededRng test file for mutation testing
        include: [
            'tests/unit/utils/seededRng.test.ts'
        ],
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
