import type { CanonicalBundle } from "./canonical";

export type AppMode = "guided" | "studio" | "architect";

export interface CanonicalState {
  bundle: CanonicalBundle;
  contractVersion: string;
  dirty: boolean;
}

export interface OverlayState {
  mode: AppMode;
  drawerOpen: boolean;
  navOpen: boolean;
  selectedWorldId: string | null;
  selectedEntityId: string | null;
  inspectorTab: "summary" | "relations" | "attachments";
  searchQuery: string;
}

export interface AppState {
  canonical: CanonicalState;
  overlay: OverlayState;
}
