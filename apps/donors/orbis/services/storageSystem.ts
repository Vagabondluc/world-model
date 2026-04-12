
import { HexData, ProjectSave, ProjectMeta, TerrainConfig, WorldDelta, PlanetType, PlaneId, StratumId } from '../types';
import { generatePlanetHexes } from './terrainSystem';
import { ProjectSaveSchema } from '../schemas/storageSchemas';
import { db } from './db/idb';

const LEGACY_STORAGE_KEY_PREFIX = 'orbis_proj_';
const LEGACY_INDEX_KEY = 'orbis_index';

export const EARTH_PRESET_CONFIG: TerrainConfig = {
  planetType: PlanetType.TERRA,
  scale: 2,
  seaLevel: 0.1,
  elevationScale: 1.0,
  subdivisions: 5,
  plateCount: 12,
  lacunarity: 2.0,
  persistence: 0.5,
  tempOffset: 0,
  moistureOffset: 0.1,
  orbital: {
    dayLengthSeconds: 60,
    yearLengthDays: 365,
    axialTilt: 23.5,
  },
  magnetosphere: {
    dipoleTilt: 11.5,
    strength: 1.0,
  },
  activePlane: PlaneId.MATERIAL,
  activeStratum: StratumId.TERRA,
};
export const EARTH_PRESET_SEED = 80085;

// --- Migration Logic ---
const migrateLegacyStorage = async () => {
  const legacyIndexRaw = localStorage.getItem(LEGACY_INDEX_KEY);
  if (!legacyIndexRaw) return;

  try {
    const legacyIndex: ProjectMeta[] = JSON.parse(legacyIndexRaw);
    console.info(`[Orbis] Migrating ${legacyIndex.length} projects from LocalStorage to IndexedDB...`);

    for (const meta of legacyIndex) {
      const rawProject = localStorage.getItem(`${LEGACY_STORAGE_KEY_PREFIX}${meta.id}`);
      if (rawProject) {
        const json = JSON.parse(rawProject);
        const result = ProjectSaveSchema.safeParse(json);
        if (result.success) {
          const project = result.data;
          // Write to IDB split stores
          await db.put('projects', project.meta);
          await db.put('worlds', { id: project.meta.id, ...project.world });
          await db.put('deltas', { id: project.meta.id, data: project.deltas });
          
          // Clear legacy
          localStorage.removeItem(`${LEGACY_STORAGE_KEY_PREFIX}${meta.id}`);
        }
      }
    }
    localStorage.removeItem(LEGACY_INDEX_KEY);
    console.info('[Orbis] Migration complete.');
  } catch (e) {
    console.error('[Orbis] Migration failed:', e);
  }
};

// Auto-trigger migration on module load (safe due to async lock in IDB adapter)
migrateLegacyStorage();

export const saveProjectToDB = async (
  name: string,
  seed: number,
  config: TerrainConfig,
  currentHexes: HexData[]
): Promise<ProjectMeta> => {
  // 1. Generate base state to compare against
  // Note: This is CPU heavy, we might want to offload this eventually too
  const { hexes: baseHexes } = generatePlanetHexes(config, seed);
  const baseMap = new Map(baseHexes.map(h => [h.id, h]));

  // 2. Calculate Deltas
  const deltas: Record<string, WorldDelta> = {};
  let deltaCount = 0;

  currentHexes.forEach(curr => {
    const base = baseMap.get(curr.id);
    if (!base) return;

    const delta: WorldDelta = {};
    let hasDelta = false;
    const epsilon = 0.0001;

    if (Math.abs(curr.biomeData.height - base.biomeData.height) > epsilon) {
      delta.h = Number(curr.biomeData.height.toFixed(4));
      hasDelta = true;
    }
    if (Math.abs(curr.biomeData.temperature - base.biomeData.temperature) > epsilon) {
      delta.t = Number(curr.biomeData.temperature.toFixed(2));
      hasDelta = true;
    }
    if (Math.abs(curr.biomeData.moisture - base.biomeData.moisture) > epsilon) {
      delta.m = Number(curr.biomeData.moisture.toFixed(4));
      hasDelta = true;
    }
    if (curr.settlementType !== base.settlementType) {
      delta.s = curr.settlementType;
      hasDelta = true;
    }
    if (curr.description && curr.description !== base.description) {
      delta.d = curr.description;
      hasDelta = true;
    }

    if (hasDelta) {
      deltas[curr.id] = delta;
      deltaCount++;
    }
  });

  const id = crypto.randomUUID();
  const now = Date.now();
  
  const meta: ProjectMeta = {
    id,
    name,
    createdAt: now,
    updatedAt: now,
    version: '1.0.0',
  };

  // 3. Write to IDB
  await db.transaction('readwrite', (stores) => {
    stores.projects.put(meta);
    stores.worlds.put({ id, seed, config });
    stores.deltas.put({ id, data: deltas });
  });
  
  console.info(`[Orbis] Project saved to IDB: ${name} (${deltaCount} deltas)`);
  return meta;
};

export const loadProjectFromDB = async (id: string): Promise<ProjectSave | null> => {
  try {
    const meta = await db.get<ProjectMeta>('projects', id);
    const world = await db.get<{ id: string, seed: number, config: TerrainConfig }>('worlds', id);
    const deltasContainer = await db.get<{ id: string, data: Record<string, WorldDelta> }>('deltas', id);

    if (!meta || !world || !deltasContainer) {
      console.warn('[Orbis] Incomplete project data found for ID:', id);
      return null;
    }

    return {
      meta,
      world: { seed: world.seed, config: world.config },
      deltas: deltasContainer.data
    };
  } catch (e) {
    console.error('[Orbis] Load failed:', e);
    return null;
  }
};

export const listProjectsFromDB = async (): Promise<ProjectMeta[]> => {
  try {
    const projects = await db.getAll<ProjectMeta>('projects');
    return projects.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch (e) {
    console.error('[Orbis] List projects failed:', e);
    return [];
  }
};

export const deleteProjectFromDB = async (id: string) => {
  await db.transaction('readwrite', (stores) => {
    stores.projects.delete(id);
    stores.worlds.delete(id);
    stores.deltas.delete(id);
  });
};

export const applyDeltasToHexes = (hexes: HexData[], deltas: Record<string, WorldDelta>) => {
  hexes.forEach(hex => {
    const d = deltas[hex.id];
    if (d) {
      if (d.h !== undefined) hex.biomeData.height = d.h;
      if (d.t !== undefined) hex.biomeData.temperature = d.t;
      if (d.m !== undefined) hex.biomeData.moisture = d.m;
      if (d.s !== undefined) hex.settlementType = d.s;
      if (d.d !== undefined) hex.description = d.d;
    }
  });
};