export interface RetryOptions {
    maxRetries?: number;
    baseDelayMs?: number;
    label?: string;
}

export class BaseAIProvider {
    protected async retryWithBackoff<T>(
        operation: () => Promise<T>,
        options: RetryOptions = {}
    ): Promise<T> {
        const maxRetries = options.maxRetries ?? 3;
        const baseDelayMs = options.baseDelayMs ?? 1000;
        const label = options.label ?? "AI";
        let lastError: unknown;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error;
                console.warn(`${label} attempt ${attempt}/${maxRetries} failed:`, error);
                if (attempt < maxRetries) {
                    const delay = Math.pow(2, attempt - 1) * baseDelayMs;
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        const message = lastError instanceof Error ? lastError.message : "Unknown error";
        throw new Error(`${label} failed after ${maxRetries} attempts: ${message}`);
    }
}
