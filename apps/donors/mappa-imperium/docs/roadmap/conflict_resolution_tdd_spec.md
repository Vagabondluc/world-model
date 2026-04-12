# Conflict Resolution TDD Specification

**Version:** 1.0.0  
**Last Updated:** 2026-01-28  
**Reference Implementation:** [`docs/roadmap/backend/connection/webrtc.md`](./backend/connection/webrtc.md)

---

## Test Suite Overview

This test suite defines comprehensive test specifications for the conflict resolution system in the Mappa Imperium project. The conflict resolution system handles simultaneous edits and lock requests using a hybrid Simultaneous Turns + Lock-Mediated Resolution model with deterministic priority rules.

### Key Components Under Test

| Component | Purpose |
|-----------|---------|
| **Front Adjacency Strength** | Calculate player's front strength for a hex |
| **Initiative Stat Comparison** | Compare player initiative stats |
| **Player ID Tie-breaking** | Final deterministic tie-breaker |
| **Lock Request Processing** | Handle simultaneous lock requests |
| **Priority Ordering** | Determine winner of conflicts |
| **Phase Validation** | Ensure events are valid for current phase |

### Conflict Resolution Priority Stack

1. **Front Adjacency Strength** - Player with strongest shared front
2. **Initiative Stat** - Player with higher initiative (optional)
3. **Player ID** - Lowest player ID (final tie-break)

---

## Test Cases

### 1. Front Adjacency Strength Calculation

#### Test 1.1: Single adjacent owned hex
- **Input:** Player P1 owns hex (1,0), target hex is (2,0)
- **Expected Output:** Strength = 1
- **Edge Cases:** None
- **Description:** Single adjacent owned hex contributes strength 1

#### Test 1.2: Multiple adjacent owned hexes
- **Input:** Player P1 owns hexes (1,0), (1,-1), target hex is (2,0)
- **Expected Output:** Strength = 2
- **Edge Cases:** None
- **Description:** Multiple adjacent owned hexes sum their strength

#### Test 1.3: No adjacent owned hexes
- **Input:** Player P1 owns hex (5,5), target hex is (0,0)
- **Expected Output:** Strength = 0
- **Edge Cases:** No adjacency
- **Description:** Non-adjacent hexes contribute zero strength

#### Test 1.4: All 6 neighbors owned
- **Input:** Player P1 owns all 6 neighbors of target hex
- **Expected Output:** Strength = 6
- **Edge Cases:** Maximum strength
- **Description:** All neighbors owned gives maximum strength

#### Test 1.5: Mixed ownership neighbors
- **Input:** Player P1 owns 3 neighbors, P2 owns 3 neighbors
- **Expected Output:** P1 strength = 3, P2 strength = 3
- **Edge Cases:** Mixed ownership
- **Description:** Each player counts only their owned neighbors

#### Test 1.6: Negative coordinate hexes
- **Input:** Player P1 owns hex (-1,0), target hex is (0,0)
- **Expected Output:** Strength = 1
- **Edge Cases:** Negative coordinates
- **Description:** Negative coordinate hexes should work correctly

#### Test 1.7: Large coordinate hexes
- **Input:** Player P1 owns hex (100,100), target hex is (101,100)
- **Expected Output:** Strength = 1
- **Edge Cases:** Large coordinates
- **Description:** Large coordinate hexes should work correctly

#### Test 1.8: Center hex neighbors
- **Input:** Player P1 owns neighbors of (0,0,0)
- **Expected Output:** Correct strength calculation
- **Edge Cases:** Center hex
- **Description:** Center hex neighbors should be calculated correctly

#### Test 1.9: Edge map boundary
- **Input:** Target hex at map edge
- **Expected Output:** Only existing neighbors counted
- **Edge Cases:** Map boundary
- **Description:** Map boundary should not affect calculation

#### Test 1.10: Front strength with multiple players
- **Input:** P1 owns 2 neighbors, P2 owns 3 neighbors, P3 owns 1 neighbor
- **Expected Output:** Correct strength for each player
- **Edge Cases:** Multiple players
- **Description:** Should calculate strength for each player independently

---

### 2. Initiative Stat Comparison

#### Test 2.1: Higher initiative wins
- **Input:** P1 initiative = 5, P2 initiative = 3
- **Expected Output:** P1 wins
- **Edge Cases:** None
- **Description:** Higher initiative should win conflict

#### Test 2.2: Lower initiative loses
- **Input:** P1 initiative = 2, P2 initiative = 4
- **Expected Output:** P2 wins
- **Edge Cases:** None
- **Description:** Lower initiative should lose conflict

#### Test 2.3: Equal initiative (tie)
- **Input:** P1 initiative = 5, P2 initiative = 5
- **Expected Output:** Tie, proceed to player ID comparison
- **Edge Cases:** Equal values
- **Description:** Equal initiative should trigger next tie-breaker

#### Test 2.4: Zero initiative
- **Input:** P1 initiative = 0, P2 initiative = 1
- **Expected Output:** P2 wins
- **Edge Cases:** Zero boundary value
- **Description:** Zero initiative should be handled correctly

#### Test 2.5: Negative initiative
- **Input:** P1 initiative = -1, P2 initiative = 0
- **Expected Output:** P2 wins
- **Edge Cases:** Negative values
- **Description:** Negative initiative should be handled correctly

#### Test 2.6: Maximum initiative
- **Input:** P1 initiative = 100, P2 initiative = 50
- **Expected Output:** P1 wins
- **Edge Cases:** Maximum value
- **Description:** Maximum initiative should work correctly

#### Test 2.7: Initiative not set (undefined)
- **Input:** P1 initiative = undefined, P2 initiative = 5
- **Expected Output:** Treat as 0 or default value
- **Edge Cases:** Undefined value
- **Description:** Undefined initiative should have default value

#### Test 2.8: Multiple players comparison
- **Input:** P1 = 5, P2 = 3, P3 = 7
- **Expected Output:** P3 wins (highest)
- **Edge Cases:** Multiple players
- **Description:** Should compare all players and pick highest

#### Test 2.9: All players equal initiative
- **Input:** P1 = 5, P2 = 5, P3 = 5
- **Expected Output:** Tie, proceed to player ID comparison
- **Edge Cases:** All equal
- **Description:** All equal should trigger player ID tie-breaker

#### Test 2.10: Initiative disabled (feature flag)
- **Input:** Initiative comparison disabled
- **Expected Output:** Skip to player ID comparison
- **Edge Cases:** Feature disabled
- **Description:** Should skip initiative when disabled

---

### 3. Player ID Tie-breaking

#### Test 3.1: Lower player ID wins
- **Input:** P1 vs P2
- **Expected Output:** P1 wins
- **Edge Cases:** None
- **Description:** Lower player ID should win

#### Test 3.2: Higher player ID loses
- **Input:** P3 vs P1
- **Expected Output:** P1 wins
- **Edge Cases:** None
- **Description:** Higher player ID should lose

#### Test 3.3: Same player ID (impossible)
- **Input:** P1 vs P1
- **Expected Output:** Should not occur (same player can't conflict with self)
- **Edge Cases:** Same ID
- **Description:** Same player ID should not create conflicts

#### Test 3.4: Player ID 1 always wins
- **Input:** P1 vs P2, P3, P4, P5, P6
- **Expected Output:** P1 wins all
- **Edge Cases:** None
- **Description:** Player ID 1 should always win ties

#### Test 3.5: Player ID 6 always loses
- **Input:** P6 vs P1, P2, P3, P4, P5
- **Expected Output:** P6 loses all
- **Edge Cases:** None
- **Description:** Player ID 6 should always lose ties

#### Test 3.6: Non-sequential player IDs
- **Input:** P1 vs P5
- **Expected Output:** P1 wins
- **Edge Cases:** Non-sequential
- **Description:** Should work with non-sequential IDs

#### Test 3.7: String player IDs
- **Input:** "player_A" vs "player_B"
- **Expected Output:** Lexicographically smaller wins
- **Edge Cases:** String IDs
- **Description:** String IDs should use lexicographic comparison

#### Test 3.8: UUID player IDs
- **Input:** UUID comparison
- **Expected Output:** Deterministic ordering
- **Edge Cases:** UUIDs
- **Description:** UUID IDs should have deterministic ordering

#### Test 3.9: Multiple players tie-break
- **Input:** P2, P4, P6 all tied on previous criteria
- **Expected Output:** P2 wins (lowest ID)
- **Edge Cases:** Multiple players
- **Description:** Should pick lowest ID among tied players

#### Test 3.10: Player ID with prefix
- **Input:** "P1_Alpha" vs "P2_Beta"
- **Expected Output:** "P1_Alpha" wins
- **Edge Cases:** Prefixed IDs
- **Description:** Prefixed IDs should compare correctly

---

### 4. Lock Request Processing

#### Test 4.1: Single lock request
- **Input:** P1 requests lock on hex (3,5)
- **Expected Output:** Lock granted to P1
- **Edge Cases:** None
- **Description:** Single request should be granted

#### Test 4.2: Simultaneous lock requests (same hex)
- **Input:** P1 and P2 both request lock on hex (3,5)
- **Expected Output:** Conflict resolution applied
- **Edge Cases:** Simultaneous requests
- **Description:** Simultaneous requests should trigger conflict resolution

#### Test 4.3: Simultaneous lock requests (different hexes)
- **Input:** P1 requests lock on (3,5), P2 requests lock on (4,6)
- **Expected Output:** Both locks granted
- **Edge Cases:** Different targets
- **Description:** Different target hexes should not conflict

#### Test 4.4: Lock request with higher priority
- **Input:** P1 (front strength 3) vs P2 (front strength 1)
- **Expected Output:** P1 wins lock
- **Edge Cases:** Priority difference
- **Description:** Higher priority should win

#### Test 4.5: Lock request with equal priority
- **Input:** P1 and P2 have equal front strength
- **Expected Output:** Initiative or player ID tie-breaker used
- **Edge Cases:** Equal priority
- **Description:** Equal priority should use tie-breakers

#### Test 4.6: Lock request during wrong phase
- **Input:** Lock request during PLAN phase
- **Expected Output:** Request rejected
- **Edge Cases:** Wrong phase
- **Description:** Lock requests only valid in LOCK phase

#### Test 4.7: Lock request for owned hex
- **Input:** P1 requests lock on hex they already own
- **Expected Output:** Lock granted (or rejected if redundant)
- **Edge Cases:** Already owned
- **Description:** Should handle lock requests for owned hexes

#### Test 4.8: Lock request timeout
- **Input:** Lock request with TTL expires
- **Expected Output:** Lock released
- **Edge Cases:** Timeout
- **Description:** Expired locks should be released

#### Test 4.9: Lock request queue
- **Input:** Multiple lock requests for same hex
- **Expected Output:** Requests queued or processed
- **Edge Cases:** Queue management
- **Description:** Should handle lock request queue

#### Test 4.10: Lock request cancellation
- **Input:** Player cancels lock request
- **Expected Output:** Lock request removed
- **Edge Cases:** Cancellation
- **Description:** Should handle lock request cancellation

---

### 5. Priority Ordering

#### Test 5.1: Front strength wins over initiative
- **Input:** P1 (front=2, initiative=1) vs P2 (front=1, initiative=10)
- **Expected Output:** P1 wins (front strength priority)
- **Edge Cases:** None
- **Description:** Front strength should have highest priority

#### Test 5.2: Initiative wins over player ID
- **Input:** P1 (front=0, initiative=5, id=P1) vs P2 (front=0, initiative=3, id=P2)
- **Expected Output:** P1 wins (initiative priority)
- **Edge Cases:** None
- **Description:** Initiative should have second priority

#### Test 5.3: Player ID as final tie-breaker
- **Input:** P1 (front=0, initiative=0, id=P1) vs P2 (front=0, initiative=0, id=P2)
- **Expected Output:** P1 wins (player ID priority)
- **Edge Cases:** None
- **Description:** Player ID should be final tie-breaker

#### Test 5.4: Full priority stack test
- **Input:** P1 (front=3, initiative=2, id=P3) vs P2 (front=2, initiative=5, id=P1)
- **Expected Output:** P1 wins (front strength)
- **Edge Cases:** Full stack
- **Description:** Should apply full priority stack correctly

#### Test 5.5: Multiple players priority ordering
- **Input:** P1 (front=1), P2 (front=3), P3 (front=2)
- **Expected Output:** P2 > P3 > P1
- **Edge Cases:** Multiple players
- **Description:** Should order multiple players by priority

#### Test 5.6: Priority with all zeros
- **Input:** All players have front=0, initiative=0
- **Expected Output:** Player ID determines order
- **Edge Cases:** All zeros
- **Description:** Should handle all-zero priority case

#### Test 5.7: Priority with maximum values
- **Input:** P1 (front=6, initiative=100, id=P1) vs P2 (front=6, initiative=100, id=P2)
- **Expected Output:** P1 wins (player ID)
- **Edge Cases:** Maximum values
- **Description:** Should handle maximum priority values

#### Test 5.8: Priority with negative values
- **Input:** P1 (front=-1, initiative=-5) vs P2 (front=0, initiative=0)
- **Expected Output:** P2 wins
- **Edge Cases:** Negative values
- **Description:** Should handle negative priority values

#### Test 5.9: Priority consistency across peers
- **Input:** Same conflict on multiple peers
- **Expected Output:** Same winner on all peers
- **Edge Cases:** None
- **Description:** Priority ordering should be deterministic

#### Test 5.10: Priority with custom tie-breaker
- **Input:** Custom tie-breaker rule enabled
- **Expected Output:** Custom rule applied
- **Edge Cases:** Custom rules
- **Description:** Should support custom tie-breaker rules

---

### 6. Phase Validation

#### Test 6.1: Valid event in correct phase
- **Input:** HEX_LOCK_REQUEST during LOCK phase
- **Expected Output:** Event accepted
- **Edge Cases:** None
- **Description:** Valid events should be accepted

#### Test 6.2: Invalid event in wrong phase
- **Input:** HEX_LOCK_REQUEST during PLAN phase
- **Expected Output:** Event rejected
- **Edge Cases:** Wrong phase
- **Description:** Invalid phase events should be rejected

#### Test 6.3: CHAT event in any phase
- **Input:** CHAT event during any phase
- **Expected Output:** Event accepted
- **Edge Cases:** None
- **Description:** Chat events should be valid in all phases

#### Test 6.4: HEX_SET_OWNER only in RESOLVE
- **Input:** HEX_SET_OWNER during LOCK phase
- **Expected Output:** Event rejected
- **Edge Cases:** Wrong phase
- **Description:** Ownership changes only valid in RESOLVE

#### Test 6.5: PHASE_SET authoritative only
- **Input:** PHASE_SET from non-authoritative peer
- **Expected Output:** Event rejected
- **Edge Cases:** Unauthorized
- **Description:** Phase changes should be authoritative only

#### Test 6.6: Phase transition validation
- **Input:** PHASE_SET from valid round to next phase
- **Expected Output:** Phase transition accepted
- **Edge Cases:** Phase transition
- **Description:** Valid phase transitions should be accepted

#### Test 6.7: Invalid phase transition
- **Input:** PHASE_SET skipping phases
- **Expected Output:** Event rejected
- **Edge Cases:** Invalid transition
- **Description:** Invalid phase transitions should be rejected

#### Test 6.8: Multiple events in same phase
- **Input:** Multiple valid events in current phase
- **Expected Output:** All events accepted
- **Edge Cases:** Multiple events
- **Description:** Multiple valid events should be accepted

#### Test 6.9: Phase with no active player
- **Input:** Event when no active player
- **Expected Output:** Event rejected or handled specially
- **Edge Cases:** No active player
- **Description:** Should handle no active player case

#### Test 6.10: Phase timeout
- **Input:** Phase timeout reached
- **Expected Output:** Auto-transition or handle timeout
- **Edge Cases:** Timeout
- **Description:** Should handle phase timeout

---

### 7. Simultaneous Lock Requests

#### Test 7.1: Two players request same hex
- **Input:** P1 and P2 request lock on same hex
- **Expected Output:** Conflict resolved, one winner
- **Edge Cases:** None
- **Description:** Should resolve two-way conflict

#### Test 7.2: Three players request same hex
- **Input:** P1, P2, P3 all request lock on same hex
- **Expected Output:** Conflict resolved, one winner
- **Edge Cases:** Multiple claimants
- **Description:** Should resolve multi-way conflict

#### Test 7.3: All six players request same hex
- **Input:** All players request lock on center hex
- **Expected Output:** Conflict resolved, one winner
- **Edge Cases:** Maximum claimants
- **Description:** Should handle maximum claimants

#### Test 7.4: Simultaneous requests with equal priority
- **Input:** All players have equal front strength and initiative
- **Expected Output:** Player ID determines winner
- **Edge Cases:** All equal
- **Description:** Should use player ID when all else equal

#### Test 7.5: Simultaneous requests with different priorities
- **Input:** Players have varying front strengths
- **Expected Output:** Highest priority wins
- **Edge Cases:** Different priorities
- **Description:** Should pick highest priority

#### Test 7.6: Lock request timing differences
- **Input:** Requests arrive at slightly different times
- **Expected Output:** Timing should not affect outcome
- **Edge Cases:** Timing
- **Description:** Outcome should be independent of timing

#### Test 7.7: Lock request with network delay
- **Input:** Requests arrive with network delays
- **Expected Output:** Deterministic outcome regardless of delay
- **Edge Cases:** Network delay
- **Description:** Network delays should not affect outcome

#### Test 7.8: Lock request during RESOLVE phase
- **Input:** Lock request during RESOLVE phase
- **Expected Output:** Request rejected
- **Edge Cases:** Wrong phase
- **Description:** Lock requests only valid in LOCK phase

#### Test 7.9: Lock request after lock already held
- **Input:** Request for hex with existing lock
- **Expected Output:** Request rejected or queued
- **Edge Cases:** Existing lock
- **Description:** Should handle existing locks

#### Test 7.10: Lock request cancellation before resolution
- **Input:** Player cancels lock request before resolution
- **Expected Output:** Request removed from consideration
- **Edge Cases:** Cancellation
- **Description:** Should handle request cancellation

---

### 8. Resolution Phase Processing

#### Test 8.1: Collect all lock requests
- **Input:** Multiple lock requests in LOCK phase
- **Expected Output:** All requests collected
- **Edge Cases:** None
- **Description:** Should collect all lock requests

#### Test 8.2: Filter invalid requests
- **Input:** Requests exceeding claim limit, non-adjacent hexes
- **Expected Output:** Invalid requests filtered out
- **Edge Cases:** Invalid requests
- **Description:** Should filter invalid lock requests

#### Test 8.3: Group requests by hex
- **Input:** Requests for various hexes
- **Expected Output:** Requests grouped by target hex
- **Edge Cases:** None
- **Description:** Should group requests by target hex

#### Test 8.4: Resolve single claimant hexes
- **Input:** Hex with single claimant
- **Expected Output:** Claimant wins automatically
- **Edge Cases:** None
- **Description:** Single claimants should win automatically

#### Test 8.5: Resolve multiple claimant hexes
- **Input:** Hex with multiple claimants
- **Expected Output:** Conflict resolution applied
- **Edge Cases:** Multiple claimants
- **Description:** Multiple claimants should trigger conflict resolution

#### Test 8.6: Emit HEX_SET_OWNER events
- **Input:** Resolved lock requests
- **Expected Output:** HEX_SET_OWNER events emitted
- **Edge Cases:** None
- **Description:** Should emit ownership events for resolved locks

#### Test 8.7: Emit HEX_LOCK_DENIED events
- **Input:** Denied lock requests
- **Expected Output:** HEX_LOCK_DENIED events emitted
- **Edge Cases:** None
- **Description:** Should emit denial events for failed locks

#### Test 8.8: Deterministic resolution
- **Input:** Same lock requests on multiple peers
- **Expected Output:** Same resolution on all peers
- **Edge Cases:** None
- **Description:** Resolution should be deterministic

#### Test 8.9: Resolution state update
- **Input:** Resolved locks
- **Expected Output:** Game state updated
- **Edge Cases:** None
- **Description:** Should update game state with resolved locks

#### Test 8.10: Resolution notification
- **Input:** Resolved locks
- **Expected Output:** Players notified of outcomes
- **Edge Cases:** None
- **Description:** Should notify players of resolution outcomes

#### Test 7.11: Simultaneous requests with network delay variance
- **Input:** Requests arrive with varying network delays (0ms, 50ms, 100ms, 200ms)
- **Expected Output:** Deterministic outcome regardless of delay variance
- **Edge Cases:** Variable network delays
- **Description:** Network delay variance should not affect outcome

#### Test 7.12: Simultaneous requests with packet reordering
- **Input:** Requests arrive out of order due to network
- **Expected Output:** Deterministic outcome based on priority, not arrival order
- **Edge Cases:** Packet reordering
- **Description:** Packet reordering should not affect outcome

#### Test 7.13: Simultaneous requests during phase transition
- **Input:** Requests arrive during LOCK → RESOLVE phase transition
- **Expected Output:** Requests handled based on phase at processing time
- **Edge Cases:** Phase transition timing
- **Description:** Phase transition timing should be handled correctly

#### Test 7.14: Simultaneous requests with conflicting priorities
- **Input:** All players have equal front strength, initiative, and sequential IDs
- **Expected Output:** Lowest player ID wins
- **Edge Cases:** Complete tie
- **Description:** Complete ties should resolve to lowest ID

#### Test 7.15: Simultaneous requests with maximum claim limit
- **Input:** Players request locks exceeding claim limit
- **Expected Output:** Requests filtered or rejected
- **Edge Cases:** Claim limit
- **Description:** Should enforce claim limits

---

### 9. Invalid Player ID Format Test Cases

#### Test 9.1: Empty player ID
- **Input:** `playerId = ''`
- **Expected Output:** Should handle gracefully (reject or use default)
- **Edge Cases:** Empty string
- **Description:** Empty player ID should be handled

#### Test 9.2: Null player ID
- **Input:** `playerId = null`
- **Expected Output:** Should handle gracefully (reject or use default)
- **Edge Cases:** Null value
- **Description:** Null player ID should be handled

#### Test 9.3: Undefined player ID
- **Input:** `playerId = undefined`
- **Expected Output:** Should handle gracefully (reject or use default)
- **Edge Cases:** Undefined value
- **Description:** Undefined player ID should be handled

#### Test 9.4: Numeric player ID
- **Input:** `playerId = 123` (number instead of string)
- **Expected Output:** Should convert to string or reject
- **Edge Cases:** Wrong type
- **Description:** Numeric player ID should be handled

#### Test 9.5: Whitespace-only player ID
- **Input:** `playerId = '   '`
- **Expected Output:** Should handle gracefully (reject or trim)
- **Edge Cases:** Whitespace
- **Description:** Whitespace-only player ID should be handled

#### Test 9.6: Player ID with special characters
- **Input:** `playerId = 'P1@#$%'`
- **Expected Output:** Should handle or reject based on validation rules
- **Edge Cases:** Special characters
- **Description:** Special characters in player ID should be handled

#### Test 9.7: Player ID with spaces
- **Input:** `playerId = 'Player 1'`
- **Expected Output:** Should handle or reject based on validation rules
- **Edge Cases:** Spaces in ID
- **Description:** Spaces in player ID should be handled

#### Test 9.8: Player ID with Unicode characters
- **Input:** `playerId = '玩家1'` or `playerId = 'Игрок1'`
- **Expected Output:** Should handle Unicode correctly
- **Edge Cases:** Unicode characters
- **Description:** Unicode player IDs should be handled

#### Test 9.9: Extremely long player ID
- **Input:** `playerId = 'P' + 'a'.repeat(10000)`
- **Expected Output:** Should handle or reject based on length limits
- **Edge Cases:** Long string
- **Description:** Long player IDs should be handled

#### Test 9.10: Malformed UUID player ID
- **Input:** `playerId = 'not-a-uuid'` when UUID expected
- **Expected Output:** Should reject or handle gracefully
- **Edge Cases:** Invalid UUID
- **Description:** Invalid UUID format should be handled

#### Test 9.11: Duplicate player ID in session
- **Input:** Two players with same `playerId`
- **Expected Output:** Should detect and reject duplicate
- **Edge Cases:** Duplicate ID
- **Description:** Duplicate player IDs should be detected

#### Test 9.12: Player ID case sensitivity
- **Input:** `playerId = 'p1'` vs `playerId = 'P1'`
- **Expected Output:** Should handle based on case sensitivity rules
- **Edge Cases:** Case differences
- **Description:** Player ID case sensitivity should be consistent

#### Test 9.13: Player ID with prefix/suffix
- **Input:** `playerId = 'prefix_P1_suffix'`
- **Expected Output:** Should handle or extract base ID
- **Edge Cases:** Prefixed/suffixed ID
- **Description:** Prefixed/suffixed player IDs should be handled

#### Test 9.14: Player ID with zero padding
- **Input:** `playerId = 'P01'` vs `playerId = 'P1'`
- **Expected Output:** Should treat as different or normalize based on rules
- **Edge Cases:** Zero padding
- **Description:** Zero-padded player IDs should be handled

#### Test 9.15: Player ID validation on event receipt
- **Input:** Event with invalid player ID received
- **Expected Output:** Event rejected or player ID normalized
- **Edge Cases:** Invalid ID in event
- **Description:** Invalid player IDs in events should be handled

---

## Test Categories

### Unit Tests
- Front strength calculation
- Initiative comparison
- Player ID comparison
- Priority ordering logic
- Phase validation logic

### Integration Tests
- Full conflict resolution cycle
- Lock request processing
- Resolution phase execution
- Multi-player conflict scenarios

### Property-Based Tests
- **Determinism:** Same inputs always produce same outputs
- **Total ordering:** Priority stack produces total ordering
- **Transitivity:** If A > B and B > C, then A > C
- **Idempotency:** Repeated resolution produces same result

---

## Mock Requirements

### Game State Mocks
```typescript
const mockGameState = {
  hexOwnership: new Map<string, string>(),
  phase: 'LOCK' as Phase,
  round: 1,
  players: [
    { id: 'P1', initiative: 5 },
    { id: 'P2', initiative: 3 },
    { id: 'P3', initiative: 7 }
  ]
};
```

### Lock Request Mocks
```typescript
const mockLockRequest = {
  round: 1,
  hex: { q: 3, r: 5 },
  action: 'CLAIM',
  playerId: 'P1'
};
```

### Event Mocks
```typescript
const mockEvent = {
  id: 'evt_123',
  kind: 'HEX_LOCK_REQUEST',
  lamport: 1,
  ts: 1700000000000,
  author: {
    peerId: 'peer_abc',
    playerId: 'P1',
    name: 'Player 1'
  },
  payload: {
    round: 1,
    hex: { q: 3, r: 5 },
    action: 'CLAIM'
  }
};
```

---

## Test Data

### Sample Conflict Scenarios
```typescript
const conflictScenarios = [
  {
    description: 'Front strength wins',
    players: [
      { id: 'P1', frontStrength: 3, initiative: 1 },
      { id: 'P2', frontStrength: 1, initiative: 10 }
    ],
    expectedWinner: 'P1'
  },
  {
    description: 'Initiative wins',
    players: [
      { id: 'P1', frontStrength: 0, initiative: 5 },
      { id: 'P2', frontStrength: 0, initiative: 3 }
    ],
    expectedWinner: 'P1'
  },
  {
    description: 'Player ID wins',
    players: [
      { id: 'P1', frontStrength: 0, initiative: 0 },
      { id: 'P2', frontStrength: 0, initiative: 0 }
    ],
    expectedWinner: 'P1'
  }
];
```

### Sample Lock Requests
```typescript
const lockRequests = [
  { playerId: 'P1', hex: { q: 3, r: 5 }, round: 1 },
  { playerId: 'P2', hex: { q: 3, r: 5 }, round: 1 },
  { playerId: 'P3', hex: { q: 4, r: 6 }, round: 1 }
];
```

---

## Coverage Goals

| Metric | Target | Notes |
|--------|--------|-------|
| Line Coverage | 95%+ | All major code paths |
| Branch Coverage | 90%+ | All conditional branches |
| Function Coverage | 100% | All conflict resolution functions |
| Statement Coverage | 95%+ | All statements |

---

## Implementation Notes

### Testing Framework
- Use **Vitest** for unit tests
- Use **property-based testing** (via fast-check) for determinism tests

### Test Organization
```typescript
// Example test structure
describe('Conflict Resolution', () => {
  describe('Front Adjacency Strength', () => {
    it('should calculate strength for single adjacent hex', () => {
      // test implementation
    });
    
    it('should sum strength for multiple adjacent hexes', () => {
      // test implementation
    });
  });
  
  describe('Priority Ordering', () => {
    it('should prioritize front strength over initiative', () => {
      // test implementation
    });
    
    it('should prioritize initiative over player ID', () => {
      // test implementation
    });
  });
  
  describe('Lock Request Processing', () => {
    it('should grant single lock request', () => {
      // test implementation
    });
    
    it('should resolve simultaneous lock requests', () => {
      // test implementation
    });
  });
});
```

### Determinism Testing
- All conflict resolution must be deterministic
- Same inputs must produce same outputs on all peers
- Use property-based testing to verify determinism

---

## Related Documentation

- [INDEX.md](./INDEX.md:1) - Documentation index and cross-reference matrix
- [webrtc_event_handling_tdd_spec.md](./webrtc_event_handling_tdd_spec.md:1) - Test-driven documentation for WebRTC event handling
- [backend/connection/webrtc.md](./backend/connection/webrtc.md:1) - WebRTC connection specification
