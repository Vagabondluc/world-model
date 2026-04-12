// vitest setup for global environment
// ensure AI provider has a dummy API key so constructors don't throw
process.env.API_KEY = 'test';

// Add garbage collection hints during testing
// This helps prevent memory leaks during mutation testing
if (typeof global !== 'undefined' && !global.gc) {
    // Try to access the gc function if available
    try {
        global.gc = require('vm').runInThisContext('gc');
    } catch (e) {
        // gc not available, silently fail
    }
}

// Configure vitest for memory efficiency
import { afterEach } from 'vitest';

afterEach(() => {
    // Force garbage collection after each test if available
    if (global.gc && typeof global.gc === 'function') {
        try {
            global.gc();
        } catch (e) {
            // Silently fail if gc is not available
        }
    }
    
    // Clear jsdom's document to help with memory cleanup
    if (typeof document !== 'undefined') {
        document.body.innerHTML = '';
        document.head.innerHTML = '';
    }
});
