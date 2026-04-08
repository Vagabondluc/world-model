export type TaxonomyFamily = "role" | "task" | "flow";

export interface TaxonomyTab {
  key: string;
  label: string;
  hint: string;
}

export interface TaxonomyDefinition {
  family: TaxonomyFamily;
  label: string;
  description: string;
  defaultTab: string;
  tabs: TaxonomyTab[];
}

export const TAXONOMIES: Record<TaxonomyFamily, TaxonomyDefinition> = {
  role: {
    family: "role",
    label: "Role",
    description: "World / Story / Schema product split.",
    defaultTab: "world",
    tabs: [
      { key: "world", label: "World", hint: "Map and world core" },
      { key: "story", label: "Story", hint: "Narrative and progression" },
      { key: "schema", label: "Schema", hint: "Contracts and reports" }
    ]
  },
  task: {
    family: "task",
    label: "Task",
    description: "Create / Edit / Inspect / Validate workflow split.",
    defaultTab: "create",
    tabs: [
      { key: "create", label: "Create", hint: "Generate and add" },
      { key: "edit", label: "Edit", hint: "Mutate canonical data" },
      { key: "inspect", label: "Inspect", hint: "Browse and compare" },
      { key: "validate", label: "Validate", hint: "Schema and reports" }
    ]
  },
  flow: {
    family: "flow",
    label: "Flow",
    description: "Start / Build / Run / Review journey split.",
    defaultTab: "start",
    tabs: [
      { key: "start", label: "Start", hint: "Open and create" },
      { key: "build", label: "Build", hint: "Edit and generate" },
      { key: "run", label: "Run", hint: "Use the world" },
      { key: "review", label: "Review", hint: "Inspect reports" }
    ]
  }
};

export const PUBLIC_FAMILY: TaxonomyFamily = "role";

export const LEGACY_ROUTE_MAP = {
  guided: "/world",
  studio: "/story",
  architect: "/schema"
} as const;

export function isTaxonomyFamily(value: string): value is TaxonomyFamily {
  return value === "role" || value === "task" || value === "flow";
}

export function getTaxonomyDefinition(family: TaxonomyFamily): TaxonomyDefinition {
  return TAXONOMIES[family];
}

export function defaultRouteForFamily(family: TaxonomyFamily): string {
  const tab = getTaxonomyDefinition(family).defaultTab;
  return family === PUBLIC_FAMILY ? `/${tab}` : `/prototype/${family}/${tab}`;
}

export function routeForTab(family: TaxonomyFamily, tab: string): string {
  return family === PUBLIC_FAMILY ? `/${tab}` : `/prototype/${family}/${tab}`;
}

export function routeLabelForFamily(family: TaxonomyFamily): string {
  return getTaxonomyDefinition(family).label;
}

export interface RouteContext {
  family: TaxonomyFamily;
  tab: string;
  prototype: boolean;
  legacy: boolean;
}

export function resolveRouteContext(pathname: string): RouteContext {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  const legacyKey = normalized.slice(1) as keyof typeof LEGACY_ROUTE_MAP;
  if (normalized.startsWith("/") && legacyKey in LEGACY_ROUTE_MAP) {
    const alias = legacyKey;
    return {
      family: PUBLIC_FAMILY,
      tab: LEGACY_ROUTE_MAP[alias].slice(1),
      prototype: false,
      legacy: true
    };
  }
  if (normalized.startsWith("/prototype/")) {
    const [_, __, family, tab] = normalized.split("/");
    if (isTaxonomyFamily(family ?? "")) {
      const typedFamily = family as TaxonomyFamily;
      return {
        family: typedFamily,
        tab: tab || getTaxonomyDefinition(typedFamily).defaultTab,
        prototype: true,
        legacy: false
      };
    }
  }
  const publicTab = normalized.startsWith("/") ? normalized.slice(1) : normalized;
  const roleTabs = getTaxonomyDefinition(PUBLIC_FAMILY).tabs.map((tab) => tab.key);
  const tab = roleTabs.includes(publicTab) ? publicTab : getTaxonomyDefinition(PUBLIC_FAMILY).defaultTab;
  return {
    family: PUBLIC_FAMILY,
    tab,
    prototype: false,
    legacy: false
  };
}
