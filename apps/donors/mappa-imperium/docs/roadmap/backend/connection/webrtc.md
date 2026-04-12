Good, now we’re firmly in **systems architecture** territory.

You want **three things at once**:

1. A **Tauri + React client**
2. **Ad-hoc peer networking** (no central server *required*)
3. A **shared, curated state + chat** between players

This immediately rules out some options and makes others *very* strong.

Below is a **clear, opinionated architecture**, then alternatives.

---

# Core Recommendation (Best Fit)

## **WebRTC mesh + deterministic state + optional relay**

This is the **only stack** that:

* works ad-hoc
* runs inside Tauri
* supports chat + shared DB
* does not require a central server (but can optionally use one)

---

## High-level architecture

```
┌────────────┐        WebRTC (DataChannel)        ┌────────────┐
│  Player A  │◀────────────────────────────────▶│  Player B  │
│ Tauri+UI   │◀────────────────────────────────▶│ Tauri+UI   │
└─────┬──────┘◀────────────────────────────────▶└─────┬──────┘
      │                                                  │
      └─────────────── optional ────────────────────────┘
              Signaling / TURN / Relay (tiny server)
```

* **WebRTC DataChannels** = peer-to-peer, encrypted, reliable
* **No sockets exposed**, works through NAT
* Chat + game state over the *same channel*

---

# Core Components

## 1️⃣ Transport Layer

### WebRTC DataChannel

Use it for:

* chat messages
* state diffs
* presence
* map edits

**Why not WebSocket?**

* WebSocket = client ↔ server
* You *cannot* do true ad-hoc without running a server someone hosts
* WebRTC = peer ↔ peer

Inside Tauri, WebRTC works because:

* Chromium engine is present
* DataChannels are standard browser APIs

---

## 2️⃣ Signaling (minimal, optional)

WebRTC needs **signaling once** to exchange offers.

Options (pick one):

### Option A — One player hosts (LAN / manual)

* Player A shows a **join code**
* Player B pastes it
* No server needed

### Option B — Tiny rendez-vous server (recommended)

* Just relays SDP offers
* No game data
* Can be:

  * FastAPI + WebSocket
  * Node + ws
* Stateless

Example signaling payload:

```json
{
  "type": "offer",
  "from": "peerA",
  "to": "peerB",
  "sdp": "..."
}
```

Once connected → server is no longer used.

---

## 3️⃣ Network Topology

### For 2–6 players

Use **full mesh**:

```
A ── B
│ ╲ │
│  ╲│
C ── D
```

* ≤6 players = max 15 connections
* Perfectly fine
* Simplest mental model

If you ever scale up:

* Switch to **star topology**
* Or elect a temporary host

---

## 4️⃣ Shared Database Model (critical)

⚠️ **Do NOT sync a database directly**

Instead:

### Use a **deterministic event log**

(CRDT-like, but simpler)

Each peer maintains:

```ts
GameState = {
  version: number,
  hexOwnership: Map<HexID, PlayerID>,
  chatLog: Message[],
  metadata: {...}
}
```

And exchanges **events**, not state:

```ts
Event =
  | { type: "CHAT"; id; author; text; ts }
  | { type: "CLAIM_HEX"; hex; player; turn }
  | { type: "SET_CENTER_RULE"; rule }
```

Rules:

* Events are **append-only**
* Events are **idempotent**
* State is rebuilt by replay

This gives you:

* No desync
* Late joiners can sync
* Debuggable

---

## 5️⃣ Chat Window (curated)

Chat is just another event stream:

```json
{
  "type": "CHAT",
  "id": "uuid",
  "author": "P3",
  "text": "I'm pushing into sector 2",
  "ts": 1700000000
}
```

Optional curation layers:

* system messages
* GM-only messages
* per-front chat channels
* mute / filter / archive

---

# API SURFACE (what you actually implement)

## Tauri side (Rust)

Expose minimal commands:

```rust
connect(peer_info)
send_event(event)
get_state()
subscribe_events()
```

Rust handles:

* WebRTC setup (via JS bridge)
* persistence (local event log)
* optional encryption keys

---

## Frontend (React)

```ts
network.connect()
network.send(event)
network.onEvent(cb)
```

React never touches sockets directly.

---

# Why NOT WebSocket-only

| Requirement   | WebSocket | WebRTC   |
| ------------- | --------- | -------- |
| Ad-hoc        | ❌         | ✅        |
| NAT traversal | ❌         | ✅        |
| P2P           | ❌         | ✅        |
| Encryption    | manual    | built-in |
| Tauri support | ✅         | ✅        |

WebSocket is fine **only if**:

* You accept a permanent server
* You accept host authority

---

# Alternative Architectures (when to use)

## Option 2 — Local host + WebSocket

One player is the server.

Pros:

* simpler logic
* easier debugging

Cons:

* host advantage
* host disconnect = game dead

## Option 3 — libp2p (advanced)

Powerful, but:

* heavy
* complex in Tauri
* overkill for 2–6 players

---

# Minimal Stack Recommendation (TL;DR)

**Use this**:

* WebRTC DataChannels (P2P)
* Tiny signaling server (WebSocket)
* Deterministic event log
* React for UI
* Tauri for packaging + persistence

---
Below is a complete, implementable MVP design for **2–6 players**, **WebRTC mesh**, **event-log state**, **chat**, with a tiny **signaling server**.

---

# 1) Exact Event Schema (JSON)

## 1.1 Envelope (every message over WebRTC and for persistence)

```json
{
  "v": 1,
  "type": "EVENT",
  "roomId": "r_7K3Q2",
  "from": "peer_8f3c",
  "event": { /* see below */ }
}
```

### Required invariants

* `event.id` is globally unique (UUID v4 is fine)
* `event.lamport` is a per-peer Lamport clock (integer)
* `event.ts` is local wall clock ms (only for UI ordering; never authoritative)

---

## 1.2 Common fields for all events

```json
{
  "id": "evt_2f3b0d0b-1f27-4e24-9a61-b9f0f01b4a7c",
  "kind": "CHAT",
  "lamport": 42,
  "ts": 1769280000123,
  "author": {
    "peerId": "peer_8f3c",
    "playerId": "P3",
    "name": "Pierre-Luc"
  },
  "sig": "optional_base64_signature",
  "payload": { }
}
```

* `sig` optional for MVP. If you later add anti-tamper, sign `(roomId + event.id + lamport + kind + payload)`.

---

## 1.3 Event kinds (MVP set)

### A) Presence / membership

**JOIN**

```json
{
  "kind": "JOIN",
  "payload": {
    "capabilities": ["webrtc", "chat", "hexmap"],
    "client": { "app": "hexmap", "ver": "0.1.0", "platform": "tauri" }
  }
}
```

**LEAVE**

```json
{
  "kind": "LEAVE",
  "payload": { "reason": "user_quit" }
}
```

**PING** (keepalive + latency estimate)

```json
{
  "kind": "PING",
  "payload": { "nonce": "n_123" }
}
```

**PONG**

```json
{
  "kind": "PONG",
  "payload": { "nonce": "n_123" }
}
```

---

### B) Chat

**CHAT**

```json
{
  "kind": "CHAT",
  "payload": {
    "channel": "global",
    "text": "I'm pushing into sector 2",
    "replyTo": null,
    "tags": ["plan"]
  }
}
```

**CHAT_EDIT** (optional)

```json
{
  "kind": "CHAT_EDIT",
  "payload": { "targetId": "evt_xxx", "text": "new text" }
}
```

**CHAT_DELETE** (optional soft-delete)

```json
{
  "kind": "CHAT_DELETE",
  "payload": { "targetId": "evt_xxx" }
}
```

---

### C) Map/game state (event-sourced)

You want “curate a database between players” → keep these as events.

**SETUP_CREATE_MAP** (authoritative init event)

```json
{
  "kind": "SETUP_CREATE_MAP",
  "payload": {
    "players": 4,
    "tier": "standard",
    "board": { "family": "rhombus", "n": 8 },
    "hexMiles": 24,
    "centerRule": "neutral",
    "neutralSelection": "frontier_between_all",
    "seedRotation": 0
  }
}
```

**HEX_SET_OWNER**

```json
{
  "kind": "HEX_SET_OWNER",
  "payload": {
    "hex": { "q": 3, "r": 5 },
    "owner": "P2",
    "reason": "claim"
  }
}
```

**HEX_SET_TERRAIN** (optional)

```json
{
  "kind": "HEX_SET_TERRAIN",
  "payload": {
    "hex": { "q": 3, "r": 5 },
    "terrain": "forest"
  }
}
```

**NOTE_SET** (per-hex note, curation)

```json
{
  "kind": "NOTE_SET",
  "payload": {
    "scope": { "type": "hex", "hex": { "q": 3, "r": 5 } },
    "text": "Old watchtower, smoke at night",
    "visibility": "all"
  }
}
```

---

### D) Moderation / curation (GM-like)

**CURATE_PIN_EVENT**

```json
{
  "kind": "CURATE_PIN_EVENT",
  "payload": { "targetId": "evt_xxx", "pin": true }
}
```

**CURATE_HIDE_EVENT**

```json
{
  "kind": "CURATE_HIDE_EVENT",
  "payload": { "targetId": "evt_xxx", "hide": true, "reason": "spam" }
}
```

---

## 1.4 Deterministic ordering key (critical)

For stable replay and simultaneous edits, define:

```
orderKey = (lamport, author.peerId, event.id)
```

* Sort ascending.
* If two events conflict, resolve with the same key (see §4).

---

# 2) Signaling Server API (tiny + dumb)

Purpose: only to exchange WebRTC offers/answers/ICE and help peers discover each other. **No game data.**

## 2.1 Transport

* **WebSocket** at: `/ws`
* Optional HTTP endpoints for room listing; not required.

## 2.2 WS messages (client → server)

**HELLO**

```json
{ "t": "HELLO", "v": 1, "peerId": "peer_8f3c", "name": "Pierre-Luc" }
```

**JOIN_ROOM**

```json
{ "t": "JOIN_ROOM", "roomId": "r_7K3Q2" }
```

**LEAVE_ROOM**

```json
{ "t": "LEAVE_ROOM", "roomId": "r_7K3Q2" }
```

**SEND_SIGNAL** (relay to specific peer)

```json
{
  "t": "SEND_SIGNAL",
  "roomId": "r_7K3Q2",
  "to": "peer_ab12",
  "signal": {
    "kind": "offer",
    "sdp": "..."
  }
}
```

**SEND_ICE**

```json
{
  "t": "SEND_SIGNAL",
  "roomId": "r_7K3Q2",
  "to": "peer_ab12",
  "signal": {
    "kind": "ice",
    "candidate": "candidate:..."
  }
}
```

## 2.3 WS messages (server → client)

**WELCOME**

```json
{ "t": "WELCOME", "serverTime": 1769280000123 }
```

**ROOM_PEERS** (full roster snapshot)

```json
{
  "t": "ROOM_PEERS",
  "roomId": "r_7K3Q2",
  "peers": [
    { "peerId": "peer_8f3c", "name": "Pierre-Luc" },
    { "peerId": "peer_ab12", "name": "Alex" }
  ]
}
```

**PEER_JOINED**

```json
{ "t": "PEER_JOINED", "roomId": "r_7K3Q2", "peer": { "peerId": "peer_x9", "name": "Sam" } }
```

**PEER_LEFT**

```json
{ "t": "PEER_LEFT", "roomId": "r_7K3Q2", "peerId": "peer_x9" }
```

**SIGNAL** (relayed)

```json
{
  "t": "SIGNAL",
  "roomId": "r_7K3Q2",
  "from": "peer_ab12",
  "signal": { "kind": "answer", "sdp": "..." }
}
```

## 2.4 Minimal security

* Room join can require a `roomKey` (shared secret) if you want private rooms:

```json
{ "t": "JOIN_ROOM", "roomId": "r_7K3Q2", "roomKey": "k_XXXXX" }
```

---

# 3) WebRTC Mesh Handshake Flow (2–6 players)

## 3.1 Roles

* Every peer connects to signaling server.
* When you join a room, you receive roster.
* You establish a DataChannel connection to each other peer.

## 3.2 Deterministic initiator rule (prevents double-offer chaos)

For each pair (A,B):

* Initiator = the one with lexicographically smaller `peerId`
* Only initiator creates the **offer**

## 3.3 Flow (for A connecting to B)

1. A sees B in `ROOM_PEERS`
2. Compare peerId:

   * if `A < B`: A is initiator
3. A creates RTCPeerConnection
4. A creates DataChannel `"events"`
5. A creates SDP offer → `SEND_SIGNAL` to B
6. B receives offer → sets remote description
7. B creates answer → `SEND_SIGNAL` to A
8. Both exchange ICE candidates via `SEND_SIGNAL`
9. DataChannel opens
10. Over DataChannel, run **app handshake**:

**APP_HELLO**

```json
{ "v": 1, "type": "APP_HELLO", "roomId": "r_7K3Q2", "peerId": "peer_8f3c", "have": { "eventHead": 128 } }
```

**SYNC_REQUEST / SYNC_RESPONSE**

* If one peer is behind, it requests missing events (by lamport range or by event index).

Minimal sync:

```json
{ "v": 1, "type": "SYNC_REQUEST", "fromIndex": 97 }
```

```json
{ "v": 1, "type": "SYNC_RESPONSE", "events": [/* envelope+event objects */] }
```

## 3.4 Late joiner

* Late joiner connects to everyone and asks for sync.
* Deterministic choice for “sync source”: smallest `peerId` currently connected (or the peer with the highest head).

---

# 4) Conflict Rules (Simultaneous Edits)

You’ll have conflicts mainly on **HEX_SET_OWNER**, **NOTE_SET**, maybe terrain edits.

## 4.1 Global rule: replay in deterministic order

* Sort all events by `orderKey = (lamport, peerId, event.id)`
* Apply in that order.

This alone makes every peer converge, as long as everyone eventually receives the same set of events.

## 4.2 Lamport clock update rule

Each peer keeps `L`:

* Before emitting an event: `L = L + 1`
* On receiving an event with `lamport = Le`: `L = max(L, Le) + 1`

## 4.3 Per-field conflict policy

Use explicit policies per “record” type:

### Policy A: LWW (Last-Write-Wins by orderKey)

Good for:

* `HEX_SET_TERRAIN`
* `NOTE_SET` (if you treat note as a single field)

Rule:

* For each key (e.g., hex coordinate), keep the value from the highest `orderKey`.

### Policy B: Append-only (no conflict)

Good for:

* `CHAT` (append)
* `CURATE_PIN_EVENT` (also LWW per target)
* `CURATE_HIDE_EVENT` (LWW per target)

### Policy C: Turn-locked / authority-gated (prevents nonsense)

Good for:

* `HEX_SET_OWNER` if you don’t want race conditions.

Example:

* Only the “active player” can claim this turn.
* Enforced by validating against derived turn state during replay.
* Invalid events are kept in the log but marked `rejected` locally (or ignored).

If you want it purely mechanical without turns:

* Allow claims, but resolve by LWW; that can feel unfair in simultaneous clicks.

**Best UX for strategy maps:** add *some* authority constraint (turn, phase, or “front locks”).

## 4.4 Optional “soft locks” (nice compromise)

Add:

* `HEX_LOCK_REQUEST(hex, ttlMs)`
* `HEX_LOCK_GRANT(hex, holderPeerId, expiresAtLamport)`
  Then only accept `HEX_SET_OWNER` if lock held.
  (Still convergent if locks are events too.)

---

# 5) Tauri ↔ React Boundary (clean separation)

Goal: React never owns networking correctness. Tauri core owns:

* persistence (event log)
* networking (webrtc connections + sync)
* deterministic replay
* validation

## 5.1 Tauri commands (Rust → callable from React)

### Network lifecycle

* `room_create(params) -> { roomId, roomKey? }`
* `room_join({ roomId, roomKey? }) -> { peerId }`
* `room_leave()`

### Peer management

* `mesh_status() -> { peers: [...], connections: [...] }`

### Events

* `event_emit(eventKind, payload) -> { eventId }`
* `event_head() -> { index, lamport }`
* `event_get_range({ fromIndex, toIndex }) -> { events: [...] }`

### State (derived)

* `state_get() -> { state: ... }` (current replayed state)
* `state_query_fronts() -> { fronts: [...] }`

## 5.2 Tauri events (Rust emits → React subscribes)

* `net/peer_joined`
* `net/peer_left`
* `net/connection_state`
* `log/event_applied` (includes event + whether accepted/rejected)
* `state/updated` (batched, debounced)

React renders only what Rust tells it is current.

## 5.3 Storage

* Append-only file per room:

  * `rooms/<roomId>/events.ndjson`
* Optional snapshot every N events:

  * `snapshot.json` + `snapshot_index`

On load:

* Load snapshot
* Replay remaining events deterministically

---

## If you want one extra “sane default”

Pick **conflict policy** now:

* Chat: append
* Notes: LWW
* Terrain: LWW
* Ownership: **turn-locked** (or lock-based) — otherwise players will hate “last packet wins”

---

If you tell me which ownership model you want (**turn-based**, **lock-based**, or **free-for-all LWW**), I’ll give you the exact validation rules and the minimal extra events needed.

Excellent choice — this gives you **fairness + simultaneity** without race-condition chaos.
What you’re describing is a **Simultaneous Turns + Lock-Mediated Resolution** model.

Below is a **clean, deterministic hybrid** that fits your event-sourced + WebRTC mesh perfectly.

---

# Hybrid Model: Simultaneous Turns + Locks

## High-level idea

Each round has **three phases**:

```
PLAN  →  LOCK  →  RESOLVE
```

* **PLAN**: everyone thinks / chats / previews
* **LOCK**: everyone can *propose* actions by locking targets
* **RESOLVE**: all valid locks resolve simultaneously into state changes

No one overwrites anyone else mid-turn.
No speed advantage.
No “last packet wins”.

---

# Phase Model (Authoritative)

## Phase enum

```ts
Phase = "PLAN" | "LOCK" | "RESOLVE"
```

## Phase event

```json
{
  "kind": "PHASE_SET",
  "payload": {
    "round": 4,
    "phase": "LOCK"
  }
}
```

### Invariants

* All peers must agree on `(round, phase)`
* Only **PHASE_SET** advances the game
* Phase changes are **rare** and highly visible

---

# Phase Semantics

## 1️⃣ PLAN phase (freeform)

**Allowed**

* Chat
* Notes
* UI previews (“ghost claims”)
* No authoritative map mutation

**Rejected**

* `HEX_SET_OWNER`
* `HEX_LOCK_REQUEST`

This keeps PLAN *purely cognitive*.

---

## 2️⃣ LOCK phase (simultaneous intent)

Players express **intent**, not outcome.

### Event: HEX_LOCK_REQUEST

```json
{
  "kind": "HEX_LOCK_REQUEST",
  "payload": {
    "round": 4,
    "hex": { "q": 3, "r": 5 },
    "action": "CLAIM"
  }
}
```

Rules:

* Anyone may request locks
* Multiple players may request the *same* hex
* Lock requests never mutate the map

Think of this as **writing orders**.

---

## 3️⃣ RESOLVE phase (deterministic)

During RESOLVE:

* Lock requests are collected
* Conflicts are resolved deterministically
* Actual ownership events are emitted

### Resolution produces derived events:

```json
HEX_SET_OWNER
HEX_LOCK_DENIED (optional, UI feedback)
```

Only events produced by RESOLVE mutate the map.

---

# Conflict Resolution Rules (critical)

Resolution must be:

* deterministic
* identical on every peer
* independent of network timing

## Step 1: Group lock requests by hex

```ts
Map<HexID, LockRequest[]>
```

---

## Step 2: Filter invalid requests

Reject any request if:

* player already exceeded per-round claim limit
* hex is not adjacent to player’s region (optional rule)
* hex is neutral-protected / forbidden

Rejected locks stay in log but don’t resolve.

---

## Step 3: Resolve conflicts (same hex)

If **exactly one claimant** → they win.

If **multiple claimants**, pick winner by **priority rule**.

### Recommended priority stack (top to bottom)

1. **Front adjacency**

   * Player with the **strongest shared front** with that hex wins
2. **Initiative stat / faction trait** (optional)
3. **Lowest player ID** (final deterministic tie-break)

Example deterministic comparator:

```ts
compare(a, b):
  if frontStrength(a) != frontStrength(b):
     return frontStrength(a) > frontStrength(b)
  if initiative[a] != initiative[b]:
     return initiative[a] > initiative[b]
  return a.playerId < b.playerId
```

No randomness required.

---

## Step 4: Emit resolution events

For each resolved hex:

```json
{
  "kind": "HEX_SET_OWNER",
  "payload": {
    "hex": { "q": 3, "r": 5 },
    "owner": "P2",
    "round": 4,
    "via": "RESOLVE"
  }
}
```

Optional feedback:

```json
{
  "kind": "HEX_LOCK_DENIED",
  "payload": {
    "hex": { "q": 3, "r": 5 },
    "round": 4,
    "reason": "lost_conflict"
  }
}
```

---

# Determinism Guarantee

Every peer:

1. Has the same **lock requests**
2. Applies the same **filters**
3. Uses the same **priority comparator**
4. Emits the same **derived events**

Result:
✅ identical state
✅ identical replay
✅ no race conditions

---

# Event Validation Rules (summary)

| Event            | Valid Phase        |
| ---------------- | ------------------ |
| CHAT             | any                |
| NOTE_SET         | any                |
| PHASE_SET        | authoritative only |
| HEX_LOCK_REQUEST | LOCK               |
| HEX_SET_OWNER    | RESOLVE only       |
| CURATION         | any                |

If an event appears in the wrong phase:

* mark `rejected: true`
* ignore for state

---

# UX Implications (important)

### What players *feel*

* Everyone “acts at once”
* No one is faster than others
* Conflicts feel *resolved*, not overwritten

### What UI should show

* PLAN: previews, ghost overlays
* LOCK: “You’ve committed X claims”
* RESOLVE: animation of outcomes

This feels very much like:

* Diplomacy
* simultaneous strategy board games
* modern digital tactics games

---

# Minimal API impact (good news)

You **do not need new transport logic**.

This is purely:

* new event types
* stricter validation
* deterministic reducer logic

WebRTC + event log remain unchanged.

---

# Why this fits your hex-sector design perfectly

* Sectors → natural fronts
* Front strength → meaningful priority
* Contested borders → natural conflict zones
* Chat → stays live and social
* Replay → clean "turn by turn" narrative

---

## Related Documentation

This WebRTC networking specification integrates with the following Mappa Imperium documentation:

### Map Data Structure
- [`../export-map/shared_hex_map_player_board_spec.md`](../export-map/shared_hex_map_player_board_spec.md) - Shared hex map data structure specification defining regions, fronts, and contested borders used in state events

### Event Handling & Testing
- [`../webrtc_event_handling_tdd_spec.md`](../webrtc_event_handling_tdd_spec.md) - WebRTC event emission and synchronization tests
- [`../conflict_resolution_tdd_spec.md`](../conflict_resolution_tdd_spec.md) - Multi-player conflict resolution tests and state synchronization guarantees

### Multiplayer UI
- [`../wireframes/connection_lobby_flow_wireframe.md`](../wireframes/connection_lobby_flow_wireframe.md) - Multiplayer connection and lobby interface wireframe
- [`../wireframes/chat_collaboration_panel_wireframe.md`](../wireframes/chat_collaboration_panel_wireframe.md) - Chat and shared cursor collaboration panel wireframe

### Documentation Index
- [`../INDEX.md`](../INDEX.md) - Master documentation index with cross-reference matrix and navigation guide

---
