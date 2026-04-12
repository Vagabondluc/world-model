import { PreparationScheme } from '../types';

export const SCHEME_CATALOG: Record<string, PreparationScheme> = {
    MUSTERING: {
        id: "MUSTERING",
        name: "Muster Forces",
        boostsFactor: "capability",
        costPerTurn: { economic: 10, military: 5 } // Paying for recruitment/drills
    },
    HOARDING: {
        id: "HOARDING",
        name: "Hoard Resources",
        boostsFactor: "capability", // Specifically economic capability
        costPerTurn: { stability: -5 } // austerity hurts stability
    },
    DESTABILIZING: {
        id: "DESTABILIZING",
        name: "Sow Dissent",
        boostsFactor: "opportunity", // Weakens target
        costPerTurn: { economic: 20, political: 5 }
    },
    PROBING: {
        id: "PROBING",
        name: "Gather Intelligence",
        boostsFactor: "confidence", // Reveals fog
        costPerTurn: { economic: 5 }
    },
    BIDING: {
        id: "BIDING",
        name: "Bide Time",
        boostsFactor: "timing", // Waiting for season/tech
        costPerTurn: {} // Free, but opportunity cost of time
    }
};
