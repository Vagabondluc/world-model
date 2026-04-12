
/**
 * Runtime Logic Verification Suite
 * Targets: Action Validation, AP Calculation, Dependency Chains.
 */

import { ACTION_REGISTRY } from '../logic/actions';
import { selectApRemaining, existsKindAtHex } from '../logic/selectors';
import { createInitialState } from '../GameContext';
import { derivePlayerState } from '../logic/derivePlayerState';
import { deriveWorld } from '../logic/deriveWorld';

const MOCK_CONFIG: any = {
  id: 'test-env',
  worldName: 'Test World',
  mapSize: 'SMALL',
  initialAge: 1,
  players: [{ id: 'P1', name: 'Tester', color: '#fff', isHuman: true }],
  rules: { strictAP: true, draftMode: false }
};

export async function runLogicVerification() {
  console.info('[Verify] Starting Logic Suite...');
  const results = { passed: 0, failed: 0, errors: [] as string[] };

  const assert = (condition: boolean, msg: string) => {
    if (condition) results.passed++;
    else {
      results.failed++;
      results.errors.push(msg);
      console.error('[Verify] FAILED:', msg);
    }
  };

  try {
    // 1. Initial State & Economy Check (Rule III)
    let state = createInitialState(MOCK_CONFIG);
    
    // In the new Economy, initial AP is 0 until a roll occurs.
    assert(selectApRemaining(state) === 0, 'Initial AP should be 0 before roll');

    // Simulate Power Roll
    state.events.push({
      id: 'evt-roll-1',
      type: 'POWER_ROLL',
      ts: Date.now(),
      playerId: 'P1',
      age: 1, round: 1, turn: 1,
      payload: { roll: [5, 5], bonus: 0, result: 10 }
    });
    
    // Re-derive player state to update cache
    state.playerCache = derivePlayerState(state.events, state.revokedEventIds, state.players);
    assert(selectApRemaining(state) === 10, 'AP should be 10 after rolling [5,5]');

    // 2. Age I Action: Create Avatar (Cost Check)
    const createAvatar = ACTION_REGISTRY['A1_CREATE_AVATAR'];
    const hex = { q: 1, r: 1 };
    const sel = { kind: 'HEX', hex } as any;
    
    // Valid Avatar Creation
    const avatarValid = createAvatar.validate(state, sel);
    assert(avatarValid.ok, 'Creating Avatar in Age I should be valid');
    
    const avatarEvent = createAvatar.buildEvent(state, sel);
    state.events.push(avatarEvent);
    
    // Re-derive for cost update
    state.playerCache = derivePlayerState(state.events, state.revokedEventIds, state.players);
    // 10 (Roll) - 10 (Avatar Cost) = 0
    assert(selectApRemaining(state) === 0, 'AP should be 0 after creating Avatar (10 AP cost)');

    // 3. Dependency Check: Order (Requires Race)
    // Advance to Age II for Order creation
    state.age = 2;
    // Inject AP for Age II
    state.events.push({
      id: 'evt-roll-2',
      type: 'POWER_ROLL',
      ts: Date.now(),
      playerId: 'P1',
      age: 2, round: 1, turn: 1,
      payload: { roll: [6, 6], bonus: 0, result: 12 }
    });
    state.playerCache = derivePlayerState(state.events, state.revokedEventIds, state.players);

    const createOrder = ACTION_REGISTRY['A2_CREATE_ORDER'];
    const orderHex = { q: 2, r: 2 };
    const orderSel = { kind: 'HEX', hex: orderHex } as any;

    // Should fail because no Race exists at 2,2
    const orderNoRace = createOrder.validate(state, orderSel);
    assert(!orderNoRace.ok, 'Creating Order without Race should be blocked');

    // Create Race at 2,2
    state.events.push({
      id: 'evt-race',
      type: 'WORLD_CREATE',
      ts: Date.now(),
      playerId: 'P1',
      age: 2, round: 1, turn: 1,
      cost: 2,
      payload: { worldId: 'race-1', kind: 'RACE', hexes: [orderHex], attrs: {} }
    });
    // Re-derive world so selector can see the Race
    state.worldCache = deriveWorld(state.events, state.revokedEventIds, state.settings);
    
    // Should pass now
    const orderWithRace = createOrder.validate(state, orderSel);
    assert(orderWithRace.ok, 'Creating Order on existing Race should be valid');

    // 4. Hierarchy Check: Nation (Requires City)
    state.age = 3;
    const foundNation = ACTION_REGISTRY['A3_FOUND_NATION'];
    
    // Should fail on the Race hex (needs City)
    const nationNoCity = foundNation.validate(state, orderSel);
    assert(!nationNoCity.ok, 'Founding Nation on Race (without City) should be blocked');

    // Create City at 2,2
    state.events.push({
      id: 'evt-city',
      type: 'WORLD_CREATE',
      ts: Date.now(),
      playerId: 'P1',
      age: 2, round: 1, turn: 1,
      cost: 3,
      payload: { worldId: 'city-1', kind: 'SETTLEMENT', hexes: [orderHex], attrs: { settlementType: 'CITY' } }
    });
    state.worldCache = deriveWorld(state.events, state.revokedEventIds, state.settings);

    // Should pass now
    const nationWithCity = foundNation.validate(state, orderSel);
    assert(nationWithCity.ok, 'Founding Nation on City should be valid');

    console.info(`[Verify] Complete. Passed: ${results.passed}, Failed: ${results.failed}`);
    
    localStorage.setItem('runtime_feedback', JSON.stringify({
      status: results.failed === 0 ? 'pass' : 'fail',
      timestamp: new Date().toISOString(),
      context: { component: 'Logic Engine (Economy + Rules)' },
      verification: { summary: `Passed ${results.passed}/${results.passed + results.failed} tests.` }
    }));

  } catch (e: any) {
    console.error('[Verify] Critical Error during suite execution:', e);
  }
}
