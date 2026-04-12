
import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useAIStateMachine } from './useAIStateMachine';
import { AIState } from '../../logic/ai/types';
import { AIScanner } from '../../logic/ai/AIScanner';
import { AIDispatcher } from '../../logic/ai/AIDispatcher';
import { UtilityScorer } from '../../logic/ai/UtilityScorer';
import { PERSONA_CONQUEROR, evalExpansion } from '../../logic/ai/personas';
import { useToast } from '../../hooks/useToast';
import { AICombat } from '../../logic/ai/AICombat';

// The "Brain" of the Automaton
interface AIControllerProps {
    worldCells?: Map<number, any>;
}

export const AIController: React.FC<AIControllerProps> = (props) => {
    const { aiState, transitionTo, context, resetContext, incrementActionCount } = useAIStateMachine();
    const { addToast } = useToast();


    // Subscribe to store updates
    const activePlayerId = useGameStore(state => state.activePlayerId);
    // Use getState for reading full state without subscribing to everything
    const getStoreState = useGameStore.getState;
    const players = useGameStore(state => state.config?.players);
    const dispatch = useGameStore(state => state.dispatch);

    // Refs for timeout clearing on unmount
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // 1. Check if it's AI's turn
    const isAiTurn = (() => {
        if (!players) return false;
        const activePlayer = players.find(p => p.id === activePlayerId);
        return activePlayer?.isHuman === false;
    })();

    // 2. State Machine Loop
    useEffect(() => {
        if (!isAiTurn) {
            if (aiState !== AIState.IDLE) {
                transitionTo(AIState.IDLE);
                resetContext();
            }
            return;
        }

        // It IS AI turn. Handle State Transitions.
        const runLoop = async () => {
            if (aiState === AIState.IDLE) {
                // Awakening
                transitionTo(AIState.AWAKENING);
            }
            else if (aiState === AIState.AWAKENING) {
                // Initial delay to gather context
                timeoutRef.current = setTimeout(() => {
                    transitionTo(AIState.DELIBERATING);
                }, 800); // 0.8s cognitive delay
            }
            else if (aiState === AIState.DELIBERATING) {
                // Scan the board
                const gameState = getStoreState();
                // Side-effect: Just ensuring scan works (or future caching)
                AIScanner.scan(gameState, activePlayerId);

                // console.log(`[AI] Scanned: Frontier=${scanResult.frontier.length}, Threats=${scanResult.threats.length}`);

                // DECISION LOGIC
                // 1. Define Potential Actions (Simplified)
                const expansionAction = [
                    { evaluator: evalExpansion, weight: 1.0, name: 'expansion' }
                ];

                const waitAction = [
                    { evaluator: () => 0.5, weight: 1.0, name: 'patience' }
                ];

                // 2. Score them using the Conqueror Persona
                const ctx = { gameState, playerId: activePlayerId };
                const scoreExpand = UtilityScorer.scoreAction('Expand', expansionAction, PERSONA_CONQUEROR, ctx);
                const scoreWait = UtilityScorer.scoreAction('Wait', waitAction, PERSONA_CONQUEROR, ctx);

                console.log(`[AI] Scores - Expand: ${scoreExpand.toFixed(2)}, Wait: ${scoreWait.toFixed(2)}`);

                // 3. Select Best Action
                if (context.actionCount === 0 && scoreExpand > scoreWait) {
                    transitionTo(AIState.ACTING);
                } else {
                    // Done acting, yield
                    timeoutRef.current = setTimeout(() => {
                        transitionTo(AIState.YIELDING);
                    }, 500);
                }
            }
            else if (aiState === AIState.ACTING) {
                // Execute Action - COMBAT / EXPANSION

                // 1. Re-scan to find target (should be cached but safe to re-scan rapid)
                const gameState = getStoreState();

                // Use props.worldCells if available, otherwise just rely on state
                // Ideally we use the one passed from parent to ensure we see the LATEST visual state
                // But scanner needs Map<number, Cell>.
                const cells = (props as any).worldCells || (gameState.world as any)?.cells;
                const stateWithWorld = { ...gameState, world: { cells } };

                const scan = AIScanner.scan(stateWithWorld as any, activePlayerId);

                if (scan.frontier.length > 0) {
                    // Pick random frontier cell
                    const targetId = scan.frontier[Math.floor(Math.random() * scan.frontier.length)];

                    // Resolve "Combat" (Expansion is just combat vs wilderness)
                    // We need to pass the FULL state to resolve, including world
                    const result = AICombat.resolve(activePlayerId, "Nature", targetId, stateWithWorld as any);

                    if (result.isConquest) {
                        try {
                            addToast(`AI Conquered Cell ${targetId}`, 'warning', 2000);
                        } catch (e) { console.warn("Toast failed", e); }

                        // Dispatch Conquest Event
                        const event = {
                            id: crypto.randomUUID(),
                            type: 'CELL_CONQUERED',
                            ts: Date.now(),
                            playerId: activePlayerId,
                            payload: { cellId: targetId, newOwnerId: activePlayerId }
                        };
                        dispatch(event);
                    } else {
                        try {
                            addToast(`AI Failed to conquer Cell ${targetId}`, 'info', 2000);
                        } catch (e) { console.warn("Toast failed", e); }
                    }
                } else {
                    // No frontier? Send a generic message
                    const actionEvent = AIDispatcher.sendMessage(activePlayerId, "I am expanding my mind...");
                    dispatch(actionEvent);
                }

                incrementActionCount();

                // Wait for "animation" then go back to Deliberating
                timeoutRef.current = setTimeout(() => {
                    transitionTo(AIState.DELIBERATING);
                }, 1000);
            }
            else if (aiState === AIState.YIELDING) {
                // Dispatch END_TURN using the Dispatcher service
                const endTurnEvent = AIDispatcher.endTurn(activePlayerId, getStoreState());
                dispatch(endTurnEvent);

                // Reset to IDLE
                transitionTo(AIState.IDLE);
            }
        };

        runLoop();

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [aiState, isAiTurn, activePlayerId, dispatch, transitionTo, resetContext, incrementActionCount]);

    // Debug Display (Overlay)
    if (!isAiTurn && aiState === AIState.IDLE) return null;

    return (
        <div style={{
            position: 'absolute',
            top: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.8)',
            color: '#0f0',
            padding: '10px 20px',
            borderRadius: '5px',
            fontFamily: 'monospace',
            zIndex: 9999,
            border: '1px solid #0f0',
            pointerEvents: 'none'
        }}>
            AI: {aiState} {context.actionCount > 0 ? `(Acts: ${context.actionCount})` : ''}
        </div>
    );
};
