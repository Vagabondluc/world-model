import { C2S, S2C, ErrorDetails } from '../protocolTypes';
import { JournalEntry, ChronicleCandidate, LoreTemplate, LoreTrigger, LoreContext, TriggerCondition } from '../chroniclerTypes';
import { GameEvent, BaseEvent, WorldEvent } from '../types';

console.log("Starting Type Integration Tests...");

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
    if (condition) {
        console.log(`[PASS] ${testName}`);
        passed++;
    } else {
        console.error(`[FAIL] ${testName}`);
        failed++;
    }
}

// Mock Data
const mockEvent: GameEvent = {
    id: "evt-1",
    ts: 100,
    playerId: "p1",
    age: 1,
    round: 1,
    turn: 1,
    type: "TURN_BEGIN",
    payload: { playerId: "p1" }
};

const mockWorldEvent: WorldEvent = {
    id: "evt-2",
    ts: 200,
    playerId: "p1",
    age: 1,
    round: 1,
    turn: 1,
    type: "WORLD_CREATE",
    cost: 1,
    payload: { worldId: "w1", kind: "TERRAIN", hexes: [{ q: 0, r: 0 }] }
};

// --- Group 1: Protocol - C2S Messages ---

// 1. Verify HELLO structure
const helloMsg: C2S = { t: "HELLO", room: "r1", playerId: "p1", clientVersion: "v1" };
assert(helloMsg.t === "HELLO" && helloMsg.room === "r1", "G1-1: HELLO structure");

// 2. Verify PULL structure
const pullMsg: C2S = { t: "PULL", room: "r1", sinceSeq: 10 };
assert(pullMsg.t === "PULL" && pullMsg.sinceSeq === 10, "G1-2: PULL structure");

// 3. Verify PUSH_EVENT with WorldCreate
const pushMsg: C2S = { t: "PUSH_EVENT", room: "r1", event: mockWorldEvent };
assert(pushMsg.event.type === "WORLD_CREATE", "G1-3: PUSH_EVENT payload");

// 4. Verify PUSH_EVENT optional prevHash
const pushMsgHash: C2S = { t: "PUSH_EVENT", room: "r1", event: mockWorldEvent, prevHash: "abc" };
assert(pushMsgHash.prevHash === "abc", "G1-4: PUSH_EVENT optional hash");

// 5. Verify C2S union discrimination
function processC2S(msg: C2S) {
    if (msg.t === "HELLO") return "hello";
    if (msg.t === "PULL") return "pull";
    if (msg.t === "PUSH_EVENT") return "push";
    return "unknown";
}
assert(processC2S(helloMsg) === "hello", "G1-5: C2S discrimination");


// --- Group 2: Protocol - S2C Messages ---

// 6. Verify WELCOME full state
const welcomeMsg: S2C = { t: "WELCOME", room: "r1", serverTime: 100, seq: 1, hash: "h1", age: 1, round: 1, turn: 1, activePlayerId: "p1", apRemaining: 5 };
assert(welcomeMsg.t === "WELCOME" && welcomeMsg.apRemaining === 5, "G2-6: WELCOME full state");

// 7. Verify WELCOME optional fields
const welcomeMsgMin: S2C = { t: "WELCOME", room: "r1", serverTime: 100, seq: 1, hash: "h1" };
assert(welcomeMsgMin.age === undefined, "G2-7: WELCOME optional fields");

// 8. Verify EVENT broadcast
const eventMsg: S2C = { t: "EVENT", room: "r1", seq: 2, event: mockEvent, hash: "h2" };
assert(eventMsg.event.id === "evt-1", "G2-8: EVENT broadcast");

// 9. Verify BATCH message
const batchMsg: S2C = { t: "BATCH", room: "r1", fromSeq: 1, toSeq: 2, events: [{ seq: 1, event: mockEvent, hash: "h1" }] };
assert(batchMsg.events.length === 1, "G2-9: BATCH structure");

// 10. Verify S2C union discrimination
function processS2C(msg: S2C) {
    return msg.t;
}
assert(processS2C(eventMsg) === "EVENT", "G2-10: S2C discrimination");


// --- Group 3: Protocol - Error Handling ---

// 11. Verify ERROR structure
const errorMsg: S2C = { t: "ERROR", code: "ERR", message: "fail" };
assert(errorMsg.code === "ERR", "G3-11: ERROR structure");

// 12. Verify HEX_REQUIRED detail
const errHex: ErrorDetails = { kind: "HEX_REQUIRED", expected: 1, actual: 0 };
assert(errHex.kind === "HEX_REQUIRED", "G3-12: HEX_REQUIRED detail");

// 13. Verify TURN_OWNERSHIP detail
const errTurn: ErrorDetails = { kind: "TURN_OWNERSHIP", activePlayerId: "p2" };
assert(errTurn.activePlayerId === "p2", "G3-13: TURN_OWNERSHIP detail");

// 14. Verify PROTECTED_UNTIL_END detail
const errProt: ErrorDetails = { kind: "PROTECTED_UNTIL_END_OF_ROUND", worldId: "w1", createdBy: "p1", createdRound: 1 };
assert(errProt.worldId === "w1", "G3-14: PROTECTED detail");

// 15. Verify generic ERROR without details
const errGen: S2C = { t: "ERROR", code: "GENERIC", message: "msg" };
assert(errGen.details === undefined, "G3-15: ERROR no details");


// --- Group 4: Chronicler - Journal Entries ---

// 16. Verify CHRONICLE entry
const chronicle: JournalEntry = {
    id: "je1", type: "CHRONICLE", age: 1, title: "History", text: "txt",
    scope: "GLOBAL", triggeredByEventIds: [], author: "THE_WORLD", timestamp: 1
};
assert(chronicle.type === "CHRONICLE", "G4-16: CHRONICLE entry");

// 17. Verify MYTH entry
const myth: JournalEntry = {
    id: "je2", type: "MYTH", age: 1, title: "Legend", text: "txt",
    scope: "REGIONAL", triggeredByEventIds: [], author: "CULTURE_1", timestamp: 1
};
assert(myth.type === "MYTH", "G4-17: MYTH entry");

// 18. Verify OBSERVATION entry
const observation: JournalEntry = {
    id: "je3", type: "OBSERVATION", age: 1, title: "Sight", text: "txt",
    scope: "LOCAL", triggeredByEventIds: [], author: "Unknown", timestamp: 1
};
assert(observation.type === "OBSERVATION", "G4-18: OBSERVATION entry");

// 19. Verify provenance
const provEntry: JournalEntry = {
    ...chronicle,
    provenance: { generatedBy: "AUTO", tablesUsed: ["t1"], reviewed: true }
};
assert(provEntry.provenance?.generatedBy === "AUTO", "G4-19: Provenance metadata");

// 20. Verify relatedHexes
const hexEntry: JournalEntry = {
    ...chronicle,
    relatedHexes: [{ q: 0, r: 0 }]
};
assert(hexEntry.relatedHexes?.[0].q === 0, "G4-20: Related hexes");


// --- Group 5: Chronicler - Candidates ---

// 21. Verify ChronicleCandidate creation
const candidate: ChronicleCandidate = {
    id: "cc1", triggerType: "T1", sourceEventIds: ["e1"], age: 1,
    scope: "GLOBAL", urgency: "NORMAL", createdAtTurn: 1,
    suggestedTemplates: [], suggestedAuthors: [], autoEligible: true, status: "PENDING"
};
assert(candidate.id === "cc1", "G5-21: Candidate creation");

// 22. Verify status transitions
const processedCand: ChronicleCandidate = { ...candidate, status: "CHRONICLED", processedAtTurn: 2 };
assert(processedCand.status === "CHRONICLED", "G5-22: Status transition");

// 23. Verify urgency levels
const highUrg: ChronicleCandidate = { ...candidate, urgency: "HIGH" };
assert(highUrg.urgency === "HIGH", "G5-23: Urgency check");

// 24. Verify autoEligible flag
const manualCand: ChronicleCandidate = { ...candidate, autoEligible: false };
assert(manualCand.autoEligible === false, "G5-24: Auto eligible check");

// 25. Verify resultingEntryId linkage
const linkedCand: ChronicleCandidate = { ...candidate, resultingEntryId: "je1" };
assert(linkedCand.resultingEntryId === "je1", "G5-25: Entry linkage");


// --- Group 6: Chronicler - Logic & Templates ---

// 26. Verify LoreContext structure
const ctx: LoreContext = { age: 1, eventName: "e1", isFirstCity: true, custom: { key: "value" } };
assert(ctx.isFirstCity === true, "G6-26: Context structure");

// 27. Verify LoreTemplate string generators
const tmplStr: LoreTemplate = {
    id: "t1", version: "1.0", trigger: {} as any, entryType: "CHRONICLE", scope: "GLOBAL",
    title: "Static Title", text: "Static Text", author: "Nobody",
    requiredContext: [], optionalContext: []
};
assert(typeof tmplStr.title === "string", "G6-27: String generators");

// 28. Verify LoreTemplate function generators
const tmplFn: LoreTemplate = {
    ...tmplStr,
    title: (c) => `Age ${c.age}`,
    author: (c) => c.isFirstCity ? "Mayor" : "Nobody"
};
assert(typeof tmplFn.title === "function", "G6-28: Function generators");

// 29. Verify LoreTrigger ALWAYS condition
const trigAlways: TriggerCondition = { type: "ALWAYS" };
assert(trigAlways.type === "ALWAYS", "G6-29: ALWAYS condition");

// 30. Verify LoreTrigger THRESHOLD condition
const trigThresh: TriggerCondition = { type: "THRESHOLD", metric: "count", operator: "GTE", value: 5, scope: "GLOBAL" };
assert(trigThresh.type === "THRESHOLD" && trigThresh.value === 5, "G6-30: THRESHOLD condition");


console.log(`\nTests Completed: ${passed} Passed, ${failed} Failed`);
// --- Group 7: Protocol - Advanced Errors ---

// 31. Verify AGE_FORBIDDEN detail
const errAge: ErrorDetails = { kind: "AGE_FORBIDDEN", age: 1, kindAttempted: "REGION" };
assert(errAge.kind === "AGE_FORBIDDEN", "G7-31: AGE_FORBIDDEN detail");

// 32. Verify WORLD_DEPENDENCY_MISSING detail
const errDep: ErrorDetails = { kind: "WORLD_DEPENDENCY_MISSING", requiredKind: "REGION", worldId: "w1" };
assert(errDep.kind === "WORLD_DEPENDENCY_MISSING", "G7-32: WORLD_DEPENDENCY_MISSING detail");

// 33. Verify AP_INSUFFICIENT detail
const errAp: ErrorDetails = { kind: "AP_INSUFFICIENT", remaining: 1, required: 2 };
assert(errAp.remaining === 1, "G7-33: AP_INSUFFICIENT detail");

// 34. Verify BAD_COORDS detail
const errCoords: ErrorDetails = { kind: "BAD_COORDS", expected: { age: 1, round: 1, turn: 1 }, received: { age: 1, round: 1, turn: 2 } };
assert(errCoords.received.turn === 2, "G7-34: BAD_COORDS detail");

// 35. Verify generic structural integrity
function processError(e: ErrorDetails) {
    if (e.kind === "HEX_REQUIRED") return "hex";
    return "other";
}
assert(processError({ kind: "HEX_REQUIRED", expected: 1, actual: 0 }) === "hex", "G7-35: Error union integrity");


// --- Group 8: Chronicler - Composite Triggers ---

// 36. Verify AND condition
const condAnd: TriggerCondition = { type: "AND", conditions: [{ type: "ALWAYS" }] };
assert(condAnd.type === "AND", "G8-36: AND condition");

// 37. Verify OR condition
const condOr: TriggerCondition = { type: "OR", conditions: [{ type: "ALWAYS" }] };
assert(condOr.type === "OR", "G8-37: OR condition");

// 38. Verify NOT condition
const condNot: TriggerCondition = { type: "NOT", conditions: [{ type: "ALWAYS" }] };
assert(condNot.type === "NOT", "G8-38: NOT condition");

// 39. Verify nested composite conditions
const condNested: TriggerCondition = {
    type: "AND",
    conditions: [
        { type: "OR", conditions: [{ type: "ALWAYS" }] }
    ]
};
assert(condNested.conditions[0].type === "OR", "G8-39: Nested composite conditions");

// 40. Verify FIRST_OF_KIND filters
const condFilter: TriggerCondition = {
    type: "FIRST_OF_KIND",
    kind: "CITY",
    scope: "GLOBAL",
    filters: { named: true }
};
assert(condFilter.type === "FIRST_OF_KIND" && condFilter.filters?.named === true, "G8-40: FIRST_OF_KIND filters");


// --- Group 9: Chronicler - Template Context ---

// 41. Verify optionalContext array
const tmplCtx: LoreTemplate = {
    ...tmplStr,
    optionalContext: ["customKey"]
};
assert(tmplCtx.optionalContext.includes("customKey"), "G9-41: Optional context");

// 42. Verify eventName in context
const ctxEvent: LoreContext = { age: 1, eventName: "Battle of X" };
assert(ctxEvent.eventName === "Battle of X", "G9-42: Event name context");

// 43. Verify mythicSeed array
const ctxMyth: LoreContext = { age: 1, mythicSeed: ["seed1", "seed2"] };
assert(ctxMyth.mythicSeed?.length === 2, "G9-43: Mythic seed");

// 44. Verify tone literals
const ctxTone: LoreContext = { age: 1, tone: "ominous" };
assert(ctxTone.tone === "ominous", "G9-44: Tone literal");

// 45. Verify custom context record
const ctxCustom: LoreContext = { age: 1, custom: { value: 123 } };
assert(ctxCustom.custom?.value === 123, "G9-45: Custom context");


// --- Group 10: Protocol - Sequence Logic ---

// 46. Verify PULL genesis sequence
const pullGen: C2S = { t: "PULL", room: "r1", sinceSeq: 0 };
assert(pullGen.sinceSeq === 0, "G10-46: Genesis PULL");

// 47. Verify BATCH multiple items
const batchMulti: S2C = {
    t: "BATCH", room: "r1", fromSeq: 1, toSeq: 2,
    events: [
        { seq: 1, event: mockEvent, hash: "h1" },
        { seq: 2, event: mockEvent, hash: "h2" }
    ]
};
assert(batchMulti.events.length === 2, "G10-47: Multi-item BATCH");

// 48. Verify PUSH_EVENT player ID
const pushPid: C2S = { t: "PUSH_EVENT", room: "r1", event: { ...mockWorldEvent, playerId: "p99" } };
assert(pushPid.event.playerId === "p99", "G10-48: PUSH_EVENT player");

// 49. Verify WELCOME sequence type
const welcomeSeq: S2C = { ...welcomeMsg, seq: 100 };
assert(typeof welcomeSeq.seq === "number", "G10-49: Sequence type");

// 50. Verify EVENT hash type
const eventHash: S2C = { ...eventMsg, hash: "deadbeef" };
assert(typeof eventHash.hash === "string", "G10-50: Hash type");


// --- Group 11: Chronicler - Review & Provenance ---

// 51. Verify GUIDED provenance
const provGuided: JournalEntry["provenance"] = { generatedBy: "GUIDED" };
assert(provGuided?.generatedBy === "GUIDED", "G11-51: GUIDED provenance");

// 52. Verify MANUAL entry
const entryManual: JournalEntry = {
    ...chronicle,
    provenance: { generatedBy: "MANUAL" }
};
assert(entryManual.provenance?.generatedBy === "MANUAL", "G11-52: MANUAL entry");

// 53. Verify tablesUsed
const provTables: JournalEntry["provenance"] = { generatedBy: "AUTO", tablesUsed: ["t1", "t2"] };
assert(provTables?.tablesUsed?.length === 2, "G11-53: Tables used");

// 54. Verify reviewed flag
const provRev: JournalEntry["provenance"] = { generatedBy: "AUTO", reviewed: false };
assert(provRev?.reviewed === false, "G11-54: Reviewed flag");

// 55. Verify optional provenance
const entryNoProv: JournalEntry = { ...chronicle, provenance: undefined };
assert(entryNoProv.provenance === undefined, "G11-55: Optional provenance");


// --- Group 12: Cross-Domain Integration ---

// 56. Verify Hex type in JournalEntry
const entryHexes: JournalEntry = { ...chronicle, relatedHexes: [{ q: 1, r: -1 }] };
assert(entryHexes.relatedHexes?.[0].r === -1, "G12-56: Hex cross-domain");

// 57. Verify WorldKind usage in ErrorDetails
const errKind: ErrorDetails = { kind: "WORLD_DEPENDENCY_MISSING", requiredKind: "NATION", worldId: "w1" };
assert(errKind.requiredKind === "NATION", "G12-57: WorldKind cross-domain");

// 58. Verify PlayerId in C2S
const msgPlayer: C2S = { t: "HELLO", room: "r1", playerId: "user-123", clientVersion: "v1" };
assert(msgPlayer.playerId === "user-123", "G12-58: PlayerId cross-domain");

// 59. Verify GameEvent in S2C
const msgEvent: S2C = { t: "EVENT", room: "r1", seq: 1, event: mockEvent, hash: "h1" };
assert(msgEvent.event.id === "evt-1", "G12-59: GameEvent cross-domain");

// 60. Verify WorldCreate payload integration
const createPayload = mockWorldEvent.payload;
assert(createPayload.kind === "TERRAIN", "G12-60: Payload cross-domain");


console.log(`\nTests Completed: ${passed} Passed, ${failed} Failed`);
if (failed > 0) process.exit(1);
