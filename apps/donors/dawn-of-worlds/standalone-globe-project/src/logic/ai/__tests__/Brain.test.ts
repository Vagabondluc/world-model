
import { renderHook, act } from '@testing-library/react';
import { useAIStateMachine } from '../../../components/ai/useAIStateMachine';
import { AIState } from '../types';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Maturity Test Suite: The Brain (State Machine)
 * Target: useAIStateMachine logic
 */
describe('AI Brain (State Machine)', () => {

    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('Brain-01: Should start in IDLE state', () => {
        const { result } = renderHook(() => useAIStateMachine());
        expect(result.current.aiState).toBe(AIState.IDLE);
    });

    it('Brain-02: Should transition to AWAKENING manually', () => {
        const { result } = renderHook(() => useAIStateMachine());

        act(() => {
            result.current.transitionTo(AIState.AWAKENING);
        });

        expect(result.current.aiState).toBe(AIState.AWAKENING);
    });

    it('Brain-03: Should increment action count context', () => {
        const { result } = renderHook(() => useAIStateMachine());

        expect(result.current.context.actionCount).toBe(0);

        act(() => {
            result.current.incrementActionCount();
        });

        expect(result.current.context.actionCount).toBe(1);
    });

    it('Brain-04: Should reset context when requested', () => {
        const { result } = renderHook(() => useAIStateMachine());

        act(() => {
            result.current.incrementActionCount();
            result.current.resetContext();
        });

        expect(result.current.context.actionCount).toBe(0);
    });

    it('Brain-05: Should allow full lifecycle transitions', () => {
        const { result } = renderHook(() => useAIStateMachine());

        // IDLE -> AWAKENING
        act(() => result.current.transitionTo(AIState.AWAKENING));
        expect(result.current.aiState).toBe(AIState.AWAKENING);

        // AWAKENING -> DELIBERTATING
        act(() => result.current.transitionTo(AIState.DELIBERATING));
        expect(result.current.aiState).toBe(AIState.DELIBERATING);

        // DELIBERATING -> ACTING
        act(() => result.current.transitionTo(AIState.ACTING));
        expect(result.current.aiState).toBe(AIState.ACTING);

        // ACTING -> YIELDING
        act(() => result.current.transitionTo(AIState.YIELDING));
        expect(result.current.aiState).toBe(AIState.YIELDING);
    });
});
