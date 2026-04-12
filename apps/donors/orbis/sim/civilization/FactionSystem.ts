
import { DomainId, AbsTime, MathPPM } from '../../core/types';
import { ISimDomain } from '../../core/time/types';
import { PressureState, Faction, FactionType } from './types';
import { SimTracer } from '../history/EventTracer';
import { PseudoRandom } from '../../services/noise';

/**
 * FactionSystem
 * Monitors societal pressures and spawns/manages interest groups.
 * Follows spec ID: 83-faction-interest-group-generator.
 */
export class FactionSystem implements ISimDomain {
  public readonly id = DomainId.CIVILIZATION_FACTIONS;

  private factions: Faction[] = [];
  private pressures: PressureState | null = null;
  private nextFactionId = 1;

  public step(): void {
    if (!this.pressures) return;

    // 1. Check Spawn Conditions (Spec 83)
    this.checkSpawns();

    // 2. Update Faction Influence
    this.updateFactions();
  }

  private checkSpawns() {
    const p = this.pressures!;
    const rng = new PseudoRandom(12345 + this.nextFactionId); // Deterministic

    // Condition: High Inequality -> Labor/Populist Faction
    if (p.economy.inequality > 400_000 && !this.hasFactionType('POPULIST')) {
        this.spawnFaction('Labor Front', 'POPULIST', ['Wealth Redistribution', 'Worker Rights']);
    }

    // Condition: High Unrest -> Revolutionary Faction
    if (p.population.unrest > 600_000 && !this.hasFactionType('MILITARY')) {
        this.spawnFaction('Liberation Army', 'MILITARY', ['Regime Change', 'Martial Law']);
    }

    // Condition: High Growth + Centralization -> Merchant/Elite Faction
    if (p.economy.growth > 300_000 && p.governance.centralization > 300_000 && !this.hasFactionType('ELITE')) {
        this.spawnFaction('Trade Guild', 'ELITE', ['Deregulation', 'Trade Routes']);
    }
  }

  private updateFactions() {
    // Simple decay logic for v1
    this.factions.forEach(f => {
        // Radicalization increases with unrest
        if (this.pressures!.population.unrest > 200_000) {
            f.radicalizationPPM = Math.min(1_000_000, f.radicalizationPPM + 10_000);
        } else {
            f.radicalizationPPM = Math.max(0, f.radicalizationPPM - 5_000);
        }
    });
  }

  private spawnFaction(name: string, type: FactionType, demands: string[]) {
    const faction: Faction = {
        id: `fac-${this.nextFactionId++}`,
        name,
        type,
        influencePPM: 100_000, // Starts small (10%)
        radicalizationPPM: 0,
        demands,
        formedTick: 0n // Context dependent
    };
    this.factions.push(faction);

    SimTracer.trace({
        time: 0n,
        domain: this.id,
        title: "Faction Emergence",
        message: `The "${name}" (${type}) has formed to demand: ${demands.join(', ')}.`,
        severity: 'warning'
    });
  }

  private hasFactionType(type: FactionType): boolean {
      return this.factions.some(f => f.type === type);
  }

  public setPressures(p: PressureState) {
      this.pressures = p;
  }

  public getFactions(): Faction[] {
      return this.factions;
  }

  public regenerateTo(tNowUs: AbsTime): void {
    this.factions = [];
    this.nextFactionId = 1;
  }
}
