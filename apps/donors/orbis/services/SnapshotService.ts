
import { SnapshotV1, DomainStateSnapshotV1 } from '../core/snapshot/types';
import { SnapshotV1Schema } from '../schemas/snapshotSchemas';
import { db } from './db/idb';
import { SimSystem } from '../sim/SimSystem';
import { DomainId } from '../core/types';
import { ISimDomain } from '../core/time/types';

/**
 * SnapshotService
 * Orchestrates the gathering and restoring of simulation state using the strict V1 protocol.
 */
export class SnapshotService {
  
  /**
   * Captures the current state of the SimSystem into a SnapshotV1 object.
   * @param id The Project/Snapshot ID
   */
  public static async captureSnapshot(id: string): Promise<SnapshotV1> {
    const absTime = SimSystem.scheduler.getAbsoluteTime();
    
    // Gather Domain States
    const domainStates: DomainStateSnapshotV1[] = [];
    const domains: ISimDomain[] = [
        SimSystem.magnetosphere,
        SimSystem.climate,
        SimSystem.hydrology,
        SimSystem.biosphere,
        SimSystem.life,
        SimSystem.trophic,
        SimSystem.refugia,
        SimSystem.population,
        SimSystem.tech,
        SimSystem.pressure,
        SimSystem.factions,
        SimSystem.narrative,
        SimSystem.myths,  // Added
        SimSystem.needs,
        SimSystem.regime
    ];

    for (const domain of domains) {
        if (domain.getSnapshot) {
            const state = domain.getSnapshot();
            const clockState = SimSystem.scheduler.getDomainState(domain.id);
            domainStates.push({
                domainId: domain.id,
                schemaVersion: 1, // To be dynamic in v2
                stateVersion: 1,
                authoritativeState: state,
                lastRunTime: (clockState?.lastStepTimeUs ?? 0n).toString()
            });
        }
    }

    const snapshot: SnapshotV1 = {
        snapshotVersion: 1,
        engineVersion: 1,
        registryVersion: 1,
        absTime: absTime.toString(),
        engineStep: "0", // SimSystem doesn't expose step count yet
        rngState: {
            baseSeed: "0", // TODO: Hook into RNG state
            eventCounter: "0"
        },
        schedulerState: {
            domainNextRun: {}, // TODO: Hook into Scheduler queues
            activeDomains: []
        },
        domainStates,
        globalDigest: "TODO_HASH" // Placeholder for digest
    };

    return snapshot;
  }

  /**
   * Persists the snapshot to IndexedDB.
   */
  public static async saveSnapshot(id: string, snapshot: SnapshotV1): Promise<void> {
    // Validate schema before write
    const validation = SnapshotV1Schema.safeParse(snapshot);
    if (!validation.success) {
        console.error("Snapshot Validation Failed:", validation.error);
        throw new Error("Invalid Snapshot Structure");
    }

    await db.put('snapshots', { id, ...snapshot });
    console.log(`[SnapshotService] Saved snapshot ${id} (Size: ${JSON.stringify(snapshot).length} chars)`);
  }

  /**
   * Loads a snapshot from IDB and restores the SimSystem state.
   */
  public static async loadSnapshot(id: string): Promise<boolean> {
    const data = await db.get<any>('snapshots', id);
    if (!data) return false;

    // Validate
    const validation = SnapshotV1Schema.safeParse(data);
    if (!validation.success) {
        console.error("Loaded Snapshot Validation Failed:", validation.error);
        return false;
    }
    const snapshot = validation.data;

    // Restore Global Time
    // Note: SimSystem.scheduler doesn't expose setTime yet, assuming regenerateTo logic handles it
    // or we extend scheduler.
    
    // Restore Domains
    const domains: Record<number, ISimDomain> = {
        [DomainId.PLANET_PHYSICS]: SimSystem.magnetosphere,
        [DomainId.CLIMATE]: SimSystem.climate,
        [DomainId.HYDROLOGY]: SimSystem.hydrology,
        [DomainId.BIOSPHERE_CAPACITY]: SimSystem.biosphere,
        [DomainId.EVOLUTION_BRANCHING]: SimSystem.life,
        [DomainId.TROPHIC_ENERGY]: SimSystem.trophic,
        [DomainId.REFUGIA_COLONIZATION]: SimSystem.refugia,
        [DomainId.POP_DYNAMICS]: SimSystem.population,
        [DomainId.CIVILIZATION_TECH]: SimSystem.tech,
        [DomainId.CIVILIZATION_PRESSURE]: SimSystem.pressure,
        [DomainId.CIVILIZATION_FACTIONS]: SimSystem.factions,
        [DomainId.NARRATIVE_LOG]: SimSystem.narrative,
        [DomainId.MYTHOS]: SimSystem.myths, // Added
        [DomainId.CIVILIZATION_NEEDS]: SimSystem.needs,
        [DomainId.CIVILIZATION_BEHAVIOR]: SimSystem.regime
    };

    for (const dState of snapshot.domainStates) {
        const domain = domains[dState.domainId];
        if (domain && domain.restoreSnapshot) {
            domain.restoreSnapshot(dState.authoritativeState);
            // Also need to restore clock state in scheduler...
        }
    }

    console.log(`[SnapshotService] Restored snapshot ${id}`);
    return true;
  }
}
