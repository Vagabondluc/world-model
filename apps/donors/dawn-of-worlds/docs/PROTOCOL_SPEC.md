# Protocol Specification

This document describes the WebSocket wire protocol for Dawn of Worlds multiplayer communication.

## Table of Contents

- [Overview](#overview)
- [Wire Format](#wire-format)
- [Message Types](#message-types)
- [Error Codes](#error-codes)
- [Message Flow](#message-flow)
- [Sequence Examples](#sequence-examples)

## Overview

The protocol is a JSON-based WebSocket protocol with:

- **Client-to-Server (C2S)** messages for client requests
- **Server-to-Client (S2C)** messages for server responses and broadcasts
- **Sequence numbers** for ordering and gap detection
- **Rolling hashes** for integrity verification

All messages are UTF-8 encoded JSON.

## Wire Format

### Message Envelope

Every message has a `t` (type) field that identifies its kind:

```ts
type Message = C2S | S2C;
```

### Client → Server (C2S)

```ts
type C2S =
  | { t: "HELLO"; room: string; playerId: string; clientVersion: string }
  | { t: "PULL"; room: string; sinceSeq: number }
  | { t: "PUSH_EVENT"; room: string; event: GameEvent; prevHash?: string };
```

### Server → Client (S2C)

```ts
type S2C =
  | { t: "WELCOME"; room: string; serverTime: number; seq: number; hash: string; age?: number; round?: number; turn?: number; activePlayerId?: string; apRemaining?: number }
  | { t: "EVENT"; room: string; seq: number; event: GameEvent; hash: string }
  | { t: "BATCH"; room: string; fromSeq: number; toSeq: number; events: Array<{ seq: number; event: GameEvent; hash: string }> }
  | { t: "ERROR"; code: string; message: string; details?: ErrorDetails };
```

## Message Types

### HELLO

Client joins a room.

**Direction:** Client → Server

```json
{
  "t": "HELLO",
  "room": "game-room-1",
  "playerId": "player-123",
  "clientVersion": "mappa-ws.v1"
}
```

**Fields:**

| Field | Type | Required | Description |
|-------|--------|----------|------------|
| `t` | string | Yes | Must be "HELLO" |
| `room` | string | Yes | Room identifier to join |
| `playerId` | string | Yes | Unique player identifier |
| `clientVersion` | string | Yes | Client protocol version |

**Server Response:** `WELCOME` or `ERROR`

### WELCOME

Server acknowledges client connection and provides initial state.

**Direction:** Server → Client

```json
{
  "t": "WELCOME",
  "room": "game-room-1",
  "serverTime": 1700000000000,
  "seq": 42,
  "hash": "abc123...",
  "age": 1,
  "round": 3,
  "turn": 2,
  "activePlayerId": "player-456",
  "apRemaining": 3
}
```

**Fields:**

| Field | Type | Required | Description |
|-------|--------|----------|------------|
| `t` | string | Yes | Must be "WELCOME" |
| `room` | string | Yes | Room identifier |
| `serverTime` | number | Yes | Server timestamp (ms since epoch) |
| `seq` | number | Yes | Latest event sequence number |
| `hash` | string | Yes | Rolling hash of event log |
| `age` | number | No | Current game age |
| `round` | number | No | Current round within age |
| `turn` | number | No | Current turn within round |
| `activePlayerId` | string | No | Current active player |
| `apRemaining` | number | No | AP remaining for active player |

### PULL

Client requests missing events after a gap.

**Direction:** Client → Server

```json
{
  "t": "PULL",
  "room": "game-room-1",
  "sinceSeq": 42
}
```

**Fields:**

| Field | Type | Required | Description |
|-------|--------|----------|------------|
| `t` | string | Yes | Must be "PULL" |
| `room` | string | Yes | Room identifier |
| `sinceSeq` | number | No | Last sequence number client has (default 0) |

**Server Response:** `BATCH`

### BATCH

Server sends multiple events in response to `PULL`.

**Direction:** Server → Client

```json
{
  "t": "BATCH",
  "room": "game-room-1",
  "fromSeq": 43,
  "toSeq": 47,
  "events": [
    { "seq": 43, "event": {...}, "hash": "..." },
    { "seq": 44, "event": {...}, "hash": "..." },
    { "seq": 45, "event": {...}, "hash": "..." },
    { "seq": 46, "event": {...}, "hash": "..." },
    { "seq": 47, "event": {...}, "hash": "..." }
  ]
}
```

**Fields:**

| Field | Type | Required | Description |
|-------|--------|----------|------------|
| `t` | string | Yes | Must be "BATCH" |
| `room` | string | Yes | Room identifier |
| `fromSeq` | number | Yes | First sequence number in batch |
| `toSeq` | number | Yes | Last sequence number in batch |
| `events` | array | Yes | Array of event entries |

### PUSH_EVENT

Client submits a new event to the server.

**Direction:** Client → Server

```json
{
  "t": "PUSH_EVENT",
  "room": "game-room-1",
  "event": {
    "id": "evt-uuid",
    "ts": 1700000000000,
    "playerId": "player-123",
    "age": 1,
    "round": 3,
    "turn": 2,
    "type": "WORLD_CREATE",
    "cost": 2,
    "payload": { ... }
  },
  "prevHash": "abc123..."
}
```

**Fields:**

| Field | Type | Required | Description |
|-------|--------|----------|------------|
| `t` | string | Yes | Must be "PUSH_EVENT" |
| `room` | string | Yes | Room identifier |
| `event` | GameEvent | Yes | The event to submit |
| `prevHash` | string | No | Client's last hash (for verification) |

**Server Response:** `EVENT` or `ERROR`

### EVENT

Server broadcasts a single event to all clients.

**Direction:** Server → Client

```json
{
  "t": "EVENT",
  "room": "game-room-1",
  "seq": 48,
  "event": {
    "id": "evt-uuid",
    "ts": 1700000000000,
    "playerId": "player-123",
    "age": 1,
    "round": 3,
    "turn": 2,
    "type": "WORLD_CREATE",
    "cost": 2,
    "payload": { ... }
  },
  "hash": "def456..."
}
```

**Fields:**

| Field | Type | Required | Description |
|-------|--------|----------|------------|
| `t` | string | Yes | Must be "EVENT" |
| `room` | string | Yes | Room identifier |
| `seq` | number | Yes | Server-assigned sequence number |
| `event` | GameEvent | Yes | The event |
| `hash` | string | Yes | Rolling hash after this event |

### ERROR

Server sends an error message to a client.

**Direction:** Server → Client

```json
{
  "t": "ERROR",
  "code": "NOT_YOUR_TURN",
  "message": "Not your turn. Active player is player-456.",
  "details": {
    "kind": "TURN_OWNERSHIP",
    "activePlayerId": "player-456"
  }
}
```

**Fields:**

| Field | Type | Required | Description |
|-------|--------|----------|------------|
| `t` | string | Yes | Must be "ERROR" |
| `code` | string | Yes | Error code (see Error Codes) |
| `message` | string | Yes | Human-readable error message |
| `details` | ErrorDetails | No | Structured error details |

## Error Codes

### Error Code Enumeration

| Code | Description | Details Kind |
|-------|-------------|--------------|
| `BAD_JSON` | Invalid JSON in message | N/A |
| `BAD_HELLO` | Missing required fields in HELLO | N/A |
| `NOT_JOINED` | Client sent message before HELLO | N/A |
| `BAD_EVENT` | Invalid event structure | N/A |
| `UNKNOWN` | Unknown message type | N/A |
| `NOT_YOUR_TURN` | Client not active player | `TURN_OWNERSHIP` |
| `BAD_COORDS` | Event coordinates don't match server | `BAD_COORDS` |
| `NO_AP` | Not enough AP for event | `AP_INSUFFICIENT` |
| `PROTECTED` | Target is protected until end of round | `PROTECTED_UNTIL_END_OF_ROUND` |
| `ILLEGAL_ACTION` | Action violates game rules | Various |
| `TURN_EMPTY` | Turn ended without any action | N/A |
| `AGE_PROPOSE_INVALID` | Cannot propose age advance | Various |
| `BAD_VOTE` | Invalid vote payload | N/A |
| `VOTE_NO_PROPOSAL` | Vote references non-existent proposal | N/A |
| `VOTE_STALE` | Vote on stale proposal | N/A |
| `TYPE_NOT_ALLOWED` | Event type not allowed in current state | N/A |
| `BAD_PLAYER` | Event playerId doesn't match sender | N/A |
| `BAD_REVOKE` | Invalid revoke payload | N/A |
| `CITY_NEEDS_RACE` | City requires race at hex | `HEX_DEPENDENCY_MISSING` |
| `AGE_FORBIDDEN` | Kind not allowed in current age | `AGE_FORBIDDEN` |

### Error Details Schema

```ts
type ErrorDetails =
  | {
      kind: "HEX_REQUIRED";
      expected: number;
      actual: number;
    }
  | {
      kind: "HEX_DEPENDENCY_MISSING";
      requiredKind: WorldKind;
      hex: { q: number; r: number };
    }
  | {
      kind: "WORLD_DEPENDENCY_MISSING";
      requiredKind: WorldKind;
      worldId?: string;
    }
  | {
      kind: "AGE_FORBIDDEN";
      age: number;
      kindAttempted: WorldKind;
    }
  | {
      kind: "PROTECTED_UNTIL_END_OF_ROUND";
      worldId: string;
      createdBy: string;
      createdRound: number;
    }
  | {
      kind: "AP_INSUFFICIENT";
      remaining: number;
      required: number;
    }
  | {
      kind: "TURN_OWNERSHIP";
      activePlayerId: string;
    }
  | {
      kind: "BAD_COORDS";
      expected: { age: number; round: number; turn: number };
      received: { age: number; round: number; turn: number };
    };
```

## Message Flow

### Connection Flow

```
Client                    Server
  |                          |
  |------- HELLO ----------->|
  |<----- WELCOME ---------|
  |                          |
  |----- PULL (seq 0) -->|
  |<----- BATCH (1-42) -----|
  |                          |
```

### Event Submission Flow

```
Client                    Server                    All Clients
  |                          |                              |
  |----- PUSH_EVENT --------->|                              |
  |                          |--- validate ---|
  |                          |--- broadcast --->|
  |<----- EVENT (seq 43) --|                              |
  |                          |                              |
  |                          |--- EVENT (seq 43) ------->|
  |                          |                              |
```

### Gap Detection Flow

```
Client                    Server
  |                          |
  |<--- EVENT (seq 44) ---|
  |<--- EVENT (seq 46) ---| (gap detected!)
  |                          |
  |----- PULL (seq 44) --->|
  |<----- BATCH (45-46) ----|
  |                          |
```

### Reconnection Flow

```
Client                    Server
  |                          |
  |--- disconnect ------------|
  |                          |
  |------- HELLO ----------->|
  |<----- WELCOME ---------|
  |----- PULL (seq 46) -->|
  |<----- BATCH (47-50) ----|
  |                          |
```

## Sequence Examples

### Example 1: First Player Joins

```json
// Client → Server
{
  "t": "HELLO",
  "room": "game-1",
  "playerId": "alice",
  "clientVersion": "mappa-ws.v1"
}

// Server → Client
{
  "t": "WELCOME",
  "room": "game-1",
  "serverTime": 1700000000000,
  "seq": 0,
  "hash": "GENESIS",
  "age": 1,
  "round": 1,
  "turn": 1,
  "activePlayerId": "alice",
  "apRemaining": 5
}
```

### Example 2: Submit World Event

```json
// Client → Server
{
  "t": "PUSH_EVENT",
  "room": "game-1",
  "event": {
    "id": "evt-001",
    "ts": 1700000001000,
    "playerId": "alice",
    "age": 1,
    "round": 1,
    "turn": 1,
    "type": "WORLD_CREATE",
    "cost": 2,
    "payload": {
      "worldId": "obj-001",
      "kind": "TERRAIN",
      "hexes": [{"q": 0, "r": 0}]
    }
  }
}

// Server → Client (broadcast)
{
  "t": "EVENT",
  "room": "game-1",
  "seq": 1,
  "event": {
    "id": "evt-001",
    "ts": 1700000001000,
    "playerId": "alice",
    "age": 1,
    "round": 1,
    "turn": 1,
    "type": "WORLD_CREATE",
    "cost": 2,
    "payload": {
      "worldId": "obj-001",
      "kind": "TERRAIN",
      "hexes": [{"q": 0, "r": 0}]
    }
  },
  "hash": "hash-001"
}
```

### Example 3: Error Response

```json
// Client → Server
{
  "t": "PUSH_EVENT",
  "room": "game-1",
  "event": {
    "id": "evt-002",
    "ts": 1700000002000,
    "playerId": "bob",
    "age": 1,
    "round": 1,
    "turn": 1,
    "type": "WORLD_CREATE",
    "cost": 2,
    "payload": {
      "worldId": "obj-002",
      "kind": "TERRAIN",
      "hexes": [{"q": 1, "r": 0}]
    }
  }
}

// Server → Client (error)
{
  "t": "ERROR",
  "code": "NOT_YOUR_TURN",
  "message": "Not your turn. Active player is alice.",
  "details": {
    "kind": "TURN_OWNERSHIP",
    "activePlayerId": "alice"
  }
}
```

### Example 4: Gap Recovery

```json
// Client detects gap (received seq 3, then seq 5)
{
  "t": "PULL",
  "room": "game-1",
  "sinceSeq": 3
}

// Server → Client
{
  "t": "BATCH",
  "room": "game-1",
  "fromSeq": 4,
  "toSeq": 4,
  "events": [
    {
      "seq": 4,
      "event": { ... },
      "hash": "hash-004"
    }
  ]
}
```

## Hash Computation

The rolling hash ensures integrity of the event log:

```js
function nextHash(prevHash, seq, event) {
  const h = crypto.createHash("sha256");
  h.update(prevHash);
  h.update(String(seq));
  h.update(stableStringify(event));
  return h.digest("hex");
}
```

- Initial hash: `"GENESIS"`
- Each event: `H(prevHash + seq + eventJson)`
- All clients can verify hash consistency

## Client-Side Deduplication

Clients should maintain a `seenEventIds` set:

```ts
const seenEventIds = new Set<string>();

function handleEvent(msg: S2C) {
  if (msg.t === "EVENT") {
    if (!seenEventIds.has(msg.event.id)) {
      seenEventIds.add(msg.event.id);
      dispatch({ type: "DISPATCH_EVENT", event: msg.event });
    }
  }
}
```

This prevents duplicate processing on reconnection.

## See Also

- [SERVER_IMPLEMENTATION.md](SERVER_IMPLEMENTATION.md) — Server-side message handling
- [ARCHITECTURE.md](ARCHITECTURE.md) — System architecture
- [API_REFERENCE.md](API_REFERENCE.md) — Complete type definitions
