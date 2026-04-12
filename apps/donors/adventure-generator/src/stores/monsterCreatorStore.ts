
import { create } from "zustand";
import { MONSTER_TYPES } from "../data/constants";
import { CRSolverOptions, CRSolverResult, CRAdjustment } from "../utils/monsterScaler";

export type Complexity = 'Simple' | 'Standard' | 'Complex';

export interface MonsterCreatorState {
  name: string;
  shortDescription: string;
  creatureType: string;
  size: string;
  alignment: string;
  cr: number;
  role: string;
  tags: string[]; // Replaces legacy 'themes'
  concept: string;
  
  // Procedural Specifics
  complexity: Complexity;
  budgetOverrides: {
    Offense: number;
    Defense: number;
    Control: number;
    Mobility: number;
    Utility: number;
  };

  lastGenerationSeed: string;
  isDirty: boolean;
  
  // CR Solver State
  targetCR: number | null;
  solverOptions: CRSolverOptions;
  solverResult: CRSolverResult | null;
  isSolving: boolean;
}

export interface MonsterCreatorActions {
  setName: (name: string) => void;
  setShortDescription: (desc: string) => void;
  setCreatureType: (type: string) => void;
  setSize: (size: string) => void;
  setAlignment: (alignment: string) => void;
  setCr: (cr: number) => void;
  setRole: (role: string) => void;
  setTags: (tags: string[]) => void; // Replaces setThemes
  setConcept: (concept: string) => void;
  
  setComplexity: (complexity: Complexity) => void;
  setBudgetOverride: (axis: keyof MonsterCreatorState['budgetOverrides'], value: number) => void;

  setLastGenerationSeed: (seed: string) => void;
  resetDraft: () => void;
  
  // CR Solver Actions
  setTargetCR: (cr: number | null) => void;
  setSolverOptions: (options: Partial<CRSolverOptions>) => void;
  setSolverResult: (result: CRSolverResult | null) => void;
  setIsSolving: (solving: boolean) => void;
  resetSolverResult: () => void;
}

const initialState: MonsterCreatorState = {
    name: "",
    shortDescription: "",
    creatureType: MONSTER_TYPES[0],
    size: "Medium",
    alignment: "Unaligned",
    cr: 5,
    role: "Brute",
    tags: ["fire"], // Default tag
    concept: "",
    complexity: "Standard",
    budgetOverrides: {
        Offense: 0,
        Defense: 0,
        Control: 0,
        Mobility: 0,
        Utility: 0
    },
    lastGenerationSeed: crypto.randomUUID(),
    isDirty: false,
    
    // CR Solver Initial State
    targetCR: null,
    solverOptions: {
        maxIterations: 20,
        convergenceThreshold: 0.1,
        preserveFeatures: true,
        method: 'dmg',
        stepSizeMultiplier: 1.0,
        minStepSize: 0.5,
        balanceThreshold: 2.0,
    },
    solverResult: null,
    isSolving: false,
};

export const useMonsterCreatorStore = create<MonsterCreatorState & MonsterCreatorActions>(
  (set) => ({
    ...initialState,
    setName: (name) => set({ name, isDirty: true }),
    setShortDescription: (shortDescription) => set({ shortDescription, isDirty: true }),
    setCreatureType: (creatureType) => set({ creatureType, isDirty: true }),
    setSize: (size) => set({ size, isDirty: true }),
    setAlignment: (alignment) => set({ alignment, isDirty: true }),
    setCr: (cr) => set({ cr, isDirty: true }),
    setRole: (role) => set({ role, isDirty: true }),
    setTags: (tags) => set({ tags, isDirty: true }),
    setConcept: (concept) => set({ concept, isDirty: true }),
    
    setComplexity: (complexity) => set({ complexity, isDirty: true }),
    setBudgetOverride: (axis, value) => set((state) => ({
        budgetOverrides: { ...state.budgetOverrides, [axis]: value },
        isDirty: true
    })),

    setLastGenerationSeed: (seed) => set({ lastGenerationSeed: seed, isDirty: true }),
    resetDraft: () => set({ ...initialState, lastGenerationSeed: crypto.randomUUID(), isDirty: false }),
    
    // CR Solver Actions
    setTargetCR: (cr) => set({ targetCR: cr }),
    setSolverOptions: (options) => set((state) => ({
        solverOptions: { ...state.solverOptions, ...options }
    })),
    setSolverResult: (result) => set({ solverResult: result }),
    setIsSolving: (solving) => set({ isSolving: solving }),
    resetSolverResult: () => set({ solverResult: null }),
  })
);
