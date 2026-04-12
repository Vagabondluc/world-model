
import { TagId } from './types';

export type TagSet = Uint32Array;

/**
 * TagRegistry holds metadata for all simulation and gameplay tags.
 */
export const TagRegistryV1 = new Map<TagId, {
  name: string,
  namespace: string,
  description: string
}>([
  // Geosphere
  [TagId.GEO_VOLCANIC, { name: 'Volcanic', namespace: 'geology', description: 'Active mantle breach zone' }],
  [TagId.GEO_CRATON, { name: 'Craton Root', namespace: 'geology', description: 'Deep stable continental crust' }],
  [TagId.GEO_FAULT, { name: 'Fault Line', namespace: 'geology', description: 'Tectonic boundary stress zone' }],
  [TagId.GEO_SEDIMENTARY, { name: 'Sedimentary Basin', namespace: 'geology', description: 'Accumulation of eroded material' }],
  [TagId.GEO_METAMORPHIC, { name: 'Metamorphic Complex', namespace: 'geology', description: 'Heat and pressure altered rock' }],

  // Hydrosphere
  [TagId.HYDRO_RIVER, { name: 'River', namespace: 'hydrology', description: 'Active fluvial channel' }],
  [TagId.HYDRO_LAKE, { name: 'Lake', namespace: 'hydrology', description: 'Inland water body' }],
  [TagId.HYDRO_ESTUARY, { name: 'Estuary', namespace: 'hydrology', description: 'River mouth meeting ocean' }],
  [TagId.HYDRO_COASTAL, { name: 'Coastal', namespace: 'hydrology', description: 'Interface between land and sea' }],
  [TagId.HYDRO_WETLAND, { name: 'Wetland', namespace: 'hydrology', description: 'Saturated land' }],

  // Biosphere
  [TagId.BIO_HABITABLE, { name: 'Habitable', namespace: 'biosphere', description: 'Supports complex carbon-based life' }],
  [TagId.BIO_REFUGIUM, { name: 'Refugium', namespace: 'biosphere', description: 'Stable life haven during crisis' }],
  [TagId.BIO_EXTINCTION_RISK, { name: 'Extinction Risk', namespace: 'biosphere', description: 'Population collapse likely' }],
  [TagId.BIO_FOREST, { name: 'Forest', namespace: 'biosphere', description: 'Tree-dominated ecosystem' }],
  [TagId.BIO_DESERT, { name: 'Desert', namespace: 'biosphere', description: 'Arid ecosystem with sparse life' }],
  [TagId.BIO_TUNDRA, { name: 'Tundra', namespace: 'biosphere', description: 'Cold ecosystem with permafrost' }],
  [TagId.BIO_JUNGLE, { name: 'Jungle', namespace: 'biosphere', description: 'Dense tropical vegetation' }],

  // Civilization
  [TagId.CIV_CAPITAL, { name: 'Capital', namespace: 'civilization', description: 'Primary administrative center' }],
  [TagId.CIV_TRADE_HUB, { name: 'Trade Hub', namespace: 'civilization', description: 'Center of commerce' }],
  [TagId.CIV_HOLY_SITE, { name: 'Holy Site', namespace: 'civilization', description: 'Religious significance' }],
  [TagId.CIV_MINE, { name: 'Mine', namespace: 'civilization', description: 'Resource extraction site' }],
  [TagId.CIV_FARM, { name: 'Farm', namespace: 'civilization', description: 'Agricultural production' }],
  [TagId.CIV_FORTRESS, { name: 'Fortress', namespace: 'civilization', description: 'Military fortification' }],

  // Structure
  [TagId.STRUCT_ROAD, { name: 'Road', namespace: 'structure', description: 'Paved transportation route' }],
  [TagId.STRUCT_BRIDGE, { name: 'Bridge', namespace: 'structure', description: 'Water crossing' }],
  [TagId.STRUCT_WALL, { name: 'Wall', namespace: 'structure', description: 'Defensive barrier' }],
  [TagId.STRUCT_PORT, { name: 'Port', namespace: 'structure', description: 'Maritime infrastructure' }],
  [TagId.STRUCT_RUIN, { name: 'Ruin', namespace: 'structure', description: 'Collapsed historical structure' }],

  // Needs
  [TagId.NEED_ENERGY, { name: 'Need: Energy', namespace: 'needs', description: 'Demand for food, fuel, and labor' }],
  [TagId.NEED_SAFETY, { name: 'Need: Safety', namespace: 'needs', description: 'Demand for defense and shelter' }],
  [TagId.NEED_EXPANSION, { name: 'Need: Expansion', namespace: 'needs', description: 'Demand for territory and resources' }],
  [TagId.NEED_STABILITY, { name: 'Need: Stability', namespace: 'needs', description: 'Demand for order and continuity' }]
]);

/**
 * Checks if a TagSet contains a specific TagId.
 */
export function hasTag(tags: TagSet | undefined, tag: TagId): boolean {
  if (!tags) return false;
  for (let i = 0; i < tags.length; i++) {
    if (tags[i] === tag) return true;
  }
  return false;
}

/**
 * Returns a new TagSet with a tag added (ensuring uniqueness).
 * Keeps the array sorted for deterministic operations.
 */
export function addTag(tags: TagSet | undefined, tag: TagId): TagSet {
  if (!tags) return new Uint32Array([tag]);
  if (hasTag(tags, tag)) return tags;
  
  const next = new Uint32Array(tags.length + 1);
  next.set(tags);
  next[tags.length] = tag;
  next.sort(); // Maintain deterministic order
  return next;
}

/**
 * Removes a tag from a TagSet.
 */
export function removeTag(tags: TagSet | undefined, tag: TagId): TagSet {
  if (!tags) return new Uint32Array(0);
  if (!hasTag(tags, tag)) return tags;
  
  const next = tags.filter(t => t !== tag);
  return next;
}

/**
 * Merges two TagSets into a new unique sorted TagSet.
 */
export function mergeTags(a: TagSet | undefined, b: TagSet | undefined): TagSet {
  if (!a && !b) return new Uint32Array(0);
  if (!a) return b!;
  if (!b) return a;

  const set = new Set<number>();
  for(let i = 0; i < a.length; i++) set.add(a[i]);
  for(let i = 0; i < b.length; i++) set.add(b[i]);
  
  const result = new Uint32Array(Array.from(set));
  result.sort();
  return result;
}
