
import { QolSettings } from '../types';

export const DEFAULT_SETTINGS: QolSettings = {
  version: "qol.v1",
  turn: {
    apByAge: { 1: 5, 2: 5, 3: 5 },
    minRoundsByAge: { 1: 1, 2: 1, 3: 1 },
    requireAllPlayersActedToAdvance: false,
  },
  ui: {
    contextFilterActions: true,
    showDisabledWithReasons: true,
    actionPreviewGhost: true,
    mapJumpFromTimeline: true,
    searchEnabled: true,
    showPlayerColorOverlay: true,
    audioMuted: false,
    renderPngTiles: false,
  },
  social: {
    ownershipTags: "SOFT",
    protectedUntilEndOfRound: false,
    alterationCost: {
      enabled: false,
      modifyOthersBasePlus: 1,
      modifyOthersNamedPlus: 2,
      namedKinds: ["LANDMARK", "SETTLEMENT", "NATION"],
    },
    warnings: {
      warnOnModifyingOthers: true,
      warnOnDeletingNamed: true,
    },
  },
  safety: {
    undo: { mode: "TURN_SCOPED" },
    draftMode: {
      enabled: false,
      draftRoundCountAtAgeStart: 0,
      allowOneGlobalRollbackDuringDraft: false,
    },
  },
  genesis: {
    enableGlobeMode: false, // Opt-in for experimental globe generation
  },
};
