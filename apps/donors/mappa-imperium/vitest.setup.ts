/// <reference types="@testing-library/jest-dom" />
/// <reference types="vitest/globals" />
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
    cleanup();
});

// Global Mocks
Object.defineProperty(window, 'sessionStorage', {
    value: {
        getItem: () => null,
        setItem: () => { },
        removeItem: () => { },
        clear: () => { },
    },
    writable: true
});
