import React, { FC, useState, useEffect } from 'react';
import { css, cx } from '@emotion/css';
import { ResolutionMethod } from '../../types/faction';
import { useFactionClockStore, ClockRollResult } from '../../stores/factionClockStore';

interface DowntimeRollerProps {
    factionId?: string;
    onClose?: () => void;
    className?: string;
}

/**
 * DowntimeRoller - Component for rolling faction clocks during downtime
 * 
 * Features:
 * - "Roll Faction Clocks" button
 * - Resolution method selector (simple/complex/blended) for all clocks
 * - Animated rolling state
 * - Display of roll results with clock details
 * - Progress event logger for each advancement
 * - Option to add narrative description for each advancement
 */
export const DowntimeRoller: FC<DowntimeRollerProps> = ({
    factionId,
    onClose,
    className,
}) => {
    const {
        clocks,
        rollAllClocks,
        isRolling,
        rollResults,
        setRolling,
        clearRollResults,
        updateClock,
    } = useFactionClockStore();

    const [resolutionMethod, setResolutionMethod] = useState<ResolutionMethod>('simple');
    const [narrativeInputs, setNarrativeInputs] = useState<Record<string, string>>({});
    const [hasRolled, setHasRolled] = useState(false);

    // Get clocks for the specified faction or all clocks
    const factionClocks = factionId 
        ? (clocks[factionId] || [])
        : Object.values(clocks).flat();

    const handleRoll = () => {
        setRolling(true);
        setHasRolled(false);
        
        // Simulate rolling animation
        setTimeout(() => {
            if (factionId) {
                rollAllClocks(factionId);
            } else {
                // Roll all clocks for all factions
                Object.keys(clocks).forEach(fid => rollAllClocks(fid));
            }
            setRolling(false);
            setHasRolled(true);
        }, 1500);
    };

    const handleReset = () => {
        clearRollResults();
        setNarrativeInputs({});
        setHasRolled(false);
    };

    const handleAddNarrative = (clockId: string, factionId: string) => {
        const narrative = narrativeInputs[clockId];
        if (narrative && narrative.trim()) {
            const result = rollResults.find(r => r.clockId === clockId);
            if (result && result.event) {
                // Update the clock's event with the narrative
                const factionClocks = clocks[factionId] || [];
                const clock = factionClocks.find(c => c.id === clockId);
                if (clock) {
                    const updatedEvents = [...clock.events];
                    const eventIndex = updatedEvents.findIndex(
                        e => e.segment === result.event?.segment && 
                             e.timestamp === result.event?.timestamp
                    );
                    if (eventIndex !== -1) {
                        updatedEvents[eventIndex] = {
                            ...updatedEvents[eventIndex],
                            description: narrative
                        };
                        updateClock(factionId, clockId, { events: updatedEvents });
                    }
                }
            }
            setNarrativeInputs(prev => ({ ...prev, [clockId]: '' }));
        }
    };

    const containerStyle = css`
        display: flex;
        flex-direction: column;
        gap: 20px;
        font-family: var(--stat-body-font);
        color: var(--dark-brown);
    `;

    const headerStyle = css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 16px;
        border-bottom: 2px solid var(--medium-brown);
    `;

    const titleStyle = css`
        font-family: var(--header-font);
        font-size: 1.5rem;
        color: var(--dark-brown);
        margin: 0;
    `;

    const controlsStyle = css`
        display: flex;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;
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

    const buttonStyle = (variant: 'primary' | 'secondary' | 'danger') => css`
        padding: 10px 20px;
        border-radius: var(--border-radius);
        font-family: var(--stat-body-font);
        font-weight: 600;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
        
        ${variant === 'primary'
            ? css`
                  background-color: var(--dnd-red);
                  color: white;
                  
                  &:hover:not(:disabled) {
                      background-color: #7a1f0d;
                      transform: translateY(-1px);
                  }
                  
                  &:disabled {
                      opacity: 0.5;
                      cursor: not-allowed;
                  }
              `
            : variant === 'danger'
            ? css`
                  background-color: var(--error-red);
                  color: white;
                  
                  &:hover:not(:disabled) {
                      background-color: #8b0000;
                  }
                  
                  &:disabled {
                      opacity: 0.5;
                      cursor: not-allowed;
                  }
              `
            : css`
                  background-color: var(--medium-brown);
                  color: var(--parchment-bg);
                  
                  &:hover {
                      background-color: var(--dark-brown);
                  }
              `}
    `;

    const rollingAnimationStyle = css`
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        animation: spin 1s linear infinite;
        display: inline-block;
    `;

    const resultsContainerStyle = css`
        display: flex;
        flex-direction: column;
        gap: 16px;
    `;

    const resultCardStyle = css`
        background-color: var(--card-bg);
        border: 1px solid var(--medium-brown);
        border-radius: var(--border-radius);
        padding: 16px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    `;

    const resultHeaderStyle = css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--light-brown);
    `;

    const clockNameStyle = css`
        font-weight: 700;
        font-size: 1.1rem;
        color: var(--dark-brown);
    `;

    const badgeStyle = (variant: 'success' | 'failure' | 'neutral') => css`
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        
        ${variant === 'success'
            ? css`
                  background-color: var(--success-green);
                  color: white;
              `
            : variant === 'failure'
            ? css`
                  background-color: var(--error-red);
                  color: white;
              `
            : css`
                  background-color: var(--medium-brown);
                  color: var(--parchment-bg);
              `}
    `;

    const resultDetailsStyle = css`
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 12px;
        margin-bottom: 12px;
    `;

    const detailItemStyle = css`
        display: flex;
        flex-direction: column;
        gap: 4px;
    `;

    const detailLabelStyle = css`
        font-size: 0.75rem;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    `;

    const detailValueStyle = css`
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--dark-brown);
    `;

    const eventStyle = css`
        background-color: rgba(146, 38, 16, 0.05);
        border-left: 3px solid var(--dnd-red);
        padding: 12px;
        margin-top: 12px;
        border-radius: 0 var(--border-radius) var(--border-radius) 0;
    `;

    const eventDescriptionStyle = css`
        font-size: 0.9rem;
        color: var(--dark-brown);
        line-height: 1.4;
    `;

    const narrativeInputStyle = css`
        width: 100%;
        padding: 8px 12px;
        border: 1px solid var(--input-border);
        border-radius: var(--border-radius);
        background-color: var(--input-bg);
        color: var(--input-text);
        font-family: var(--stat-body-font);
        font-size: 0.9rem;
        margin-top: 8px;
        resize: vertical;
        min-height: 60px;
        
        &:focus {
            outline: none;
            border-color: var(--input-focus);
            box-shadow: 0 0 0 2px rgba(146, 38, 16, 0.1);
        }
    `;

    const narrativeActionsStyle = css`
        display: flex;
        justify-content: flex-end;
        margin-top: 8px;
    `;

    const emptyStateStyle = css`
        text-align: center;
        padding: 40px 20px;
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
    `;

    const factionClocksForResults = factionId 
        ? (clocks[factionId] || [])
        : Object.entries(clocks).flatMap(([fid, fclocks]) => 
            fclocks.map(c => ({ ...c, factionId: fid }))
          );

    // Get all roll results across all factions
    const allRollResults = factionId
        ? rollResults.filter(r => r.factionId === factionId)
        : rollResults;

    return (
        <div className={cx(containerStyle, className)}>
            {/* Header */}
            <div className={headerStyle}>
                <h2 className={titleStyle}>Downtime Roller</h2>
                {onClose && (
                    <button onClick={onClose} className={buttonStyle('secondary')}>
                        Close
                    </button>
                )}
            </div>

            {/* Controls */}
            <div className={controlsStyle}>
                <label htmlFor="resolutionMethod" style={{ fontWeight: 600 }}>
                    Resolution Method:
                </label>
                <select
                    id="resolutionMethod"
                    value={resolutionMethod}
                    onChange={(e) => setResolutionMethod(e.target.value as ResolutionMethod)}
                    className={selectStyle}
                    disabled={isRolling || hasRolled}
                >
                    <option value="simple">Simple - 1d6, advance on 1</option>
                    <option value="complex">Complex - Skill check vs DC</option>
                    <option value="blended">Blended - 1d4, advance on 1</option>
                </select>
                <button
                    onClick={handleRoll}
                    disabled={isRolling || factionClocks.length === 0}
                    className={buttonStyle('primary')}
                >
                    {isRolling ? (
                        <>
                            <span className={rollingAnimationStyle}>🎲</span> Rolling...
                        </>
                    ) : (
                        '🎲 Roll Faction Clocks'
                    )}
                </button>
                {hasRolled && (
                    <button onClick={handleReset} className={buttonStyle('secondary')}>
                        Reset
                    </button>
                )}
            </div>

            {/* Results */}
            {hasRolled && allRollResults.length > 0 ? (
                <div className={resultsContainerStyle}>
                    {allRollResults.map((result) => {
                        const clock = factionClocksForResults.find(c => c.id === result.clockId);
                        if (!clock) return null;

                        return (
                            <div key={result.clockId} className={resultCardStyle}>
                                <div className={resultHeaderStyle}>
                                    <span className={clockNameStyle}>{clock.objective}</span>
                                    {result.advanced ? (
                                        <span className={badgeStyle('success')}>
                                            +{result.segmentsAdvanced} Segment{result.segmentsAdvanced !== 1 ? 's' : ''}
                                        </span>
                                    ) : (
                                        <span className={badgeStyle('neutral')}>
                                            No Progress
                                        </span>
                                    )}
                                </div>

                                <div className={resultDetailsStyle}>
                                    <div className={detailItemStyle}>
                                        <span className={detailLabelStyle}>Roll Value</span>
                                        <span className={detailValueStyle}>
                                            {result.rollValue !== undefined ? result.rollValue : 'N/A'}
                                        </span>
                                    </div>
                                    {result.checkPassed !== undefined && (
                                        <div className={detailItemStyle}>
                                            <span className={detailLabelStyle}>Check Result</span>
                                            <span className={detailValueStyle}>
                                                {result.checkPassed ? 'Passed' : 'Failed'}
                                            </span>
                                        </div>
                                    )}
                                    <div className={detailItemStyle}>
                                        <span className={detailLabelStyle}>New Progress</span>
                                        <span className={detailValueStyle}>
                                            {clock.progress} / {clock.segments}
                                        </span>
                                    </div>
                                    <div className={detailItemStyle}>
                                        <span className={detailLabelStyle}>Status</span>
                                        <span className={detailValueStyle}>
                                            {clock.progress >= clock.segments ? (
                                                <span style={{ color: 'var(--success-green)' }}>Complete!</span>
                                            ) : (
                                                `${clock.segments - clock.progress} segments remaining`
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {result.event && (
                                    <div className={eventStyle}>
                                        <div className={detailLabelStyle}>Progress Event</div>
                                        <div className={eventDescriptionStyle}>
                                            {result.event.description}
                                        </div>
                                    </div>
                                )}

                                {/* Narrative Input */}
                                {result.advanced && (
                                    <div>
                                        <textarea
                                            value={narrativeInputs[result.clockId] || ''}
                                            onChange={(e) =>
                                                setNarrativeInputs(prev => ({
                                                    ...prev,
                                                    [result.clockId]: e.target.value
                                                }))
                                            }
                                            placeholder="Add narrative description for this advancement..."
                                            className={narrativeInputStyle}
                                        />
                                        <div className={narrativeActionsStyle}>
                                            <button
                                                onClick={() => handleAddNarrative(result.clockId, result.factionId)}
                                                className={buttonStyle('secondary')}
                                                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                                            >
                                                Add Narrative
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : factionClocks.length === 0 ? (
                <div className={emptyStateStyle}>
                    <div className={emptyStateIconStyle}>⏰</div>
                    <div className={emptyStateTextStyle}>
                        No faction clocks to roll. Create some clocks first!
                    </div>
                </div>
            ) : null}
        </div>
    );
};
