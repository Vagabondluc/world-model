import { describe, expect, it, vi } from 'vitest';
import {
  createDefaultOllamaSettings,
  discoverOllamaModels,
  normalizeOllamaModels,
  normalizeOllamaSettings,
  resolveOllamaModel,
  toOllamaSettingsWire,
  toPiProviderConfig,
} from '@/lib/llm/ollama-settings';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(async (cmd: string) => {
    if (cmd === 'ollama_list_models') {
      return { models: [{ name: 'llama3.1:8b', size: 123 }, { name: 'mistral:7b', size: 456 }] };
    }
    if (cmd === 'ollama_get_settings') {
      return {
        provider: 'ollama',
        runtime: 'http',
        base_url: 'http://127.0.0.1:11434',
        auto_discover_models: false,
        refresh_on_open: true,
        refresh_interval_sec: 120,
        selected_model: 'mistral:7b',
        discovered_models: [{ name: 'mistral:7b', size: 456, modified_at: '2026-03-31T00:00:00Z' }],
        last_discovery_at: 1,
        last_health_check_at: 2,
        is_reachable: true,
        last_error: null,
      };
    }
    return null;
  }),
}));

describe('ollama settings contract', () => {
  it('normalizes wrapped model payloads', () => {
    const models = normalizeOllamaModels({ models: [{ name: 'mistral:7b', size: 456 }] });
    expect(models).toEqual([{ name: 'mistral:7b', size: 456, modifiedAt: undefined, isDefault: undefined }]);
  });

  it('normalizes backend settings into the shared shape', () => {
    const settings = normalizeOllamaSettings({
      provider: 'ollama',
      runtime: 'http',
      base_url: 'http://127.0.0.1:11434',
      auto_discover_models: false,
      refresh_on_open: true,
      refresh_interval_sec: 120,
      selected_model: 'mistral:7b',
      discovered_models: [{ name: 'mistral:7b', modified_at: '2026-03-31T00:00:00Z' }],
      last_discovery_at: 1,
      last_health_check_at: 2,
      is_reachable: true,
      last_error: null,
    });
    expect(settings.baseUrl).toBe('http://127.0.0.1:11434');
    expect(settings.selectedModel).toBe('mistral:7b');
    expect(settings.runtime).toBe('http');
    expect(settings.discoveredModels[0].modifiedAt).toBe('2026-03-31T00:00:00Z');
  });

  it('serializes the shared payload into the canonical wire DTO', () => {
    const wire = toOllamaSettingsWire({
      ...createDefaultOllamaSettings(),
      baseUrl: 'http://127.0.0.1:11434',
      selectedModel: 'mistral:7b',
      discoveredModels: [{ name: 'mistral:7b', size: 456, modifiedAt: '2026-03-31T00:00:00Z' }],
    });
    expect(wire).toEqual({
      provider: 'ollama',
      runtime: 'tauri',
      baseUrl: 'http://127.0.0.1:11434',
      autoDiscoverModels: true,
      refreshOnOpen: true,
      refreshIntervalSec: 60,
      selectedModel: 'mistral:7b',
      discoveredModels: [{ name: 'mistral:7b', size: 456, modifiedAt: '2026-03-31T00:00:00Z' }],
      lastDiscoveryAt: null,
      lastHealthCheckAt: null,
      isReachable: false,
      lastError: null,
    });
  });

  it('resolves a model from the selected field first', () => {
    const settings = createDefaultOllamaSettings();
    settings.selectedModel = 'llama3.1:8b';
    expect(resolveOllamaModel(settings)).toBe('llama3.1:8b');
  });

  it('falls back to the first discovered model when no selection exists', () => {
    const settings = createDefaultOllamaSettings();
    expect(resolveOllamaModel(settings, [{ name: 'llama3.1:8b' }])).toBe('llama3.1:8b');
  });

  it('maps the shared payload to a generic Pi/OpenClaw provider config', () => {
    const config = toPiProviderConfig({
      ...createDefaultOllamaSettings(),
      selectedModel: 'mistral:7b',
    });
    expect(config.provider).toBe('ollama');
    expect(config.model).toBe('mistral:7b');
    expect(config.baseUrl).toContain('11434');
  });

  it('discovers models from the shared Tauri command', async () => {
    const models = await discoverOllamaModels();
    expect(models).toHaveLength(2);
    expect(models[0].name).toBe('llama3.1:8b');
  });
});
