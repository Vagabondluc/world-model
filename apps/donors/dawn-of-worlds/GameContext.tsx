
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { GameState, PlayerId, QolSettings, GameSessionConfig, PlayerRuntimeState } from './types';
import { reducer, GameAction } from './logic/reducer';
import { DEFAULT_SETTINGS } from './logic/constants';

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEY = 'dawn_of_worlds_save_v1';

// Modified to accept a full config
export const createInitialState = (config?: GameSessionConfig): GameState => {
  // If config is passed, we are starting a NEW game, ignore storage
  if (config) {
    const playerCache: Record<PlayerId, PlayerRuntimeState> = {};
    config.players.forEach(p => {
      playerCache[p.id] = { currentPower: 0, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false };
    });

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
      parsed.revokedEventIds = new Set(parsed.revokedEventIds);
      if (Array.isArray(parsed.worldCache)) {
        parsed.worldCache = new Map(parsed.worldCache);
      } else {
        parsed.worldCache = new Map();
      }

      // Ensure playerCache exists for legacy saves
      if (!parsed.playerCache) {
        parsed.playerCache = {};
        if (Array.isArray(parsed.players)) {
          parsed.players.forEach((pid: string) => {
            parsed.playerCache[pid] = { currentPower: 0, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false };
          });
        }
      } else {
        // Migrate existing playerCache entries if hasRolledThisTurn is missing
        Object.keys(parsed.playerCache).forEach(pid => {
          if (typeof parsed.playerCache[pid].hasRolledThisTurn === 'undefined') {
            parsed.playerCache[pid].hasRolledThisTurn = false;
          }
        });
      }

      // Ensure new UI fields exist
      if (!parsed.onboardingStep) parsed.onboardingStep = 'MAP_TAP';
      if (typeof parsed.isHandoverActive === 'undefined') parsed.isHandoverActive = false;
      if (typeof parsed.combatSession === 'undefined') parsed.combatSession = null;

      return parsed;
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
    playerCache: {
      'P1': { currentPower: 0, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false },
      'P2': { currentPower: 0, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false }
    },
    onboardingStep: 'MAP_TAP',
    isHandoverActive: false,
    combatSession: null,
  };
};

export const GameProvider: React.FC<{ children: ReactNode; initialConfig?: GameSessionConfig }> = ({ children, initialConfig }) => {
  const [state, dispatch] = useReducer(reducer, createInitialState(initialConfig));

  useEffect(() => {
    const saveState = {
      ...state,
      revokedEventIds: Array.from(state.revokedEventIds),
      worldCache: Array.from(state.worldCache.entries())
    };
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
