import React, { FC, useState, useMemo } from 'react';
import { css, cx } from '@emotion/css';
import { ClockEvent, FactionClock as FactionClockType } from '../../types/faction';
import { useFactionClockStore } from '../../stores/factionClockStore';

interface ProgressEventViewerProps {
    factionId?: string;
    className?: string;
}

interface EventWithClock {
    event: ClockEvent;
    clock: FactionClockType;
    clockId: string;
}

/**
 * ProgressEventViewer - Timeline view of all clock events
 * 
 * Features:
 * - Timeline view of all clock events
 * - Grouped by faction and clock
 * - Shows event description, timestamp, trigger type, segment number
 * - Filter by faction, clock, or trigger type
 */
export const ProgressEventViewer: FC<ProgressEventViewerProps> = ({
    factionId,
    className,
}) => {
    const { clocks } = useFactionClockStore();
    type TriggerFilter = 'all' | ClockEvent['triggeredBy'];
    const [filterTrigger, setFilterTrigger] = useState<TriggerFilter>('all');
    const [filterClock, setFilterClock] = useState<string>('all');

    // Get all events across all clocks
    const allEvents: EventWithClock[] = useMemo(() => {
        const events: EventWithClock[] = [];
        
        const factionIds = factionId ? [factionId] : Object.keys(clocks);
        
        factionIds.forEach(fid => {
            const factionClocks = clocks[fid] || [];
            factionClocks.forEach(clock => {
                clock.events.forEach(event => {
                    events.push({
                        event,
                        clock,
                        clockId: clock.id,
                    });
                });
            });
        });
        
        // Sort by timestamp descending (newest first)
        return events.sort((a, b) => 
            new Date(b.event.timestamp).getTime() - new Date(a.event.timestamp).getTime()
        );
    }, [clocks, factionId]);

    // Get unique clock IDs for filtering
    const uniqueClockIds = useMemo(() => {
        const ids = new Set<string>();
        const factionIds = factionId ? [factionId] : Object.keys(clocks);
        factionIds.forEach(fid => {
            (clocks[fid] || []).forEach(clock => ids.add(clock.id));
        });
        return Array.from(ids);
    }, [clocks, factionId]);

    // Filter events
    const filteredEvents = useMemo(() => {
        return allEvents.filter(({ event, clockId }) => {
            if (filterTrigger !== 'all' && event.triggeredBy !== filterTrigger) {
                return false;
            }
            if (filterClock !== 'all' && clockId !== filterClock) {
                return false;
            }
            return true;
        });
    }, [allEvents, filterTrigger, filterClock]);

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getTriggerIcon = (trigger: ClockEvent['triggeredBy']) => {
        switch (trigger) {
            case 'downtime':
                return '🎲';
            case 'encounter':
                return '⚔️';
            case 'manual':
                return '✋';
            default:
                return '📌';
        }
    };

    const getTriggerLabel = (trigger: ClockEvent['triggeredBy']) => {
        switch (trigger) {
            case 'downtime':
                return 'Downtime';
            case 'encounter':
                return 'Encounter';
            case 'manual':
                return 'Manual';
            default:
                return 'Unknown';
        }
    };

    const containerStyle = css`
        display: flex;
        flex-direction: column;
        gap: 20px;
        font-family: var(--stat-body-font);
        color: var(--dark-brown);
        height: 100%;
    `;

    const headerStyle = css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 16px;
        border-bottom: 2px solid var(--medium-brown);
        flex-shrink: 0;
    `;

    const titleStyle = css`
        font-family: var(--header-font);
        font-size: 1.5rem;
        color: var(--dark-brown);
        margin: 0;
    `;

    const filtersStyle = css`
        display: flex;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;
        flex-shrink: 0;
    `;

    const selectStyle = css`
        padding: 8px 12px;
        border: 1px solid var(--input-border);
        border-radius: var(--border-radius);
        background-color: var(--input-bg);
        color: var(--input-text);
        font-family: var(--stat-body-font);
        font-size: 0.9rem;
        cursor: pointer;
    `;

    const labelStyle = css`
        font-weight: 600;
        color: var(--text-muted);
        font-size: 0.9rem;
    `;

    const timelineStyle = css`
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        padding-right: 8px;
    `;

    const timelineItemStyle = css`
        display: flex;
        gap: 16px;
        padding: 16px;
        background-color: var(--card-bg);
        border: 1px solid var(--medium-brown);
        border-radius: var(--border-radius);
        margin-bottom: 12px;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        
        &:hover {
            transform: translateX(4px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
    `;

    const timelineIconStyle = css`
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background-color: var(--dnd-red);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        flex-shrink: 0;
    `;

    const timelineContentStyle = css`
        flex: 1;
        min-width: 0;
    `;

    const timelineHeaderStyle = css`
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 8px;
        gap: 12px;
    `;

    const clockNameStyle = css`
        font-weight: 700;
        font-size: 1.1rem;
        color: var(--dark-brown);
    `;

    const timestampStyle = css`
        font-size: 0.8rem;
        color: var(--text-muted);
        white-space: nowrap;
    `;

    const eventDescriptionStyle = css`
        font-size: 0.95rem;
        color: var(--dark-brown);
        line-height: 1.4;
        margin-bottom: 8px;
    `;

    const eventMetaStyle = css`
        display: flex;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;
    `;

    const badgeStyle = (variant: 'trigger' | 'segment') => css`
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        
        ${variant === 'trigger'
            ? css`
                  background-color: var(--medium-brown);
                  color: var(--parchment-bg);
              `
            : css`
                  background-color: var(--dnd-red);
                  color: white;
              `}
    `;

    const segmentStyle = css`
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.85rem;
        color: var(--text-muted);
    `;

    const segmentDotStyle = (filled: boolean) => css`
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: ${filled ? 'var(--dnd-red)' : 'var(--light-brown)'};
        border: 1px solid ${filled ? 'var(--dnd-red)' : 'var(--medium-brown)'};
    `;

    const emptyStateStyle = css`
        text-align: center;
        padding: 60px 20px;
        color: var(--text-muted);
        background-color: rgba(0, 0, 0, 0.02);
        border-radius: var(--border-radius);
        border: 1px dashed var(--light-brown);
    `;

    const emptyStateIconStyle = css`
        font-size: 3rem;
        margin-bottom: 16px;
    `;

    const emptyStateTextStyle = css`
        font-size: 1.1rem;
        color: var(--medium-brown);
        margin-bottom: 8px;
    `;

    const emptyStateSubtextStyle = css`
        font-size: 0.9rem;
        color: var(--text-muted);
    `;

    const groupHeaderStyle = css`
        font-family: var(--header-font);
        font-size: 1.1rem;
        color: var(--dark-brown);
        margin: 24px 0 12px 0;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--light-brown);
    `;

    return (
        <div className={cx(containerStyle, className)}>
            {/* Header */}
            <div className={headerStyle}>
                <h2 className={titleStyle}>Progress History</h2>
                <div className={filtersStyle}>
                    <span className={labelStyle}>Filter:</span>
                    <select
                        value={filterTrigger}
                        onChange={(e) => {
                            const next = e.target.value;
                            if (next === 'all' || next === 'downtime' || next === 'encounter' || next === 'manual') {
                                setFilterTrigger(next);
                            }
                        }}
                        className={selectStyle}
                    >
                        <option value="all">All Triggers</option>
                        <option value="downtime">🎲 Downtime</option>
                        <option value="encounter">⚔️ Encounter</option>
                        <option value="manual">✋ Manual</option>
                    </select>
                    {uniqueClockIds.length > 1 && (
                        <select
                            value={filterClock}
                            onChange={(e) => setFilterClock(e.target.value)}
                            className={selectStyle}
                        >
                            <option value="all">All Clocks</option>
                            {uniqueClockIds.map(clockId => {
                                const clock = Object.values(clocks)
                                    .flat()
                                    .find(c => c.id === clockId);
                                return (
                                    <option key={clockId} value={clockId}>
                                        {clock?.objective || clockId}
                                    </option>
                                );
                            })}
                        </select>
                    )}
                </div>
            </div>

            {/* Timeline */}
            {filteredEvents.length > 0 ? (
                <div className={timelineStyle}>
                    {filteredEvents.map(({ event, clock, clockId }) => (
                        <div key={`${clockId}-${event.timestamp}`} className={timelineItemStyle}>
                            <div className={timelineIconStyle}>
                                {getTriggerIcon(event.triggeredBy)}
                            </div>
                            <div className={timelineContentStyle}>
                                <div className={timelineHeaderStyle}>
                                    <div className={clockNameStyle}>{clock.objective}</div>
                                    <div className={timestampStyle}>
                                        {formatDate(event.timestamp)}
                                    </div>
                                </div>
                                <div className={eventDescriptionStyle}>
                                    {event.description}
                                </div>
                                <div className={eventMetaStyle}>
                                    <span className={badgeStyle('trigger')}>
                                        {getTriggerIcon(event.triggeredBy)} {getTriggerLabel(event.triggeredBy)}
                                    </span>
                                    <span className={badgeStyle('segment')}>
                                        Segment {event.segment} / {clock.segments}
                                    </span>
                                    <div className={segmentStyle}>
                                        {Array.from({ length: clock.segments }).map((_, i) => (
                                            <div
                                                key={i}
                                                className={segmentDotStyle(i < event.segment)}
                                                title={`Segment ${i + 1}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={emptyStateStyle}>
                    <div className={emptyStateIconStyle}>📜</div>
                    <div className={emptyStateTextStyle}>
                        {allEvents.length === 0 
                            ? 'No events recorded yet' 
                            : 'No events match your filters'}
                    </div>
                    <div className={emptyStateSubtextStyle}>
                        {allEvents.length === 0
                            ? 'Progress events will appear here as clocks advance'
                            : 'Try adjusting your filter settings'}
                    </div>
                </div>
            )}
        </div>
    );
};
