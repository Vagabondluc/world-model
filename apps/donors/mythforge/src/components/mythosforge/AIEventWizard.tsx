// =============================================================================
// MythosForge - AI Calendar Event Wizard
// =============================================================================

'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { CalendarEvent, CalendarEventCategory, CalendarStructuredData } from './calendar-forge-config';
import { EVENT_CATEGORIES, EVENT_CATEGORY_KEYS } from './calendar-types';
import { Sparkles, Loader2, X, Check, Plus, RotateCcw, ChevronLeft, Trash2 } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AIEventWizardProps {
  open: boolean;
  onOpenChange: (_open: boolean) => void;
  calendarData: CalendarStructuredData;
  existingEvents: CalendarEvent[];
  worldLore?: string;
  onSave: (_events: CalendarEvent[]) => void;
}

interface WizardEvent extends CalendarEvent {
  selected: boolean;
}

type WizardStep = 'configure' | 'generating' | 'review';

// ─── Suggestion Chips ─────────────────────────────────────────────────────────

const PROMPT_SUGGESTIONS = [
  'Generate major holidays and religious observances',
  'Create seasonal agricultural festivals tied to harvest cycles',
  'Design military remembrance days and battle anniversaries',
  'Add celestial events like eclipses, meteor showers, and planetary alignments',
  'Build political ceremonies and royal court traditions',
  'Create mystical events tied to the moons or magical ley lines',
];

// ─── Component ────────────────────────────────────────────────────────────────

export function AIEventWizard({
  open, onOpenChange, calendarData, existingEvents, worldLore, onSave,
}: AIEventWizardProps) {
  const [step, setStep] = useState<WizardStep>('configure');
  const [eventCount, setEventCount] = useState(10);
  const [selectedCategories, setSelectedCategories] = useState<Set<CalendarEventCategory>>(
    new Set(['festival', 'religious', 'harvest', 'celestial']),
  );
  const [recurringOnly, setRecurringOnly] = useState(true);
  const [spreadAcrossMonths, setSpreadAcrossMonths] = useState(true);
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedEvents, setGeneratedEvents] = useState<WizardEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Reset state when dialog opens
  useEffect(() => {
    if (!open) return;
    setStep('configure');
    setEventCount(10);
    setSelectedCategories(new Set(['festival', 'religious', 'harvest', 'celestial']));
    setRecurringOnly(true);
    setSpreadAcrossMonths(true);
    setCustomPrompt('');
    setGeneratedEvents([]);
    setError(null);
    setIsGenerating(false);
  }, [open]);

  const toggleCategory = useCallback((cat: CalendarEventCategory) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  }, []);

  const selectAllCategories = useCallback(() => {
    setSelectedCategories(new Set(EVENT_CATEGORY_KEYS));
  }, []);

  const clearAllCategories = useCallback(() => {
    setSelectedCategories(new Set());
  }, []);

  const selectedCount = useMemo(() => generatedEvents.filter((e) => e.selected).length, [generatedEvents]);

  const toggleEvent = useCallback((id: string) => {
    setGeneratedEvents((prev) =>
      prev.map((e) => e.id === id ? { ...e, selected: !e.selected } : e),
    );
  }, []);

  const toggleAllEvents = useCallback((select: boolean) => {
    setGeneratedEvents((prev) => prev.map((e) => ({ ...e, selected: select })));
  }, []);

  const removeEvent = useCallback((id: string) => {
    setGeneratedEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  // ── Generate Events ─────────────────────────────────────────────────────────

  const handleGenerate = useCallback(async () => {
    if (selectedCategories.size === 0) {
      setError('Select at least one event category');
      return;
    }

    setIsGenerating(true);
    setStep('generating');
    setError(null);

    try {
      const response = await fetch('/api/ai/generate-calendar-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calendarData,
          worldLore: worldLore || undefined,
          existingEvents: existingEvents.map((e) => ({
            name: e.name, month: e.month, day: e.day, category: e.category,
          })),
          preferences: {
            count: eventCount,
            categories: Array.from(selectedCategories),
            customPrompt: customPrompt.trim() || undefined,
            recurringOnly,
            spreadAcrossMonths,
          },
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Generation failed (${response.status})`);
      }

      const events: CalendarEvent[] = await response.json();
      setGeneratedEvents(events.map((e) => ({ ...e, selected: true })));
      setStep('review');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during generation.');
      setStep('configure');
    } finally {
      setIsGenerating(false);
    }
  }, [calendarData, worldLore, existingEvents, eventCount, selectedCategories, customPrompt, recurringOnly, spreadAcrossMonths]);

  // ── Save Selected Events ────────────────────────────────────────────────────

  const handleSave = useCallback(() => {
    const selected = generatedEvents.filter((e) => e.selected).map(({ selected: _s, ...evt }) => evt);
    onSave([...existingEvents, ...selected]);
    onOpenChange(false);
  }, [generatedEvents, existingEvents, onSave, onOpenChange]);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!isGenerating) onOpenChange(v); }}>
      <DialogContent className="bg-void-800 border-white/[0.08] text-bone-100 max-w-xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-5 pt-4 pb-0 flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
            <Sparkles className="w-4 h-4 text-accent-gold" />
            {step === 'configure' && 'AI Event Wizard'}
            {step === 'generating' && 'Generating Events...'}
            {step === 'review' && `Review Events (${selectedCount} selected)`}
          </DialogTitle>
        </DialogHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {/* ── Step 1: Configure ─────────────────────────────────────────── */}
          {step === 'configure' && (
            <div className="space-y-4">
              {/* Error banner */}
              {error && (
                <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg bg-accent-blood/[0.1] border border-accent-blood/[0.2]">
                  <X className="w-4 h-4 text-accent-blood flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-bone-300 leading-relaxed">
                    <span className="text-accent-blood font-semibold">Error:</span> {error}
                  </p>
                </div>
              )}

              {/* Info banner */}
              <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg bg-accent-gold/[0.06] border border-accent-gold/[0.12]">
                <Sparkles className="w-4 h-4 text-accent-gold flex-shrink-0 mt-0.5" />
                <p className="text-xs text-bone-300 leading-relaxed">
                  Describe what kinds of events you want, choose categories, and the AI will generate thematic events that fit your calendar and world lore.
                </p>
              </div>

              {/* Event count */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-ash-500 uppercase tracking-wider font-semibold">Number of Events</label>
                <div className="flex items-center gap-3">
                  <input type="range" min={3} max={30} value={eventCount}
                    onChange={(e) => setEventCount(parseInt(e.target.value))}
                    className="flex-1 accent-accent-gold h-1.5 bg-surface-600 rounded-full appearance-none cursor-pointer" />
                  <span className="text-sm font-mono text-accent-gold font-bold w-8 text-right">{eventCount}</span>
                </div>
              </div>

              {/* Categories */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-ash-500 uppercase tracking-wider font-semibold">Event Categories</label>
                  <div className="flex gap-1.5">
                    <button onClick={selectAllCategories} className="text-[9px] text-ash-500 hover:text-accent-gold transition-colors">All</button>
                    <span className="text-ash-700">·</span>
                    <button onClick={clearAllCategories} className="text-[9px] text-ash-500 hover:text-accent-blood transition-colors">None</button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {EVENT_CATEGORY_KEYS.map((cat) => {
                    const active = selectedCategories.has(cat);
                    const catInfo = EVENT_CATEGORIES[cat];
                    return (
                      <button key={cat} onClick={() => toggleCategory(cat)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
                          active
                            ? catInfo.bg + ' ' + catInfo.color + ' border-current/20'
                            : 'border-white/[0.06] text-ash-500 hover:text-bone-200 hover:border-white/[0.1]'
                        }`}>
                        {catInfo.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2.5 text-xs text-ash-400 cursor-pointer select-none">
                  <input type="checkbox" checked={recurringOnly} onChange={(e) => setRecurringOnly(e.target.checked)}
                    className="rounded border-white/[0.1] bg-void-900 accent-accent-gold" />
                  Recurring events only (every year)
                </label>
                <label className="flex items-center gap-2.5 text-xs text-ash-400 cursor-pointer select-none">
                  <input type="checkbox" checked={spreadAcrossMonths} onChange={(e) => setSpreadAcrossMonths(e.target.checked)}
                    className="rounded border-white/[0.1] bg-void-900 accent-accent-gold" />
                  Spread events across different months
                </label>
              </div>

              {/* Custom prompt */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-ash-500 uppercase tracking-wider font-semibold">Custom Instructions (optional)</label>
                <textarea value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g., Include a dark ritual during the winter solstice, a gladiatorial tournament, and a royal coronation ceremony..."
                  rows={3}
                  className="w-full bg-void-900 text-bone-300 text-xs border border-white/[0.06] rounded-lg p-3 resize-none leading-relaxed focus-visible:ring-accent-gold/30 focus-visible:border-accent-gold/40 placeholder:text-ash-600" />
                <div className="flex flex-wrap gap-1.5">
                  {PROMPT_SUGGESTIONS.map((suggestion) => (
                    <button key={suggestion} onClick={() => setCustomPrompt((prev) => prev ? `${prev.trim()}\n${suggestion}` : suggestion)}
                      className="px-2 py-0.5 rounded-full text-[9px] bg-surface-600 hover:bg-surface-500 text-ash-500 hover:text-bone-200 transition-colors border border-white/[0.04] hover:border-white/[0.1] truncate max-w-[220px]">
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Generating ────────────────────────────────────────── */}
          {step === 'generating' && (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-accent-gold animate-pulse" />
                </div>
                <div className="absolute -inset-2 rounded-2xl border-2 border-accent-gold/20 animate-ping" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-bone-100 font-semibold text-sm">Weaving Events into Your Calendar...</p>
                <p className="text-ash-500 text-xs">Consulting the oracles to craft {eventCount} thematic events</p>
              </div>
            </div>
          )}

          {/* ── Step 3: Review ────────────────────────────────────────────── */}
          {step === 'review' && (
            <div className="space-y-3">
              {/* Select all / deselect all */}
              <div className="flex items-center justify-between">
                <button onClick={() => toggleAllEvents(selectedCount === generatedEvents.length)}
                  className="text-[10px] text-ash-500 hover:text-accent-gold transition-colors">
                  {selectedCount === generatedEvents.length ? 'Deselect All' : 'Select All'}
                </button>
                <span className="text-[10px] text-ash-500">
                  {selectedCount} of {generatedEvents.length} events selected
                </span>
              </div>

              {/* Event list */}
              <div className="flex flex-col gap-1.5 max-h-[45vh] overflow-y-auto pr-1">
                {generatedEvents.map((evt) => {
                  const categories = EVENT_CATEGORIES as Record<string, (typeof EVENT_CATEGORIES)[keyof typeof EVENT_CATEGORIES]>;
                  const cat = categories[evt.category] || EVENT_CATEGORIES.festival;
                  const monthName = calendarData.month_names[evt.month] || `Month ${evt.month + 1}`;
                  return (
                    <div key={evt.id}
                      onClick={() => toggleEvent(evt.id)}
                      className={`flex items-start gap-3 p-2.5 rounded-lg border cursor-pointer transition-all ${
                        evt.selected
                          ? 'border-accent-gold/20 bg-accent-gold/[0.04] hover:bg-accent-gold/[0.08]'
                          : 'border-white/[0.04] bg-void-900 hover:bg-surface-700/50 opacity-50 hover:opacity-80'
                      }`}>
                      {/* Checkbox */}
                      <div className={`w-4 h-4 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                        evt.selected ? 'bg-accent-gold border-accent-gold' : 'border-white/[0.15]'
                      }`}>
                        {evt.selected && <Check className="w-3 h-3 text-void-900" />}
                      </div>

                      {/* Event details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-semibold text-bone-100 truncate">{evt.name}</span>
                          <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-medium ${cat.bg} ${cat.color} flex-shrink-0`}>
                            {cat.label}
                          </span>
                        </div>
                        {evt.description && (
                          <p className="text-[10px] text-ash-500 leading-relaxed line-clamp-2">{evt.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] text-ash-600 font-mono">{monthName}, Day {evt.day}</span>
                          {evt.year === 0 && <span className="text-[8px] text-accent-gold/60 bg-accent-gold/10 px-1.5 py-0.5 rounded-full">Recurring</span>}
                          {evt.year > 0 && <span className="text-[8px] text-ash-600">Year {evt.year}</span>}
                        </div>
                      </div>

                      {/* Remove button */}
                      <button onClick={(e) => { e.stopPropagation(); removeEvent(evt.id); }}
                        className="p-1 rounded text-ash-600 hover:text-accent-blood hover:bg-accent-blood/10 transition-all flex-shrink-0">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Regenerate button */}
              <button onClick={() => setStep('configure')}
                className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs text-ash-500 hover:text-bone-200 bg-surface-700/50 hover:bg-surface-600 transition-colors border border-white/[0.04]">
                <RotateCcw className="w-3 h-3" /> Back to Configuration
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="px-5 py-3 border-t border-white/[0.06] flex items-center justify-between flex-shrink-0 bg-void-800">
          {step === 'review' ? (
            <>
              <button onClick={() => setStep('configure')}
                className="flex items-center gap-1.5 text-xs text-ash-400 hover:text-bone-200 transition-colors">
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}
                  className="text-ash-400 hover:text-bone-100"><X className="w-3.5 h-3.5 mr-1" /> Cancel</Button>
                <Button size="sm" onClick={handleSave} disabled={selectedCount === 0}
                  className="bg-accent-gold text-void-900 hover:bg-accent-gold-dim font-medium">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add {selectedCount} Event{selectedCount !== 1 ? 's' : ''}
                </Button>
              </div>
            </>
          ) : step === 'generating' ? (
            <div />
          ) : (
            <>
              <button onClick={() => onOpenChange(false)}
                className="text-xs text-ash-400 hover:text-bone-200 transition-colors">
                Cancel
              </button>
              <Button size="sm" onClick={handleGenerate}
                disabled={selectedCategories.size === 0 || isGenerating}
                className="bg-accent-gold text-void-900 hover:bg-accent-gold-dim font-medium flex items-center gap-2">
                {isGenerating
                  ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</>
                  : <><Sparkles className="w-3.5 h-3.5" /> Generate Events</>}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
