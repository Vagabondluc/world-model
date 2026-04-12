
/**
 * Factory for creating Web Workers in a build-less ESM environment.
 * Uses Blobs to ensure code execution regardless of server path resolution.
 */
export class WorkerFactory {
    /**
     * Creates a module-type worker from a string of code.
     */
    static create(code: string): Worker {
        const blob = new Blob([code], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const worker = new Worker(url, { type: 'module' });

        // Wrap the terminate to also clean up the object URL
        const originalTerminate = worker.terminate.bind(worker);
        worker.terminate = () => {
            originalTerminate();
            URL.revokeObjectURL(url);
        };

        return worker;
    }

    /**
     * Helper to wrap a function body into a worker-ready string.
     */
    static fromFunction(fn: Function, imports: string[] = []): Worker {
        const importStrings = imports.map(i => `import '${i}';`).join('\n');
        const code = `
            ${importStrings}
            (${fn.toString()})();
        `;
        return this.create(code);
    }
}
