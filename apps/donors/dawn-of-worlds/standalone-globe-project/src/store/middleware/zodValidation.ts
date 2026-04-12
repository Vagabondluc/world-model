/**
 * Zod Validation Middleware for Zustand Stores
 * 
 * This middleware provides runtime validation for Zustand store state updates.
 * It validates events before state changes and logs validation failures.
 */

import { StateCreator, StoreMutatorIdentifier } from 'zustand';
import { z, ZodError, ZodTypeAny } from 'zod';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Configuration for the Zod validation middleware
 */
export interface ZodValidationConfig<T> {
    /** Schema to validate the state against */
    stateSchema?: ZodTypeAny;

    /** Schema to validate events/actions against */
    eventSchema?: ZodTypeAny;

    /** Whether to log validation errors */
    logErrors?: boolean;

    /** Whether to throw on validation errors (default: false, just log) */
    throwOnError?: boolean;

    /** Custom error handler */
    onError?: (error: ZodError, context: ValidationErrorContext) => void;
}

/**
 * Context for validation errors
 */
export interface ValidationErrorContext {
    /** The store name (for logging) */
    storeName?: string;

    /** The action/event that caused the error */
    action?: string;

    /** The invalid data */
    data?: unknown;

    /** The previous state */
    previousState?: unknown;
}

/**
 * Middleware type signature
 */
type ZodValidation = <
    T,
    Mps extends [StoreMutatorIdentifier, unknown][] = [],
    Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
    config: ZodValidationConfig<T>
) => (
    f: StateCreator<T, Mps, Mcs>
) => StateCreator<T, Mps, Mcs>;

// ============================================================================
// MIDDLEWARE IMPLEMENTATION
// ============================================================================

/**
 * Create a Zod validation middleware for Zustand stores
 * 
 * @param config - Configuration options for the middleware
 * @returns A Zustand middleware function
 * 
 * @example
 * ```ts
 * import { create } from 'zustand';
 * import { zodValidation } from './middleware/zodValidation';
 * import { GameStateSchema } from './schemas';
 * 
 * const useStore = create<GameState>()(
 *   zodValidation({ stateSchema: GameStateSchema })(
 *     (set) => ({ ...initialState, ...actions })
 *   )
 * );
 * ```
 */
export const zodValidation: ZodValidation = <T>(config: ZodValidationConfig<T>) => {
    const {
        stateSchema,
        eventSchema,
        logErrors = true,
        throwOnError = false,
        onError,
    } = config;

    return (createState) => (set, get, api) => {
        // Wrap the set function to validate state updates
        const wrappedSet: typeof set = (partial, replace) => {
            // Get the previous state for error context
            const previousState = get();

            // Apply the update to get the new state
            // We need to compute the new state to validate it
            let newState: T;

            if (typeof partial === 'function') {
                newState = partial(previousState);
            } else {
                newState = replace ? (partial as T) : { ...previousState, ...partial };
            }

            // Validate the new state if a schema is provided
            if (stateSchema) {
                const validationResult = stateSchema.safeParse(newState);

                if (!validationResult.success) {
                    const errorContext: ValidationErrorContext = {
                        storeName: api.devtools?.name || 'unknown',
                        data: newState,
                        previousState,
                    };

                    if (onError) {
                        onError(validationResult.error, errorContext);
                    } else if (logErrors) {
                        logValidationError(validationResult.error, errorContext);
                    }

                    if (throwOnError) {
                        throw new ValidationError('State validation failed', validationResult.error, errorContext);
                    }

                    // Don't update the state if validation fails
                    return;
                }
            }

            // Apply the update
            set(partial, replace);
        };

        // Create the store with the wrapped set function
        const store = createState(wrappedSet, get, api);

        // If an event schema is provided, wrap the dispatch function
        if (eventSchema && 'dispatch' in store && typeof store.dispatch === 'function') {
            const originalDispatch = store.dispatch as (event: unknown) => void;

            store.dispatch = (event: unknown) => {
                const validationResult = eventSchema.safeParse(event);

                if (!validationResult.success) {
                    const errorContext: ValidationErrorContext = {
                        storeName: api.devtools?.name || 'unknown',
                        action: 'dispatch',
                        data: event,
                        previousState: get(),
                    };

                    if (onError) {
                        onError(validationResult.error, errorContext);
                    } else if (logErrors) {
                        logValidationError(validationResult.error, errorContext);
                    }

                    if (throwOnError) {
                        throw new ValidationError('Event validation failed', validationResult.error, errorContext);
                    }

                    // Don't dispatch the event if validation fails
                    return;
                }

                // Dispatch the validated event
                originalDispatch(event);
            };
        }

        return store;
    };
};

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Custom error class for validation errors
 */
export class ValidationError extends Error {
    constructor(
        message: string,
        public readonly zodError: ZodError,
        public readonly context: ValidationErrorContext
    ) {
        super(message);
        this.name = 'ValidationError';
    }
}

/**
 * Log a validation error to the console
 */
function logValidationError(error: ZodError, context: ValidationErrorContext): void {
    const storeName = context.storeName || 'unknown';
    const action = context.action || 'state update';

    console.group(`🚨 [Zod Validation Error] ${storeName}`);
    console.error(`Action: ${action}`);
    console.error('Error Details:');
    error.issues.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });

    if (context.data) {
        console.error('Invalid Data:', context.data);
    }

    console.groupEnd();
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Create a middleware that validates only events
 */
export function validateEvents<T extends { dispatch: (event: unknown) => void }>(
    eventSchema: ZodTypeAny,
    config?: Partial<ZodValidationConfig<T>>
) {
    return zodValidation({ ...config, eventSchema });
}

/**
 * Create a middleware that validates only state
 */
export function validateState<T>(
    stateSchema: ZodTypeAny,
    config?: Partial<ZodValidationConfig<T>>
) {
    return zodValidation({ ...config, stateSchema });
}

/**
 * Create a middleware that validates both state and events
 */
export function validateAll<T extends { dispatch: (event: unknown) => void }>(
    stateSchema: ZodTypeAny,
    eventSchema: ZodTypeAny,
    config?: Partial<ZodValidationConfig<T>>
) {
    return zodValidation({ ...config, stateSchema, eventSchema });
}

// ============================================================================
// DEVTOOLS INTEGRATION
// ============================================================================

/**
 * Enable devtools integration for better error reporting
 * This should be used in development mode only
 */
export function withDevtoolsName<T>(
    storeName: string,
    middlewareCreator: (config: ZodValidationConfig<T>) => (f: StateCreator<T>) => StateCreator<T>
) {
    return (config: ZodValidationConfig<T>) => {
        const enhancedConfig: ZodValidationConfig<T> = {
            ...config,
            onError: (error, context) => {
                context.storeName = storeName;
                if (config.onError) {
                    config.onError(error, context);
                } else {
                    logValidationError(error, context);
                }
            },
        };
        return middlewareCreator(enhancedConfig);
    };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default zodValidation;
