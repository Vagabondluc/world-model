import { GameEvent, WorldKind, Hex } from './types';

// --- Error Handling ---

export type ErrorDetails =
    | { kind: "HEX_REQUIRED"; expected: number; actual: number; }
    | { kind: "HEX_DEPENDENCY_MISSING"; requiredKind: WorldKind; hex: Hex; }
    | { kind: "WORLD_DEPENDENCY_MISSING"; requiredKind: WorldKind; worldId?: string; }
    | { kind: "AGE_FORBIDDEN"; age: number; kindAttempted: WorldKind; }
    | { kind: "PROTECTED_UNTIL_END_OF_ROUND"; worldId: string; createdBy: string; createdRound: number; }
    | { kind: "AP_INSUFFICIENT"; remaining: number; required: number; }
    | { kind: "TURN_OWNERSHIP"; activePlayerId: string; }
    | { kind: "BAD_COORDS"; expected: { age: number; round: number; turn: number }; received: { age: number; round: number; turn: number }; };

// --- Wire Protocol Messages ---

export type Message = C2S | S2C;

export type C2S =
    | { t: "HELLO"; room: string; playerId: string; clientVersion: string }
    | { t: "PULL"; room: string; sinceSeq: number }
    | { t: "PUSH_EVENT"; room: string; event: GameEvent; prevHash?: string };

export type S2C =
    | { t: "WELCOME"; room: string; serverTime: number; seq: number; hash: string; age?: number; round?: number; turn?: number; activePlayerId?: string; apRemaining?: number }
    | { t: "EVENT"; room: string; seq: number; event: GameEvent; hash: string }
    | { t: "BATCH"; room: string; fromSeq: number; toSeq: number; events: Array<{ seq: number; event: GameEvent; hash: string }> }
    | { t: "ERROR"; code: string; message: string; details?: ErrorDetails };
