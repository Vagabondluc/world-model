// =============================================================================
// MythosForge - Manual Calendar Configurator
// =============================================================================

'use client';

import { useState, useCallback } from 'react';
import type { CalendarStructuredData } from './calendar-forge-config';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings2, X, Save } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ManualCalendarEditorProps {
  open: boolean;
  onOpenChange: (_open: boolean) => void;
  initialData?: CalendarStructuredData;
  onSave: (_data: CalendarStructuredData) => void;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULTS: CalendarStructuredData = {
  total_months: 12,
  days_per_week: 7,
  days_per_month: 30,
  intercalary_days_count: 0,
  month_names: Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`),
  weekday_names: Array.from({ length: 7 }, (_, i) => `Day ${i + 1}`),
  epoch_event: '',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function syncArray(arr: string[], newLen: number, fallback: (_i: number) => string): string[] {
  if (newLen > arr.length) {
    return [...arr, ...Array.from({ length: newLen - arr.length }, (_, i) => fallback(arr.length + i))];
  }
  return arr.slice(0, newLen);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ManualCalendarEditor({ open, onOpenChange, initialData, onSave }: ManualCalendarEditorProps) {
  const [local, setLocal] = useState<CalendarStructuredData>(DEFAULTS);

  // Sync state when dialog opens (React's adjusting-state-during-render pattern)
  const [prevOpen, setPrevOpen] = useState(false);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setLocal(initialData
        ? { ...DEFAULTS, ...initialData, month_names: [...initialData.month_names], weekday_names: [...initialData.weekday_names] }
        : { ...DEFAULTS });
    }
  }

  const setNum = useCallback(<K extends 'total_months' | 'days_per_week' | 'days_per_month' | 'intercalary_days_count'>(
    key: K, value: number,
  ) => {
    setLocal((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'total_months') next.month_names = syncArray(prev.month_names, value, (i) => `Month ${i + 1}`);
      if (key === 'days_per_week') next.weekday_names = syncArray(prev.weekday_names, value, (i) => `Day ${i + 1}`);
      return next;
    });
  }, []);

  const setName = useCallback((key: 'month_names' | 'weekday_names', index: number, value: string) => {
    setLocal((prev) => {
      const arr = [...prev[key]];
      arr[index] = value;
      return { ...prev, [key]: arr };
    });
  }, []);

  const handleSave = useCallback(() => {
    const data: CalendarStructuredData = {
      ...local,
      month_names: local.month_names.map((n, i) => n.trim() || `Month ${i + 1}`),
      weekday_names: local.weekday_names.map((n, i) => n.trim() || `Day ${i + 1}`),
    };
    onSave(data);
    onOpenChange(false);
  }, [local, onSave, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-void-800 border-white/[0.08] text-bone-100 max-w-lg max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-5 pt-4 pb-0 flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
            <Settings2 className="w-4 h-4 text-accent-gold" /> Manual Calendar Configuration
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-4">
          {/* Section A: Grid Math */}
          <section>
            <h3 className="text-[10px] text-ash-500 uppercase tracking-wider font-semibold mb-2">Grid Mathematics</h3>
            <div className="grid grid-cols-2 gap-2.5">
              <NumField label="Total Months" value={local.total_months} onChange={(v) => setNum('total_months', v)} />
              <NumField label="Days per Week" value={local.days_per_week} onChange={(v) => setNum('days_per_week', v)} />
              <NumField label="Days per Month" value={local.days_per_month} onChange={(v) => setNum('days_per_month', v)} />
              <NumField label="Intercalary Days" value={local.intercalary_days_count} onChange={(v) => setNum('intercalary_days_count', v)} />
            </div>
          </section>

          {/* Section B: Weekday Names */}
          <section>
            <h3 className="text-[10px] text-ash-500 uppercase tracking-wider font-semibold mb-2">
              Weekday Names ({local.days_per_week})
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              {local.weekday_names.map((name, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-[9px] text-ash-600 w-4 text-right flex-shrink-0 font-mono">{i + 1}</span>
                  <input type="text" value={name} onChange={(e) => setName('weekday_names', i, e.target.value)}
                    className="flex-1 bg-void-900 text-bone-300 text-xs border border-white/[0.06] rounded px-2 py-1 focus-visible:ring-accent-gold/30 focus-visible:border-accent-gold/40 min-w-0" />
                </div>
              ))}
            </div>
          </section>

          {/* Section B: Month Names */}
          <section>
            <h3 className="text-[10px] text-ash-500 uppercase tracking-wider font-semibold mb-2">
              Month Names ({local.total_months})
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              {local.month_names.map((name, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-[9px] text-ash-600 w-4 text-right flex-shrink-0 font-mono">{i + 1}</span>
                  <input type="text" value={name} onChange={(e) => setName('month_names', i, e.target.value)}
                    className="flex-1 bg-void-900 text-bone-300 text-xs border border-white/[0.06] rounded px-2 py-1 focus-visible:ring-accent-gold/30 focus-visible:border-accent-gold/40 min-w-0" />
                </div>
              ))}
            </div>
          </section>

          {/* Section C: Epoch */}
          <section>
            <h3 className="text-[10px] text-ash-500 uppercase tracking-wider font-semibold mb-2">Epoch Event</h3>
            <input type="text" value={local.epoch_event} onChange={(e) => setLocal((p) => ({ ...p, epoch_event: e.target.value }))}
              placeholder="e.g., The Founding of the First Empire"
              className="w-full bg-void-900 text-bone-300 text-sm border border-white/[0.06] rounded-lg px-3 py-2 focus-visible:ring-accent-gold/30 focus-visible:border-accent-gold/40 placeholder:text-ash-600" />
          </section>
        </div>

        <DialogFooter className="px-5 py-3 border-t border-white/[0.06] flex items-center justify-end gap-2 flex-shrink-0 bg-void-800">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}
            className="text-ash-400 hover:text-bone-100"><X className="w-3.5 h-3.5 mr-1" /> Cancel</Button>
          <Button size="sm" onClick={handleSave}
            className="bg-accent-gold text-void-900 hover:bg-accent-gold-dim font-medium"><Save className="w-3.5 h-3.5 mr-1" /> Save Configuration</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Number Field Sub-component ───────────────────────────────────────────────

function NumField({ label, value, onChange }: { label: string; value: number; onChange: (_v: number) => void }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] text-ash-500">{label}</label>
      <input type="number" min={1} value={value}
        onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))}
        className="bg-void-900 text-bone-100 text-sm border border-white/[0.06] rounded-lg px-3 py-1.5 focus-visible:ring-accent-gold/30 focus-visible:border-accent-gold/40 w-full" />
    </div>
  );
}
