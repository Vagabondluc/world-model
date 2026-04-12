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

export class AIServiceError extends Error {
    constructor(message: string, public readonly model: string) {
        super(message);
        this.name = 'AIServiceError';
    }
}
