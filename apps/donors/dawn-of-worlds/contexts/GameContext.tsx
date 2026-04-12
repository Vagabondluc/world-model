
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { GameState, PlayerId, GameSessionConfig, PlayerRuntimeState } from '../types';
import { reducer, GameAction } from '../logic/reducer';
import { DEFAULT_SETTINGS } from '../logic/constants';
import { reviveState, serializeState } from '../logic/serialization';
import { initializePlayerCache, createDefaultPlayerRuntimeState } from '../logic/playerState';

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEY = 'dawn_of_worlds_save_v1';

// Modified to accept a full config
export const createInitialState = (config?: GameSessionConfig): GameState => {
  // If config is passed, we are starting a NEW game, ignore storage
  if (config) {
    const playerCache = initializePlayerCache(config.players.map(p => p.id));

    return {
      settings: DEFAULT_SETTINGS,
      config,
      age: config.initialAge,
      round: 1,
      turn: 1,
      activePlayerId: config.players[0].id,
      players: config.players.map(p => p.id),
      events: [],
      revokedEventIds: new Set(),
      draftRollbackUsedByAge: {},
      activeSelection: { kind: "NONE" },
      previewEvent: null,
      chronicle: {},
      worldCache: new Map(),
      playerCache,
      onboardingStep: 'MAP_TAP',
      isHandoverActive: false,
      combatSession: null,
    };
  }

  // Otherwise try to load from storage
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      const revived = reviveState(parsed);

      // Ensure playerCache exists for legacy saves
      if (!revived.playerCache) {
        revived.playerCache = {};
        if (Array.isArray(revived.players)) {
          revived.playerCache = initializePlayerCache(revived.players);
        }
      } else {
        // Migrate existing playerCache entries if hasRolledThisTurn is missing
        Object.keys(revived.playerCache).forEach(pid => {
          if (typeof revived.playerCache[pid].hasRolledThisTurn === 'undefined') {
            revived.playerCache[pid].hasRolledThisTurn = false;
          }
        });
      }

      // Ensure new UI fields exist
      if (!revived.onboardingStep) revived.onboardingStep = 'MAP_TAP';
      if (typeof revived.isHandoverActive === 'undefined') revived.isHandoverActive = false;
      if (typeof revived.combatSession === 'undefined') revived.combatSession = null;

      return revived;
    } catch (e) {
      console.error("Failed to load save game", e);
    }
  }

  // Fallback default (should rarely be hit if App handles flow correctly)
  return {
    settings: DEFAULT_SETTINGS,
    age: 1,
    round: 1,
    turn: 1,
    activePlayerId: 'P1',
    players: ['P1', 'P2'],
    events: [],
    revokedEventIds: new Set(),
    draftRollbackUsedByAge: {},
    activeSelection: { kind: "NONE" },
    previewEvent: null,
    chronicle: {},
    worldCache: new Map(),
    playerCache: initializePlayerCache(['P1', 'P2']),
    onboardingStep: 'MAP_TAP',
    isHandoverActive: false,
    combatSession: null,
  };
};

export const GameProvider: React.FC<{ children: ReactNode; initialConfig?: GameSessionConfig }> = ({ children, initialConfig }) => {
  const [state, dispatch] = useReducer(reducer, createInitialState(initialConfig));

  useEffect(() => {
    const saveState = serializeState(state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveState));
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
