
import { useState, useCallback } from 'react';
import { AIState } from '../../logic/ai/types';

export const useAIStateMachine = () => {
    const [aiState, setAIState] = useState<AIState>(AIState.IDLE);
    const [context, setContext] = useState({ actionCount: 0 });

    const transitionTo = useCallback((newState: AIState) => {
        // console.log(`[AI] Transition: ${aiState} -> ${newState}`);
        setAIState(newState);
    }, [aiState]);

    const resetContext = useCallback(() => {
        setContext({ actionCount: 0 });
    }, []);

    const incrementActionCount = useCallback(() => {
        setContext(prev => ({ ...prev, actionCount: prev.actionCount + 1 }));
    }, []);

    return {
        aiState,
        transitionTo,
        context,
        resetContext,
        incrementActionCount
    };
};
