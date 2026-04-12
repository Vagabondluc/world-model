// =============================================================================
// MythosForge - Calendar Event Dialog
// =============================================================================

'use client';

import { useState, useCallback } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { CalendarEvent, CalendarEventCategory } from './calendar-types';
import type { CalendarStructuredData } from './calendar-forge-config';
import { EVENT_CATEGORIES, EVENT_CATEGORY_KEYS, generateEventId } from './calendar-types';
import { CalendarPlus, X, Save, Trash2 } from 'lucide-react';

interface CalendarEventDialogProps {
  open: boolean;
  onOpenChange: (_open: boolean) => void;
  data: CalendarStructuredData;
  events: CalendarEvent[];
  initialEvent?: CalendarEvent | null;
  defaultYear: number;
  defaultMonth: number;
  defaultDay: number;
  onSave: (_event: CalendarEvent) => void;
  onDelete?: (_eventId: string) => void;
}

export function CalendarEventDialog({
  open, onOpenChange, data, events, initialEvent,
  defaultYear, defaultMonth, defaultDay, onSave, onDelete,
}: CalendarEventDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState(defaultYear);
  const [month, setMonth] = useState(defaultMonth);
  const [day, setDay] = useState(defaultDay);
  const [recurring, setRecurring] = useState(false);
  const [category, setCategory] = useState<CalendarEventCategory>('festival');

  // Sync state when dialog opens (React's adjusting-state-during-render pattern)
  const [prevOpen, setPrevOpen] = useState(false);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      if (initialEvent) {
        setName(initialEvent.name);
        setDescription(initialEvent.description);
        setYear(initialEvent.year);
        setMonth(initialEvent.month);
        setDay(initialEvent.day);
        setRecurring(initialEvent.year === 0);
        setCategory(initialEvent.category);
      } else {
        setName(''); setDescription('');
        setYear(defaultYear); setMonth(defaultMonth); setDay(defaultDay);
        setRecurring(false); setCategory('festival');
      }
    }
  }

  const handleSave = useCallback(() => {
    if (!name.trim()) return;
    onSave({
      id: initialEvent?.id || generateEventId(),
      name: name.trim(),
      description: description.trim(),
      year: recurring ? 0 : year,
      month, day, category,
    });
    onOpenChange(false);
  }, [name, description, year, month, day, recurring, category, initialEvent, onSave, onOpenChange]);

  const existingForDate = events.filter((e) => {
    if (e.id === initialEvent?.id) return false;
    return e.month === month && e.day === day && (e.year === 0 || e.year === year);
  });

  const isEditing = !!initialEvent;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-void-800 border-white/[0.08] text-bone-100 max-w-md p-0 overflow-hidden">
        <DialogHeader className="px-5 pt-4 pb-0 flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
            <CalendarPlus className="w-4 h-4 text-accent-gold" />
            {isEditing ? 'Edit Event' : 'New Calendar Event'}
          </DialogTitle>
        </DialogHeader>

        <div className="px-5 py-3 space-y-3 overflow-y-auto max-h-[50vh]">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Event name..."
            className="w-full bg-void-900 text-bone-100 text-sm border border-white/[0.06] rounded-lg px-3 py-2 focus-visible:ring-accent-gold/30 focus-visible:border-accent-gold/40 placeholder:text-ash-600" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)..." rows={2}
            className="w-full bg-void-900 text-bone-300 text-xs border border-white/[0.06] rounded-lg px-3 py-2 resize-none focus-visible:ring-accent-gold/30 focus-visible:border-accent-gold/40 placeholder:text-ash-600" />

          {/* Date Row */}
          <div className="flex gap-2">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-[10px] text-ash-500">Month</label>
              <select value={month} onChange={(e) => setMonth(Number(e.target.value))}
                className="bg-void-900 text-bone-100 text-xs border border-white/[0.06] rounded px-2 py-1.5">
                {data.month_names.map((n, i) => <option key={i} value={i}>{n}</option>)}
              </select>
            </div>
            <div className="w-20 flex flex-col gap-1">
              <label className="text-[10px] text-ash-500">Day</label>
              <input type="number" min={1} max={data.days_per_month} value={day}
                onChange={(e) => setDay(Math.max(1, Math.min(data.days_per_month, parseInt(e.target.value) || 1)))}
                className="bg-void-900 text-bone-100 text-xs border border-white/[0.06] rounded px-2 py-1.5" />
            </div>
            <div className="w-20 flex flex-col gap-1">
              <label className="text-[10px] text-ash-500">Year</label>
              <input type="number" min={0} value={recurring ? 'Every' : year} disabled={recurring}
                className="bg-void-900 text-bone-100 text-xs border border-white/[0.06] rounded px-2 py-1.5 disabled:text-ash-500" />
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs text-ash-400 cursor-pointer select-none">
            <input type="checkbox" checked={recurring} onChange={(e) => setRecurring(e.target.checked)}
              className="rounded border-white/[0.1] bg-void-900" />
            Recurring every year
          </label>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-ash-500 uppercase tracking-wider font-semibold">Category</label>
            <div className="flex flex-wrap gap-1.5">
              {EVENT_CATEGORY_KEYS.map((cat) => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`px-2 py-1 rounded text-[10px] font-medium border transition-colors ${
                    category === cat ? EVENT_CATEGORIES[cat].bg + ' ' + EVENT_CATEGORIES[cat].color
                      : 'border-white/[0.06] text-ash-500 hover:text-bone-200'}`}>
                  {EVENT_CATEGORIES[cat].label}
                </button>
              ))}
            </div>
          </div>

          {existingForDate.length > 0 && (
            <div className="text-[10px] text-ash-500 bg-surface-700/50 rounded px-2.5 py-1.5">
              Also on this date: {existingForDate.map((e) => e.name).join(', ')}
            </div>
          )}
        </div>

        <DialogFooter className="px-5 py-3 border-t border-white/[0.06] flex items-center justify-between flex-shrink-0">
          {isEditing && onDelete ? (
            <Button variant="ghost" size="sm" onClick={() => { if (initialEvent) { onDelete(initialEvent.id); onOpenChange(false); } }}
              className="text-accent-blood hover:text-accent-blood hover:bg-accent-blood/10"><Trash2 className="w-3.5 h-3.5 mr-1" /> Delete</Button>
          ) : <div />}
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}
              className="text-ash-400 hover:text-bone-100"><X className="w-3.5 h-3.5 mr-1" /> Cancel</Button>
            <Button size="sm" onClick={handleSave} disabled={!name.trim()}
              className="bg-accent-gold text-void-900 hover:bg-accent-gold-dim font-medium"><Save className="w-3.5 h-3.5 mr-1" /> Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
