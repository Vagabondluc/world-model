// =============================================================================
// MythosForge - Calendar Forge: Hybrid Brainstorming Wizard
// =============================================================================

'use client';

import { useState, useCallback } from 'react';
import { useWorldStore } from '@/store/useWorldStore';
import {
  CALENDAR_PROMPTS,
  buildFinalMarkdown,
  type CalendarAttributes,
  type CalendarStructuredData,
} from './calendar-forge-config';
import type { CalendarPrompt } from './calendar-forge-config';
import { ManualCalendarEditor } from './ManualCalendarEditor';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { CalendarDays, Sparkles, X, RotateCcw, Loader2, Zap, Settings2 } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type DesignNotes = CalendarAttributes['design_notes'];

interface CalendarForgeProps {
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CalendarForge({ onClose }: CalendarForgeProps) {
  const addEntity = useWorldStore((s) => s.addEntity);
  const setActiveEntity = useWorldStore((s) => s.setActiveEntity);

  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState<DesignNotes>({
    cosmology_solar: '', cosmology_moons: '', structure_grid: '',
    structure_intercalary: '', lore_epoch: '', lore_naming: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualOpen, setManualOpen] = useState(false);

  const setNote = useCallback((key: keyof DesignNotes, value: string) => {
    setNotes((prev) => ({ ...prev, [key]: value }));
    setError(null);
  }, []);

  const handleChipClick = useCallback((promptId: keyof DesignNotes, suggestion: string) => {
    setNotes((prev) => {
      const current = prev[promptId];
      const next = current.trim() ? `${current.trim()}\n${suggestion}` : suggestion;
      return { ...prev, [promptId]: next };
    });
    setError(null);
  }, []);

  const hasContent = Object.values(notes).some((v) => v.trim().length > 0);
  const filledCount = Object.values(notes).filter((v) => v.trim().length > 0).length;

  // ── AI Synthesis Path ─────────────────────────────────────────────────────

  const handleAiSave = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const calendarTitle = title.trim() || 'Untitled Calendar';
      const response = await fetch('/api/ai/synthesize-calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Synthesis failed (${response.status})`);
      }
      const synthesized: CalendarStructuredData = await response.json();
      const markdown = buildFinalMarkdown(notes, synthesized);
      const entity = addEntity(calendarTitle, 'Calendar', markdown, {
        design_notes: notes, synthesized,
      } satisfies CalendarAttributes);
      setActiveEntity(entity.id);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during synthesis.');
    } finally {
      setIsGenerating(false);
    }
  }, [title, notes, addEntity, setActiveEntity, onClose]);

  // ── Manual Configuration Path ─────────────────────────────────────────────

  const handleManualSave = useCallback((data: CalendarStructuredData) => {
    const calendarTitle = title.trim() || 'Untitled Calendar';
    const markdown = buildFinalMarkdown(notes, data);
    const entity = addEntity(calendarTitle, 'Calendar', markdown, {
      design_notes: notes, synthesized: data,
    } satisfies CalendarAttributes);
    setActiveEntity(entity.id);
    onClose();
  }, [title, notes, addEntity, setActiveEntity, onClose]);

  const handleReset = useCallback(() => {
    if (!hasContent) return;
    setNotes({ cosmology_solar: '', cosmology_moons: '', structure_grid: '',
      structure_intercalary: '', lore_epoch: '', lore_naming: '' });
    setTitle(''); setError(null);
  }, [hasContent]);

  return (
    <div className="h-full flex flex-col bg-void-800">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <CalendarDays className="w-5 h-5 text-accent-gold" />
          <h2 className="text-sm font-bold text-bone-100 tracking-wide uppercase">Hybrid Calendar Forge</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-ash-600 mr-1">{filledCount}/6 filled</span>
          {hasContent && (
            <button onClick={handleReset} className="p-1.5 rounded-md text-ash-500 hover:text-accent-blood hover:bg-surface-600 transition-colors" title="Reset all fields">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
          <button onClick={onClose} className="p-1.5 rounded-md text-ash-500 hover:text-bone-100 hover:bg-surface-600 transition-colors" title="Close">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-5 py-4 space-y-4">
          {/* Calendar Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-ash-500 uppercase tracking-wider font-medium">Calendar Name</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., The Imperial Reckoning of Aethelgard"
              className="bg-void-900 text-bone-100 text-sm border border-white/[0.06] rounded-lg px-3 py-2 focus-visible:ring-accent-gold/30 focus-visible:border-accent-gold/40 placeholder:text-ash-600" />
          </div>

          {/* Progress indicator */}
          <div className="flex gap-1.5">
            {CALENDAR_PROMPTS.map((p) => {
              const filled = notes[p.id]?.trim().length > 0;
              return <div key={p.id} className={`flex-1 h-1 rounded-full transition-colors ${filled ? 'bg-accent-gold' : 'bg-surface-600'}`} />;
            })}
          </div>

          {/* AI Pipeline info banner */}
          <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg bg-accent-gold/[0.06] border border-accent-gold/[0.12]">
            <Zap className="w-4 h-4 text-accent-gold flex-shrink-0 mt-0.5" />
            <p className="text-xs text-bone-300 leading-relaxed">
              <span className="text-accent-gold font-semibold">Dual Path:</span> Use <span className="text-bone-100 font-medium">AI Synthesis</span> to auto-generate the calendar grid from your notes, or <span className="text-bone-100 font-medium">Configure Manually</span> to punch in exact values yourself.
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg bg-accent-blood/[0.1] border border-accent-blood/[0.2]">
              <X className="w-4 h-4 text-accent-blood flex-shrink-0 mt-0.5" />
              <p className="text-xs text-bone-300 leading-relaxed">
                <span className="text-accent-blood font-semibold">Synthesis Failed:</span> {error}
              </p>
            </div>
          )}

          {/* Accordion Prompts */}
          <Accordion type="multiple" defaultValue={['cosmology_solar']} className="space-y-1">
            {CALENDAR_PROMPTS.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} value={notes[prompt.id]}
                onChange={(v) => setNote(prompt.id, v)} onChipClick={handleChipClick} />
            ))}
          </Accordion>
        </div>
      </div>

      {/* Fixed Footer — Dual Path Buttons */}
      <div className="flex-shrink-0 border-t border-white/[0.06] px-5 py-3 flex items-center justify-between bg-void-800/95 backdrop-blur-sm">
        <button onClick={() => setManualOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-ash-400 hover:text-bone-200 bg-surface-700 hover:bg-surface-600 border border-white/[0.06] transition-colors">
          <Settings2 className="w-3.5 h-3.5" /> Configure Manually
        </button>
        <button onClick={handleAiSave} disabled={!hasContent || isGenerating}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            isGenerating ? 'bg-accent-gold/40 text-void-900 cursor-wait'
              : hasContent ? 'bg-accent-gold text-void-900 hover:bg-accent-gold-dim'
                : 'bg-surface-600 text-ash-500 cursor-not-allowed'
          }`}>
          {isGenerating ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Synthesizing...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Generate & Save</>
          )}
        </button>
      </div>

      <ManualCalendarEditor open={manualOpen} onOpenChange={setManualOpen} onSave={handleManualSave} />
    </div>
  );
}

// ─── Prompt Card Sub-component ────────────────────────────────────────────────

function PromptCard({
  prompt, value, onChange, onChipClick,
}: {
  prompt: CalendarPrompt; value: string;
  onChange: (_v: string) => void;
  onChipClick: (_id: keyof DesignNotes, _suggestion: string) => void;
}) {
  return (
    <AccordionItem value={prompt.id}
      className="border border-white/[0.06] rounded-lg bg-surface-700/20 overflow-hidden data-[state=open]:border-accent-gold/20 transition-colors">
      <AccordionTrigger className="px-4 py-3 hover:no-underline">
        <div className="flex items-center gap-2.5 text-left">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${
            value.trim() ? 'bg-accent-gold/20 text-accent-gold' : 'bg-surface-600 text-ash-500'
          }`}>
            {value.trim() ? '✓' : (CALENDAR_PROMPTS.indexOf(prompt) + 1)}
          </div>
          <span className="text-bone-200 text-sm font-semibold">{prompt.title}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <p className="text-bone-300 text-sm font-medium mb-3 flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-accent-gold flex-shrink-0 mt-0.5" />
          {prompt.question}
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {prompt.suggestions.map((suggestion) => (
            <button key={suggestion} onClick={() => onChipClick(prompt.id, suggestion)}
              className="px-3 py-1.5 rounded-full text-xs bg-surface-600 hover:bg-surface-500 text-ash-400 hover:text-bone-200 transition-colors border border-white/[0.04] hover:border-white/[0.1]">
              {suggestion}
            </button>
          ))}
        </div>
        <textarea value={value} onChange={(e) => onChange(e.target.value)}
          placeholder="Type your answer here, or click a chip above to Quick-Fill..."
          rows={3}
          className="w-full bg-void-900 text-bone-300 text-sm border border-white/[0.06] rounded-lg p-3 resize-y leading-relaxed focus-visible:ring-accent-gold/30 focus-visible:border-accent-gold/40 placeholder:text-ash-600" />
      </AccordionContent>
    </AccordionItem>
  );
}
