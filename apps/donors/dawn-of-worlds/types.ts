
import { z } from 'zod';
import * as S from './logic/schema';

export enum GameView {
  MAIN = 'MAIN',
  TIMELINE = 'TIMELINE',
  DESIGN_SYSTEM = 'DESIGN_SYSTEM',
  DASHBOARD = 'DASHBOARD',
  CHRONICLER = 'CHRONICLER',
  COUNSELOR = 'COUNSELOR'
}

// Inferred Types
export type Age = z.infer<typeof S.AgeSchema>;
export type PlayerId = z.infer<typeof S.PlayerIdSchema>;
export type MapSize = z.infer<typeof S.MapSizeSchema>;
export type PlayerConfig = z.infer<typeof S.PlayerConfigSchema>;
export type GameSessionConfig = z.infer<typeof S.GameSessionConfigSchema>;
export type Hex = z.infer<typeof S.HexSchema>;
export type Selection = z.infer<typeof S.SelectionSchema>;
export type WorldKind = z.infer<typeof S.WorldKindSchema>;
export type WorldObject = z.infer<typeof S.WorldObjectSchema>;
export type ChatMessage = z.infer<typeof S.ChatMessageSchema>;

// Event Types
export type BaseEvent = z.infer<typeof S.BaseEventSchema>;
export type WorldEvent = z.infer<typeof S.WorldEventSchema>;
export type TurnEvent = z.infer<typeof S.TurnEventSchema>;
export type QolEvent = z.infer<typeof S.QolEventSchema>;
export type EconomyEvent = z.infer<typeof S.EconomyEventSchema>;
export type GameEvent = z.infer<typeof S.GameEventSchema>;

export type Annotation = {
  title: string;
  body: string;
  tone: 'Heroic' | 'Tragic' | 'Mysterious' | 'Neutral';
};

export type PlayerRuntimeState = {
  currentPower: number;
  lowPowerBonus: number;
  lastTurnSpend: number;
  hasRolledThisTurn: boolean;
};

export type CombatModifier = {
  id: string;
  label: string;
  value: number;
  type: 'AUTO' | 'USER' | 'FATIGUE';
};

export type CombatSession = {
  stage: 'SETUP' | 'TACTICS' | 'ROLLING' | 'RESOLUTION' | 'CHRONICLE';
  attackerId: string;
  defenderId: string;
  attackerModifiers: CombatModifier[];
  defenderModifiers: CombatModifier[];
  rolls?: { attacker: [number, number]; defender: [number, number] };
  winner?: 'ATTACKER' | 'DEFENDER' | 'DRAW';
  consequence?: 'SCATTER' | 'OBLITERATE' | 'REPEL';
};

export type QolSettings = {
  version: "qol.v1";
  turn: {
    apByAge: Record<Age, number>;
    minRoundsByAge: Record<Age, number>;
    requireAllPlayersActedToAdvance: boolean;
  };
  ui: {
    contextFilterActions: boolean;
    showDisabledWithReasons: boolean;
    actionPreviewGhost: boolean;
    mapJumpFromTimeline: boolean;
    searchEnabled: boolean;
    searchExpandedByDefault?: boolean;
    showPlayerColorOverlay: boolean;
    audioMuted: boolean;
    renderPngTiles: boolean;
  };
  social: {
    ownershipTags: "OFF" | "SOFT";
    protectedUntilEndOfRound: boolean;
    alterationCost: {
      enabled: boolean;
      modifyOthersBasePlus: number;
      modifyOthersNamedPlus: number;
      namedKinds: Array<WorldKind>;
    };
    warnings: {
      warnOnModifyingOthers: boolean;
      warnOnDeletingNamed: boolean;
    };
  };
  safety: {
    undo: { mode: "OFF" | "TURN_SCOPED" };
    draftMode: {
      enabled: boolean;
      draftRoundCountAtAgeStart: number;
      allowOneGlobalRollbackDuringDraft: boolean;
    };
  };
  genesis: {
    enableGlobeMode: boolean;
  };
};

export type GameState = {
  settings: QolSettings;
  config?: GameSessionConfig;
  age: Age;
  round: number;
  turn: number;
  activePlayerId: PlayerId;
  players: PlayerId[];
  events: GameEvent[];
  revokedEventIds: Set<string>;
  draftRollbackUsedByAge: Partial<Record<Age, boolean>>;
  activeSelection: Selection;
  previewEvent: WorldEvent | null;
  chronicle: Record<string, Annotation>;
  worldCache: Map<string, WorldObject>;
  playerCache: Record<PlayerId, PlayerRuntimeState>; // Added for Rule III
  // UI State
  onboardingStep: 'MAP_TAP' | 'INSPECT' | 'ACTION' | 'END_TURN' | 'DONE';
  isHandoverActive: boolean;
  combatSession: CombatSession | null;
};

export type ActionDef = {
  id: string;
  label: string;
  age: Age;
  baseCost: number;
  target: "NONE" | "HEX" | "WORLD";
  validate: (state: GameState, selection: Selection) => { ok: true } | { ok: false; reason: string };
  buildEvent: (state: GameState, selection: Selection) => WorldEvent;
};

// Legacy visual types - keeping temporary for UI backward compatibility
export type BiomeType = string;
export interface LogEntry {
  age: string;
  round: number;
  player: 'Red' | 'Blue' | 'Green' | 'Yellow';
  description: string;
  ap: number;
  status: 'success' | 'revoked' | 'failed';
}
