import { invoke } from '@tauri-apps/api/core';
import { z } from 'zod';

export const OLLAMA_PROVIDER = 'ollama' as const;
export const OLLAMA_DEFAULT_BASE_URL = 'http://127.0.0.1:11434';
export const OLLAMA_DEFAULT_REFRESH_INTERVAL_SEC = 60;

export const OllamaModelSchema = z.object({
  name: z.string(),
  size: z.number().optional(),
  modifiedAt: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export const OllamaSettingsSchema = z.object({
  provider: z.literal(OLLAMA_PROVIDER),
  runtime: z.enum(['tauri', 'http']),
  baseUrl: z.string().min(1),
  autoDiscoverModels: z.boolean(),
  refreshOnOpen: z.boolean(),
  refreshIntervalSec: z.number().int().min(5).max(3600),
  selectedModel: z.string().nullable(),
  discoveredModels: z.array(OllamaModelSchema),
  lastDiscoveryAt: z.number().nullable(),
  lastHealthCheckAt: z.number().nullable(),
  isReachable: z.boolean(),
  lastError: z.string().nullable(),
});

export type OllamaModelSummary = z.infer<typeof OllamaModelSchema>;
export type OllamaSettings = z.infer<typeof OllamaSettingsSchema>;
export type OllamaSettingsWire = OllamaSettings;
export type OllamaRuntime = OllamaSettings['runtime'];

export interface PiProviderConfig {
  provider: string;
  baseUrl: string;
  apiKey: string;
  model: string | null;
  runtime: OllamaRuntime;
}

export function createDefaultOllamaSettings(): OllamaSettings {
  return {
    provider: OLLAMA_PROVIDER,
    runtime: 'tauri',
    baseUrl: OLLAMA_DEFAULT_BASE_URL,
    autoDiscoverModels: true,
    refreshOnOpen: true,
    refreshIntervalSec: OLLAMA_DEFAULT_REFRESH_INTERVAL_SEC,
    selectedModel: null,
    discoveredModels: [],
    lastDiscoveryAt: null,
    lastHealthCheckAt: null,
    isReachable: false,
    lastError: null,
  };
}

function parseModel(raw: unknown): OllamaModelSummary | null {
  if (!raw || typeof raw !== 'object') return null;
  const record = raw as Record<string, unknown>;
  const name = typeof record.name === 'string' ? record.name : '';
  if (!name) return null;
  return {
    name,
    size: typeof record.size === 'number' ? record.size : undefined,
    modifiedAt: typeof record.modifiedAt === 'string'
      ? record.modifiedAt
      : typeof record.modified_at === 'string'
        ? String(record.modified_at)
        : undefined,
    isDefault: typeof record.isDefault === 'boolean'
      ? record.isDefault
      : typeof record.is_default === 'boolean'
        ? record.is_default
        : undefined,
  };
}

export function normalizeOllamaModels(raw: unknown): OllamaModelSummary[] {
  const list = Array.isArray(raw)
    ? raw
    : raw && typeof raw === 'object' && Array.isArray((raw as { models?: unknown[] }).models)
      ? ((raw as { models?: unknown[] }).models ?? [])
      : [];
  return list.map(parseModel).filter((model): model is OllamaModelSummary => Boolean(model));
}

export function normalizeOllamaSettings(raw: unknown): OllamaSettings {
  const base = createDefaultOllamaSettings();
  if (!raw || typeof raw !== 'object') return base;
  const record = raw as Record<string, unknown>;
  return {
    provider: typeof record.provider === 'string' ? (record.provider as typeof base.provider) : base.provider,
    runtime: record.runtime === 'http' ? 'http' : 'tauri',
    baseUrl: typeof record.baseUrl === 'string'
      ? record.baseUrl
      : typeof record.base_url === 'string'
        ? String(record.base_url)
        : base.baseUrl,
    autoDiscoverModels: typeof record.autoDiscoverModels === 'boolean'
      ? record.autoDiscoverModels
      : typeof record.auto_discover_models === 'boolean'
        ? record.auto_discover_models
        : base.autoDiscoverModels,
    refreshOnOpen: typeof record.refreshOnOpen === 'boolean'
      ? record.refreshOnOpen
      : typeof record.refresh_on_open === 'boolean'
        ? record.refresh_on_open
        : base.refreshOnOpen,
    refreshIntervalSec: typeof record.refreshIntervalSec === 'number'
      ? record.refreshIntervalSec
      : typeof record.refresh_interval_sec === 'number'
        ? record.refresh_interval_sec
        : base.refreshIntervalSec,
    selectedModel: typeof record.selectedModel === 'string'
      ? record.selectedModel
      : typeof record.selected_model === 'string'
        ? record.selected_model
        : null,
    discoveredModels: normalizeOllamaModels(record.discoveredModels ?? record.discovered_models ?? record.models),
    lastDiscoveryAt: typeof record.lastDiscoveryAt === 'number'
      ? record.lastDiscoveryAt
      : typeof record.last_discovery_at === 'number'
        ? record.last_discovery_at
        : null,
    lastHealthCheckAt: typeof record.lastHealthCheckAt === 'number'
      ? record.lastHealthCheckAt
      : typeof record.last_health_check_at === 'number'
        ? record.last_health_check_at
        : null,
    isReachable: typeof record.isReachable === 'boolean'
      ? record.isReachable
      : typeof record.is_reachable === 'boolean'
        ? record.is_reachable
        : base.isReachable,
    lastError: typeof record.lastError === 'string'
      ? record.lastError
      : typeof record.last_error === 'string'
        ? record.last_error
        : null,
  };
}

export function resolveOllamaModel(settings: OllamaSettings, discoveredModels: OllamaModelSummary[] = settings.discoveredModels): string | null {
  return settings.selectedModel || discoveredModels[0]?.name || null;
}

export function toPiProviderConfig(settings: OllamaSettings): PiProviderConfig {
  return {
    provider: settings.provider,
    baseUrl: settings.baseUrl,
    apiKey: 'ollama',
    model: resolveOllamaModel(settings),
    runtime: settings.runtime,
  };
}

export function toOllamaSettingsWire(settings: OllamaSettings): OllamaSettingsWire {
  return OllamaSettingsSchema.parse(settings);
}

export async function loadOllamaSettings(): Promise<OllamaSettings> {
  try {
    const raw = await invoke('ollama_get_settings');
    return normalizeOllamaSettings(raw);
  } catch {
    return createDefaultOllamaSettings();
  }
}

export async function saveOllamaSettings(settings: OllamaSettings): Promise<OllamaSettings> {
  const wire = toOllamaSettingsWire(settings);
  const raw = await invoke('ollama_save_settings', { settings: wire });
  return normalizeOllamaSettings(raw ?? wire);
}

export async function setOllamaModel(model: string): Promise<void> {
  await invoke('ollama_set_model', { model });
}

export async function discoverOllamaModels(): Promise<OllamaModelSummary[]> {
  try {
    const raw = await invoke('ollama_list_models');
    return normalizeOllamaModels(raw);
  } catch {
    return [];
  }
}

export async function testOllamaConnection(): Promise<boolean> {
  try {
    await invoke('ollama_health_check');
    return true;
  } catch {
    return false;
  }
}
