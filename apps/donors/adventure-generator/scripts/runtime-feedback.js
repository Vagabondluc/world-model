// Browser-only runtime feedback logger
export const RFS_KEY = 'dnd_gen_rfs_log';

export function recordFeedback(status, context, message) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        status, // 'PASS' | 'FAIL' | 'WARN'
        context, // e.g., 'GeneratorStore', 'SchemaValidation'
        message
    };
    
    const existing = getFeedback();
    existing.unshift(logEntry);
    // Keep last 50 entries to avoid localStorage bloat
    if (existing.length > 50) existing.pop();
    
    try {
        localStorage.setItem(RFS_KEY, JSON.stringify(existing));
        const color = status === 'PASS' ? 'green' : status === 'FAIL' ? 'red' : 'orange';
        console.log(`%c[RFS] [${status}] ${context}: ${message}`, `color: ${color}; font-weight: bold;`);
    } catch (e) {
        console.warn('Failed to save runtime feedback to localStorage', e);
    }
}

export function getFeedback() {
    try {
        return JSON.parse(localStorage.getItem(RFS_KEY) || '[]');
    } catch (e) {
        return [];
    }
}

export function clearFeedback() {
    localStorage.removeItem(RFS_KEY);
}
