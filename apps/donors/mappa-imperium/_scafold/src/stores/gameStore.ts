import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  GameState,
  GameSettings,
  Player,
  GameRole,
  ElementCard,
  View,
  AppSettings,
  EraUIState,
} from '@/types';

// Define the state shape
export interface GameStoreState {
  gameState: GameState;
  gameSettings: GameSettings | null;
  players: Player[];
  currentPlayer: Player | null;
  currentEraId: number;
  viewedEraId: number;
  view: View;
  gameRole: GameRole;
  isDebugMode: boolean;
  isEraNavigationUnlocked: boolean;
  elements: ElementCard[];
  appSettings: AppSettings;
  isSettingsModalOpen: boolean;
  isDebuggerOpen: boolean;
  eraUiState: EraUIState;
}

// Define the actions
export interface GameStoreActions {
  startGame: (settings: GameSettings) => void;
  debugSetup: () => void;
  // ... other actions
  toggleDebugger: () => void;
  toggleEraNavigationLock: () => void;
  prepopulateEra: (eraId: number, playerNumber: number) => void;
  exportGameData: () => void;
  importGameData: (file: File) => void;
  clearAllData: () => void;
  getCompletedEras: () => number[];
}

const initialEraUiState: EraUIState = {
    eraOne: { gameplayStep: 'geography' },
    eraTwo: { gameplayStep: 'setup' },
    eraThree: { gameplayStep: 'faction' },
    eraFour: { gameplayStep: 'exploration' },
    eraFive: { gameplayStep: 'expansion' },
    eraSix: { gameplayStep: 'events' },
};

const initialState: GameStoreState = {
    gameState: 'setup',
    gameSettings: null,
    players: [],
    currentPlayer: null,
    currentEraId: 0,
    viewedEraId: 0,
    view: 'eras',
    gameRole: 'player',
    isDebugMode: true, // Default to true for development ease
    isEraNavigationUnlocked: false,
    elements: [],
    appSettings: { markdownFormat: 'regular' },
    isSettingsModalOpen: false,
    isDebuggerOpen: false,
    eraUiState: initialEraUiState,
};

// Create the store
export const useGameStore = create<GameStoreState & GameStoreActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Actions
      startGame: (settings) => {
        // ... (implementation from phase 2)
      },
      
      debugSetup: () => {},

      // ... (other actions from phase 2)

      // Debug Actions
      toggleDebugger: () => set(state => ({ isDebuggerOpen: !state.isDebuggerOpen })),
      toggleEraNavigationLock: () => set(state => ({ isEraNavigationUnlocked: !state.isEraNavigationUnlocked })),
      
      prepopulateEra: (eraId, playerNumber) => {
        console.log(`Prepopulating Era ${eraId} for player ${playerNumber === 0 ? 'All' : playerNumber}`);
        // This logic is now handled in GameContext for better state access
      },

      exportGameData: () => {
        console.log('Exporting game data from store...');
        // This logic is now handled in GameContext
      },

      importGameData: (file: File) => {
        console.log('Importing game data from file:', file.name);
         // This logic is now handled in GameContext
      },

      clearAllData: () => {
        // This logic is now handled in GameContext
      },
      
      getCompletedEras: () => {
        const { currentEraId } = get();
        return Array.from({ length: currentEraId > 0 ? currentEraId - 1 : 0 }, (_, i) => i + 1);
      }
    }),
    {
      name: 'mappa-imperium-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);