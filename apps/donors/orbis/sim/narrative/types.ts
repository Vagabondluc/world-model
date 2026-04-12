
import { AbsTime, DomainId } from '../../core/types';

export type EventSeverity = 'info' | 'warning' | 'critical' | 'flavor';

export interface RawSimulationEvent {
  domain: DomainId;
  type: string; // e.g., "FACTION_SPAWN", "TECH_UNLOCK"
  params: Record<string, any>;
  severity: EventSeverity;
  time: AbsTime;
}

export interface ChronicleEntry {
  id: string;
  tick: AbsTime;
  year: number;
  domain: DomainId;
  title: string;
  message: string;
  severity: EventSeverity;
  icon?: string; // Optional icon override
}
