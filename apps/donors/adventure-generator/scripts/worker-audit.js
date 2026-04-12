
import { recordFeedback } from './runtime-feedback.js';

/**
 * T-700: Web Worker Feasibility Study
 * Audits the browser environment for Web Worker support.
 */
export async function auditWorkerCapabilities() {
    const results = {
        workerSupported: typeof Worker !== 'undefined',
        blobSpawning: false,
        moduleSupport: false,
        latencyMs: 0,
        errors: []
    };

    if (!results.workerSupported) {
        recordFeedback('FAIL', 'WorkerAudit', 'Web Workers are not supported in this environment.');
        return results;
    }

    // 1. Test Blob Spawning (Reliable in sandboxed/build-less envs)
    try {
        const workerCode = `
            self.onmessage = (e) => {
                if (e.data === 'ping') self.postMessage('pong');
            };
        `;
        const blob = new Blob([workerCode], { type: 'text/javascript' });
        const blobUrl = URL.createObjectURL(blob);
        const worker = new Worker(blobUrl);

        const pongPromise = new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Blob worker timeout')), 2000);
            worker.onmessage = (e) => {
                clearTimeout(timeout);
                if (e.data === 'pong') resolve(true);
            };
        });

        const startTime = performance.now();
        worker.postMessage('ping');
        results.blobSpawning = await pongPromise;
        results.latencyMs = performance.now() - startTime;
        
        worker.terminate();
        URL.revokeObjectURL(blobUrl);
    } catch (e) {
        results.errors.push(`Blob spawn failed: ${e.message}`);
    }

    // 2. Test Module Support
    try {
        const moduleCode = `export const msg = 'ready';`;
        const blob = new Blob([moduleCode], { type: 'text/javascript' });
        const blobUrl = URL.createObjectURL(blob);
        // We just check if constructor throws with type: module
        const worker = new Worker(blobUrl, { type: 'module' });
        results.moduleSupport = true;
        worker.terminate();
        URL.revokeObjectURL(blobUrl);
    } catch (e) {
        results.moduleSupport = false;
    }

    if (results.blobSpawning) {
        recordFeedback('PASS', 'WorkerAudit', `Audit complete. Latency: ${results.latencyMs.toFixed(2)}ms. Modules: ${results.moduleSupport}`);
    } else {
        recordFeedback('WARN', 'WorkerAudit', `Audit failed to confirm basic spawning. ${results.errors.join(', ')}`);
    }

    return results;
}
