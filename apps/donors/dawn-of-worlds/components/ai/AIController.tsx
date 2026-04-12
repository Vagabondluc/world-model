import React, { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import { PlayerId } from '../../types';
import { decideNextMove } from '../../logic/ai/brain';
import { DEFAULT_PERSONALITIES } from '../../logic/ai/profiles';

type AIState = 'IDLE' | 'AWAKENING' | 'DELIBERATING' | 'ACTING' | 'YIELDING';

/**
 * The Automaton Brain
 * 
 * A headless component that manages the lifecycle of non-human players.
 * It observes the game state and intervenes when activePlayer.isHuman === false.
 */
const AIController: React.FC = () => {
    const activePlayerId = useGameStore(state => state.activePlayerId);
    const playerCache = useGameStore(state => state.playerCache);
    const players = useGameStore(state => state.config?.players);
    const dispatch = useGameStore(state => state.dispatch);

    // Game Context
    const age = useGameStore(state => state.age);
    const round = useGameStore(state => state.round);
    const turn = useGameStore(state => state.turn);

    const [aiState, setAiState] = useState<AIState>('IDLE');

    // Safety timeout ref
    const panicTimeout = useRef<NodeJS.Timeout>();

    // Derived
    const activePlayerConfig = players?.find(p => p.id === activePlayerId);
    const isHuman = activePlayerConfig?.isHuman ?? true;
    const runtimeState = playerCache[activePlayerId];

    // ------------------------------------------------------------
    // 1. Awakening Trigger
    // ------------------------------------------------------------
    const isHandoverActive = useGameStore(state => state.isHandoverActive);
    const completeHandover = useGameStore(state => state.completeHandover);

    // ------------------------------------------------------------
    // 1. Awakening Trigger & Handover
    // ------------------------------------------------------------
    useEffect(() => {
        if (!isHuman) {
            // Priority: If handover is active, clear it first so turn can really start
            if (isHandoverActive && activePlayerId) {
                console.log(`[AI] ${activePlayerId} Completing Handover`);
                completeHandover();
                return;
            }

            // Normal Awakening
            if (aiState === 'IDLE' && !isHandoverActive) {
                console.log(`[AI] ${activePlayerId} Awakening...`);
                setAiState('AWAKENING');
            }
        }
    }, [activePlayerId, isHuman, aiState, isHandoverActive, completeHandover]);

    // ------------------------------------------------------------
    // 2. State Machine Loop
    // ------------------------------------------------------------
    useEffect(() => {
        let timer: NodeJS.Timeout;

        const runLoop = async () => {
            // --- PHASE: AWAKENING ---
            if (aiState === 'AWAKENING') {
                // Initial delay to simulate "noticing" the turn
                timer = setTimeout(() => {
                    if (!runtimeState?.hasRolledThisTurn) {
                        console.log(`[AI] ${activePlayerId} performing POWER_ROLL`);


                        // Execute Roll
                        const d1 = Math.ceil(Math.random() * 6);
                        const d2 = Math.ceil(Math.random() * 6);
                        const bonus = runtimeState?.lowPowerBonus || 0;
                        const result = d1 + d2 + bonus;

                        dispatch({
                            id: crypto.randomUUID(),
                            type: 'POWER_ROLL',
                            ts: Date.now(),
                            playerId: activePlayerId,
                            age, round, turn,
                            payload: { roll: [d1, d2], bonus, result }
                        });

                        // Stay in AWAKENING for a brief moment to let animation play (conceptually)
                        // Then move to DELIBERATING
                        // In reality, state update will happen via Store, and next tick we see hasRolledThisTurn=true
                    }
                    setAiState('DELIBERATING');
                }, 1500);
            }

            // --- PHASE: DELIBERATING ---
            if (aiState === 'DELIBERATING') {
                timer = setTimeout(() => {
                    // Logic: If we have AP, try to do something.
                    // For now (Phase 1.5), we just check if we rolled.

                    // NEW: Consult the brain
                    const decision = decideNextMove(
                        {
                            // Construct a partial GameState or pass store state directly 
                            // Ideally we should pass the full state object from the store 
                            // But for now, let's just use what we have access to via hooks if possible
                            // Actually, deep state access inside useEffect is tricky due to closures.
                            // Better to read fresh state or rely on dependencies.
                            // Simplification: We will just read the necessary parts from store.getState() 
                            // But we can't use hooks conditionally. 
                            // Let's use useGameStore.getState() for one-off reads in the effect.
                            ...useGameStore.getState()
                        },
                        activePlayerId,
                        DEFAULT_PERSONALITIES.AGGRESSOR // Default profile for now
                    );

                    console.log(`[AI] Decision: ${decision.reason} -> ${decision.action?.type ?? 'YIELD'}`);

                    if (decision.action) {
                        setAiState('ACTING');

                        // Execute Action (Generic Dispatch)
                        console.log(`[AI] Dispatching: ${decision.action.type}`, decision.action.payload);

                        dispatch({
                            id: crypto.randomUUID(),
                            type: decision.action.type as any, // dynamic type from AI
                            ts: Date.now(),
                            playerId: activePlayerId,
                            age, round, turn,
                            cost: decision.action.cost || 0,
                            payload: decision.action.payload
                        });

                        // Re-enter Deliberating to see if we can do more
                        setAiState('DELIBERATING');
                        return; // Let loop cycle
                    }

                    if (decision.shouldYield) {
                        console.log('[AI] Deliberation complete -> Yielding');
                        setAiState('YIELDING');
                    }
                }, 2000);
            }

            // --- PHASE: YIELDING ---
            if (aiState === 'YIELDING') {
                console.log(`[AI] Yielding turn for ${activePlayerId}`);

                dispatch({
                    id: crypto.randomUUID(),
                    type: 'TURN_END',
                    ts: Date.now(),
                    playerId: activePlayerId,
                    age, round, turn,
                    payload: {}
                });

                // Reset to IDLE immediately
                setAiState('IDLE');
            }
        };

        runLoop();

        return () => clearTimeout(timer);
    }, [aiState, activePlayerId, age, round, turn, dispatch, runtimeState]);


    // ------------------------------------------------------------
    // 3. Safety Valve (Panic Reset)
    // ------------------------------------------------------------
    useEffect(() => {
        // If we are stuck in a non-IDLE state for too long, force yield
        if (aiState !== 'IDLE') {
            panicTimeout.current = setTimeout(() => {
                console.warn('[AI] Panic Reset Triggered - Force Yielding');
                // Ensure we don't double-dispatch if the loop just finished
                if (activePlayerConfig?.isHuman === false) {
                    dispatch({
                        id: crypto.randomUUID(),
                        type: 'TURN_END',
                        ts: Date.now(),
                        playerId: activePlayerId,
                        age, round, turn,
                        payload: {}
                    });
                }
                setAiState('IDLE');
            }, 10000); // 10s timeout
        } else {
            clearTimeout(panicTimeout.current);
        }

        return () => clearTimeout(panicTimeout.current);
    }, [aiState, activePlayerId, dispatch, age, round, turn]);

    return null; // Headless
};

export default AIController;
