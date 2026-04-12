
import { AbsTime, DomainId } from '../../core/types';
import { RawSimulationEvent, EventSeverity } from '../narrative/types';

export interface LegacyEvent {
    id: string;
    time: AbsTime;
    domain: DomainId;
    title: string;
    message: string;
    severity: EventSeverity;
}

/**
 * EventTracer (The Bus)
 * Receives raw signals from all domains.
 * The NarrativeEngine consumes this queue every tick.
 */
class EventBus {
  private queue: RawSimulationEvent[] = [];
  
  // Legacy support for parts of the app not yet using the Chronicle
  // This will eventually be phased out in favor of SimSystem.narrative.getChronicle()
  private legacyLog: LegacyEvent[] = []; 

  /**
   * Push a structured raw event to the bus.
   */
  public emit(domain: DomainId, type: string, params: Record<string, any>, severity: EventSeverity = 'info') {
    this.queue.push({
        domain,
        type,
        params,
        severity,
        time: 0n // Will be stamped by Scheduler or caller context if available
    });
  }

  /**
   * Legacy method support. 
   * Maps old manual trace calls to the new system where possible, 
   * or stores them in legacy log if they are just strings.
   */
  public trace(event: { time: AbsTime, domain: DomainId, title: string, message: string, severity: EventSeverity }) {
    // 1. Store in legacy log for immediate UI compatibility
    this.legacyLog.unshift({ ...event, id: crypto.randomUUID() });
    if (this.legacyLog.length > 50) this.legacyLog.pop();

    // 2. Also push to new queue as a generic "LEGACY_TRACE" so NarrativeEngine can see it
    this.queue.push({
        domain: event.domain,
        type: 'LEGACY_TRACE',
        params: { title: event.title, message: event.message },
        severity: event.severity,
        time: event.time
    });
  }

  public consumeQueue(): RawSimulationEvent[] {
    const batch = this.queue;
    this.queue = [];
    return batch;
  }

  public getRecent(): LegacyEvent[] {
    return this.legacyLog;
  }
}

export const SimTracer = new EventBus();
