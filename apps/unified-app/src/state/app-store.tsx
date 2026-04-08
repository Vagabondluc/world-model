import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ReactNode
} from "react";
import type { AppMode, AppState } from "@/domain/app-state";
import type { ModalKind } from "@/domain/app-state";
import type { CanonicalBundle } from "@/domain/canonical";
import {
  createEmptyCanonicalBundle,
  getCanonicalContractVersion,
  loadCanonicalBundle,
  saveCanonicalBundle
} from "@/services/canonical-bundle";
import { SAMPLE_BUNDLE } from "@/services/canonical-fixtures";
import {
  copyBundle,
  createEntityBundle,
  createWorldBundle,
  updateEntityDescription,
  updateEntityMetadata,
  updateWorldDescription,
  updateWorldMetadata,
  type EntityDraft,
  type MetadataDraft,
  type WorldDraft
} from "@/services/canonical-ops";

type Action =
  | { type: "load_bundle"; bundle: CanonicalBundle }
  | { type: "select_world"; worldId: string | null }
  | { type: "select_entity"; entityId: string | null }
  | { type: "set_mode"; mode: AppMode }
  | { type: "open_modal"; modal: ModalKind }
  | { type: "close_modal" }
  | { type: "set_drawer"; open: boolean }
  | { type: "set_nav"; open: boolean }
  | { type: "set_search"; searchQuery: string }
  | { type: "set_inspector_tab"; tab: AppState["overlay"]["inspectorTab"] }
  | { type: "create_world"; draft: WorldDraft }
  | { type: "create_entity"; draft: EntityDraft }
  | { type: "update_world"; draft: MetadataDraft }
  | { type: "update_entity"; entityId: string; draft: MetadataDraft }
  | { type: "update_world_description"; description: string }
  | { type: "update_entity_description"; entityId: string; description: string }
  | { type: "reset_bundle" };

function firstEntityId(bundle: CanonicalBundle): string | null {
  return Object.keys(bundle.entities)[0] ?? null;
}

export function hydrateAppStateFromCanonical(bundle: CanonicalBundle): AppState {
  return {
    canonical: {
      bundle,
      contractVersion: getCanonicalContractVersion(),
      dirty: false
    },
    overlay: {
      mode: "guided",
      drawerOpen: true,
      navOpen: true,
      selectedWorldId: bundle.world?.world_id ?? null,
      selectedEntityId: firstEntityId(bundle),
      inspectorTab: "summary",
      searchQuery: "",
      activeModal: null
    }
  };
}

export function extractCanonicalFromAppState(state: AppState): CanonicalBundle {
  return state.canonical.bundle;
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "load_bundle":
      return hydrateAppStateFromCanonical(action.bundle);
    case "select_world":
      return {
        ...state,
        overlay: { ...state.overlay, selectedWorldId: action.worldId }
      };
    case "select_entity":
      return {
        ...state,
        overlay: { ...state.overlay, selectedEntityId: action.entityId }
      };
    case "set_mode":
      return {
        ...state,
        overlay: { ...state.overlay, mode: action.mode }
      };
    case "open_modal":
      return {
        ...state,
        overlay: { ...state.overlay, activeModal: action.modal }
      };
    case "close_modal":
      return {
        ...state,
        overlay: { ...state.overlay, activeModal: null }
      };
    case "set_drawer":
      return {
        ...state,
        overlay: { ...state.overlay, drawerOpen: action.open }
      };
    case "set_nav":
      return {
        ...state,
        overlay: { ...state.overlay, navOpen: action.open }
      };
    case "set_search":
      return {
        ...state,
        overlay: { ...state.overlay, searchQuery: action.searchQuery }
      };
    case "set_inspector_tab":
      return {
        ...state,
        overlay: { ...state.overlay, inspectorTab: action.tab }
      };
    case "create_world": {
      const bundle = createWorldBundle(state.canonical.bundle, action.draft);
      return {
        canonical: { ...state.canonical, bundle, dirty: true },
        overlay: {
          ...state.overlay,
          selectedWorldId: bundle.world?.world_id ?? null,
          selectedEntityId: state.overlay.selectedEntityId,
          activeModal: null
        }
      };
    }
    case "create_entity": {
      const bundle = createEntityBundle(state.canonical.bundle, action.draft);
      return {
        canonical: { ...state.canonical, bundle, dirty: true },
        overlay: {
          ...state.overlay,
          selectedWorldId: action.draft.worldId,
          selectedEntityId: action.draft.entityId,
          activeModal: null
        }
      };
    }
    case "update_world": {
      const bundle = updateWorldMetadata(state.canonical.bundle, action.draft);
      return {
        canonical: { ...state.canonical, bundle, dirty: true },
        overlay: { ...state.overlay, activeModal: null }
      };
    }
    case "update_entity": {
      const bundle = updateEntityMetadata(state.canonical.bundle, action.entityId, action.draft);
      return {
        canonical: { ...state.canonical, bundle, dirty: true },
        overlay: { ...state.overlay, activeModal: null, selectedEntityId: action.entityId }
      };
    }
    case "update_world_description": {
      const bundle = updateWorldDescription(state.canonical.bundle, action.description);
      return {
        canonical: { ...state.canonical, bundle, dirty: true },
        overlay: { ...state.overlay, activeModal: null }
      };
    }
    case "update_entity_description": {
      const bundle = updateEntityDescription(state.canonical.bundle, action.entityId, action.description);
      return {
        canonical: { ...state.canonical, bundle, dirty: true },
        overlay: { ...state.overlay, activeModal: null, selectedEntityId: action.entityId }
      };
    }
    case "reset_bundle":
      return hydrateAppStateFromCanonical(createEmptyCanonicalBundle());
    default:
      return state;
  }
}

interface AppStoreValue {
  state: AppState;
  loadBundle: (bundle: CanonicalBundle) => void;
  loadBundleText: (text: string) => void;
  saveBundleText: () => string;
  openModal: (modal: ModalKind) => void;
  closeModal: () => void;
  selectWorld: (worldId: string | null) => void;
  selectEntity: (entityId: string | null) => void;
  setMode: (mode: AppMode) => void;
  setDrawerOpen: (open: boolean) => void;
  setNavOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setInspectorTab: (tab: AppState["overlay"]["inspectorTab"]) => void;
  createWorld: (draft: WorldDraft) => void;
  createEntity: (draft: EntityDraft) => void;
  updateWorld: (draft: MetadataDraft) => void;
  updateEntity: (entityId: string, draft: MetadataDraft) => void;
  updateWorldDescription: (description: string) => void;
  updateEntityDescription: (entityId: string, description: string) => void;
  resetBundle: () => void;
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, hydrateAppStateFromCanonical(SAMPLE_BUNDLE));

  const value = useMemo<AppStoreValue>(
    () => ({
      state,
      loadBundle: (bundle) => dispatch({ type: "load_bundle", bundle }),
      loadBundleText: (text) => dispatch({ type: "load_bundle", bundle: loadCanonicalBundle(text) }),
      saveBundleText: () => saveBundleText(state.canonical.bundle),
      openModal: (modal) => dispatch({ type: "open_modal", modal }),
      closeModal: () => dispatch({ type: "close_modal" }),
      selectWorld: (worldId) => dispatch({ type: "select_world", worldId }),
      selectEntity: (entityId) => dispatch({ type: "select_entity", entityId }),
      setMode: (mode) => dispatch({ type: "set_mode", mode }),
      setDrawerOpen: (open) => dispatch({ type: "set_drawer", open }),
      setNavOpen: (open) => dispatch({ type: "set_nav", open }),
      setSearchQuery: (query) => dispatch({ type: "set_search", searchQuery: query }),
      setInspectorTab: (tab) => dispatch({ type: "set_inspector_tab", tab }),
      createWorld: (draft) => dispatch({ type: "create_world", draft }),
      createEntity: (draft) => dispatch({ type: "create_entity", draft }),
      updateWorld: (draft) => dispatch({ type: "update_world", draft }),
      updateEntity: (entityId, draft) => dispatch({ type: "update_entity", entityId, draft }),
      updateWorldDescription: (description) => dispatch({ type: "update_world_description", description }),
      updateEntityDescription: (entityId, description) =>
        dispatch({ type: "update_entity_description", entityId, description }),
      resetBundle: () => dispatch({ type: "reset_bundle" })
    }),
    [state]
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

function saveBundleText(bundle: CanonicalBundle): string {
  return saveCanonicalBundle(copyBundle(bundle));
}

export function useAppStore() {
  const context = useContext(AppStoreContext);
  if (context === null) {
    throw new Error("AppStoreProvider is required");
  }
  return context;
}
