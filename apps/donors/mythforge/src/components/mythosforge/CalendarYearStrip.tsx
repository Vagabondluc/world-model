// =============================================================================
// MythosForge - Year Strip Overview (sub-component of CalendarViewer)
// =============================================================================

import type { CalendarStructuredData } from './calendar-forge-config';
import type { CalendarEvent } from './calendar-types';

export function YearStrip({ data, viewMonth, onSelect, events }: {
  data: CalendarStructuredData;
  viewMonth: number;
  onSelect: (_m: number) => void;
  events: CalendarEvent[];
}) {
  return (
    <div className="mx-3 mt-2 grid gap-1"
      style={{ gridTemplateColumns: `repeat(${Math.min(data.total_months, 6)}, minmax(0, 1fr))` }}>
      {data.month_names.map((name, i) => {
        const mEvents = events.filter((e) => e.month === i);
        const active = i === viewMonth;
        return (
          <button key={i} onClick={() => onSelect(i)}
            className={`p-1.5 rounded-md text-center transition-colors border ${
              active ? 'border-accent-gold/30 bg-accent-gold/10' : 'border-white/[0.04] bg-void-900 hover:bg-surface-700/50'}`}>
            <span className={`text-[10px] font-medium block truncate ${active ? 'text-accent-gold' : 'text-bone-300'}`}>{name}</span>
            <span className="text-[8px] text-ash-600">{data.days_per_month}d</span>
            {mEvents.length > 0 && <span className="text-[8px] text-accent-gold/70">{mEvents.length} evt</span>}
          </button>
        );
      })}
    </div>
  );
}
