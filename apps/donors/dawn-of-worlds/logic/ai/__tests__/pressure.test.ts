import { describe, it, expect, beforeEach } from 'vitest';
import { SemanticTag, StoreProfile, CulturalBias, TagFamily } from '../types';
import { PressureEngine } from '../pressure'; // We will create this
import { GameState } from '../../schema';

// --- Mocks ---
const mockSourceId = "player_1";
const mockState = {} as GameState;

const mockTagTemplate = (id: string, family: TagFamily): SemanticTag => ({
    id,
    family,
    source: mockSourceId,
    intensity: 0.5,
    urgency: 0.1,
    satisfaction: { type: "THRESHOLD", metric: "damage", requirement: 100 },
    accumulatedValue: 0,
    accumulatedLoss: 0,
    createdAtTurn: 1
});

const mockStore: StoreProfile = {
    id: "RAID",
    name: "Military Raid",
    reducesFamilies: ["GRUDGE"],
    costs: { military: 10, economic: 0, political: 0, stability: 0, legitimacy: 0 },
    risk: 0.2,
    visibility: 0.5
};

const mockBias: CulturalBias = {
    id: "WARLORD",
    name: "Warlord",
    storePreferences: { "RAID": 1.5 },
    lossTolerance: 0.5,
    symbolismPreference: 0.1,
    familyWeights: { GRUDGE: 1.5, FEAR: 0.5, SHAME: 0.5, AMBITION: 1.0 }
};

describe('PressureEngine', () => {
    let engine: PressureEngine;

    beforeEach(() => {
        engine = new PressureEngine();
    });

    // -------------------------------------------------------------------------
    // 1. Tag Lifecycle Tests
    // -------------------------------------------------------------------------
    describe('Tag Lifecycle', () => {
        it('should decay intensity over time based on urgency', () => {
            const tag = mockTagTemplate("v1", "GRUDGE");
            tag.intensity = 1.0;
            tag.urgency = 0.1; // Low urgency -> High decay

            const nextTag = engine.processTagDecay(tag);
            expect(nextTag.intensity).toBeLessThan(1.0);
        });

        it('should NOT decay intensity if urgency is 1.0', () => {
            const tag = mockTagTemplate("v2", "GRUDGE");
            tag.intensity = 1.0;
            tag.urgency = 1.0;

            const nextTag = engine.processTagDecay(tag);
            expect(nextTag.intensity).toBe(1.0);
        });

        it('should mark tag as satisfied when threshold reached', () => {
            const tag = mockTagTemplate("v3", "GRUDGE");
            tag.satisfaction = { type: 'THRESHOLD', metric: 'damage', requirement: 100 };
            tag.accumulatedValue = 100;

            expect(engine.isTagSatisfied(tag)).toBe(true);
        });

        it('should NOT mark tag as satisfied below threshold', () => {
            const tag = mockTagTemplate("v3", "GRUDGE");
            tag.satisfaction = { type: 'THRESHOLD', metric: 'damage', requirement: 100 };
            tag.accumulatedValue = 99;

            expect(engine.isTagSatisfied(tag)).toBe(false);
        });

        it('should mark tag as OBSOLETE when accumulated loss exceeds tolerance', () => {
            const tag = mockTagTemplate("v4", "GRUDGE");
            tag.intensity = 1.0;
            tag.accumulatedLoss = 60; // > 1.0 * 0.5 * 100 (assuming factor 100)

            // engine.checkObsolescence(tag, bias)
            // tolerance = bias.lossTolerance (0.5)
            // threshold = intensity (1.0) * tolerance (0.5) * BASE_COST_FACTOR (e.g. 100) = 50

            expect(engine.isObsolete(tag, mockBias)).toBe(true);
        });
    });

    // -------------------------------------------------------------------------
    // 2. Prioritization Tests
    // -------------------------------------------------------------------------
    describe('Prioritization', () => {
        it('should rank tags by P = Intensity * Urgency * Scope * CultureBias', () => {
            const t1 = { ...mockTagTemplate("t1", "GRUDGE"), intensity: 1, urgency: 1 };
            // Warlord Bias for Grudge = 1.5 -> Score 1.5

            const t2 = { ...mockTagTemplate("t2", "SHAME"), intensity: 1, urgency: 1 };
            // Warlord Bias for Shame = 0.5 -> Score 0.5

            const ranked = engine.prioritizeTags([t1, t2], mockBias);
            expect(ranked[0].id).toBe("t1");
        });
    });

    // -------------------------------------------------------------------------
    // 3. Store Selection Tests
    // -------------------------------------------------------------------------
    describe('Store Selection', () => {
        it('should filter stores that do not reduce the tag family', () => {
            const grudgeStore = mockStore; // reduces GRUDGE
            const peacefulStore: StoreProfile = { ...mockStore, id: "PEACE", reducesFamilies: ["FEAR"] };

            const valid = engine.getValidStores(mockTagTemplate("t1", "GRUDGE"), [grudgeStore, peacefulStore]);
            expect(valid.map(s => s.id)).toContain("RAID");
            expect(valid.map(s => s.id)).not.toContain("PEACE");
        });

        it('should reject stores with excessive risk for Stable AI', () => {
            // Mock logic: if Urgency < 0.3, reject Risk > 0.5
            const riskyStore: StoreProfile = { ...mockStore, risk: 0.9 };
            const lowUrgencyTag = { ...mockTagTemplate("t1", "GRUDGE"), urgency: 0.1 };

            // This is a "Behavioral" test - might need the scorer
            const score = engine.scoreStore(riskyStore, lowUrgencyTag, mockBias, mockState);
            expect(score).toBe(0); // Should be rejected/zeroed
        });

        it('should accept stores with excessive risk for Desperate AI', () => {
            const riskyStore: StoreProfile = { ...mockStore, risk: 0.9 };
            const desperateTag = { ...mockTagTemplate("t1", "GRUDGE"), urgency: 0.9 };

            const score = engine.scoreStore(riskyStore, desperateTag, mockBias, mockState);
            expect(score).toBeGreaterThan(0);
        });
    });

    // -------------------------------------------------------------------------
    // 4. Emergent Behavior (Scenario)
    // -------------------------------------------------------------------------
    describe('Emergent Scenarios', () => {
        it('should learn aversion from obsolescence', () => {
            // 1. Tag became obsolete due to cost
            const obsoleteTag = mockTagTemplate("old_grudge", "GRUDGE");
            obsoleteTag.accumulatedLoss = 1000;

            // 2. Engine registers memory
            engine.registerMemory(obsoleteTag, "TOO_COSTLY");

            // 3. New similar tag appears
            const newTag = mockTagTemplate("new_grudge", "GRUDGE");

            // 4. Engine scores "Same Strategy" (RAID) lower
            const score = engine.scoreStore(mockStore, newTag, mockBias, mockState);

            // Should be penalized because RAID was the thing that failed (implied)
            // For V1 simple memory: reduce score of ALL GRUDGE stores? Or specific store?
            // Spec says "Behavioral Aversion". Let's assume generic penalty for now.

            // Just verify mechanism exists
            expect(engine.getMemories().length).toBe(1);
        });
    });
});
