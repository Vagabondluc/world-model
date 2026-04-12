
import { DomainId, AbsTime } from '../../core/types';
import { ISimDomain } from '../../core/time/types';
import { SimTracer } from '../history/EventTracer';
import { ChronicleEntry, RawSimulationEvent } from './types';
import { EVENT_SCHEMA, formatString } from './EventSchema';
import { useWorldStore } from '../../stores/useWorldStore'; // Access config for year calculation

/**
 * NarrativeEngine
 * "The Chronicler"
 * Consumes raw events, formats them, and maintains the history of the world.
 * Follows spec ID: 86-information-narrative-engine.
 */
export class NarrativeEngine implements ISimDomain {
  public readonly id = DomainId.NARRATIVE_LOG;

  private chronicle: ChronicleEntry[] = [];
  private readonly MAX_HISTORY = 200; // Keep memory usage low
  private currentTime: AbsTime = 0n;

  public step(): void {
    // 1. Drain the Event Bus
    const rawEvents = SimTracer.consumeQueue();

    if (rawEvents.length === 0) return;

    // 2. Process and Format
    const newEntries: ChronicleEntry[] = [];
    
    // We need the year length to format dates nicely
    const { config } = useWorldStore.getState();
    const yearLen = config.orbital.dayLengthSeconds * config.orbital.yearLengthDays;

    for (const raw of rawEvents) {
        // Stamp time if missing
        if (raw.time === 0n) raw.time = this.currentTime;
        
        const entry = this.processEvent(raw, Number(raw.time), yearLen);
        if (entry) newEntries.push(entry);
    }

    // 3. Update Chronicle (Newest First)
    if (newEntries.length > 0) {
        this.chronicle = [...newEntries.reverse(), ...this.chronicle];
        
        // Prune
        if (this.chronicle.length > this.MAX_HISTORY) {
            this.chronicle = this.chronicle.slice(0, this.MAX_HISTORY);
        }
    }
  }

  private processEvent(raw: RawSimulationEvent, timeSec: number, yearLenSec: number): ChronicleEntry | null {
      const year = Math.floor(timeSec / yearLenSec) + 1;
      const template = EVENT_SCHEMA[raw.type];

      if (raw.type === 'LEGACY_TRACE') {
          // Pass-through for legacy calls
          return {
              id: crypto.randomUUID(),
              tick: raw.time,
              year,
              domain: raw.domain,
              title: raw.params.title,
              message: raw.params.message,
              severity: raw.severity
          };
      }

      if (!template) {
          // If no template, we might skip it or log generic. 
          // For now, skip unknown events to reduce noise.
          return null;
      }

      return {
          id: crypto.randomUUID(),
          tick: raw.time,
          year,
          domain: raw.domain,
          title: formatString(template.titleTemplate, raw.params),
          message: formatString(template.messageTemplate, raw.params),
          severity: raw.severity
      };
  }

  public regenerateTo(tNowUs: AbsTime): void {
      // History persists through regeneration generally, 
      // but if we do a hard reset, we might clear it.
      // For now, we keep it to show the "history of the simulation".
      this.currentTime = tNowUs;
  }

  public setTime(t: AbsTime) {
      this.currentTime = t;
  }

  public getChronicle(): ChronicleEntry[] {
      return this.chronicle;
  }

  // --- Persistence Hooks ---
  
  public getSnapshot(): any {
      return {
          chronicle: this.chronicle,
          currentTime: this.currentTime.toString()
      };
  }

  public restoreSnapshot(state: any): void {
      if (!state) return;
      this.chronicle = state.chronicle;
      this.currentTime = BigInt(state.currentTime);
  }
}
