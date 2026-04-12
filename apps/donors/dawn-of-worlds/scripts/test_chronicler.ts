import { useGameStore } from '../store/gameStore';
import { GameEvent } from '../types';

// Mock the store purely for this test context if needed, 
// but here we will try to use the real store logic if possible 
// or just simulate the flow since we are in a node env without React.

// Note: useGameStore is a hook, so it might fail outside a component or without a provider context 
// depending on how strict Zustand is. However, Zustand vanilla store can be used.

// Getting the vanilla store
const store = useGameStore.getState();

console.log("Initial Candidates:", Object.keys(store.candidates).length);

// 1. Dispatch an AGE_ADVANCE event (Should trigger 'Age Transition')
const ageEvent: GameEvent = {
    id: `evt_test_${Date.now()}`,
    type: 'AGE_ADVANCE',
    ts: Date.now(),
    playerId: 'SYSTEM',
    age: 1,
    round: 1,
    turn: 1,
    payload: { from: 1, to: 2 }
};

console.log("Dispatching AGE_ADVANCE...");
store.dispatch(ageEvent);

// 2. Check Results
const candidates = useGameStore.getState().candidates;
const candidateKeys = Object.keys(candidates);

console.log("Final Candidates:", candidateKeys.length);

if (candidateKeys.length > 0) {
    const candidate = candidates[candidateKeys[0]];
    console.log("SUCCESS: Candidate Created!");
    console.log(" - ID:", candidate.id);
    console.log(" - Trigger:", candidate.triggerType);
    console.log(" - Sug. Template:", candidate.suggestedTemplates[0]);
} else {
    console.error("FAILURE: No candidate created.");
}
