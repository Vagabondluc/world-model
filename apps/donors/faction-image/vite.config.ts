import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "node:fs/promises";
import type { IncomingMessage, ServerResponse } from "node:http";
import { componentTagger } from "lovable-tagger";

function scoreRecord(record: any, queryTokens: string[], domain?: string): number {
  let score = 0;
  const keywords = new Set((record.keywords || []).map((k: string) => String(k).toLowerCase()));
  for (const token of queryTokens) {
    if (keywords.has(token)) score += 4;
    if (String(record.id || "").toLowerCase().includes(token)) score += 2;
    if (String(record.category || "").toLowerCase().includes(token)) score += 1;
  }
  if (domain && record.domains && record.domains[domain]) {
    score += Number(record.domains[domain] || 0) * 3;
  }
  score += Math.max(0, Math.min(5, Number(record.quality?.recolorQuality || 0))) * 0.5;
  return score;
}

function writeJson(res: ServerResponse, code: number, payload: unknown) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function writeText(res: ServerResponse, code: number, body: string) {
  res.statusCode = code;
  res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
  res.end(body);
}

function iconMockApiPlugin() {
  const publicRoot = path.resolve(__dirname, "public");
  const iconsRoot = path.resolve(__dirname, "icons");
  const indexPath = path.resolve(publicRoot, "icons", "keywords.index.json");
  let cachedIndex: any | null = null;

  const loadIndex = async () => {
    if (cachedIndex) return cachedIndex;
    const raw = await fs.readFile(indexPath, "utf8");
    cachedIndex = JSON.parse(raw);
    return cachedIndex;
  };

  const safeJoinPublic = (relativeUrlPath: string): string | null => {
    const decoded = decodeURIComponent(relativeUrlPath);
    const normalized = path.normalize(decoded).replace(/^([/\\])+/, "");
    const absolute = path.resolve(publicRoot, normalized);
    if (!absolute.startsWith(publicRoot)) return null;
    return absolute;
  };
  const safeJoinIcons = (relativeUrlPath: string): string | null => {
    const decoded = decodeURIComponent(relativeUrlPath);
    const normalized = path.normalize(decoded).replace(/^([/\\])+/, "");
    const absolute = path.resolve(iconsRoot, normalized);
    if (!absolute.startsWith(iconsRoot)) return null;
    return absolute;
  };

  return {
    name: "icon-mock-api",
    configureServer(server: any) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        try {
          const url = req.url ? new URL(req.url, "http://localhost") : null;
          if (!url || !url.pathname.startsWith("/api/")) return next();

          if (url.pathname === "/api/icon-index") {
            const index = await loadIndex();
            return writeJson(res, 200, index);
          }

          if (url.pathname === "/api/icon-index/search") {
            const index = await loadIndex();
            const q = (url.searchParams.get("q") || "").toLowerCase().trim();
            const domain = url.searchParams.get("domain") || undefined;
            const category = url.searchParams.get("category") || undefined;
            const limit = Math.max(1, Math.min(200, Number(url.searchParams.get("limit") || "40")));
            const tokens = q.split(/\s+/).filter(Boolean);
            const started = performance.now();
            const items = (index.records || [])
              .filter((record: any) => !category || record.category === category)
              .map((record: any) => ({ record, score: scoreRecord(record, tokens, domain) }))
              .filter((r: any) => tokens.length === 0 || r.score > 0)
              .sort((a: any, b: any) => b.score - a.score)
              .slice(0, limit)
              .map((r: any) => r.record);
            return writeJson(res, 200, { items, elapsedMs: performance.now() - started });
          }

          if (url.pathname === "/api/icon-index/by-id") {
            const id = url.searchParams.get("id");
            if (!id) return writeJson(res, 400, { error: "missing id" });
            const index = await loadIndex();
            const found = (index.records || []).find((r: any) => r.id === id);
            if (!found) return writeJson(res, 404, { error: "not found" });
            return writeJson(res, 200, found);
          }

          if (url.pathname === "/api/icon-assets/raw") {
            const assetPath = url.searchParams.get("path");
            if (!assetPath) return writeJson(res, 400, { error: "missing path" });
            let absolute: string | null = null;
            if (assetPath.startsWith("/icons/")) {
              absolute = safeJoinIcons(assetPath.slice("/icons/".length));
            } else if (assetPath.startsWith("/assets/")) {
              absolute = safeJoinPublic(assetPath);
            }
            if (!absolute) return writeJson(res, 403, { error: "invalid path" });
            const svg = await fs.readFile(absolute, "utf8");
            return writeText(res, 200, svg);
          }

          return writeJson(res, 404, { error: "unknown endpoint" });
        } catch (error) {
          return writeJson(res, 500, { error: error instanceof Error ? error.message : "server error" });
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), iconMockApiPlugin(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        dashboard: path.resolve(__dirname, "dashboard.html"),
      },
    },
  },
}));
