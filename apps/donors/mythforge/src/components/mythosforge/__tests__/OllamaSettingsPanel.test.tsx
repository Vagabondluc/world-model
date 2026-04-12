import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OllamaSettingsPanel } from '@/components/mythosforge/OllamaSettingsPanel';

const invoke = vi.hoisted(() =>
  vi.fn(async (cmd: string, payload?: Record<string, unknown>) => {
    if (cmd === 'ollama_get_settings') {
      return {
        provider: 'ollama',
        runtime: 'tauri',
        baseUrl: 'http://127.0.0.1:11434',
        autoDiscoverModels: true,
        refreshOnOpen: true,
        refreshIntervalSec: 60,
        selectedModel: null,
        discoveredModels: [],
        lastDiscoveryAt: null,
        lastHealthCheckAt: null,
        isReachable: false,
        lastError: null,
      };
    }
    if (cmd === 'ollama_list_models') {
      return { models: [{ name: 'llama3.1:8b' }, { name: 'mistral:7b' }] };
    }
    if (cmd === 'ollama_health_check') {
      return null;
    }
    if (cmd === 'ollama_save_settings') {
      return payload?.settings ?? null;
    }
    return null;
  }),
);

vi.mock('@tauri-apps/api/core', () => ({ invoke }));

describe('OllamaSettingsPanel', () => {
  beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    invoke.mockClear();
  });

  it('auto-discovers models when opened', async () => {
    render(<OllamaSettingsPanel open />);

    await waitFor(() => {
      expect(screen.getByText(/Discovered 2 Ollama models/i)).toBeInTheDocument();
    });
    expect(screen.getAllByText('llama3.1:8b')).toHaveLength(2);
    expect(screen.getAllByText('mistral:7b')).toHaveLength(1);
  });

  it('saves the exact wire DTO expected by Rust', async () => {
    const user = userEvent.setup();
    render(<OllamaSettingsPanel open />);

    await user.click(screen.getByRole('button', { name: /Refresh/i }));
    await user.click(screen.getByRole('button', { name: /Test/i }));
    await user.click(screen.getByRole('button', { name: /Save/i }));

    await waitFor(() => {
      expect(invoke).toHaveBeenCalledWith('ollama_save_settings', {
        settings: {
          provider: 'ollama',
          runtime: 'tauri',
          baseUrl: 'http://127.0.0.1:11434',
          autoDiscoverModels: true,
          refreshOnOpen: true,
          refreshIntervalSec: 60,
          selectedModel: 'llama3.1:8b',
          discoveredModels: [{ name: 'llama3.1:8b' }, { name: 'mistral:7b' }],
          lastDiscoveryAt: 1_700_000_000_000,
          lastHealthCheckAt: 1_700_000_000_000,
          isReachable: true,
          lastError: null,
        },
      });
    });
  });
});
