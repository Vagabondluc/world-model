
import { create } from 'zustand';
import { HexData, TerrainConfig, TerraformMode, PlateType, BiomeType } from '../types';
import { TerrainConfigSchema } from '../schemas/configSchemas';
import { generatePlanetHexes } from '../services/terrainSystem';
import { saveProjectToDB, loadProjectFromDB, applyDeltasToHexes } from '../services/storageSystem';
import { EARTH_PRESET, ARCHETYPES } from '../services/archetypes';
import { applyTerraformBrush } from '../services/terraforming';
import { generateGrid } from '../services/terrain/topology';
import { applyHydrology } from '../services/terrain/hydrology';
import { simulateCivilization } from '../services/terrain/civilization';
import { driftPlates, assignPlates, calculateStress, Plate } from '../services/terrain/tectonics';
import { GeologyEngine } from '../sim/geology/GeologyEngine';
import { useUIStore } from './useUIStore';
import { SpatialQuery } from '../services/spatialQuery';
import { TagId } from '../core/types';
import { addTag } from '../core/tags';
import { EnergyBalanceModel } from '../sim/climate/EnergyBalanceModel';

interface SimulationState {
  planetAge: number; // In simulation years
  lastCivUpdate: number; // Last age (years) civ was updated
  lastGeologicUpdate: number; // Last age (years) geology was updated
}

interface WorldState {
  seed: number;
  config: TerrainConfig;
  hexes: HexData[];
  plates: Plate[]; // Store live plates state
  hexDescriptions: Record<string, string>;
  selectedHexId: string | null;
  isGenerating: boolean;
  currentProjectId: string | null;
  currentProjectName: string | null;
  
  // Simulation Tracking
  simState: SimulationState;

  terraformMode: TerraformMode;
  brushRadius: number;
  brushIntensity: number;

  setSeed: (seed: number) => void;
  updateConfig: (patch: Partial<TerrainConfig>) => void;
  regenerateWorld: () => void;
  setSelectedHexId: (id: string | null) => void;
  getHexById: (id: string) => HexData | undefined;
  
  saveWorld: (name: string) => Promise<void>;
  loadWorld: (id: string) => Promise<boolean>;
  loadPreset: (config: TerrainConfig, seed: number) => void;
  loadArchetype: (type: any) => void;
  
  setTerraformMode: (mode: TerraformMode) => void;
  setBrushRadius: (r: number) => void;
  setBrushIntensity: (i: number) => void;
  applyBrush: (centerId: string) => void;
  updateHexDescription: (id: string, description: string) => void;

  // Simulation Actions
  runGeologicStep: (years: number) => void;
  runCivStep: () => void;
  updatePlanetAge: (years: number) => void;
  runTectonicDrift: (dt: number) => void;
  
  // Physics Sync
  syncClimateOverlay: (climate: EnergyBalanceModel) => void;
}

// Helper to hydrate tags on generation
const hydrateTags = (hexes: HexData[]) => {
    hexes.forEach(h => {
        let tags = new Uint32Array(0);
        // Hydrology
        if (h.isRiver) tags = addTag(tags, TagId.HYDRO_RIVER);
        if (h.coastalFeature === 'LAGOON') tags = addTag(tags, TagId.HYDRO_LAKE);
        
        // Biome
        if (h.biome === BiomeType.TROPICAL_RAIN_FOREST) tags = addTag(tags, TagId.BIO_JUNGLE);
        if (h.biome.includes('FOREST') || h.biome === BiomeType.TAIGA) tags = addTag(tags, TagId.BIO_FOREST);
        if (h.biome.includes('DESERT')) tags = addTag(tags, TagId.BIO_DESERT);
        if (h.biome === BiomeType.VOLCANIC) tags = addTag(tags, TagId.GEO_VOLCANIC);

        // Civ
        if (h.settlementType === 'CITY' || h.settlementType === 'METROPOLIS') tags = addTag(tags, TagId.CIV_CAPITAL);
        if (h.habitabilityScore > 0.8) tags = addTag(tags, TagId.BIO_HABITABLE);

        h.tags = tags;
    });
    // Build Index
    SpatialQuery.rebuild(hexes);
};

export const useWorldStore = create<WorldState>((set, get) => ({
  seed: Math.floor(Math.random() * 10000),
  config: EARTH_PRESET,
  hexes: [],
  plates: [],
  hexDescriptions: {},
  selectedHexId: null,
  isGenerating: false,
  currentProjectId: null,
  currentProjectName: null,

  simState: {
    planetAge: 0,
    lastCivUpdate: 0,
    lastGeologicUpdate: 0,
  },

  terraformMode: TerraformMode.SELECT,
  brushRadius: 1,
  brushIntensity: 0.2,

  setSeed: (seed) => {
    set({ seed, currentProjectId: null, currentProjectName: null });
    get().regenerateWorld();
  },

  updateConfig: (patch) => {
    const nextConfig = { ...get().config, ...patch };
    const result = TerrainConfigSchema.safeParse(nextConfig);
    if (result.success) {
      set({ config: result.data, currentProjectId: null, currentProjectName: null });
      get().regenerateWorld();
    } else {
      console.warn('[Orbis] Invalid Config Patch:', result.error.format());
    }
  },

  regenerateWorld: () => {
    set({ isGenerating: true });
    // setTimeout to yield to UI render before heavy calc
    setTimeout(() => {
      const { config, seed } = get();
      try {
        const { hexes, plates } = generatePlanetHexes(config, seed);
        hydrateTags(hexes);
        set({ 
          hexes, 
          plates,
          hexDescriptions: {}, 
          isGenerating: false,
          simState: { planetAge: 0, lastCivUpdate: 0, lastGeologicUpdate: 0 }
        });
      } catch (error) {
        console.error('[Orbis] World Generation Failed:', error);
        set({ isGenerating: false });
      }
    }, 10);
  },

  setSelectedHexId: (id) => set({ selectedHexId: id }),

  getHexById: (id: string) => get().hexes.find(h => h.id === id),

  saveWorld: async (name) => {
    const { seed, config, hexes, hexDescriptions } = get();
    const { setNotification } = useUIStore.getState();
    
    // Merge descriptions into hexes for persistence
    const hexesWithDescriptions = hexes.map(h => {
      const desc = hexDescriptions[h.id];
      if (desc !== undefined) {
        return { ...h, description: desc };
      }
      return h;
    });

    try {
      setNotification(`Saving ${name}...`);
      const meta = await saveProjectToDB(name, seed, config, hexesWithDescriptions);
      set({ currentProjectId: meta.id, currentProjectName: meta.name });
      setNotification("Project Saved Successfully");
    } catch (e) {
      console.error(e);
      setNotification("Failed to Save Project");
    }
  },

  loadWorld: async (id) => {
    set({ isGenerating: true });
    try {
      const project = await loadProjectFromDB(id);
      if (!project) {
        set({ isGenerating: false });
        return false;
      }
      
      // Generation is heavy, run in next tick
      setTimeout(() => {
        const { hexes, plates } = generatePlanetHexes(project.world.config, project.world.seed);
        applyDeltasToHexes(hexes, project.deltas);
        hydrateTags(hexes);
        
        const descriptions: Record<string, string> = {};
        hexes.forEach(h => {
          if (h.description) descriptions[h.id] = h.description;
        });

        set({
          seed: project.world.seed,
          config: project.world.config,
          hexes,
          plates,
          hexDescriptions: descriptions,
          currentProjectId: project.meta.id,
          currentProjectName: project.meta.name,
          isGenerating: false,
          simState: { planetAge: 0, lastCivUpdate: 0, lastGeologicUpdate: 0 }
        });
      }, 10);
      return true;
    } catch (e) {
      set({ isGenerating: false });
      console.error(e);
      return false;
    }
  },

  loadPreset: (config, seed) => {
    set({ 
      config, 
      seed, 
      currentProjectId: null, 
      currentProjectName: "Preset World",
      isGenerating: true 
    });
    setTimeout(() => {
      const { hexes, plates } = generatePlanetHexes(config, seed);
      hydrateTags(hexes);
      set({ 
        hexes, 
        plates,
        hexDescriptions: {}, 
        isGenerating: false,
        simState: { planetAge: 0, lastCivUpdate: 0, lastGeologicUpdate: 0 }
      });
    }, 10);
  },

  loadArchetype: (type) => {
    const archetype = ARCHETYPES[type as any];
    if (!archetype) return;
    
    set({
      config: archetype.config,
      seed: Math.floor(Math.random() * 10000),
      currentProjectId: null,
      currentProjectName: null,
      isGenerating: true
    });
    setTimeout(() => {
      const { hexes, plates } = generatePlanetHexes(archetype.config, get().seed);
      hydrateTags(hexes);
      set({ 
        hexes, 
        plates,
        hexDescriptions: {}, 
        isGenerating: false,
        simState: { planetAge: 0, lastCivUpdate: 0, lastGeologicUpdate: 0 }
      });
    }, 10);
  },

  setTerraformMode: (mode) => set({ terraformMode: mode }),
  setBrushRadius: (r) => set({ brushRadius: r }),
  setBrushIntensity: (i) => set({ brushIntensity: i }),

  applyBrush: (centerId) => {
    const { hexes, terraformMode, brushRadius, brushIntensity, config, seed } = get();
    if (terraformMode === TerraformMode.SELECT) return;

    const nextHexes = applyTerraformBrush(centerId, hexes, terraformMode, brushRadius, brushIntensity, config, seed);
    hydrateTags(nextHexes); // Re-tag after modification
    set({ hexes: nextHexes });
  },

  updateHexDescription: (id, description) => {
    set((state) => ({
      hexDescriptions: {
        ...state.hexDescriptions,
        [id]: description
      }
    }));
  },

  updatePlanetAge: (years) => {
    set((state) => ({ simState: { ...state.simState, planetAge: state.simState.planetAge + years } }));
  },

  runGeologicStep: (years) => {
    const { hexes, config, seed, simState, plates } = get();
    const grid = generateGrid(config.subdivisions);
    
    // 1. Tectonic Drift
    if (years > 1000) { 
       driftPlates(plates, years * 0.00005); 
       const { hexPlateData, hexVelocities } = assignPlates(grid, plates, seed);
       const { tectonicStresses, isBoundary } = calculateStress(grid, hexPlateData, hexVelocities);
       
       hexes.forEach((h, i) => {
          const oldPlateType = h.plateType;
          const newPlateId = hexPlateData[i];
          const newPlateType = plates[newPlateId].type;
          
          h.plateId = newPlateId;
          h.plateType = newPlateType;
          h.plateVelocity = hexVelocities[i].toArray();
          h.isBoundary = isBoundary[i] === 1;
          h.plateColor = plates[newPlateId].id % 2 === 0 ? '#ef4444' : '#3b82f6'; 

          if (oldPlateType === PlateType.CONTINENTAL && newPlateType === PlateType.OCEANIC) {
             h.biomeData.height = config.seaLevel - 0.5;
             h.biomeData.temperature += 10;
          }
       });
    }

    // 2. Fixed-Point Erosion (Replaces Legacy Hydrology Erosion)
    GeologyEngine.performErosionStep(hexes, grid, years);

    // 3. Update Hydrology Flow Graph (Post-Erosion)
    applyHydrology(hexes, grid, config.seaLevel);
    
    hydrateTags(hexes); // Refresh tags after geo changes

    set({ 
      hexes: [...hexes], 
      plates: [...plates],
      simState: { ...simState, lastGeologicUpdate: simState.planetAge } 
    });
  },

  runTectonicDrift: (dt) => {
     const { hexes, plates, config, seed } = get();
     driftPlates(plates, dt);
     
     const grid = generateGrid(config.subdivisions);
     const { hexPlateData, hexVelocities } = assignPlates(grid, plates, seed);
     const { tectonicStresses, isBoundary } = calculateStress(grid, hexPlateData, hexVelocities);

     hexes.forEach((h, i) => {
        h.plateId = hexPlateData[i];
        h.plateType = plates[h.plateId].type;
        h.isBoundary = isBoundary[i] === 1;
        
        if (h.plateType === PlateType.OCEANIC && h.biomeData.height > config.seaLevel) {
           h.biomeData.height = config.seaLevel - 0.2; 
        }
     });
     
     hydrateTags(hexes);
     set({ hexes: [...hexes], plates: [...plates] });
  },

  runCivStep: () => {
    const { hexes, seed, simState } = get();
    simulateCivilization(hexes, seed + simState.planetAge);
    hydrateTags(hexes); // Civ tags might change
    set({ 
      hexes: [...hexes], 
      simState: { ...simState, lastCivUpdate: simState.planetAge } 
    });
  },

  syncClimateOverlay: (climate) => {
    const { hexes } = get();
    // Only update if hexes exist
    if (hexes.length === 0) return;

    const nextHexes = [...hexes];
    let changed = false;

    // We only update temperature for now to drive visual snow
    // Precipitation/Moisture is handled by hydrology domain, but we can grab precip here too if needed
    for (const h of nextHexes) {
       const newTemp = climate.getTemperatureAtLat(h.center[1]);
       
       // Optimization: Simple diff check to avoid react re-renders if stable
       if (Math.abs(h.biomeData.temperature - newTemp) > 0.1) {
           h.biomeData.temperature = newTemp;
           changed = true;
       }
    }

    if (changed) {
        set({ hexes: nextHexes });
    }
  }
}));
