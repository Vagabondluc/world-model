/**
 * Causality Tracer (Spec T0)
 * Tracks the causal chain of simulation events for explainability.
 */

export interface CausalEvent {
  id: string;
  cause: string;
  effect: string;
  timestamp: number;
  parentId?: string;
}

export interface CausalNode {
  id: string;
  events: CausalEvent[];
  parentId?: string;
}

export class CausalityTracer {
  private events: Map<string, CausalEvent> = new Map();
  private nodes: Map<string, CausalNode> = new Map();
  private currentTick: number = 0;
  private seed: number;

  constructor(seed: number = 12345) {
    this.seed = seed;
  }

  public recordEvent(event: CausalEvent): void {
    event.timestamp = this.currentTick;
    this.events.set(event.id, event);
  }

  public createNode(id: string): CausalNode {
    const node: CausalNode = {
      id,
      events: []
    };
    this.nodes.set(id, node);
    return node;
  }

  public linkEvents(causeId: string, effectId: string): void {
    const causeEvent = this.events.get(causeId);
    const effectEvent = this.events.get(effectId);
    
    if (causeEvent && effectEvent) {
      effectEvent.parentId = causeId;
    }
  }

  public advanceTick(): void {
    this.currentTick++;
  }

  public getEvent(id: string): CausalEvent | undefined {
    return this.events.get(id);
  }

  public getNode(id: string): CausalNode | undefined {
    return this.nodes.get(id);
  }

  public getCausalChain(eventId: string): CausalEvent[] {
    const chain: CausalEvent[] = [];
    const visited = new Set<string>();
    let currentEvent = this.events.get(eventId);
    
    while (currentEvent && currentEvent.parentId && !visited.has(currentEvent.id)) {
      visited.add(currentEvent.id);
      chain.unshift(currentEvent);
      currentEvent = this.events.get(currentEvent.parentId);
    }
    
    if (currentEvent && !visited.has(currentEvent.id)) {
      chain.unshift(currentEvent);
    }
    
    return chain;
  }

  public getTick(): number { return this.currentTick; }
  public getSeed(): number { return this.seed; }
}
