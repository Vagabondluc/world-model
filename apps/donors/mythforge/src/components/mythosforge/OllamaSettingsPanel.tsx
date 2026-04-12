'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Loader2, RefreshCcw, Save, ServerCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  createDefaultOllamaSettings,
  discoverOllamaModels,
  loadOllamaSettings,
  normalizeOllamaSettings,
  resolveOllamaModel,
  saveOllamaSettings,
  testOllamaConnection,
  type OllamaModelSummary,
  type OllamaSettings,
} from '@/lib/llm/ollama-settings';

interface OllamaSettingsPanelProps {
  open: boolean;
}

export function OllamaSettingsPanel({ open }: OllamaSettingsPanelProps) {
  const [settings, setSettings] = useState<OllamaSettings>(createDefaultOllamaSettings());
  const [models, setModels] = useState<OllamaModelSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const effectiveModel = useMemo(() => resolveOllamaModel(settings, models), [settings, models]);
  const selectedModelMissing = Boolean(settings.selectedModel && !models.some((model) => model.name === settings.selectedModel));

  const updateSetting = useCallback(<K extends keyof OllamaSettings>(key: K, value: OllamaSettings[K]) => {
    setSettings((current) => ({ ...current, [key]: value }));
  }, []);

  const hydrate = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const loaded = normalizeOllamaSettings(await loadOllamaSettings());
      setSettings(loaded);
      const discovered = loaded.autoDiscoverModels || loaded.refreshOnOpen
        ? await discoverOllamaModels()
        : loaded.discoveredModels;
      setModels(discovered);
      setSettings((current) => ({
        ...current,
        discoveredModels: discovered,
        lastDiscoveryAt: Date.now(),
        isReachable: discovered.length > 0,
        lastError: null,
      }));
      setMessage(discovered.length > 0
        ? `Discovered ${discovered.length} Ollama model${discovered.length === 1 ? '' : 's'}.`
        : 'No Ollama models discovered yet.');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to load Ollama settings.';
      setError(msg);
      setModels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) void hydrate();
  }, [open, hydrate]);

  const refreshModels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const discovered = await discoverOllamaModels();
      setModels(discovered);
      setSettings((current) => ({
        ...current,
        discoveredModels: discovered,
        lastDiscoveryAt: Date.now(),
        isReachable: discovered.length > 0,
        lastError: null,
      }));
      setMessage(discovered.length > 0
        ? `Refreshed ${discovered.length} Ollama model${discovered.length === 1 ? '' : 's'}.`
        : 'Ollama is reachable but no models were returned.');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Model refresh failed.';
      setError(msg);
      setSettings((current) => ({ ...current, isReachable: false, lastError: msg }));
    } finally {
      setLoading(false);
    }
  }, []);

  const testConnection = useCallback(async () => {
    setTesting(true);
    setError(null);
    try {
      const ok = await testOllamaConnection();
      setSettings((current) => ({
        ...current,
        lastHealthCheckAt: Date.now(),
        isReachable: ok,
        lastError: ok ? null : 'Ollama is not reachable.',
      }));
      setMessage(ok ? 'Ollama connection looks good.' : 'Ollama did not respond.');
      if (ok) await refreshModels();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Connection test failed.';
      setError(msg);
      setSettings((current) => ({ ...current, isReachable: false, lastError: msg }));
    } finally {
      setTesting(false);
    }
  }, [refreshModels]);

  const save = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = normalizeOllamaSettings({
        ...settings,
        selectedModel: effectiveModel,
        discoveredModels: models,
      });
      await saveOllamaSettings(payload);
      setSettings(payload);
      setMessage('Ollama settings saved.');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to save Ollama settings.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  }, [effectiveModel, models, settings]);

  return (
    <div data-testid="ollama-settings-panel" className="space-y-4">
      <div className="rounded-md border border-white/[0.06] bg-void-700/50 p-3 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ServerCog className="size-4 text-accent-gold" />
            <div>
              <p className="text-sm font-medium text-bone-200">Ollama Connection</p>
              <p className="text-xs text-ash-500">Local model discovery and streaming via Tauri.</p>
            </div>
          </div>
          <div className="text-xs text-ash-500">
            {settings.isReachable ? (
              <span className="inline-flex items-center gap-1 text-emerald-400"><CheckCircle2 className="size-3.5" /> Ready</span>
            ) : (
              <span className="inline-flex items-center gap-1"><AlertTriangle className="size-3.5" /> Offline</span>
            )}
          </div>
        </div>

        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label className="text-xs text-ash-500">Base URL</Label>
              <Input
                data-testid="ollama-base-url"
                value={settings.baseUrl}
                onChange={(e) => updateSetting('baseUrl', e.target.value)}
                className="h-8 bg-surface-700/50 border-white/[0.08] text-bone-300 placeholder:text-ash-600"
            />
          </div>

          <div className="grid gap-1.5">
            <Label className="text-xs text-ash-500">Default Model</Label>
            <Select
              value={settings.selectedModel ?? effectiveModel ?? ''}
              onValueChange={(value) => updateSetting('selectedModel', value)}
            >
              <SelectTrigger className="h-8 bg-transparent border-white/[0.08] text-bone-300">
                <SelectValue placeholder={effectiveModel || 'No model selected'} />
              </SelectTrigger>
              <SelectContent className="bg-surface-700 border-white/[0.08]">
                {models.length > 0 ? (
                  models.map((model) => (
                    <SelectItem key={model.name} value={model.name} className="text-xs text-bone-300 focus:bg-surface-600 focus:text-bone-100">
                      {model.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="__none__" disabled className="text-xs text-ash-500">
                    No models discovered
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {selectedModelMissing && (
              <p className="text-[11px] text-amber-400">
                Saved model is not currently in the discovered list.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center justify-between rounded-md border border-white/[0.06] bg-void-800/60 px-3 py-2">
              <div>
                <p className="text-sm text-bone-200">Auto discover</p>
                <p className="text-[11px] text-ash-500">Scan on open and refresh automatically.</p>
              </div>
              <Switch checked={settings.autoDiscoverModels} onCheckedChange={(value) => updateSetting('autoDiscoverModels', value)} />
            </div>
            <div className="flex items-center justify-between rounded-md border border-white/[0.06] bg-void-800/60 px-3 py-2">
              <div>
                <p className="text-sm text-bone-200">Refresh on open</p>
                <p className="text-[11px] text-ash-500">Hydrate the model list when the dialog opens.</p>
              </div>
              <Switch checked={settings.refreshOnOpen} onCheckedChange={(value) => updateSetting('refreshOnOpen', value)} />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label className="text-xs text-ash-500">Refresh interval (sec)</Label>
            <Input
              type="number"
              min={5}
              max={3600}
              value={settings.refreshIntervalSec}
              onChange={(e) => updateSetting('refreshIntervalSec', Number(e.target.value) || 60)}
              className="h-8 bg-surface-700/50 border-white/[0.08] text-bone-300"
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border border-white/[0.06] bg-void-700/40 p-3 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-wider text-ash-500 font-semibold">Model Discovery</p>
            <p className="text-xs text-ash-500">
              {models.length > 0 ? `${models.length} discovered model${models.length === 1 ? '' : 's'}` : 'No cached models yet'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              data-testid="ollama-refresh"
              type="button"
              variant="outline"
              size="sm"
              onClick={refreshModels}
              disabled={loading}
              className="h-8 border-white/[0.08] text-bone-300 hover:bg-white/[0.06] hover:text-bone-100"
            >
              {loading ? <Loader2 className="mr-1.5 size-3.5 animate-spin" /> : <RefreshCcw className="mr-1.5 size-3.5" />}
              Refresh
            </Button>
            <Button
              data-testid="ollama-test"
              type="button"
              variant="outline"
              size="sm"
              onClick={testConnection}
              disabled={testing}
              className="h-8 border-white/[0.08] text-bone-300 hover:bg-white/[0.06] hover:text-bone-100"
            >
              {testing ? <Loader2 className="mr-1.5 size-3.5 animate-spin" /> : <CheckCircle2 className="mr-1.5 size-3.5" />}
              Test
            </Button>
          </div>
        </div>

        <div className="max-h-40 overflow-y-auto mythosforge-scrollbar space-y-1.5">
          {models.length > 0 ? (
            models.map((model) => (
              <div key={model.name} data-testid={`ollama-model-${model.name}`} className="flex items-center justify-between rounded-md border border-white/[0.06] bg-void-800/60 px-3 py-2">
                <div>
                  <p className="text-sm text-bone-200">{model.name}</p>
                  <p className="text-[11px] text-ash-500">
                    {typeof model.size === 'number' ? `${model.size} bytes` : 'Size unavailable'}
                  </p>
                </div>
                {resolveOllamaModel(settings, models) === model.name && (
                  <span className="text-[10px] uppercase tracking-wider text-accent-gold">Selected</span>
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-ash-500">Enable auto discovery or refresh to load models.</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="min-h-5">
          {message && <p className="text-xs text-emerald-400">{message}</p>}
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
        <Button
          data-testid="ollama-save"
          type="button"
          onClick={save}
          disabled={saving}
          className="h-8 bg-accent-gold text-void-900 hover:bg-accent-gold-dim"
        >
          {saving ? <Loader2 className="mr-1.5 size-3.5 animate-spin" /> : <Save className="mr-1.5 size-3.5" />}
          Save
        </Button>
      </div>

      <Separator className="bg-white/[0.06]" />
      <p className="text-[11px] text-ash-500">
        AI Co-Pilot reads this same provider payload. Pi/OpenClaw adapters can consume the normalized contract without changing the UI shape.
      </p>
    </div>
  );
}
