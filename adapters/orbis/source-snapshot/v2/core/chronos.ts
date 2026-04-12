import { DomainId } from '../../../zod/core';

export interface SimEvent {
  atTimeUs: bigint;
  domain: DomainId;
  kind: number;
  scope: number;
  a: bigint;
  b?: bigint;
  x: number;
  index: number;
  payloadHash: number;
}

export interface InvalidationBubble {
  id: string;
  tPatch: bigint;
  affectedDomains: DomainId[];
  status: 'Active' | 'Reconciling' | 'Resolved';
}

/**
 * Chronos Engine (Spec 115)
 * Manages the Master Event Ledger and retroactive consistency.
 */
export class ChronosEngine {
  private ledger: SimEvent[] = [];
  private bubbles: InvalidationBubble[] = [];

  /**
   * Appends an event to the ledger and ensures deterministic order.
   */
  appendEvent(event: SimEvent): void {
    this.ledger.push(event);
    this.sortLedger();
  }

  /**
   * Injects a retroactive event and creates an invalidation bubble.
   */
  injectRetroactiveEvent(event: SimEvent, affectedDomains: DomainId[]): string {
    const bubbleId = `bubble-${event.atTimeUs}-${Math.random().toString(36).substring(2, 7)}`;
    
    // 1. Create Invalidation Bubble
    this.bubbles.push({
      id: bubbleId,
      tPatch: event.atTimeUs,
      affectedDomains,
      status: 'Active'
    });

    // 2. Insert event into ledger
    this.ledger.push(event);

    // 3. Deterministic Sort
    this.sortLedger();

    return bubbleId;
  }

  private sortLedger(): void {
    this.ledger.sort((a, b) => {
      if (a.atTimeUs !== b.atTimeUs) return Number(a.atTimeUs - b.atTimeUs);
      if (a.domain !== b.domain) return a.domain - b.domain;
      if (a.kind !== b.kind) return a.kind - b.kind;
      return a.index - b.index;
    });
  }

  /**
   * Checks if a domain state is currently stale at a specific time.
   */
  isDomainStale(domain: DomainId, timeUs: bigint): boolean {
    return this.bubbles.some(b => 
      b.status !== 'Resolved' && 
      b.tPatch <= timeUs && 
      b.affectedDomains.includes(domain)
    );
  }

  /**
   * Transitions a bubble to the next phase.
   */
  updateBubbleStatus(bubbleId: string, status: InvalidationBubble['status']): void {
    const bubble = this.bubbles.find(b => b.id === bubbleId);
    if (bubble) {
      bubble.status = status;
    }
  }

  getLedger(): SimEvent[] {
    return this.ledger;
  }

  getActiveBubbles(): InvalidationBubble[] {
    return this.bubbles.filter(b => b.status !== 'Resolved');
  }

  /**
   * Returns the nearest checkpoint at or before the target time.
   */
  getNearestCheckpoint(targetTimeUs: bigint, checkpoints: bigint[]): bigint | null {
    const valid = checkpoints
      .filter(t => t <= targetTimeUs)
      .sort((a, b) => Number(b - a));
    return valid.length > 0 ? valid[0] : null;
  }
}
