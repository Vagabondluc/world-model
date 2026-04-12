# WebRTC Event Handling TDD Specification

**Version:** 1.0.0  
**Last Updated:** 2026-01-28  
**Reference Implementation:** [`docs/roadmap/backend/connection/webrtc.md`](./backend/connection/webrtc.md)

---

## Test Suite Overview

This test suite defines comprehensive test specifications for WebRTC-based peer-to-peer event handling in the Mappa Imperium project. The event system enables real-time multiplayer synchronization through WebRTC DataChannels with an event-sourced state management approach.

### Key Components Under Test

| Component | Purpose |
|-----------|---------|
| **Event Emission** | Broadcasting events to connected peers |
| **Event Reception** | Receiving and processing events from peers |
| **State Synchronization** | Maintaining consistent state across peers |
| **Conflict Resolution** | Handling simultaneous conflicting events |
| **Network Partition Handling** | Graceful degradation during connection issues |
| **Reconnection Scenarios** | Re-establishing connections after disconnects |

### Event Types

| Event Kind | Purpose |
|------------|---------|
| `JOIN` | Peer joining the session |
| `LEAVE` | Peer leaving the session |
| `PING/PONG` | Connection health monitoring |
| `CHAT` | Chat messages |
| `HEX_SET_OWNER` | Hex ownership changes |
| `HEX_SET_TERRAIN` | Terrain modifications |
| `NOTE_SET` | Per-hex notes |
| `PHASE_SET` | Game phase transitions |
| `HEX_LOCK_REQUEST` | Lock requests for conflict resolution |
| `CURATE_*` | Content moderation events |

---

## Test Cases

### 1. Event Emission

#### Test 1.1: Basic event emission
- **Input:** Valid event object
- **Expected Output:** Event sent to all connected peers
- **Edge Cases:** None
- **Description:** Events should be broadcast to all peers

#### Test 1.2: Event with Lamport clock
- **Input:** Event with incremented Lamport clock
- **Expected Output:** Lamport clock incremented and included
- **Edge Cases:** None
- **Description:** Each event should increment the local Lamport clock

#### Test 1.3: Event with unique ID
- **Input:** Event generation
- **Expected Output:** Event has globally unique ID (UUID v4)
- **Edge Cases:** None
- **Description:** Every event should have a unique identifier

#### Test 1.4: Event envelope structure
- **Input:** Event object
- **Expected Output:** Valid envelope with version, type, roomId, from, event
- **Edge Cases:** None
- **Description:** Events should be wrapped in proper envelope structure

#### Test 1.5: Event serialization
- **Input:** Event object
- **Expected Output:** Valid JSON string
- **Edge Cases:** None
- **Description:** Events should serialize to JSON correctly

#### Test 1.6: Event size limits
- **Input:** Large event payload
- **Expected Output:** Event sent or rejected based on size limits
- **Edge Cases:** Large payloads
- **Description:** Should handle events of various sizes

#### Test 1.7: Event emission with no peers
- **Input:** Event when no peers connected
- **Expected Output:** Event queued or logged locally
- **Edge Cases:** No connected peers
- **Description:** Should handle emission when no peers are connected

#### Test 1.8: Event emission during connection
- **Input:** Event while connection is establishing
- **Expected Output:** Event queued until connection ready
- **Edge Cases:** Connection in progress
- **Description:** Should queue events during connection establishment

---

### 2. Event Reception

#### Test 2.1: Basic event reception
- **Input:** Valid event from peer
- **Expected Output:** Event received and processed
- **Edge Cases:** None
- **Description:** Should receive and process valid events

#### Test 2.2: Event validation
- **Input:** Malformed event
- **Expected Output:** Event rejected with error
- **Edge Cases:** Invalid structure
- **Description:** Should reject malformed events

#### Test 2.3: Event from unknown peer
- **Input:** Event from peer not in session
- **Expected Output:** Event rejected or peer added
- **Edge Cases:** Unknown peer ID
- **Description:** Should handle events from unknown peers

#### Test 2.4: Duplicate event detection
- **Input:** Same event received twice
- **Expected Output:** Second instance ignored
- **Edge Cases:** Duplicate events
- **Description:** Should detect and ignore duplicate events

#### Test 2.5: Lamport clock update on receive
- **Input:** Event with Lamport clock value
- **Expected Output:** Local Lamport clock updated to max(local, received) + 1
- **Edge Cases:** None
- **Description:** Should update Lamport clock on event receipt

#### Test 2.6: Event ordering
- **Input:** Events received out of order
- **Expected Output:** Events reordered based on Lamport clock
- **Edge Cases:** Out-of-order delivery
- **Description:** Should handle out-of-order event delivery

#### Test 2.7: Event acknowledgment
- **Input:** Event received
- **Expected Output:** Acknowledgment sent to sender
- **Edge Cases:** None
- **Description:** Should acknowledge received events

#### Test 2.8: Event buffer overflow
- **Input:** Rapid burst of events
- **Expected Output:** Events buffered or oldest dropped
- **Edge Cases:** High event rate
- **Description:** Should handle event buffer overflow

---

### 3. State Synchronization

#### Test 3.1: Initial state sync
- **Input:** New peer joins
- **Expected Output:** New peer receives current state
- **Edge Cases:** None
- **Description:** New peers should receive current state

#### Test 3.2: Event replay for sync
- **Input:** Late joiner requests sync
- **Expected Output:** Missing events sent to late joiner
- **Edge Cases:** Late joiner
- **Description:** Should send missing events to late joiners

#### Test 3.3: Deterministic replay
- **Input:** Same event log on two peers
- **Expected Output:** Identical final state
- **Edge Cases:** None
- **Description:** Event replay should be deterministic

#### Test 3.4: State convergence
- **Input:** Events from multiple peers
- **Expected Output:** All peers converge to same state
- **Edge Cases:** None
- **Description:** All peers should converge to identical state

#### Test 3.5: Snapshot-based sync
- **Input:** Large event log
- **Expected Output:** Snapshot sent instead of full replay
- **Edge Cases:** Large event log
- **Description:** Should use snapshots for efficient sync

#### Test 3.6: Delta sync
- **Input:** Peer has some events
- **Expected Output:** Only missing events sent
- **Edge Cases:** Partial sync
- **Description:** Should send only delta of missing events

#### Test 3.7: Sync request validation
- **Input:** Invalid sync request
- **Expected Output:** Request rejected
- **Edge Cases:** Invalid request
- **Description:** Should validate sync requests

#### Test 3.8: Sync timeout
- **Input:** Sync operation takes too long
- **Expected Output:** Timeout and retry or fail
- **Edge Cases:** Slow sync
- **Description:** Should handle sync timeouts

---

### 4. Conflict Resolution

#### Test 4.1: Last-Write-Wins (LWW) resolution
- **Input:** Two conflicting events with different orderKeys
- **Expected Output:** Event with higher orderKey wins
- **Edge Cases:** None
- **Description:** Should resolve conflicts using LWW by orderKey

#### Test 4.2: Simultaneous event detection
- **Input:** Two events with same Lamport clock
- **Expected Output:** Resolved by peerId comparison
- **Edge Cases:** Same Lamport clock
- **Description:** Should use peerId as tiebreaker

#### Test 4.3: Append-only event handling
- **Input:** CHAT event
- **Expected Output:** Event appended, no conflict
- **Edge Cases:** None
- **Description:** Append-only events should not conflict

#### Test 4.4: Per-field conflict resolution
- **Input:** Multiple events affecting same hex
- **Expected Output:** Each field resolved independently
- **Edge Cases:** Multiple fields
- **Description:** Should resolve conflicts per field

#### Test 4.5: Event rejection
- **Input:** Invalid event (wrong phase, etc.)
- **Expected Output:** Event marked rejected, not applied
- **Edge Cases:** Invalid event
- **Description:** Should reject invalid events

#### Test 4.6: Conflict event logging
- **Input:** Conflict detected and resolved
- **Expected Output:** Conflict logged for debugging
- **Edge Cases:** None
- **Description:** Should log conflicts for debugging

#### Test 4.7: Deterministic conflict resolution
- **Input:** Same conflict on multiple peers
- **Expected Output:** Same resolution on all peers
- **Edge Cases:** None
- **Description:** Conflict resolution should be deterministic

#### Test 4.8: Conflict notification
- **Input:** User's event loses conflict
- **Expected Output:** User notified of conflict
- **Edge Cases:** User loses conflict
- **Description:** Should notify users of conflicts

---

### 5. Event Ordering

#### Test 5.1: orderKey calculation
- **Input:** Event with lamport, peerId, eventId
- **Expected Output:** Correct orderKey = (lamport, peerId, eventId)
- **Edge Cases:** None
- **Description:** Should calculate correct orderKey

#### Test 5.2: Event sorting by orderKey
- **Input:** Multiple events
- **Expected Output:** Events sorted by orderKey
- **Edge Cases:** None
- **Description:** Should sort events by orderKey

#### Test 5.3: Lamport clock monotonicity
- **Input:** Sequence of events
- **Expected Output:** Lamport clock always increases
- **Edge Cases:** None
- **Description:** Lamport clock should be monotonic

#### Test 5.4: Out-of-order event buffering
- **Input:** Event with future Lamport clock
- **Expected Output:** Event buffered until in-order
- **Edge Cases:** Future event
- **Description:** Should buffer out-of-order events

#### Test 5.5: Event queue processing
- **Input:** Buffered events
- **Expected Output:** Events processed in order
- **Edge Cases:** Multiple buffered events
- **Description:** Should process buffered events in order

#### Test 5.6: Maximum buffer size
- **Input:** Many out-of-order events
- **Expected Output:** Buffer limited to max size
- **Edge Cases:** Large buffer
- **Description:** Should limit buffer size

#### Test 5.7: Old event rejection
- **Input:** Event with old Lamport clock
- **Expected Output:** Event rejected as duplicate
- **Edge Cases:** Old event
- **Description:** Should reject events already processed

#### Test 5.8: Concurrent event ordering
- **Input:** Events from multiple peers with same Lamport
- **Expected Output:** Deterministic ordering by peerId
- **Edge Cases:** Concurrent events
- **Description:** Should order concurrent events deterministically

---

### 6. Network Partition Handling

#### Test 6.1: Detect network partition
- **Input:** Peer stops responding
- **Expected Output:** Partition detected after timeout
- **Edge Cases:** None
- **Description:** Should detect network partitions

#### Test 6.2: Graceful degradation
- **Input:** Network partition occurs
- **Expected Output:** Continue with available peers
- **Edge Cases:** Partial partition
- **Description:** Should continue with remaining peers

#### Test 6.3: Event buffering during partition
- **Input:** Events generated during partition
- **Expected Output:** Events buffered locally
- **Edge Cases:** No connectivity
- **Description:** Should buffer events during partition

#### Test 6.4: Partition recovery
- **Input:** Network restored
- **Expected Output:** Buffered events sent to recovered peers
- **Edge Cases:** Recovery
- **Description:** Should sync events after recovery

#### Test 6.5: Divergent state detection
- **Input:** Peers have diverged during partition
- **Expected Output:** Divergence detected and resolved
- **Edge Cases:** State divergence
- **Description:** Should detect and resolve state divergence

#### Test 6.6: Merge conflict resolution
- **Input:** Conflicting changes during partition
- **Expected Output:** Conflicts resolved using standard rules
- **Edge Cases:** Merge conflicts
- **Description:** Should resolve merge conflicts

#### Test 6.7: Partition timeout
- **Input:** Long partition
- **Expected Output:** Peer marked as disconnected
- **Edge Cases:** Long partition
- **Description:** Should timeout disconnected peers

#### Test 6.8: Multiple partitions
- **Input:** Network splits into multiple segments
- **Expected Output:** Each segment continues independently
- **Edge Cases:** Multiple partitions
- **Description:** Should handle multiple network segments

---

### 7. Reconnection Scenarios

#### Test 7.1: Automatic reconnection
- **Input:** Connection lost
- **Expected Output:** Attempt automatic reconnection
- **Edge Cases:** None
- **Description:** Should attempt automatic reconnection

#### Test 7.2: Reconnection with state sync
- **Input:** Peer reconnects
- **Expected Output:** State synced with current state
- **Edge Cases:** None
- **Description:** Should sync state on reconnection

#### Test 7.3: Reconnection event replay
- **Input:** Peer reconnects after missing events
- **Expected Output:** Missing events replayed
- **Edge Cases:** Missed events
- **Description:** Should replay missed events

#### Test 7.4: Reconnection with duplicate detection
- **Input:** Peer reconnects with some events
- **Expected Output:** Duplicate events detected and ignored
- **Edge Cases:** Duplicate events
- **Description:** Should handle duplicate events on reconnect

#### Test 7.5: Reconnection failure handling
- **Input:** Reconnection attempts fail
- **Expected Output:** Exponential backoff, eventual failure
- **Edge Cases:** Reconnection failure
- **Description:** Should handle reconnection failures

#### Test 7.6: Session restoration
- **Input:** Peer reconnects to same session
- **Expected Output:** Session restored with previous state
- **Edge Cases:** Session persistence
- **Description:** Should restore session on reconnect

#### Test 7.7: New session on reconnect
- **Input:** Peer reconnects to new session
- **Expected Output:** New session joined
- **Edge Cases:** Session change
- **Description:** Should handle new session on reconnect

#### Test 7.8: Reconnection with role preservation
- **Input:** Player reconnects
- **Expected Output:** Player role preserved
- **Edge Cases:** Role preservation
- **Description:** Should preserve player role on reconnect

---

### 8. Specific Event Types

#### Test 8.1: JOIN event handling
- **Input:** JOIN event from new peer
- **Expected Output:** Peer added to session
- **Edge Cases:** None
- **Description:** Should handle JOIN events

#### Test 8.2: LEAVE event handling
- **Input:** LEAVE event from peer
- **Expected Output:** Peer removed from session
- **Edge Cases:** None
- **Description:** Should handle LEAVE events

#### Test 8.3: PING/PONG handling
- **Input:** PING event
- **Expected Output:** PONG response sent
- **Edge Cases:** None
- **Description:** Should handle keepalive events

#### Test 8.4: CHAT event handling
- **Input:** CHAT event
- **Expected Output:** Chat message displayed
- **Edge Cases:** None
- **Description:** Should handle chat events

#### Test 8.5: HEX_SET_OWNER handling
- **Input:** HEX_SET_OWNER event
- **Expected Output:** Hex ownership updated
- **Edge Cases:** Conflict with other event
- **Description:** Should handle hex ownership events

#### Test 8.6: HEX_SET_TERRAIN handling
- **Input:** HEX_SET_TERRAIN event
- **Expected Output:** Terrain updated
- **Edge Cases:** LWW conflict
- **Description:** Should handle terrain events

#### Test 8.7: NOTE_SET handling
- **Input:** NOTE_SET event
- **Expected Output:** Note added/updated
- **Edge Cases:** LWW conflict
- **Description:** Should handle note events

#### Test 8.8: PHASE_SET handling
- **Input:** PHASE_SET event
- **Expected Output:** Game phase updated
- **Edge Cases:** Invalid phase
- **Description:** Should handle phase events

#### Test 8.9: HEX_LOCK_REQUEST handling
- **Input:** HEX_LOCK_REQUEST event
- **Expected Output:** Lock request recorded
- **Edge Cases:** Multiple requests for same hex
- **Description:** Should handle lock requests

#### Test 8.10: CURATE_* event handling
- **Input:** Curation event
- **Expected Output:** Content curation applied
- **Edge Cases:** Unauthorized curation
- **Description:** Should handle curation events

---

### 9. Security and Validation

#### Test 9.1: Event signature validation
- **Input:** Event with signature
- **Expected Output:** Signature validated
- **Edge Cases:** Invalid signature
- **Description:** Should validate event signatures

#### Test 9.2: Room ID validation
- **Input:** Event with wrong room ID
- **Expected Output:** Event rejected
- **Edge Cases:** Wrong room
- **Description:** Should validate room ID

#### Test 9.3: Peer authorization
- **Input:** Event from unauthorized peer
- **Expected Output:** Event rejected
- **Edge Cases:** Unauthorized peer
- **Description:** Should authorize peers

#### Test 9.4: Event rate limiting
- **Input:** Rapid events from peer
- **Expected Output:** Rate limit enforced
- **Edge Cases:** High event rate
- **Description:** Should rate limit events

#### Test 9.5: Malicious payload detection
- **Input:** Event with malicious content
- **Expected Output:** Event rejected
- **Edge Cases:** Malicious content
- **Description:** Should detect malicious payloads

#### Test 9.6: Size limit enforcement
- **Input:** Oversized event
- **Expected Output:** Event rejected
- **Edge Cases:** Large event
- **Description:** Should enforce size limits

#### Test 9.7: Malformed event payload detection
- **Input:** Event with malformed JSON structure
- **Expected Output:** Event rejected with error
- **Edge Cases:** Malformed JSON
- **Description:** Should detect malformed event payloads

#### Test 9.8: Oversized event payload handling
- **Input:** Event with payload exceeding size limit (e.g., 10MB)
- **Expected Output:** Event rejected
- **Edge Cases:** Oversized payload
- **Description:** Should reject oversized event payloads

#### Test 9.9: Rapid event burst handling
- **Input:** 100 events sent in rapid succession
- **Expected Output:** Events queued or rate-limited appropriately
- **Edge Cases:** High event rate
- **Description:** Should handle rapid event bursts

---

### 10. Performance Tests for Event Throughput

#### Test 10.1: Single peer event throughput
- **Input:** Send 1,000 events from single peer
- **Expected Output:** All events processed within 5 seconds
- **Edge Cases:** High volume from single peer
- **Description:** Should handle high throughput from single peer

#### Test 10.2: Multiple peer event throughput
- **Input:** 6 peers each send 200 events simultaneously
- **Expected Output:** All events processed within 10 seconds
- **Edge Cases:** Concurrent high volume
- **Description:** Should handle concurrent throughput from multiple peers

#### Test 10.3: Event serialization performance
- **Input:** Serialize 10,000 events
- **Expected Output:** Complete within 1 second
- **Edge Cases:** Bulk serialization
- **Description:** Event serialization should be performant

#### Test 10.4: Event deserialization performance
- **Input:** Deserialize 10,000 events
- **Expected Output:** Complete within 1 second
- **Edge Cases:** Bulk deserialization
- **Description:** Event deserialization should be performant

#### Test 10.5: Lamport clock update performance
- **Input:** Update Lamport clock 100,000 times
- **Expected Output:** Complete within 100ms
- **Edge Cases:** High-frequency updates
- **Description:** Lamport clock updates should be very fast

#### Test 10.6: Event ordering performance
- **Input:** Sort 10,000 events by orderKey
- **Expected Output:** Complete within 500ms
- **Edge Cases:** Large event log
- **Description:** Event ordering should be efficient

#### Test 10.7: Conflict resolution performance
- **Input:** Resolve 1,000 conflicting events
- **Expected Output:** Complete within 1 second
- **Edge Cases:** Many conflicts
- **Description:** Conflict resolution should be performant

#### Test 10.8: State sync performance
- **Input:** Sync state with 1,000 events
- **Expected Output:** Complete within 2 seconds
- **Edge Cases:** Large event log
- **Description:** State synchronization should be efficient

---

### 11. Memory Leak Tests

#### Test 11.1: Short session memory usage
- **Input:** Run session with 100 events for 1 minute
- **Expected Output:** Memory usage stable, no leaks
- **Edge Cases:** Short session
- **Description:** Short sessions should not leak memory

#### Test 11.2: Long session memory usage
- **Input:** Run session with 10,000 events for 30 minutes
- **Expected Output:** Memory usage stable, no leaks
- **Edge Cases:** Long session
- **Description:** Long sessions should not leak memory

#### Test 11.3: Peer connection memory leak
- **Input:** Connect and disconnect 100 peers sequentially
- **Expected Output:** Memory usage returns to baseline after each disconnect
- **Edge Cases:** Repeated connections
- **Description:** Peer connections should not leak memory

#### Test 11.4: Event buffer memory leak
- **Input:** Buffer 10,000 events, then clear
- **Expected Output:** Memory usage returns to baseline
- **Edge Cases:** Large buffer
- **Description:** Event buffers should not leak memory

#### Test 11.5: Event listener memory leak
- **Input:** Add and remove 1,000 event listeners
- **Expected Output:** Memory usage stable
- **Edge Cases:** Many listeners
- **Description:** Event listeners should not leak memory

#### Test 11.6: Snapshot memory leak
- **Input:** Create and discard 100 snapshots
- **Expected Output:** Memory usage stable
- **Edge Cases:** Many snapshots
- **Description:** Snapshots should not leak memory

#### Test 11.7: Out-of-order buffer memory leak
- **Input:** Buffer 1,000 out-of-order events, then process
- **Expected Output:** Memory returns to baseline after processing
- **Edge Cases:** Out-of-order buffer
- **Description:** Out-of-order buffers should not leak memory

#### Test 11.8: Reconnection memory leak
- **Input:** Simulate 50 connection loss and recovery cycles
- **Expected Output:** Memory usage stable
- **Edge Cases:** Repeated reconnections
- **Description:** Reconnections should not leak memory

---

### 12. Network Partition Recovery Tests

#### Test 12.1: Short partition recovery
- **Input:** Simulate 5-second network partition
- **Expected Output:** All peers reconnect and sync successfully
- **Edge Cases:** Short partition
- **Description:** Should recover from short partitions

#### Test 12.2: Long partition recovery
- **Input:** Simulate 5-minute network partition
- **Expected Output:** All peers reconnect and sync using snapshots
- **Edge Cases:** Long partition
- **Description:** Should recover from long partitions

#### Test 12.3: Partial partition recovery
- **Input:** Network splits into 3 segments, then rejoins
- **Expected Output:** All segments converge to same state
- **Edge Cases:** Multiple segments
- **Description:** Should recover from partial partitions

#### Test 12.4: Partition during event burst
- **Input:** Partition occurs while 100 events are being processed
- **Expected Output:** Events buffered during partition, synced on recovery
- **Edge Cases:** Partition during high activity
- **Description:** Should handle partition during event bursts

#### Test 12.5: Partition with state divergence
- **Input:** Peers make conflicting changes during partition
- **Expected Output:** Conflicts resolved using standard rules on reconnection
- **Edge Cases:** Divergent state
- **Description:** Should resolve divergent states on recovery

#### Test 12.6: Partition recovery with missing events
- **Input:** Some events lost during partition
- **Expected Output:** Missing events detected and requested from peers
- **Edge Cases:** Data loss
- **Description:** Should detect and recover missing events

#### Test 12.7: Partition recovery with duplicate events
- **Input:** Duplicate events sent during recovery
- **Expected Output:** Duplicates detected and ignored
- **Edge Cases:** Duplicate data
- **Description:** Should handle duplicate events during recovery

#### Test 12.8: Multiple consecutive partitions
- **Input:** Simulate 5 consecutive 30-second partitions
- **Expected Output:** Each partition recovered successfully
- **Edge Cases:** Repeated partitions
- **Description:** Should handle multiple consecutive partitions

#### Test 12.9: Partition recovery timeout
- **Input:** Partition exceeds recovery timeout threshold
- **Expected Output:** Peers marked as disconnected, session may be terminated
- **Edge Cases:** Timeout
- **Description:** Should handle partition recovery timeout

#### Test 12.10: Partition recovery with role preservation
- **Input:** Players have roles during partition
- **Expected Output:** Roles preserved after recovery
- **Edge Cases:** Role preservation
- **Description:** Should preserve player roles through partition recovery

---

## Test Categories

### Unit Tests
- Event serialization/deserialization
- orderKey calculation
- Lamport clock operations
- Event validation logic
- Conflict resolution logic

### Integration Tests
- Full event emission and reception cycle
- State synchronization across peers
- Network partition and recovery
- Reconnection scenarios

### End-to-End Tests
- Multi-peer session with events
- Late joiner sync
- Conflict resolution in real scenario
- Network partition and recovery

---

## Mock Requirements

### WebRTC Mocks
```typescript
// Mock RTCPeerConnection
const mockPeerConnection = {
  createDataChannel: vi.fn(),
  createOffer: vi.fn(),
  createAnswer: vi.fn(),
  setLocalDescription: vi.fn(),
  setRemoteDescription: vi.fn(),
  addIceCandidate: vi.fn(),
  close: vi.fn(),
};

// Mock RTCDataChannel
const mockDataChannel = {
  send: vi.fn(),
  close: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};
```

### Network Mocks
```typescript
// Mock network conditions
const mockNetwork = {
  latency: 0,
  packetLoss: 0,
  partition: false,
  simulatePartition: () => {},
  simulateRecovery: () => {},
};
```

### Storage Mocks
```typescript
// Mock event storage
const mockEventStorage = {
  append: vi.fn(),
  getRange: vi.fn(),
  getSnapshot: vi.fn(),
  saveSnapshot: vi.fn(),
};
```

---

## Test Data

### Sample Event Objects
```typescript
const joinEvent = {
  id: 'evt_123',
  kind: 'JOIN',
  lamport: 1,
  ts: 1700000000000,
  author: {
    peerId: 'peer_abc',
    playerId: 'P1',
    name: 'Player 1'
  },
  payload: {
    capabilities: ['webrtc', 'chat', 'hexmap'],
    client: { app: 'hexmap', ver: '0.1.0', platform: 'tauri' }
  }
};

const chatEvent = {
  id: 'evt_456',
  kind: 'CHAT',
  lamport: 2,
  ts: 1700000001000,
  author: {
    peerId: 'peer_abc',
    playerId: 'P1',
    name: 'Player 1'
  },
  payload: {
    channel: 'global',
    text: 'Hello world!',
    replyTo: null,
    tags: []
  }
};

const hexSetOwnerEvent = {
  id: 'evt_789',
  kind: 'HEX_SET_OWNER',
  lamport: 3,
  ts: 1700000002000,
  author: {
    peerId: 'peer_abc',
    playerId: 'P1',
    name: 'Player 1'
  },
  payload: {
    hex: { q: 3, r: 5 },
    owner: 'P1',
    reason: 'claim'
  }
};
```

### Sample Peer Configurations
```typescript
const peerConfigs = [
  { peerId: 'peer_abc', playerId: 'P1', name: 'Player 1' },
  { peerId: 'peer_def', playerId: 'P2', name: 'Player 2' },
  { peerId: 'peer_ghi', playerId: 'P3', name: 'Player 3' },
];
```

---

## Coverage Goals

| Metric | Target | Notes |
|--------|--------|-------|
| Line Coverage | 90%+ | All major code paths |
| Branch Coverage | 85%+ | All conditional branches |
| Function Coverage | 100% | All event handlers |
| Statement Coverage | 90%+ | All statements |

---

## Implementation Notes

### Testing Framework
- Use **Vitest** for unit tests
- Use **MSW (Mock Service Worker)** for network mocking
- Use **fake-timers** for timing-related tests

### WebRTC Testing
- WebRTC APIs are browser-specific and require special handling
- Use mock implementations for RTCPeerConnection and RTCDataChannel
- Consider using a test harness that simulates peer behavior

### Test Organization
```typescript
// Example test structure
describe('WebRTC Event Handling', () => {
  describe('Event Emission', () => {
    it('should broadcast events to all peers', () => {
      // test implementation
    });
    
    it('should increment Lamport clock', () => {
      // test implementation
    });
  });
  
  describe('Event Reception', () => {
    it('should receive and process valid events', () => {
      // test implementation
    });
    
    it('should reject malformed events', () => {
      // test implementation
    });
  });
  
  describe('State Synchronization', () => {
    it('should sync new peer with current state', () => {
      // test implementation
    });
    
    it('should converge state across all peers', () => {
      // test implementation
    });
  });
});
```

### Performance Considerations
- E2E tests with multiple peers should be marked as slow
- Use smaller event logs for quick unit tests
- Consider parallel test execution where possible

---

## Related Documentation

- [INDEX.md](./INDEX.md:1) - Documentation index and cross-reference matrix
- [conflict_resolution_tdd_spec.md](./conflict_resolution_tdd_spec.md:1) - Test-driven documentation for conflict resolution
- [backend/connection/webrtc.md](./backend/connection/webrtc.md:1) - WebRTC connection specification
- [wireframes/connection_lobby_flow_wireframe.md](./wireframes/connection_lobby_flow_wireframe.md:1) - Wireframe mockup for connection lobby flow
