# Server Implementation

This document describes the WebSocket server implementation for Dawn of Worlds, including room management, validation, and event broadcasting.

## Table of Contents

- [Server Overview](#server-overview)
- [Room State](#room-state)
- [Server Setup](#server-setup)
- [Message Handling](#message-handling)
- [Validation Layer](#validation-layer)
- [Event Broadcasting](#event-broadcasting)
- [Canonical Cost Computation](#canonical-cost-computation)
- [Action Legality Validation](#action-legality-validation)

## Server Overview

The WebSocket server is the single source of truth for multiplayer games. It:

- Manages rooms with independent game sessions
- Validates all incoming events
- Enforces turn ownership, AP budgets, and protection rules
- Computes canonical costs (ignoring client values)
- Broadcasts events to all connected clients

### Dependencies

```bash
npm install ws
```

### Basic Server Structure

```js
import { WebSocketServer } from "ws";
import crypto from "crypto";

const wss = new WebSocketServer({ port: 8787 });

console.log("WS server on ws://localhost:8787");
```

## Room State

Each room maintains authoritative game state:

```js
function getRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      seq: 0,
      hash: "GENESIS",
      log: [],
      clients: new Set(),

      players: [],
      activeIndex: 0,

      age: 1,
      round: 1,
      turn: 1,

      revoked: new Set(),
      settings: DEFAULT_SETTINGS,

      worldIndex: new Map(),
      hexIndex: new Map(),
    });
  }
  return rooms.get(roomId);
}

const DEFAULT_SETTINGS = {
  apByAge: { 1: 5, 2: 5, 3: 5 },

  turnRules: {
    requireActionBeforeTurnEnd: true,
    revokeCountsAsAction: false,
  },

  ageRules: {
    minRoundsByAge: { 1: 1, 2: 1, 3: 1 },
    requireAllPlayersActedToAdvance: true,
    voteThreshold: "UNANIMOUS",
  },

  social: {
    protectedUntilEndOfRound: false,
    alterationCost: {
      enabled: false,
      modifyOthersBasePlus: 1,
      modifyOthersNamedPlus: 2,
      namedKinds: ["LANDMARK", "SETTLEMENT", "NATION"],
    },
  },
};
```

## Server Setup

### Connection Handler

```js
wss.on("connection", (ws) => {
  ws.meta = { room: null, playerId: null };

  ws.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return send(ws, {
        t: "ERROR",
        code: "BAD_JSON",
        message: "Invalid JSON"
      });
    }

    handleMessage(ws, msg);
  });

  ws.on("close", () => {
    const roomId = ws.meta.room;
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (!room) return;
    room.clients.delete(ws);
  });
});
```

### Helper Functions

```js
function stableStringify(obj) {
  return JSON.stringify(obj);
}

function nextHash(prevHash, seq, event) {
  const h = crypto.createHash("sha256");
  h.update(prevHash);
  h.update(String(seq));
  h.update(stableStringify(event));
  return h.digest("hex");
}

function send(ws, msg) {
  ws.send(JSON.stringify(msg));
}

function broadcast(room, msg) {
  for (const client of room.clients) {
    if (client.readyState === 1) send(client, msg);
  }
}

function hexKey(h) {
  return `${h.q},${h.r}`;
}

function ensureSet(map, key) {
  let s = map.get(key);
  if (!s) { s = new Set(); map.set(key, s); }
  return s;
}
```

## Message Handling

### HELLO Message

Client joins a room:

```js
if (msg.t === "HELLO") {
  const { room: roomId, playerId } = msg;
  if (!roomId || !playerId) {
    return send(ws, {
      t: "ERROR",
      code: "BAD_HELLO",
      message: "room + playerId required"
    });
  }

  const room = getRoom(roomId);

  ws.meta.room = roomId;
  ws.meta.playerId = playerId;
  room.clients.add(ws);

  // Register player in turn order if new
  if (!room.players.includes(playerId)) {
    room.players.push(playerId);
  }

  // First player: initialize turn
  if (room.players.length === 1 && room.log.length === 0) {
    const evt = serverEvent(room, room.players[0], {
      type: "TURN_BEGIN",
      payload: { playerId: room.players[0] },
    });
    appendLogAndBroadcast(room, roomId, evt);
  }

  return send(ws, {
    t: "WELCOME",
    room: roomId,
    serverTime: Date.now(),
    seq: room.seq,
    hash: room.hash,
    age: room.age,
    round: room.round,
    turn: room.turn,
    activePlayerId: room.players[room.activeIndex] ?? null,
    apRemaining: selectApRemaining(room),
  });
}
```

### PULL Message

Client requests missing events:

```js
if (msg.t === "PULL") {
  const sinceSeq = Number(msg.sinceSeq ?? 0);
  const fromIdx = room.log.findIndex(e => e.seq > sinceSeq);
  const slice = fromIdx === -1 ? [] : room.log.slice(fromIdx);

  return send(ws, {
    t: "BATCH",
    room: ws.meta.room,
    fromSeq: sinceSeq + 1,
    toSeq: slice.length ? slice[slice.length - 1].seq : sinceSeq,
    events: slice.map(x => ({ seq: x.seq, event: x.event, hash: x.hash })),
  });
}
```

### PUSH_EVENT Message

Client submits a new event:

```js
if (msg.t === "PUSH_EVENT") {
  const event = msg.event;

  if (!event || !event.id || !event.type) {
    return send(ws, {
      t: "ERROR",
      code: "BAD_EVENT",
      message: "event with id + type required"
    });
  }

  // Validation pipeline
  const own = validateTurnOwnership(room, playerId);
  if (!own.ok) {
    return sendError(ws, "NOT_YOUR_TURN", own.message, {
      kind: "TURN_OWNERSHIP",
      activePlayerId: room.players[room.activeIndex],
    });
  }

  const coord = validateEventCoordinates(room, event);
  if (!coord.ok) {
    return sendError(ws, "BAD_COORDS", coord.message, {
      kind: "BAD_COORDS",
      expected: { age: room.age, round: room.round, turn: room.turn },
      received: { age: event.age, round: event.round, turn: event.turn },
    });
  }

  const prot = validateProtectionRule(room, event);
  if (!prot.ok) {
    const target = room.worldIndex.get(event.payload.worldId);
    return sendError(ws, "PROTECTED", prot.message, {
      kind: "PROTECTED_UNTIL_END_OF_ROUND",
      worldId: event.payload.worldId,
      createdBy: target.createdBy,
      createdRound: target.createdRound,
    });
  }

  const legal = validateActionLegality(room, event);
  if (!legal.ok) {
    return sendError(ws, "ILLEGAL_ACTION", legal.message, legal.details);
  }

  // Compute authoritative cost
  event.cost = authoritativeCost(room, event);

  const ap = validateApBudget(room, event);
  if (!ap.ok) {
    return sendError(ws, "NO_AP", ap.message, {
      kind: "AP_INSUFFICIENT",
      required: event.cost,
      remaining: selectApRemaining(room),
    });
  }

  // Accept and broadcast
  appendLogAndBroadcast(room, roomId, event);
  applyWorldEvent(room, event);

  // Handle TURN_END
  if (event.type === "TURN_END") {
    advanceTurn(room);
    const nextPlayer = room.players[room.activeIndex];
    const begin = serverEvent(room, nextPlayer, {
      type: "TURN_BEGIN",
      payload: { playerId: nextPlayer },
    });
    appendLogAndBroadcast(room, roomId, begin);
  }
}
```

## Validation Layer

### Turn Ownership

```js
function validateTurnOwnership(room, playerId) {
  const active = room.players[room.activeIndex];
  if (!active) {
    return { ok: false, message: "No active player (room not initialized)." };
  }
  if (active !== playerId) {
    return { ok: false, message: `Not your turn. Active player is ${active}.` };
  }
  return { ok: true };
}
```

### Event Coordinates

```js
function validateEventCoordinates(room, event) {
  if (event.age !== room.age) {
    return { ok: false, message: "Wrong age." };
  }
  if (event.round !== room.round) {
    return { ok: false, message: "Wrong round." };
  }
  if (event.turn !== room.turn) {
    return { ok: false, message: "Wrong turn." };
  }
  return { ok: true };
}
```

### Protection Rule

```js
function validateProtectionRule(room, event) {
  if (!room.settings.social?.protectedUntilEndOfRound) {
    return { ok: true };
  }

  if (event.type !== "WORLD_MODIFY" && event.type !== "WORLD_DELETE") {
    return { ok: true };
  }

  const target = room.worldIndex.get(event.payload.worldId);
  if (!target) return { ok: true };

  if (target.createdBy === event.playerId) return { ok: true };

  const createdThisRound =
    target.createdAge === room.age &&
    target.createdRound === room.round;

  if (createdThisRound) {
    return {
      ok: false,
      message: "Target is protected until end of round.",
    };
  }

  return { ok: true };
}
```

### AP Budget

```js
function selectApSpentThisTurn(room) {
  let spent = 0;
  for (const entry of room.log) {
    const e = entry.event;
    if (room.revoked.has(e.id)) continue;
    if (e.age !== room.age) continue;
    if (e.round !== room.round) continue;
    if (e.turn !== room.turn) continue;
    if (typeof e.cost === "number") spent += e.cost;
  }
  return spent;
}

function selectApRemaining(room) {
  const apTotal = room.settings.apByAge[room.age] ?? 0;
  const spent = selectApSpentThisTurn(room);
  return Math.max(0, apTotal - spent);
}

function validateApBudget(room, event) {
  if (typeof event.cost !== "number") return { ok: true };

  const remaining = selectApRemaining(room);
  if (event.cost > remaining) {
    return {
      ok: false,
      message: `Not enough AP. Remaining=${remaining}, cost=${event.cost}`
    };
  }
  return { ok: true };
}
```

## Event Broadcasting

### Append and Broadcast

```js
function appendLogAndBroadcast(room, roomId, event) {
  room.seq += 1;
  room.hash = nextHash(room.hash, room.seq, event);
  const entry = { seq: room.seq, event, hash: room.hash };
  room.log.push(entry);

  broadcast(room, {
    t: "EVENT",
    room: roomId,
    seq: entry.seq,
    event: entry.event,
    hash: entry.hash,
  });
}
```

### Server Event Generator

```js
function serverEvent(room, playerId, partial) {
  return {
    id: crypto.randomUUID(),
    ts: Date.now(),
    playerId,
    age: room.age,
    round: room.round,
    turn: room.turn,
    ...partial,
  };
}
```

### Turn Advancement

```js
function advanceTurn(room) {
  room.activeIndex = (room.activeIndex + 1) % room.players.length;
  room.turn += 1;

  if (room.activeIndex === 0) {
    room.round += 1;
    room.turn = 1;
  }
}
```

## Canonical Cost Computation

### Canonical Cost Table

```js
const CANONICAL_COSTS = {
  // Age I
  TERRAIN_ADD: 2,
  WATER_ADD: 2,
  REGION_NAME: 1,
  LANDMARK_CREATE: 3,

  // Age II
  RACE_CREATE: 2,
  CITY_FOUND: 3,
  CULTURE_TAG: 1,

  // Age III
  NATION_FOUND: 3,
  BORDER_CLAIM: 2,
  WAR_DECLARE: 2,
  TREATY_SIGN: 1,
  PROJECT_GREAT: 3,

  // Modifications / deletes
  WORLD_MODIFY: 1,
  WORLD_DELETE: 2,
};
```

### Base Cost Function

```js
function canonicalBaseCost(room, event) {
  // No cost for structural events
  if (
    event.type === "TURN_BEGIN" ||
    event.type === "TURN_END" ||
    event.type === "ROUND_END" ||
    event.type === "AGE_ADVANCE" ||
    event.type === "AGE_ADVANCE_PROPOSE" ||
    event.type === "AGE_ADVANCE_VOTE" ||
    event.type === "EVENT_REVOKE"
  ) {
    return 0;
  }

  if (event.type === "WORLD_MODIFY") {
    return CANONICAL_COSTS.WORLD_MODIFY;
  }
  if (event.type === "WORLD_DELETE") {
    return CANONICAL_COSTS.WORLD_DELETE;
  }

  if (event.type !== "WORLD_CREATE") return 0;

  const kind = event.payload.kind;
  const attrs = event.payload.attrs ?? {};

  // Age I
  if (kind === "TERRAIN") return CANONICAL_COSTS.TERRAIN_ADD;
  if (kind === "WATER") return CANONICAL_COSTS.WATER_ADD;
  if (kind === "REGION") return CANONICAL_COSTS.REGION_NAME;
  if (kind === "LANDMARK") return CANONICAL_COSTS.LANDMARK_CREATE;

  // Age II
  if (kind === "RACE") return CANONICAL_COSTS.RACE_CREATE;
  if (kind === "SETTLEMENT") {
    if (attrs.settlementType === "CITY") {
      return CANONICAL_COSTS.CITY_FOUND;
    }
    return CANONICAL_COSTS.CITY_FOUND;
  }
  if (kind === "CULTURE_TAG") return CANONICAL_COSTS.CULTURE_TAG;

  // Age III
  if (kind === "NATION") return CANONICAL_COSTS.NATION_FOUND;
  if (kind === "BORDER") return CANONICAL_COSTS.BORDER_CLAIM;
  if (kind === "WAR") return CANONICAL_COSTS.WAR_DECLARE;
  if (kind === "TREATY") return CANONICAL_COSTS.TREATY_SIGN;
  if (kind === "PROJECT") return CANONICAL_COSTS.PROJECT_GREAT;

  if (kind === "LABEL") return 0;

  return 0;
}
```

### Authoritative Cost with Modifiers

```js
function authoritativeCost(room, event) {
  let cost = canonicalBaseCost(room, event);

  // Alteration modifiers only for modify/delete
  const alter = room.settings.social?.alterationCost;
  if (!alter?.enabled) return cost;

  if (event.type === "WORLD_MODIFY" || event.type === "WORLD_DELETE") {
    const target = room.worldIndex.get(event.payload.worldId);
    if (!target) return cost;

    if (target.createdBy && target.createdBy !== event.playerId) {
      cost += alter.modifyOthersBasePlus;

      if (target.isNamed && alter.namedKinds.includes(target.kind)) {
        cost += alter.modifyOthersNamedPlus;
      }
    }
  }

  return cost;
}
```

## Action Legality Validation

### Age Gates

```js
function validateActionLegality(room, event) {
  if (event.type !== "WORLD_CREATE" &&
      event.type !== "WORLD_MODIFY" &&
      event.type !== "WORLD_DELETE") {
    return { ok: true };
  }

  const age = room.age;
  const kind = event.type === "WORLD_CREATE"
    ? event.payload.kind
    : room.worldIndex.get(event.payload.worldId)?.kind;

  if (!kind) {
    return { ok: false, message: "Unknown target or missing kind." };
  }

  const allowedByAge = {
    1: new Set(["TERRAIN", "WATER", "REGION", "LANDMARK", "LABEL"]),
    2: new Set(["RACE", "SETTLEMENT", "CULTURE_TAG", "LABEL",
                "TERRAIN", "WATER", "REGION", "LANDMARK"]),
    3: new Set(["NATION", "BORDER", "WAR", "TREATY", "PROJECT", "LABEL",
                "RACE", "SETTLEMENT", "CULTURE_TAG",
                "TERRAIN", "WATER", "REGION", "LANDMARK"]),
  };

  if (!allowedByAge[age].has(kind)) {
    return {
      ok: false,
      message: `Kind ${kind} not allowed in Age ${age}.`,
      details: {
        kind: "AGE_FORBIDDEN",
        age,
        kindAttempted: kind,
      },
    };
  }

  // Dependency rules
  // ... (see full implementation in CORE_IMPLEMENTATION.md)

  return { ok: true };
}
```

### Hex Index Helpers

```js
function worldIdsAtHex(room, hex) {
  return ensureSet(room.hexIndex, hexKey(hex));
}

function existsKindAtHex(room, hex, kind) {
  for (const id of worldIdsAtHex(room, hex)) {
    const obj = room.worldIndex.get(id);
    if (obj && obj.kind === kind) return true;
  }
  return false;
}
```

## World Index Management

### Apply World Event

```js
function applyWorldEvent(room, event) {
  if (event.type === "WORLD_CREATE") {
    const { worldId, kind, name, hexes = [], attrs = {} } = event.payload;
    const hexSet = new Set(hexes.map(hexKey));

    room.worldIndex.set(worldId, {
      kind,
      createdBy: event.playerId,
      createdAge: event.age,
      createdRound: event.round,
      isNamed: Boolean(name && String(name).trim()),
      hexes: hexSet,
      attrs: { ...attrs },
    });

    for (const hk of hexSet) {
      ensureSet(room.hexIndex, hk).add(worldId);
    }
  }

  if (event.type === "WORLD_MODIFY") {
    const obj = room.worldIndex.get(event.payload.worldId);
    if (!obj) return;

    for (const op of event.payload.patch ?? []) {
      if (op.op === "set") {
        if (op.path === "name") {
          obj.isNamed = Boolean(op.value && String(op.value).trim());
        }
        if (op.path.startsWith("attrs.")) {
          obj.attrs[op.path.slice("attrs.".length)] = op.value;
        }
      }

      if (op.op === "unset") {
        if (op.path.startsWith("attrs.")) {
          delete obj.attrs[op.path.slice("attrs.".length)];
        }
      }

      if (op.op === "addHex") {
        for (const h of op.hexes) {
          const hk = hexKey(h);
          obj.hexes.add(hk);
          ensureSet(room.hexIndex, hk).add(obj.id);
        }
      }

      if (op.op === "removeHex") {
        for (const h of op.hexes) {
          const hk = hexKey(h);
          obj.hexes.delete(hk);
          const set = room.hexIndex.get(hk);
          if (set) set.delete(obj.id);
        }
      }
    }
  }

  if (event.type === "WORLD_DELETE") {
    const obj = room.worldIndex.get(event.payload.worldId);
    if (!obj) return;

    for (const hk of obj.hexes) {
      const set = room.hexIndex.get(hk);
      if (set) set.delete(obj.id);
    }
    room.worldIndex.delete(event.payload.worldId);
  }
}
```

### Rebuild Indexes (for revocation)

```js
function rebuildIndexes(room) {
  room.worldIndex = new Map();
  room.hexIndex = new Map();

  for (const entry of room.log) {
    const e = entry.event;
    if (room.revoked.has(e.id)) continue;
    if (e.type === "WORLD_CREATE" || e.type === "WORLD_MODIFY" || e.type === "WORLD_DELETE") {
      applyWorldEvent(room, e);
    }
  }
}
```

## Error Handling

### Structured Error Sender

```js
function sendError(ws, code, message, details) {
  return send(ws, {
    t: "ERROR",
    code,
    message,
    details,
  });
}
```

## See Also

- [PROTOCOL_SPEC.md](PROTOCOL_SPEC.md) — Wire format and message types
- [ARCHITECTURE.md](ARCHITECTURE.md) — System architecture
- [CORE_IMPLEMENTATION.md](CORE_IMPLEMENTATION.md) — Client-side types and selectors
