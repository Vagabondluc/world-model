import type { DiscoveryQuery, DiscoveryResult, IconKeywordIndex, IconKeywordRecord } from "./types";

export interface IconIndexProvider {
  loadIndex(): Promise<IconKeywordIndex>;
  search(query: DiscoveryQuery): Promise<DiscoveryResult>;
  getById(id: string): Promise<IconKeywordRecord | null>;
}

export interface IconAssetProvider {
  loadRawSvg(assetPath: string): Promise<string>;
}

function scoreRecord(record: IconKeywordRecord, queryTokens: string[], domain?: string): number {
  let score = 0;
  const keywords = new Set(record.keywords.map((k) => k.toLowerCase()));
  for (const token of queryTokens) {
    if (keywords.has(token)) score += 4;
    if (record.id.toLowerCase().includes(token)) score += 2;
    if (record.category.toLowerCase().includes(token)) score += 1;
  }
  if (domain && record.domains[domain as keyof typeof record.domains]) {
    score += (record.domains[domain as keyof typeof record.domains] || 0) * 3;
  }
  score += Math.max(0, Math.min(5, record.quality.recolorQuality)) * 0.5;
  return score;
}

export class LocalIconIndexProvider implements IconIndexProvider {
  private indexPromise: Promise<IconKeywordIndex> | null = null;

  async loadIndex(): Promise<IconKeywordIndex> {
    if (!this.indexPromise) {
      this.indexPromise = fetch("/icons/keywords.index.json").then(async (response) => {
        if (!response.ok) throw new Error("Failed loading icon keyword index.");
        return response.json() as Promise<IconKeywordIndex>;
      });
    }
    return this.indexPromise;
  }

  async search(query: DiscoveryQuery): Promise<DiscoveryResult> {
    const started = performance.now();
    const index = await this.loadIndex();
    const tokens = query.query.toLowerCase().split(/\s+/).filter(Boolean);
    const filtered = index.records
      .filter((record) => !query.category || record.category === query.category)
      .map((record) => ({ record, score: scoreRecord(record, tokens, query.domain) }))
      .filter((r) => tokens.length === 0 || r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, query.limit ?? 40)
      .map((r) => r.record);
    return {
      items: filtered,
      elapsedMs: performance.now() - started,
    };
  }

  async getById(id: string): Promise<IconKeywordRecord | null> {
    const index = await this.loadIndex();
    return index.records.find((record) => record.id === id) ?? null;
  }
}

export class LocalIconAssetProvider implements IconAssetProvider {
  async loadRawSvg(assetPath: string): Promise<string> {
    const url = assetPath.startsWith("/icons/")
      ? `/api/icon-assets/raw?path=${encodeURIComponent(assetPath)}`
      : assetPath;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Asset fetch failed: ${assetPath}`);
    return response.text();
  }
}

export class ApiIconIndexProvider implements IconIndexProvider {
  constructor(private readonly baseUrl = "/api") {}

  async loadIndex(): Promise<IconKeywordIndex> {
    const response = await fetch(`${this.baseUrl}/icon-index`);
    if (!response.ok) throw new Error("Failed loading icon index from API.");
    return response.json() as Promise<IconKeywordIndex>;
  }

  async search(query: DiscoveryQuery): Promise<DiscoveryResult> {
    const params = new URLSearchParams();
    if (query.query) params.set("q", query.query);
    if (query.domain) params.set("domain", query.domain);
    if (query.category) params.set("category", query.category);
    if (query.limit != null) params.set("limit", String(query.limit));
    const response = await fetch(`${this.baseUrl}/icon-index/search?${params.toString()}`);
    if (!response.ok) throw new Error("API icon search failed.");
    return response.json() as Promise<DiscoveryResult>;
  }

  async getById(id: string): Promise<IconKeywordRecord | null> {
    const response = await fetch(`${this.baseUrl}/icon-index/by-id?id=${encodeURIComponent(id)}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error("API icon by-id fetch failed.");
    return response.json() as Promise<IconKeywordRecord>;
  }
}

export class ApiIconAssetProvider implements IconAssetProvider {
  constructor(private readonly baseUrl = "/api") {}

  async loadRawSvg(assetPath: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/icon-assets/raw?path=${encodeURIComponent(assetPath)}`);
    if (!response.ok) throw new Error(`API raw SVG fetch failed: ${assetPath}`);
    return response.text();
  }
}

export type IconProviderMode = "local" | "api";

export function createIconProviders(mode: IconProviderMode = "api", apiBase = "/api"): {
  mode: IconProviderMode;
  indexProvider: IconIndexProvider;
  assetProvider: IconAssetProvider;
} {
  if (mode === "api") {
    return {
      mode,
      indexProvider: new ApiIconIndexProvider(apiBase),
      assetProvider: new ApiIconAssetProvider(apiBase),
    };
  }
  return {
    mode: "local",
    indexProvider: new LocalIconIndexProvider(),
    assetProvider: new LocalIconAssetProvider(),
  };
}
