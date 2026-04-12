
// =========================================================================================
// 🏛️ PROJECT CONSTITUTION & ARCHITECTURAL CONTRACT
// =========================================================================================
// This file serves as the "DNA" of the project. It uses TypeScript's structural typing
// to enforce the existence of critical systems and non-negotiable features.
//
// If an AI or developer attempts to refactor the codebase and removes any of these
// keys or modules, the build WILL fail immediately.
//
// DO NOT MODIFY THIS FILE WITHOUT EXPLICIT CONSENT.
// =========================================================================================

import { Chronicler } from './chronicler';
import { GameStore } from '../store/gameStore';

/**
 * The `NonNegotiable` type wraps a feature to indicate its permanence.
 */
export type NonNegotiable<T> = T;

/**
 * 1. THE CHRONICLER SYSTEM
 * -----------------------------------------------------------------------------------------
 * We must have a historical engine that converts events into narrative.
 * It must support:
 * - Event Processing
 * - Candidate Generation
 * - Trigger Evaluation
 */
export interface ChroniclerContract {
    readonly engine: NonNegotiable<Chronicler>;
    readonly version: "1.0.0"; // Version lock
}

/**
 * 2. THE SIMULATION CORE
 * -----------------------------------------------------------------------------------------
 * The game must remain state-driven and deterministic.
 */
export interface SimulationContract {
    readonly store: NonNegotiable<GameStore>;
}

/**
 * 3. THE GLOBAL CONSTITUTION
 * -----------------------------------------------------------------------------------------
 * This object is never actually instantiated at runtime; it exists purely for
 * compile-time verification of the architecture.
 */
export interface ProjectConstitution {
    readonly chronicler: ChroniclerContract;
    readonly simulation: SimulationContract;

    // Future "Steering" Types can be added here
    readonly narrativeDirection?: "Emergent" | "Guided";
    readonly physicsFidelity?: "Arcade" | "Simulation";
}

// -----------------------------------------------------------------------------------------
// ARCHITECTURAL VERIFICATION (COMPILE-TIME ONLY)
// -----------------------------------------------------------------------------------------
// This function will cause a TS error if the imported modules don't satisfy the contract.
// It is "dead code" but "live protection".
export function verifyArchitecture(
    c: Chronicler,
    s: GameStore
): ProjectConstitution {
    return {
        chronicler: {
            engine: c,
            version: "1.0.0"
        },
        simulation: {
            store: s
        }
    };
}
