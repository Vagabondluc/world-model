# Troubleshooting

This document provides solutions to common issues when developing, deploying, or using Dawn of Worlds.

## Table of Contents

- [Development Issues](#development-issues)
- [WebSocket Issues](#websocket-issues)
- [Multiplayer Sync Issues](#multiplayer-sync-issues)
- [Performance Issues](#performance-issues)
- [Error Code Reference](#error-code-reference)

## Development Issues

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::8787`

**Cause:** Another process is using the WebSocket port.

**Solutions:**

```bash
# Windows
netstat -ano | findstr :8787
taskkill /PID <pid> /F

# macOS/Linux
lsof -i :8787
kill -9 <pid>

# Or use different port
WS_PORT=8788 node server.js
```

### Module Not Found

**Error:** `Cannot find module 'xyz'`

**Cause:** Missing dependency.

**Solution:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or install missing module
npm install <module-name>
```

### TypeScript Errors

**Error:** Type errors in `.ts` files

**Cause:** Type mismatches or missing type definitions.

**Solutions:**

```bash
# Check TypeScript version
npm list typescript

# Regenerate type definitions
npx tsc --noEmit

# Check tsconfig.json
cat tsconfig.json
```

Common fixes:

```ts
// Import types correctly
import type { GameState } from "./state";

// Use type assertions carefully
const obj = data as WorldObject;

// Add type guards
function isWorldObject(val: any): val is WorldObject {
  return val && typeof val.id === 'string';
}
```

### Build Failures

**Error:** Build fails with obscure error

**Solutions:**

```bash
# Clear cache
rm -rf .vite dist node_modules/.vite
npm run build

# Check Node version
node --version  # Should be 18+

# Update dependencies
npm update
```

## WebSocket Issues

### Connection Refused

**Error:** `WebSocket connection to 'ws://localhost:8787' failed`

**Causes:**
- Server not running
- Wrong port
- Firewall blocking

**Solutions:**

```bash
# Verify server is running
netstat -ano | findstr :8787  # Windows
lsof -i :8787                  # macOS/Linux

# Check server logs
pm2 logs dawnworlds-ws

# Test connection manually
wscat -c ws://localhost:8787
```

### Connection Drops

**Symptom:** WebSocket connects then immediately disconnects

**Causes:**
- Client sending invalid messages
- Server rejecting connection
- Network instability

**Solutions:**

```js
// Client: Add reconnection logic
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

function connect() {
  ws = new WebSocket(url);

  ws.onclose = () => {
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttempts++;
      setTimeout(connect, 1000 * reconnectAttempts);
    }
  };
}
```

### Message Not Received

**Symptom:** Client sends message but no response

**Causes:**
- Server not processing message type
- Validation failure (no error sent)
- Async processing delay

**Debug Steps:**

```js
// Add logging to both sides
console.log('Client sending:', msg);

// Server
ws.on('message', (raw) => {
  console.log('Server received:', raw);
  // ... processing
});

// Client
ws.onmessage = (event) => {
  console.log('Client received:', event.data);
};
```

### High Latency

**Symptom:** Messages take > 500ms to process

**Causes:**
- Network congestion
- Server overloaded
- Expensive operations in message handler

**Solutions:**

```js
// Profile message handler
console.time('messageProcessing');
// ... handle message
console.timeEnd('messageProcessing');

// Offload expensive operations
if (event.type === 'WORLD_CREATE') {
  // Async processing
  setImmediate(() => processCreateEvent(event));
}
```

## Multiplayer Sync Issues

### Divergent State

**Symptom:** Clients show different world state

**Causes:**
- Missed events (gap not detected)
- Revoked events not processed
- Client-side state corruption

**Solutions:**

```js
// Verify sequence numbers
if (msg.seq !== lastSeq + 1) {
  console.error('Gap detected! Expected', lastSeq + 1, 'got', msg.seq);
  ws.send(JSON.stringify({ t: 'PULL', sinceSeq: lastSeq }));
}

// Verify hash
const computedHash = nextHash(lastHash, msg.seq, msg.event);
if (computedHash !== msg.hash) {
  console.error('Hash mismatch! Computed', computedHash, 'received', msg.hash);
}
```

### Duplicate Events

**Symptom:** Same event appears multiple times

**Causes:**
- Client not deduping
- Server broadcasting duplicate

**Solutions:**

```js
// Client: Track seen event IDs
const seenEventIds = new Set();

function handleEvent(msg) {
  if (seenEventIds.has(msg.event.id)) {
    console.warn('Duplicate event:', msg.event.id);
    return;
  }
  seenEventIds.add(msg.event.id);
  dispatch({ type: 'DISPATCH_EVENT', event: msg.event });
}
```

### Turn Ownership Confusion

**Symptom:** "Not your turn" error when it should be

**Causes:**
- Server and client out of sync
- TURN_BEGIN not received
- Active player index wrong

**Debug Steps:**

```js
// Log turn changes
console.log('Turn changed:', {
  age: state.age,
  round: state.round,
  turn: state.turn,
  activePlayerId: state.activePlayerId,
});

// Verify server state
// Add server logging in WELCOME message
console.log('Server state:', {
  age,
  round,
  turn,
  activePlayerId,
  activeIndex,
});
```

## Performance Issues

### Slow Rendering

**Symptom:** UI feels sluggish

**Causes:**
- Re-deriving world on every render
- Large event log
- Inefficient selectors

**Solutions:**

```ts
// Memoize expensive operations
import { useMemo } from 'react';

function GameComponent({ state }) {
  const world = useMemo(() => deriveWorld(state), [state.events]);
  const legalActions = useMemo(
    () => selectLegalActions(state, selection, actionRegistry),
    [state, selection]
  );

  return <div>...</div>;
}
```

### High Memory Usage

**Symptom:** Browser tab crashes or server OOM

**Causes:**
- Event log growing unbounded
- Memory leaks in components
- Not cleaning up resources

**Solutions:**

```js
// Server: Implement event log truncation
const MAX_EVENTS = 10000;

function truncateEventLog(room) {
  if (room.log.length > MAX_EVENTS) {
    // Keep last N events
    room.log = room.log.slice(-MAX_EVENTS);
  }
}

// Client: Clean up listeners
useEffect(() => {
  const ws = new WebSocket(url);
  return () => {
    ws.close();
    ws = null;
  };
}, []);
```

### Large Bundle Size

**Symptom:** Initial load takes > 5 seconds

**Causes:**
- Unoptimized build
- Large dependencies
- No code splitting

**Solutions:**

```bash
# Analyze bundle
npm run build -- --mode analyze

# Use bundle analyzer
npm install -D rollup-plugin-visualizer

# Configure code splitting in vite.config.ts
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
};
```

## Error Code Reference

| Code | Message | Cause | Resolution |
|-------|----------|--------|------------|
| `BAD_JSON` | Invalid JSON in message | Check message format |
| `BAD_HELLO` | Missing room or playerId | Include required fields |
| `NOT_JOINED` | Message before HELLO | Send HELLO first |
| `BAD_EVENT` | Invalid event structure | Check event schema |
| `UNKNOWN` | Unknown message type | Check message type field |
| `NOT_YOUR_TURN` | Client not active player | Wait for your turn |
| `BAD_COORDS` | Event coordinates don't match server | Check age/round/turn |
| `NO_AP` | Not enough AP for event | Check AP remaining |
| `PROTECTED` | Target is protected | Wait for round end |
| `ILLEGAL_ACTION` | Action violates game rules | Check action legality |
| `TURN_EMPTY` | Turn ended without action | Perform at least one action |
| `AGE_PROPOSE_INVALID` | Cannot propose age advance | Check min rounds |
| `BAD_VOTE` | Invalid vote payload | Check vote format |
| `VOTE_NO_PROPOSAL` | Vote references non-existent proposal | Check proposal ID |
| `VOTE_STALE` | Vote on stale proposal | Refresh proposals |
| `TYPE_NOT_ALLOWED` | Event type not allowed | Check current age |
| `BAD_PLAYER` | Event playerId doesn't match sender | Use correct playerId |
| `BAD_REVOKE` | Invalid revoke payload | Check targetEventIds format |
| `CITY_NEEDS_RACE` | City requires race at hex | Create race first |
| `AGE_FORBIDDEN` | Kind not allowed in current age | Wait for next age |

## Debug Tips

### Browser DevTools

```javascript
// Enable React DevTools
// Install extension: https://react.dev/

// In console
__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers.forEach(r => r.isDisabled = false);
```

### Server Logging

```js
// Add detailed logging
const DEBUG = process.env.DEBUG === 'true';

function log(message, data) {
  if (DEBUG) {
    console.log(`[${new Date().toISOString()}]`, message, data);
  }
}

// Usage
log('Event received', { type: event.type, playerId: event.playerId });
```

### Network Inspection

```bash
# Use Wireshark for deep packet inspection
wireshark

# Use Chrome DevTools Network tab
# Filter by WS (WebSocket)
```

### State Inspection

```ts
// Add state inspection to development
declare global {
  __INSPECT_STATE__: () => GameState;
}

// In reducer
if (process.env.NODE_ENV === 'development') {
  (global as any).__INSPECT_STATE__ = () => state;
}

// In browser console
__INSPECT_STATE__()
```

## Getting Help

### Community Resources

- **GitHub Issues**: Report bugs at project repository
- **Discord/Slack**: Join community chat
- **Documentation**: Check [docs/](.) for detailed guides

### Creating Debug Logs

When reporting issues, include:

1. Browser and version
2. Operating system
3. Steps to reproduce
4. Expected vs actual behavior
5. Console errors
6. Network logs (if applicable)

### Minimal Reproduction

Create minimal reproduction case:

```ts
// Minimal test case
const state = makeEmptyState();
state.events.push({
  id: 'test-1',
  ts: Date.now(),
  playerId: 'P1',
  age: 1,
  round: 1,
  turn: 1,
  type: 'WORLD_CREATE',
  cost: 2,
  payload: { worldId: 'obj-1', kind: 'TERRAIN', hexes: [] },
});

// What happens?
console.log(deriveWorld(state));
```

## See Also

- [GETTING_STARTED.md](GETTING_STARTED.md) — Development setup
- [DEPLOYMENT.md](DEPLOYMENT.md) — Production deployment
- [PROTOCOL_SPEC.md](PROTOCOL_SPEC.md) — Error code details
- [SERVER_IMPLEMENTATION.md](SERVER_IMPLEMENTATION.md) — Server architecture
