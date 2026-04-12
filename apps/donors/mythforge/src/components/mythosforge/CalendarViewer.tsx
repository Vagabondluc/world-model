// =============================================================================
// MythosForge - Interactive Calendar Viewer (Pure Math, No Date Objects)
// =============================================================================

'use client';

import { useState, useMemo, useCallback } from 'react';
import type { CalendarStructuredData } from './calendar-forge-config';
import type { CalendarEvent, CalendarSeason } from './calendar-types';
import { EVENT_CATEGORIES, DEFAULT_SEASONS } from './calendar-types';
import { CalendarEventDialog } from './CalendarEventDialog';
import { YearStrip } from './CalendarYearStrip';
import { DayEventPanel } from './CalendarDayPanel';
import { AIEventWizard } from './AIEventWizard';
import { ChevronLeft, ChevronRight, Star, Plus, Flame, Sparkles } from 'lucide-react';

function YearInput({ value, onChange }: { value: number; onChange: (_v: number) => void }) {
  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      <button onClick={() => onChange(Math.max(1, value - 1))} className="p-0.5 rounded text-ash-500 hover:text-bone-200 hover:bg-surface-600"><ChevronLeft className="w-3 h-3" /></button>
      <input type="number" min={1} value={value} onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))}
        className="w-10 text-center bg-transparent text-accent-gold text-xs font-mono font-bold border-none focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
      <button onClick={() => onChange(value + 1)} className="p-0.5 rounded text-ash-500 hover:text-bone-200 hover:bg-surface-600"><ChevronRight className="w-3 h-3" /></button>
    </div>);
}

interface CalendarViewerProps {
  data: CalendarStructuredData;
  events?: CalendarEvent[];
  seasons?: CalendarSeason[];
  worldLore?: string;
  onEventsChange?: (_events: CalendarEvent[]) => void;
}

const EMPTY_EVENTS: CalendarEvent[] = [];

export function CalendarViewer({ data, events = EMPTY_EVENTS, seasons = DEFAULT_SEASONS, worldLore, onEventsChange }: CalendarViewerProps) {
  const [viewYear, setViewYear] = useState(1);
  const [viewMonth, setViewMonth] = useState(0);
  const [showYearStrip, setShowYearStrip] = useState(false);
  const [showIntercalary, setShowIntercalary] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [aiWizardOpen, setAiWizardOpen] = useState(false);

  const startOffset = useMemo(() => {
    const intercalaryPerYear = data.intercalary_days_count || 0;
    const daysPerMonth = data.days_per_month;
    const daysInYear = data.total_months * daysPerMonth + intercalaryPerYear;
    const totalDays = ((viewYear - 1) * daysInYear) + (viewMonth * daysPerMonth);
    return totalDays % data.days_per_week;
  }, [viewYear, viewMonth, data]);

  const eventsForMonth = useMemo(() =>
    events.filter((e) => e.month === viewMonth && (e.year === 0 || e.year === viewYear)),
    [events, viewMonth, viewYear]);

  const eventsForDay = useCallback((day: number) =>
    eventsForMonth.filter((e) => e.day === day), [eventsForMonth]);

  const activeSeason = useMemo(() =>
    seasons.find((s) => {
      const next = seasons.find((ns) => ns.start_month > s.start_month && ns.start_month <= viewMonth);
      return !next && s.start_month <= viewMonth;
    }), [seasons, viewMonth]);

  const monthName = data.month_names[viewMonth] || `Month ${viewMonth + 1}`;
  const gridStyle = { gridTemplateColumns: `repeat(${data.days_per_week}, minmax(0, 1fr))` };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(data.total_months - 1); }
    else setViewMonth((m) => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (viewMonth >= data.total_months - 1) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
    setSelectedDay(null);
  };

  const handleDayClick = (day: number) => setSelectedDay((prev) => prev === day ? null : day);
  const handleAddEvent = (day: number) => { setEditingEvent(null); setSelectedDay(day); setEventDialogOpen(true); };

  const handleSaveEvent = useCallback((evt: CalendarEvent) => {
    if (!onEventsChange) return;
    const existing = events.find((e) => e.id === evt.id);
    onEventsChange(existing ? events.map((e) => e.id === evt.id ? evt : e) : [...events, evt]);
  }, [events, onEventsChange]);

  const handleDeleteEvent = useCallback((eventId: string) => {
    if (onEventsChange) onEventsChange(events.filter((e) => e.id !== eventId));
  }, [events, onEventsChange]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06] flex-shrink-0 gap-2">
        <button onClick={prevMonth} className="p-1.5 rounded-md text-ash-400 hover:text-bone-100 hover:bg-surface-600 transition-colors flex-shrink-0"><ChevronLeft className="w-4 h-4" /></button>
        <div className="flex items-center gap-2 min-w-0 flex-1 justify-center">
          <h2 className="text-bone-100 font-bold text-sm truncate">{monthName}</h2>
          {activeSeason && <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${activeSeason.color} text-bone-300`}>{activeSeason.name}</span>}
        </div>
        <YearInput value={viewYear} onChange={setViewYear} />
        <button onClick={nextMonth} className="p-1.5 rounded-md text-ash-400 hover:text-bone-100 hover:bg-surface-600 transition-colors flex-shrink-0"><ChevronRight className="w-4 h-4" /></button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-white/[0.04] flex-shrink-0">
        <button onClick={() => setShowYearStrip(!showYearStrip)}
          className={`text-[10px] px-2 py-0.5 rounded font-medium transition-colors ${showYearStrip ? 'bg-accent-gold/20 text-accent-gold' : 'text-ash-500 hover:text-bone-200'}`}>Year Overview</button>
        {data.intercalary_days_count > 0 && (
          <button onClick={() => setShowIntercalary(!showIntercalary)}
            className={`text-[10px] px-2 py-0.5 rounded font-medium transition-colors flex items-center gap-1 ${showIntercalary ? 'bg-accent-gold/20 text-accent-gold' : 'text-ash-500 hover:text-bone-200'}`}>
            <Flame className="w-3 h-3" /> {data.intercalary_days_count} Intercalar{data.intercalary_days_count === 1 ? 'y' : 'ies'}</button>)}
        {onEventsChange && (
          <div className="flex items-center gap-1.5 ml-auto">
            <button onClick={() => setAiWizardOpen(true)}
              className="text-[10px] px-2 py-0.5 rounded font-medium text-ash-500 hover:text-accent-gold hover:bg-accent-gold/10 transition-colors flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI Events
            </button>
            <button onClick={() => handleAddEvent(1)}
              className="text-[10px] px-2 py-0.5 rounded font-medium text-ash-500 hover:text-accent-gold hover:bg-accent-gold/10 transition-colors flex items-center gap-1">
              <Plus className="w-3 h-3" /> Event
            </button>
          </div>)}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {data.epoch_event && (
          <div className="flex items-start gap-2 mx-3 mt-2 px-3 py-2 rounded-lg bg-accent-gold/[0.04] border border-accent-gold/[0.08]">
            <Star className="w-3 h-3 text-accent-gold flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-bone-400 leading-relaxed"><span className="text-accent-gold font-semibold">Epoch:</span> {data.epoch_event}</p>
          </div>
        )}

        {showYearStrip && <YearStrip data={data} viewMonth={viewMonth} onSelect={setViewMonth} events={events} />}

        {/* Month Grid */}
        <div className="p-3 pt-2">
          <div className="max-w-3xl mx-auto space-y-1">
            <div style={gridStyle} className="grid gap-px">
              {data.weekday_names.map((name, i) => (
                <div key={i} className="text-accent-gold/70 text-[9px] uppercase font-bold text-center py-1 truncate font-mono">{name}</div>
              ))}
            </div>
            <div style={gridStyle} className="grid gap-px auto-rows-min">
              {Array.from({ length: startOffset }, (_, i) => <div key={`e-${i}`} className="min-h-8" />)}
              {Array.from({ length: data.days_per_month }, (_, i) => {
                const day = i + 1;
                const dayEvents = eventsForDay(day);
                const isSelected = selectedDay === day;
                return (
                  <div key={day} onClick={() => handleDayClick(day)}
                    className={`min-h-10 sm:min-h-14 p-0.5 border rounded-sm cursor-pointer group relative transition-colors ${isSelected ? 'border-accent-gold/40 bg-surface-700' : 'border-surface-600/30 bg-void-900 hover:bg-surface-700/50'}`}>
                    <div className="flex items-center justify-between px-1">
                      <span className={`text-[10px] sm:text-xs font-medium ${isSelected ? 'text-accent-gold' : 'text-ash-500 group-hover:text-bone-200'}`}>{day}</span>
                      {dayEvents.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-accent-gold flex-shrink-0" />}
                    </div>
                    <div className="hidden sm:flex flex-col gap-0.5 mt-0.5 px-0.5 overflow-hidden" style={{ maxHeight: '2rem' }}>
                      {dayEvents.slice(0, 2).map((evt) => {
                        const cat = EVENT_CATEGORIES[evt.category];
                        return <div key={evt.id} className={`text-[8px] leading-tight truncate rounded px-1 ${cat.bg} ${cat.color}`}>{evt.name}</div>;
                      })}
                      {dayEvents.length > 2 && <span className="text-[8px] text-ash-600 px-1">+{dayEvents.length - 2} more</span>}
                    </div>
                    {onEventsChange && (
                      <button onClick={(e) => { e.stopPropagation(); handleAddEvent(day); }}
                        className="absolute bottom-0.5 right-0.5 p-0.5 rounded opacity-0 group-hover:opacity-100 text-ash-600 hover:text-accent-gold transition-all"><Plus className="w-2.5 h-2.5" /></button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Intercalary Days */}
        {showIntercalary && data.intercalary_days_count > 0 && (
          <div className="px-3 pb-3">
            <div className="max-w-3xl mx-auto">
              <h4 className="text-[10px] text-accent-gold/60 uppercase tracking-wider font-bold mb-1.5 flex items-center gap-1.5"><Flame className="w-3 h-3" /> Intercalary Days — Year {viewYear}</h4>
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: data.intercalary_days_count }, (_, i) => {
                  const intEvt = events.filter((e) => e.month === -1 && e.day === i + 1 && (e.year === 0 || e.year === viewYear));
                  return (
                    <div key={i} className="px-2.5 py-1.5 border border-accent-gold/[0.12] rounded bg-accent-gold/[0.04] hover:bg-accent-gold/[0.08] cursor-pointer transition-colors">
                      <span className="text-[10px] text-bone-300 font-medium">Day {i + 1}</span>
                      {intEvt.length > 0 && <span className="ml-1 text-[8px] text-accent-gold">({intEvt.length})</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Selected Day Panel */}
        {selectedDay !== null && (
          <DayEventPanel monthName={monthName} day={selectedDay} year={viewYear} events={eventsForDay(selectedDay)}
            onAddEvent={onEventsChange ? () => handleAddEvent(selectedDay) : undefined}
            onEditEvent={(evt) => { setEditingEvent(evt); setEventDialogOpen(true); }} />
        )}

        <p className="text-[9px] text-ash-600 text-center py-1">{data.days_per_month * data.total_months + data.intercalary_days_count}d/yr · {data.total_months}mo · {data.days_per_week}-day weeks · {eventsForMonth.length} events</p>
      </div>

      {onEventsChange && (
        <CalendarEventDialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}
          data={data} events={events} initialEvent={editingEvent}
          defaultYear={viewYear} defaultMonth={viewMonth} defaultDay={selectedDay || 1}
          onSave={handleSaveEvent} onDelete={handleDeleteEvent} />
      )}
      {onEventsChange && (
        <AIEventWizard open={aiWizardOpen} onOpenChange={setAiWizardOpen}
          calendarData={data} existingEvents={events} worldLore={worldLore}
          onSave={onEventsChange} />
      )}
    </div>
  );
}
