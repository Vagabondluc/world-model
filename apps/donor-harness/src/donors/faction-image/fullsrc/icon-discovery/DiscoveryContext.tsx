import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type { FactionDomain } from "@/icon-generator/domainPalettes";
import { IconRecolorEngine } from "./recolorEngine";
import { createIconProviders } from "./providers";
import type { DiscoveryResult, IconKeywordRecord, RecolorConfig, RecolorResult } from "./types";

type DiscoveryState = {
  open: boolean;
  query: string;
  category: string | null;
  domain: FactionDomain | undefined;
  loading: boolean;
  error: string | null;
  results: IconKeywordRecord[];
  selected: IconKeywordRecord | null;
  preview: RecolorResult | null;
  recolor: RecolorConfig;
  elapsedMs: number;
};

type DiscoveryAction =
  | { type: "set-open"; open: boolean }
  | { type: "set-query"; query: string }
  | { type: "set-category"; category: string | null }
  | { type: "set-domain"; domain: FactionDomain | undefined }
  | { type: "set-loading"; loading: boolean }
  | { type: "set-error"; error: string | null }
  | { type: "set-results"; payload: DiscoveryResult }
  | { type: "set-selected"; selected: IconKeywordRecord | null }
  | { type: "set-preview"; preview: RecolorResult | null }
  | { type: "set-recolor"; recolor: Partial<RecolorConfig> };

const initialState: DiscoveryState = {
  open: false,
  query: "",
  category: null,
  domain: undefined,
  loading: false,
  error: null,
  results: [],
  selected: null,
  preview: null,
  recolor: {
    targetColor: "#ffffff",
    brightness: 1,
    saturation: 1,
    opacity: 1,
    scope: "grayscale",
  },
  elapsedMs: 0,
};

function reducer(state: DiscoveryState, action: DiscoveryAction): DiscoveryState {
  if (action.type === "set-open") return { ...state, open: action.open };
  if (action.type === "set-query") return { ...state, query: action.query };
  if (action.type === "set-category") return { ...state, category: action.category };
  if (action.type === "set-domain") return { ...state, domain: action.domain };
  if (action.type === "set-loading") return { ...state, loading: action.loading };
  if (action.type === "set-error") return { ...state, error: action.error };
  if (action.type === "set-results") return { ...state, results: action.payload.items, elapsedMs: action.payload.elapsedMs };
  if (action.type === "set-selected") return { ...state, selected: action.selected, preview: null };
  if (action.type === "set-preview") return { ...state, preview: action.preview };
  if (action.type === "set-recolor") return { ...state, recolor: { ...state.recolor, ...action.recolor } };
  return state;
}

type DiscoveryContextValue = {
  mode: "local" | "api";
  state: DiscoveryState;
  setOpen: (open: boolean) => void;
  setQuery: (query: string) => void;
  setCategory: (category: string | null) => void;
  setDomain: (domain: FactionDomain | undefined) => void;
  setSelected: (selected: IconKeywordRecord | null) => void;
  setRecolor: (recolor: Partial<RecolorConfig>) => void;
  refresh: () => Promise<void>;
  refreshPreview: () => Promise<void>;
};

const DiscoveryContext = createContext<DiscoveryContextValue | null>(null);

export function DiscoveryProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const providers = useMemo(() => createIconProviders(
    (import.meta.env.VITE_ICON_PROVIDER_MODE as "local" | "api" | undefined) ?? "api",
    import.meta.env.VITE_ICON_API_BASE || "/api",
  ), []);
  const { indexProvider, assetProvider } = providers;
  const recolorEngine = useMemo(() => new IconRecolorEngine(), []);

  const refresh = async () => {
    dispatch({ type: "set-loading", loading: true });
    dispatch({ type: "set-error", error: null });
    try {
      const result = await indexProvider.search({
        query: state.query,
        domain: state.domain,
        category: state.category ?? undefined,
        limit: 200,
      });
      dispatch({ type: "set-results", payload: result });
    } catch (error) {
      dispatch({ type: "set-error", error: error instanceof Error ? error.message : "Search failed." });
    } finally {
      dispatch({ type: "set-loading", loading: false });
    }
  };

  const refreshPreview = async () => {
    if (!state.selected) return;
    dispatch({ type: "set-loading", loading: true });
    try {
      const raw = await assetProvider.loadRawSvg(state.selected.assetPath);
      dispatch({ type: "set-preview", preview: recolorEngine.recolor(raw, state.recolor) });
    } catch (error) {
      dispatch({ type: "set-error", error: error instanceof Error ? error.message : "Preview failed." });
      dispatch({ type: "set-preview", preview: null });
    } finally {
      dispatch({ type: "set-loading", loading: false });
    }
  };

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.query, state.category, state.domain]);

  useEffect(() => {
    if (!state.selected) return;
    void refreshPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selected, state.recolor]);

  const value: DiscoveryContextValue = {
    mode: providers.mode,
    state,
    setOpen: (open) => dispatch({ type: "set-open", open }),
    setQuery: (query) => dispatch({ type: "set-query", query }),
    setCategory: (category) => dispatch({ type: "set-category", category }),
    setDomain: (domain) => dispatch({ type: "set-domain", domain }),
    setSelected: (selected) => dispatch({ type: "set-selected", selected }),
    setRecolor: (recolor) => dispatch({ type: "set-recolor", recolor }),
    refresh,
    refreshPreview,
  };

  return (
    <DiscoveryContext.Provider value={value}>
      {children}
    </DiscoveryContext.Provider>
  );
}

export function useDiscovery() {
  const context = useContext(DiscoveryContext);
  if (!context) throw new Error("useDiscovery must be used within DiscoveryProvider");
  return context;
}
