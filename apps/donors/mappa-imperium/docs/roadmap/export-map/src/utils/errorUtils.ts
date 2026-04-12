export class AdventureGenerationError extends Error {
    constructor(
        message: string,
        public readonly context: string,
        public readonly operation: string
    ) {
        super(message);
        this.name = 'AdventureGenerationError';
    }
}
