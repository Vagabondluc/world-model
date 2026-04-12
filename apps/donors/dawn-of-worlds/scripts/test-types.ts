import { C2S, S2C } from '../protocolTypes';
import { JournalEntry, ChronicleCandidate, LoreTemplate, LoreTrigger } from '../chroniclerTypes';
import { GameEvent } from '../types';

// Test Protocol Types
const testC2S: C2S = {
    t: "HELLO",
    room: "room1",
    playerId: "p1",
    clientVersion: "1.0.0"
};

const testS2C: S2C = {
    t: "WELCOME",
    room: "room1",
    serverTime: 1234567890,
    seq: 1,
    hash: "hash",
    age: 1,
    round: 1,
    turn: 1,
    activePlayerId: "p1",
    apRemaining: 3
};

// Test Chronicler Types
const testEntry: JournalEntry = {
    id: "je_A1_001",
    type: "CHRONICLE",
    age: 1,
    title: "Test Entry",
    text: "Some text",
    scope: "GLOBAL",
    triggeredByEventIds: ["evt1"],
    author: "THE_WORLD",
    timestamp: 1
};

const testCandidate: ChronicleCandidate = {
    id: "cc_123_001",
    triggerType: "TEST",
    sourceEventIds: ["evt1"],
    age: 1,
    scope: "GLOBAL",
    urgency: "LOW",
    createdAtTurn: 1,
    suggestedTemplates: ["tmpl1"],
    suggestedAuthors: ["THE_WORLD"],
    autoEligible: true,
    status: "PENDING"
};

console.log("Types verified successfully");
