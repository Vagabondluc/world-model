// =============================================================================
// MythosForge - Selected Day Event Panel (sub-component of CalendarViewer)
// =============================================================================

import type { CalendarEvent } from './calendar-types';
import { EVENT_CATEGORIES } from './calendar-types';
import { Plus } from 'lucide-react';

export function DayEventPanel({
  monthName, day, year, events, onAddEvent, onEditEvent,
}: {
  monthName: string; day: number; year: number;
  events: CalendarEvent[];
  onAddEvent?: () => void;
  onEditEvent: (_evt: CalendarEvent) => void;
}) {
  return (
    <div className="mx-3 mb-3 p-2.5 rounded-lg bg-surface-700/30 border border-white/[0.06]">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] text-ash-500 font-medium">{monthName}, Day {day}, Year {year}</span>
        {onAddEvent && (
          <button onClick={onAddEvent}
            className="text-[9px] px-1.5 py-0.5 rounded text-accent-gold hover:bg-accent-gold/10 flex items-center gap-0.5 transition-colors">
            <Plus className="w-2.5 h-2.5" /> Add Event
          </button>
        )}
      </div>
      {events.length === 0 ? (
        <p className="text-[10px] text-ash-600 italic">No events on this day</p>
      ) : (
        <div className="flex flex-col gap-1">
          {events.map((evt) => {
            const cat = EVENT_CATEGORIES[evt.category];
            return (
              <button key={evt.id} onClick={() => onEditEvent(evt)}
                className={`flex items-center gap-2 px-2 py-1 rounded text-left ${cat.bg} border border-transparent hover:border-white/[0.1] transition-colors`}>
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 bg-current ${cat.color}`} />
                <div className="min-w-0">
                  <span className={`text-[10px] font-medium ${cat.color} truncate block`}>{evt.name}</span>
                  {evt.description && <span className="text-[9px] text-ash-500 truncate block">{evt.description}</span>}
                  {evt.year === 0 && <span className="text-[8px] text-ash-600">Recurring</span>}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
