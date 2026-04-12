
import { z } from 'zod';
import { AbsTimeSchema, MathPPMSchema } from './core';

// --- NARRATIVE PRODUCTION (docs/update/specs/130-narrative-and-myth-production-engine.md) ---

export const NarrativeArtifactIdSchema = z.string().uuid();
export type NarrativeArtifactId = z.infer<typeof NarrativeArtifactIdSchema>;

export const NarrativeScopeSchema = z.enum(["local", "regional", "civilizational"]);
export type NarrativeScope = z.infer<typeof NarrativeScopeSchema>;

export const NarrativeToneSchema = z.enum(["heroic", "tragic", "bureaucratic", "propagandist", "revisionist"]);
export type NarrativeTone = z.infer<typeof NarrativeToneSchema>;

export const NarrativeArtifactSchema = z.object({
  artifactId: NarrativeArtifactIdSchema,
  eventId: z.string(), // Source event ID
  sourceActorId: z.string().optional(), // Who created this narrative (optional for V1)
  
  narrativeKey: z.string(), // e.g. "myth_founding_heroic"
  scope: NarrativeScopeSchema,
  tone: NarrativeToneSchema,
  
  // Content
  heroes: z.array(z.string()),
  villains: z.array(z.string()),
  lesson: z.string(),
  
  // Metrics (PPM)
  beliefShiftPPM: z.number().int(), // Signed
  mythRetentionPPM: MathPPMSchema, // How likely it is to stick
  
  // State
  creationTick: AbsTimeSchema,
  isMyth: z.boolean()
});
export type NarrativeArtifact = z.infer<typeof NarrativeArtifactSchema>;

export const NarrativeAdoptionStateSchema = z.object({
  populationBlockId: z.string(),
  artifactId: NarrativeArtifactIdSchema,
  adoptionPPM: MathPPMSchema,
  polarizationPPM: MathPPMSchema
});
export type NarrativeAdoptionState = z.infer<typeof NarrativeAdoptionStateSchema>;

export const NarrativeInputsSchema = z.object({
  sourceTrustPPM: MathPPMSchema,
  sourceReachPPM: MathPPMSchema,
  identityAffinityPPM: MathPPMSchema,
  crisisIntensityPPM: MathPPMSchema
});
export type NarrativeInputs = z.infer<typeof NarrativeInputsSchema>;
