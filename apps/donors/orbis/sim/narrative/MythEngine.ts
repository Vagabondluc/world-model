
import { DomainId, AbsTime } from '../../core/types';
import { ISimDomain } from '../../core/time/types';
import { ChronicleEntry } from './types';
import { NarrativeArtifact, NarrativeArtifactIdSchema } from '../../core/schemas/narrative';
import { clampPPM01, mulPPM, PPM_ONE } from '../../core/math';
import { SimTracer } from '../history/EventTracer';

/**
 * MythEngine
 * Transforms raw events into cultural narratives and myths.
 * Follows spec ID: 130-narrative-and-myth-production-engine.
 */
export class MythEngine implements ISimDomain {
  public readonly id = DomainId.MYTHOS; 

  // State
  private artifacts = new Map<string, NarrativeArtifact>();
  private activeNarratives: string[] = []; // List of IDs

  // Config
  private readonly MYTH_HARDENING_THRESHOLD = 800_000; // PPM
  private readonly DECAY_RATE = 5_000; // PPM per tick

  public step(): void {
    // 1. Decay Narratives
    for (const id of this.activeNarratives) {
      const artifact = this.artifacts.get(id);
      if (!artifact) continue;

      if (!artifact.isMyth) {
        // Simple decay for non-myths
        artifact.mythRetentionPPM = Math.max(0, artifact.mythRetentionPPM - this.DECAY_RATE);
        
        // Hardening Check
        if (artifact.mythRetentionPPM > this.MYTH_HARDENING_THRESHOLD) {
          this.hardenToMyth(artifact);
        }

        // Forgotten?
        if (artifact.mythRetentionPPM <= 0) {
            this.artifacts.delete(id);
        }
      }
    }
    
    // Cleanup list
    this.activeNarratives = this.activeNarratives.filter(id => this.artifacts.has(id));
  }

  /**
   * Ingests a chronicle entry (event) and potentially creates a narrative artifact.
   */
  public ingestEvent(entry: ChronicleEntry, inputs: { crisisPPM: number }): void {
    // Only interesting events generate narratives
    if (entry.severity === 'info') return;

    const baseRetention = entry.severity === 'critical' ? 500_000 : 200_000;
    const crisisBoost = mulPPM(inputs.crisisPPM, 300_000);
    
    const artifact: NarrativeArtifact = {
        artifactId: crypto.randomUUID(),
        eventId: entry.id,
        narrativeKey: `narrative_${entry.domain}_${entry.year}`,
        scope: entry.severity === 'critical' ? 'civilizational' : 'regional',
        tone: 'heroic', // Default, would derive from source bias
        heroes: [],
        villains: [],
        lesson: `The age of ${entry.title} taught us caution.`,
        beliefShiftPPM: 0,
        mythRetentionPPM: clampPPM01(baseRetention + crisisBoost),
        creationTick: entry.tick,
        isMyth: false
    };

    this.artifacts.set(artifact.artifactId, artifact);
    this.activeNarratives.push(artifact.artifactId);

    // Trace creation
    // We don't use SimTracer here to avoid recursive loops if we logged "Narrative Created"
  }

  private hardenToMyth(artifact: NarrativeArtifact) {
    artifact.isMyth = true;
    artifact.tone = 'heroic'; // Myths tend to drift to heroic/tragic
    
    SimTracer.trace({
        time: 0n, // Context will fill
        domain: this.id,
        title: "Myth Solidified",
        message: `The story of "${artifact.lesson}" has become a foundational myth.`,
        severity: 'flavor'
    });
  }

  public regenerateTo(tNowUs: AbsTime): void {
    this.artifacts.clear();
    this.activeNarratives = [];
  }

  public getArtifacts(): NarrativeArtifact[] {
      return Array.from(this.artifacts.values());
  }

  // --- Persistence Hooks ---
  
  public getSnapshot(): any {
      return {
          artifacts: Array.from(this.artifacts.entries()),
          activeNarratives: this.activeNarratives
      };
  }

  public restoreSnapshot(state: any): void {
      if (!state) return;
      this.artifacts = new Map(state.artifacts);
      this.activeNarratives = state.activeNarratives;
  }
}
