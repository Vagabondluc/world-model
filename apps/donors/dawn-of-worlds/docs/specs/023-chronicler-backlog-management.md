# Chronicler Backlog Management

## Purpose

This specification defines the deferred chronicling pipeline that separates world events from lore recording. The backlog system ensures gameplay flow is never interrupted while providing opportunities for meaningful reflection between rounds.

## Dependencies

- [`020-chronicler-data-models.md`](020-chronicler-data-models.md) - ChronicleCandidate, ChronicleBacklog types
- [`021-chronicler-trigger-system.md`](021-chronicler-trigger-system.md) - Trigger evaluation and candidate creation
- [`024-chronicler-auto-mode.md`](024-chronicler-auto-mode.md) - Auto-Chronicler integration

---

## Core Principle

> **Events change the world immediately. Chronicling happens later, optionally, and out of band.**

This preserves game flow, player momentum, solo speed, and multiplayer fairness.

---

## Pipeline Architecture

### Two Separate Pipelines

#### World Pipeline (Authoritative)

```text
Action → Event → World State
```

- Immediate execution
- Never blocked
- Source of truth

#### Chronicle Pipeline (Optional, Deferred)

```text
Event → Lore Trigger → Backlog → Chronicle Entry (maybe)
```

- Asynchronous processing
- Player-controlled timing
- Derived from world state

**Critical:** The Chronicle Pipeline cannot block the World Pipeline.

---

## Backlog Data Structures

### ChronicleBacklog

```typescript
interface ChronicleBacklog {
  candidates: ChronicleCandidate[];
  lastProcessedTurn: number;
  lastProcessedAge: number;
  persisted: boolean;             // Whether backlog is persisted
}

interface ChronicleQueue {
  orderedCandidates: ChronicleCandidate[]; // Priority-ordered
  currentIndex: number;
}
```

---

### Backlog Statistics

```typescript
interface BacklogStats {
  totalCandidates: number;
  byStatus: Record<CandidateStatus, number>;
  byUrgency: Record<CandidateUrgency, number>;
  byAge: Record<number, number>;
}
```

---

## Backlog Manager

### BacklogManager

```typescript
class BacklogManager {
  private backlog: ChronicleBacklog;
  private queue: ChronicleQueue;

  constructor() {
    this.backlog = {
      candidates: [],
      lastProcessedTurn: 0,
      lastProcessedAge: 0,
      persisted: false
    };
    this.queue = {
      orderedCandidates: [],
      currentIndex: 0
    };
  }

  // Add candidate to backlog
  addCandidate(candidate: ChronicleCandidate): void {
    this.backlog.candidates.push(candidate);
    this.rebuildQueue();
  }

  // Add multiple candidates
  addCandidates(candidates: ChronicleCandidate[]): void {
    this.backlog.candidates.push(...candidates);
    this.rebuildQueue();
  }

  // Rebuild priority queue
  private rebuildQueue(): void {
    this.queue.orderedCandidates = [...this.backlog.candidates]
      .filter(c => c.status === "PENDING")
      .sort(this.priorityComparator);
    this.queue.currentIndex = 0;
  }

  // Priority comparator
  private priorityComparator(
    a: ChronicleCandidate,
    b: ChronicleCandidate
  ): number {
    // Urgency first
    const urgencyOrder = { HIGH: 0, NORMAL: 1, LOW: 2 };
    const urgencyDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    if (urgencyDiff !== 0) return urgencyDiff;

    // Age next (earlier ages first)
    const ageDiff = a.age - b.age;
    if (ageDiff !== 0) return ageDiff;

    // Creation time next
    return a.createdAtTurn - b.createdAtTurn;
  }

  // Get next candidate
  getNextCandidate(): ChronicleCandidate | undefined {
    if (this.queue.currentIndex >= this.queue.orderedCandidates.length) {
      return undefined;
    }
    return this.queue.orderedCandidates[this.queue.currentIndex];
  }

  // Mark candidate as chronicled
  markChronicled(candidateId: string, entryId: string): void {
    const candidate = this.findCandidate(candidateId);
    if (candidate) {
      candidate.status = "CHRONICLED";
      candidate.processedAtTurn = this.backlog.lastProcessedTurn;
      candidate.resultingEntryId = entryId;
      this.rebuildQueue();
    }
  }

  // Dismiss candidate
  dismissCandidate(candidateId: string): void {
    const candidate = this.findCandidate(candidateId);
    if (candidate) {
      candidate.status = "DISMISSED";
      candidate.processedAtTurn = this.backlog.lastProcessedTurn;
      this.rebuildQueue();
    }
  }

  // Find candidate by ID
  private findCandidate(id: string): ChronicleCandidate | undefined {
    return this.backlog.candidates.find(c => c.id === id);
  }

  // Get all pending candidates
  getPendingCandidates(): ChronicleCandidate[] {
    return this.backlog.candidates.filter(c => c.status === "PENDING");
  }

  // Get candidates by urgency
  getCandidatesByUrgency(urgency: CandidateUrgency): ChronicleCandidate[] {
    return this.backlog.candidates.filter(
      c => c.status === "PENDING" && c.urgency === urgency
    );
  }

  // Get backlog statistics
  getStats(): BacklogStats {
    const candidates = this.backlog.candidates;

    const byStatus: Record<CandidateStatus, number> = {
      PENDING: 0,
      CHRONICLED: 0,
      DISMISSED: 0,
      EXPIRED: 0
    };

    const byUrgency: Record<CandidateUrgency, number> = {
      HIGH: 0,
      NORMAL: 0,
      LOW: 0
    };

    const byAge: Record<number, number> = {};

    for (const c of candidates) {
      byStatus[c.status]++;
      byUrgency[c.urgency]++;
      byAge[c.age] = (byAge[c.age] || 0) + 1;
    }

    return {
      totalCandidates: candidates.length,
      byStatus,
      byUrgency,
      byAge
    };
  }

  // Process expiry
  processExpiry(currentAge: number): void {
    for (const candidate of this.backlog.candidates) {
      if (
        candidate.status === "PENDING" &&
        candidate.expiresAtAge !== undefined &&
        candidate.expiresAtAge < currentAge
      ) {
        candidate.status = "EXPIRED";
      }
    }
    this.rebuildQueue();
  }

  // Get pending count
  getPendingCount(): number {
    return this.backlog.candidates.filter(c => c.status === "PENDING").length;
  }

  // Clear backlog (for new game)
  clear(): void {
    this.backlog = {
      candidates: [],
      lastProcessedTurn: 0,
      lastProcessedAge: 0,
      persisted: false
    };
    this.queue = {
      orderedCandidates: [],
      currentIndex: 0
    };
  }
}
```

---

## Backlog Processing Windows

### Processing Triggers

Chronicling opportunities are presented at natural breakpoints:

| Trigger          | Description                          |
| ----------------- | ------------------------------------ |
| End of Round     | After all players have acted         |
| End of Age       | After age transition                 |
| Manual Open      | Player explicitly opens Chronicle     |
| Solo Downtime    | Between solo actions                 |
| Session End      | Before saving/quitting               |

---

### Processing Window State

```typescript
interface ProcessingWindow {
  isActive: boolean;
  trigger: ProcessingTrigger;
  candidatesAvailable: number;
  autoProcessEnabled: boolean;
}

type ProcessingTrigger =
  | "END_OF_ROUND"
  | "END_OF_AGE"
  | "MANUAL_OPEN"
  | "SOLO_DOWNTIME"
  | "SESSION_END";
```

---

## Auto-Processing Logic

### Auto-Processing Configuration

```typescript
interface AutoProcessingConfig {
  enabled: boolean;
  processHighUrgency: boolean;      // Always process HIGH urgency
  processNormalUrgency: boolean;    // Process NORMAL based on density
  processLowUrgency: boolean;       // Rarely process LOW urgency
  maxEntriesPerRound: number;       // Density control
  ageTransitionOverride: boolean;   // Always process age transitions
}
```

### Default Configuration

```typescript
const DEFAULT_AUTO_PROCESSING_CONFIG: AutoProcessingConfig = {
  enabled: true,
  processHighUrgency: true,
  processNormalUrgency: true,
  processLowUrgency: true,
  maxEntriesPerRound: 3,
  ageTransitionOverride: true
};
```

### Auto-Processing Algorithm

```typescript
function autoProcessBacklog(
  backlog: ChronicleBacklog,
  config: AutoProcessingConfig,
  autoChronicler: AutoChronicler
): ProcessedResult {
  const processed: string[] = []; // Candidate IDs processed
  const skipped: string[] = [];  // Candidate IDs skipped

  const pending = backlog.candidates.filter(c => c.status === "PENDING");

  // Sort by priority
  const sorted = pending.sort(priorityComparator);

  let entriesThisRound = 0;

  for (const candidate of sorted) {
    // Check limits
    if (entriesThisRound >= config.maxEntriesPerRound) {
      skipped.push(candidate.id);
      continue;
    }

    // Check eligibility based on urgency
    if (!shouldAutoProcess(candidate, config)) {
      skipped.push(candidate.id);
      continue;
    }

    // Process with Auto-Chronicler
    if (candidate.autoEligible) {
      const entry = autoChronicler.generateEntry(candidate);
      if (entry) {
        backlog.markChronicled(candidate.id, entry.id);
        processed.push(candidate.id);
        entriesThisRound++;
      }
    }
  }

  return { processed, skipped };
}

function shouldAutoProcess(
  candidate: ChronicleCandidate,
  config: AutoProcessingConfig
): boolean {
  // Age transition always processes
  if (candidate.urgency === "HIGH" && config.ageTransitionOverride) {
    return true;
  }

  // HIGH urgency always processes if enabled
  if (candidate.urgency === "HIGH" && config.processHighUrgency) {
    return true;
  }

  // NORMAL urgency processes based on config
  if (candidate.urgency === "NORMAL" && config.processNormalUrgency) {
    return Math.random() > 0.3; // 70% chance
  }

  // LOW urgency rarely processes
  if (candidate.urgency === "LOW" && config.processLowUrgency) {
    return Math.random() > 0.8; // 20% chance
  }

  return false;
}

interface ProcessedResult {
  processed: string[];
  skipped: string[];
}
```

---

## Backlog UI

### Backlog Display

```typescript
interface BacklogUIState {
  isOpen: boolean;
  selectedCandidate: ChronicleCandidate | null;
  filter: BacklogFilter;
  sortBy: BacklogSortOption;
}

interface BacklogFilter {
  urgency?: CandidateUrgency[];
  scope?: EntryScope[];
  age?: number[];
}

type BacklogSortOption =
  | "URGENCY"
  | "AGE"
  | "CREATION_TIME"
  | "TRIGGER_TYPE";
```

---

### Backlog Actions

```typescript
type BacklogAction =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "SELECT_CANDIDATE"; candidateId: string }
  | { type: "CHRONICLE_NOW"; candidateId: string }
  | { type: "AUTO_CHRONICLE_ALL" }
  | { type: "DISMISS"; candidateId: string }
  | { type: "DISMISS_ALL" }
  | { type: "SET_FILTER"; filter: BacklogFilter }
  | { type: "SET_SORT"; sortBy: BacklogSortOption };
```

---

### Backlog Indicator

A subtle indicator shows pending items:

```typescript
interface BacklogIndicator {
  count: number;
  hasHighUrgency: boolean;
  hasAgeTransition: boolean;
}
```

**Display:**

```
📖 Chronicle Backlog (3)
```

- Badge shows count
- Color indicates urgency (red = HIGH, yellow = NORMAL, gray = LOW)
- No guilt, no pressure

---

## Expiry and Decay

### Expiry Configuration

```typescript
interface ExpiryConfig {
  enabled: boolean;
  defaultAgeExpiry: number;        // Default ages before expiry
  urgencyExpiry: Record<CandidateUrgency, number>;
  triggerTypeExpiry: Record<string, number>;
}
```

### Default Configuration

```typescript
const DEFAULT_EXPIRY_CONFIG: ExpiryConfig = {
  enabled: true,
  defaultAgeExpiry: 2,  // Default 2 ages before expiry
  urgencyExpiry: {
    HIGH: 999,       // Never expires
    NORMAL: 2,         // 2 ages
    LOW: 1              // 1 age
  },
  triggerTypeExpiry: {
    "AGE_ADVANCE": 999,     // Never expires
    "WAR_BEGIN": 999,        // Never expires
    "WAR_END": 999,          // Never expires
    "SETTLEMENT_FOUND": 999, // Never expires
    "NATION_PROCLAIM": 999,  // Never expires
    "RACE_EMERGE": 999,        // Never expires
    "MAJOR_TERRAIN": 999,     // Never expires
    "LANDMARK_CREATE": 999,     // Never expires
    "DISCOVERY": 1               // 1 age
    "CULTURE_TRAIT": 1,         // 1 age
    "BORDER_DRAW": 1               // 1 age
  }
};
```

### Expiry Rules

| Trigger Type       | Default Expiry |
| ----------------- | -------------- |
| Age transition     | Never          |
| First war          | Never          |
| First city         | Never          |
| Nation proclamation | Never          |
| Major terrain      | Never          |
| Landmark          | Never          |
| Race emergence     | Never          |
| Cultural trait     | 2 Ages         |
| Border drawn       | 1 Age          |
| Discovery         | 1 Age          |

### Expiry Processing

```typescript
function processExpiry(
  backlog: ChronicleBacklog,
  config: ExpiryConfig,
  currentAge: number
): ExpiredResult {
  const expired: string[] = [];

  for (const candidate of backlog.candidates) {
    if (candidate.status !== "PENDING") continue;

    const expiryAge = getExpiryAge(candidate, config);

    if (expiryAge !== undefined && currentAge >= expiryAge) {
      candidate.status = "EXPIRED";
      expired.push(candidate.id);
    }
  }

  return { expired };
}

function getExpiryAge(
  candidate: ChronicleCandidate,
  config: ExpiryConfig
): number | undefined {
  // Check candidate-specific expiry
  if (candidate.expiresAtAge !== undefined) {
    return candidate.expiresAtAge;
  }

  // Check trigger type expiry
  if (config.triggerTypeExpiry[candidate.triggerType] !== undefined) {
    return candidate.createdAtAge + config.triggerTypeExpiry[candidate.triggerType];
  }

  // Check urgency expiry
  if (config.urgencyExpiry[candidate.urgency] !== undefined) {
    return candidate.createdAtAge + config.urgencyExpiry[candidate.urgency];
  }

  // Check default
  if (config.defaultAgeExpiry > 0) {
    return candidate.createdAtAge + config.defaultAgeExpiry;
  }

  return undefined;
}
```

---

## Resolved Ambiguities

### 1. Backlog Persistence

**Decision**: Persist backlog across sessions; clear on new game.

**Persistence Rules**:

```typescript
interface BacklogPersistence {
  persistAcrossSessions: boolean;    // true - save to localStorage
  clearOnNewGame: boolean;         // true - reset when starting new campaign
  clearOnAgeTransition: boolean;   // false - preserve across ages
}

const DEFAULT_BACKLOG_PERSISTENCE: BacklogPersistence = {
  persistAcrossSessions: true,
  clearOnNewGame: true,
  clearOnAgeTransition: false
};
```

**Storage Locations**:

| Scenario       | Storage          | Behavior                      |
| -------------- | ---------------- | ----------------------------- |
| Save game     | Game save file   | Full backlog included           |
| Session close  | localStorage      | Pending candidates saved        |
| New game      | Clear            | Fresh backlog                 |
| Load game     | Game save file   | Restore backlog from save       |

**Persistence Implementation**:

```typescript
function saveBacklog(backlog: ChronicleBacklog): void {
  const persisted: PersistedBacklog = {
    version: "1.0.0",
    candidates: backlog.candidates,
    metadata: {
      lastSavedAt: Date.now(),
      currentAge: getCurrentAge(),
      gameId: getGameId()
    }
  };
  localStorage.setItem("chronicler_backlog", JSON.stringify(persisted));
}

function loadBacklog(gameId: string): ChronicleBacklog {
  const saved = localStorage.getItem("chronicler_backlog");

  if (!saved) {
    return createEmptyBacklog();
  }

  const persisted: PersistedBacklog = JSON.parse(saved);

  // Clear if different game
  if (persisted.metadata.gameId !== gameId) {
    return createEmptyBacklog();
  }

  return {
    candidates: persisted.candidates,
    lastProcessedTurn: persisted.metadata?.lastSavedAt ? 0 : persisted.metadata.lastProcessedTurn,
    lastProcessedAge: persisted.metadata?.currentAge || 1,
    persisted: true
  };
}

function createEmptyBacklog(): ChronicleBacklog {
  return {
    candidates: [],
    lastProcessedTurn: 0,
    lastProcessedAge: 0,
    persisted: false
  };
}
```

**Rationale**:
- Players may quit mid-session; backlog should persist
- New games start fresh, not carrying old candidates
- Game-specific isolation prevents cross-contamination
- Age transitions preserve backlog for continuity

---

### 2. Manual Recovery

**Decision**: Players can manually add chronicling opportunities for past events.

**Manual Recovery Mechanism**:

```typescript
interface ManualRecovery {
  enabled: boolean;
  maxPastTurns: number;            // Maximum turns back to allow recovery
}

function addManualCandidate(
  backlog: BacklogManager,
  pastEventIds: string[],
  template: LoreTemplate,
  context: Partial<LoreContext>
): ChronicleCandidate {
  const candidate: ChronicleCandidate = {
    id: generateChronicleCandidateID(),
    triggerType: template.trigger,
    sourceEventIds: pastEventIds,
    age: getCurrentAge(),
    scope: template.scope,
    urgency: "LOW",
    createdAtTurn: getCurrentTurn(),
    expiresAtAge: getCurrentAge() + 1, // 1 age to recover
    suggestedTemplates: [template.id],
    suggestedAuthors: ["UNKNOWN"],
    autoEligible: false,
    status: "PENDING"
  };

  backlog.addCandidate(candidate);
  return candidate;
}

function canRecoverEvent(event: WorldEvent, config: ManualRecovery): boolean {
  if (!config.enabled) return false;

  const turnsSinceEvent = getCurrentTurn() - event.turn;
  return turnsSinceEvent <= config.maxPastTurns;
}
```

**Rationale**:
- Allows players to add lore for events they missed
- Time limit prevents abuse
- Optional feature for power users
- Does not interfere with normal gameplay

---

### 3. Merge Threshold

**Decision**: Candidates with same trigger type and related objects are merged.

**Merge Strategy**:

```typescript
function mergeCandidates(
  candidates: ChronicleCandidate[]
): ChronicleCandidate[] {
  const merged: Map<string, ChronicleCandidate> = new Map();

  for (const candidate of candidates) {
    const key = getCandidateKey(candidate);

    if (merged.has(key)) {
      const existing = merged.get(key)!;

      // Merge source event IDs
      existing.sourceEventIds = [
        ...existing.sourceEventIds,
        ...candidate.sourceEventIds
      ];

      // Keep earliest creation time
      if (candidate.createdAtTurn < existing.createdAtTurn) {
        existing.createdAtTurn = candidate.createdAtTurn;
      }

      // Merge suggested templates
      existing.suggestedTemplates = [
        ...new Set([
          ...existing.suggestedTemplates,
          ...candidate.suggestedTemplates
        ])
      ];

      // Merge suggested authors
      existing.suggestedAuthors = [
        ...new Set([
          ...existing.suggestedAuthors,
          ...candidate.suggestedAuthors
        ])
      ];
    } else {
      merged.set(key, { ...candidate });
    }
  }

  return Array.from(merged.values());
}

function getCandidateKey(candidate: ChronicleCandidate): string {
  return `${candidate.triggerType}:${candidate.relatedWorldIds?.join(",") || ""}`;
}
```

**Rationale**:
- Prevents duplicate candidates for same events
- Preserves all source events for traceability
- Reduces backlog clutter
- Combines template suggestions for better options

---

### 4. Expiry Notification

**Decision**: Players are notified when candidates expire.

**Notification System**:

```typescript
interface ExpiryNotification {
  showNotification: boolean;
  notificationQueue: ExpiredCandidate[];
}

function notifyExpiry(
  expiredCandidates: ChronicleCandidate[]
): void {
  // Add to notification queue
  for (const candidate of expiredCandidates) {
    // Show notification on next open
    // Could also show toast notification
  console.log(`Candidate expired: ${candidate.id}`);
  }
}
```

**Rationale**:
- Players may want to know they missed opportunities
- Prevents confusion about missing lore
- Optional feature - can be disabled

---

## Architecture Decisions

### 1. Backlog State Location

**Decision**: Separate chronicler state module.

**State Isolation**:

```typescript
// Chronicler backlog state is separate from game state
interface ChroniclerState {
  backlog: ChronicleBacklog;
  processingWindow: ProcessingWindow | null;
}

// Game state references chronicler state via IDs only
interface GameState {
  // ... existing game state
  // Chronicler integration is loose coupling
}
```

**Rationale**:
- Clear module boundaries
- Chronicler can be developed independently
- Game state remains focused on gameplay
- Chronicler state can be serialized separately

---

### 2. Candidate Deduplication

**Decision**: Deduplicate candidates based on trigger type and related objects.

**Deduplication Strategy**:

```typescript
function deduplicateCandidates(
  candidates: ChronicleCandidate[]
): ChronicleCandidate[] {
  const seen = new Map<string, ChronicleCandidate>();

  for (const candidate of candidates) {
    const key = getCandidateKey(candidate);

    if (seen.has(key)) {
      // Merge with existing
      const existing = seen.get(key)!;
      
      existing.sourceEventIds = [
        ...existing.sourceEventIds,
        ...candidate.sourceEventIds
      ];
      
      // Keep earliest
      if (candidate.createdAtTurn < existing.createdAtTurn) {
        existing.createdAtTurn = candidate.createdAtTurn;
      }
      
      // Replace in seen map
      seen.set(key, existing);
    } else {
      seen.set(key, candidate);
    }
  }

  return Array.from(seen.values());
}
```

**Rationale**:
- Prevents duplicate candidates for same events
- Reduces backlog clutter
- Preserves all source events for traceability
- Improves performance by reducing redundant processing

---

## Default Values

### Default Backlog Configuration

```typescript
const DEFAULT_BACKLOG_CONFIG: {
  maxCandidatesPerRound: 3,
  priorityOrder: { HIGH: 0, NORMAL: 1, LOW: 2 },
  autoProcessing: {
    enabled: true,
    processHighUrgency: true,
    processNormalUrgency: true,
    processLowUrgency: true,
    maxEntriesPerRound: 3,
    ageTransitionOverride: true
  },
  expiry: {
    enabled: true,
    defaultAgeExpiry: 2,
    urgencyExpiry: {
      HIGH: 999,
      NORMAL: 2,
      LOW: 1
    },
    triggerTypeExpiry: {
      "AGE_ADVANCE": 999,
      "WAR_BEGIN": 999,
      "WAR_END": 999,
      "SETTLEMENT_FOUND": 999,
      "NATION_PROCLAIM": 999,
      "RACE_EMERGE": 999,
      "MAJOR_TERRAIN": 999,
      "LANDMARK_CREATE": 999,
      "DISCOVERY": 1,
      "CULTURE_TRAIT": 1,
      "BORDER_DRAW": 1
    }
  },
  manualRecovery: {
    enabled: false,
    maxPastTurns: 100
  }
};
```

### Default Processing Windows

```typescript
const DEFAULT_PROCESSING_WINDOWS = {
  endOfRound: true,
  endOfAge: true,
  manualOpen: true,
  soloDowntime: true,
  sessionEnd: true
};
```

---

## Error Handling

### Empty Backlog

```typescript
function handleEmptyBacklog(): void {
  console.warn("Backlog is empty, no candidates to process");
}
```

### Invalid Candidate ID

```typescript
interface BacklogError extends Error {
  candidateId: string;
  operation: string;
}

function validateCandidate(candidate: ChronicleCandidate): void {
  if (!candidate.id) {
    throw new BacklogError(candidate.id, "Missing candidate ID");
  }
  if (!candidate.triggerType) {
    throw new BacklogError(candidate.id, "Missing trigger type");
  }
  if (!candidate.urgency) {
    throw new BacklogError(candidate.id, "Missing urgency");
  }
}
```

### Backlog Corruption Recovery

```typescript
function recoverBacklog(saved: string): ChronicleBacklog {
  try {
    const parsed: PersistedBacklog = JSON.parse(saved);

    // Validate structure
    if (!parsed.candidates || !Array.isArray(parsed.candidates)) {
      throw new Error("Invalid backlog structure");
    }

    // Validate each candidate
    const validCandidates = parsed.candidates.filter(c =>
      c.id && c.triggerType && c.status
    );

    if (validCandidates.length !== parsed.candidates.length) {
      console.warn(`Recovered ${validCandidates.length}/${parsed.candidates.length} candidates`);
    }

    return {
      candidates: validCandidates,
      lastProcessedTurn: parsed.metadata?.lastSavedAt ? 0 : parsed.metadata.lastProcessedTurn,
      lastProcessedAge: parsed.metadata?.currentAge || 1,
      persisted: true
    };
  } catch (e) {
    console.error("Failed to load backlog, creating empty:", e);
    return createEmptyBacklog();
  }
}
```

---

## Performance Requirements

### Backlog Operations

- **Add candidate**: < 1ms
- **Queue rebuild**: < 5ms for 100 candidates
- **Filter operations**: < 10ms for any filter combination
- **Priority sort**: < 10ms for 100 candidates
- **Get next candidate**: O(1) lookup

### Auto-Processing Performance

- **Candidate evaluation**: < 1ms per candidate
- **Auto-Chronicler call**: < 50ms per entry
- **Overall round processing**: < 100ms for full backlog

---

## Testing Requirements

### Unit Tests

- Backlog manager initializes with empty state
- Candidates are added and removed correctly
- Queue is rebuilt on every modification
- Priority comparator produces correct ordering
- Expiry processing marks candidates correctly

### Integration Tests

- Backlog persists and loads correctly across sessions
- Auto-processing respects configuration limits
- Manual recovery adds candidates for past events
- Deduplication merges candidates correctly
- Statistics are calculated accurately

### Edge Case Tests

- Empty backlog handles gracefully
- Duplicate candidates are merged correctly
- Invalid candidate IDs throw clear errors
- Corrupted save recovery works correctly
- Expiry processing handles all edge cases
