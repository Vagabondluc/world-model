import React, { FC, useState } from 'react';
import { css, cx } from '@emotion/css';
import { useEncounterStore } from '../../stores/encounterStore';
import { useFactionClockStore } from '../../stores/factionClockStore';
import { useCompendiumStore } from '../../stores/compendiumStore';
import { FactionClock } from '../faction/FactionClock';
import { EncounterOutcome, FactionImpact } from '../../schemas/encounter';

interface EncounterOutcomeFormProps {
    onSubmit?: (outcome: EncounterOutcome) => void;
    onCancel?: () => void;
    className?: string;
}

/**
 * EncounterOutcomeForm - Form for recording encounter outcomes and triggering faction clock advancement
 * 
 * Provides:
 * - Outcome selection (victory, defeat, fled, negotiated, other)
 * - Faction impact configuration (advance/hinder clocks)
 * - Segment count input for each affected faction
 * - Description field for narrative context
 * - Automatic clock advancement via factionClockStore on submit
 */
export const EncounterOutcomeForm: FC<EncounterOutcomeFormProps> = ({
    onSubmit,
    onCancel,
    className,
}) => {
    const { factionContext, recordEncounterOutcome } = useEncounterStore();
    const { advanceClock } = useFactionClockStore();
    const { compendiumEntries } = useCompendiumStore();

    const [result, setResult] = useState<'victory' | 'defeat' | 'fled' | 'negotiated' | 'other'>('victory');
    const [description, setDescription] = useState('');
    const [factionImpacts, setFactionImpacts] = useState<Record<string, FactionImpact>>({});

    // Get faction entries from compendium
    const factionEntries = compendiumEntries.filter(e => e.category === 'faction');

    const handleImpactChange = (factionId: string, updates: Partial<FactionImpact>) => {
        setFactionImpacts(prev => {
            const existing = prev[factionId];
            return {
                ...prev,
                [factionId]: {
                    factionId,
                    impact: existing?.impact || 'none',
                    segments: existing?.segments || 0,
                    description: existing?.description || '',
                    ...updates,
                }
            };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Build faction impacts array
        const impacts: FactionImpact[] = Object.values(factionImpacts).filter(
            impact => impact.impact !== 'none' && impact.segments > 0
        );

        const outcome: EncounterOutcome = {
            result,
            description,
            factionImpacts: impacts,
        };

        // Record outcome in encounter store
        recordEncounterOutcome(outcome);

        // Trigger clock advancement for each faction impact
        impacts.forEach(impact => {
            const factionContextEntry = factionContext.find(fc => fc.factionId === impact.factionId);
            const clockId = factionContextEntry?.clockImpact?.clockId;

            if (clockId) {
                const segments = impact.impact === 'hinder' ? -impact.segments : impact.segments;
                advanceClock(
                    impact.factionId,
                    clockId,
                    segments,
                    'encounter',
                    impact.description || `${result} - ${description}`
                );
            }
        });

        // Call optional callback
        onSubmit?.(outcome);

        // Reset form
        setResult('victory');
        setDescription('');
        setFactionImpacts({});
    };

    const handleCancel = () => {
        setResult('victory');
        setDescription('');
        setFactionImpacts({});
        onCancel?.();
    };

    const formStyle = css`
        display: flex;
        flex-direction: column;
        gap: 20px;
        font-family: var(--stat-body-font);
        color: var(--dark-brown);
        padding: 20px;
        background-color: var(--panel-bg);
        border-radius: var(--border-radius);
        border: 1px solid var(--border-color);
    `;

    const formGroupStyle = css`
        display: flex;
        flex-direction: column;
        gap: 8px;
    `;

    const labelStyle = css`
        font-weight: 600;
        font-size: 0.95rem;
        color: var(--dark-brown);
    `;

    const inputStyle = css`
        padding: 10px 14px;
        border: 1px solid var(--input-border);
        border-radius: var(--border-radius);
        background-color: var(--input-bg);
        color: var(--input-text);
        font-family: var(--stat-body-font);
        font-size: 0.95rem;
        
        &:focus {
            outline: none;
            border-color: var(--input-focus);
            box-shadow: 0 0 0 2px rgba(146, 38, 16, 0.1);
        }
    `;

    const textareaStyle = css`
        ${inputStyle}
        min-height: 100px;
        resize: vertical;
    `;

    const selectStyle = css`
        ${inputStyle}
        cursor: pointer;
    `;

    const radioGroupStyle = css`
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
    `;

    const radioLabelStyle = css`
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        font-size: 0.9rem;
    `;

    const radioInputStyle = css`
        cursor: pointer;
        accent-color: var(--dnd-red);
    `;

    const sectionStyle = css`
        padding: 16px;
        background-color: var(--card-bg);
        border-radius: var(--border-radius);
        border: 1px solid var(--border-color-light);
    `;

    const factionCardStyle = css`
        padding: 12px;
        background-color: var(--input-bg);
        border-radius: var(--border-radius);
        border: 1px solid var(--border-color);
    `;

    const rowStyle = css`
        display: flex;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;
    `;

    const buttonGroupStyle = css`
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        margin-top: 8px;
    `;

    const buttonStyle = css`
        padding: 10px 20px;
        border: none;
        border-radius: var(--border-radius);
        font-family: var(--stat-body-font);
        font-size: 0.95rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
    `;

    const primaryButtonStyle = css`
        ${buttonStyle}
        background-color: var(--dnd-red);
        color: white;
        
        &:hover {
            background-color: var(--dnd-red-hover);
            transform: translateY(-1px);
        }
        
        &:active {
            transform: translateY(0);
        }
    `;

    const secondaryButtonStyle = css`
        ${buttonStyle}
        background-color: var(--button-secondary-bg);
        color: var(--button-secondary-text);
        
        &:hover {
            background-color: var(--button-secondary-hover);
        }
    `;

    const numberInputStyle = css`
        ${inputStyle}
        width: 80px;
    `;

    const noFactionsStyle = css`
        padding: 20px;
        text-align: center;
        color: var(--medium-brown);
        font-style: italic;
    `;

    const getFactionName = (factionId: string): string => {
        const entry = factionEntries.find(e => e.id === factionId);
        return entry?.title || factionId;
    };

    // Get faction clocks from factionClockStore for display
    const { clocks } = useFactionClockStore();
    
    const getFactionClock = (factionId: string) => {
        const factionClocks = clocks[factionId] || [];
        return factionClocks[0]; // Get first clock for display
    };

    return (
        <form className={cx(formStyle, className)} onSubmit={handleSubmit}>
            <h3 style={{ margin: 0, color: 'var(--dark-brown)' }}>Record Encounter Outcome</h3>

            {/* Outcome Selection */}
            <div className={formGroupStyle}>
                <label className={labelStyle}>Result</label>
                <div className={radioGroupStyle}>
                    {(['victory', 'defeat', 'fled', 'negotiated', 'other'] as const).map(r => (
                        <label key={r} className={radioLabelStyle}>
                            <input
                                type="radio"
                                name="result"
                                value={r}
                                checked={result === r}
                                onChange={() => setResult(r)}
                                className={radioInputStyle}
                            />
                            {r.charAt(0).toUpperCase() + r.slice(1)}
                        </label>
                    ))}
                </div>
            </div>

            {/* Description */}
            <div className={formGroupStyle}>
                <label className={labelStyle} htmlFor="description">Description</label>
                <textarea
                    id="description"
                    className={textareaStyle}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe how the encounter concluded..."
                />
            </div>

            {/* Faction Impacts */}
            <div className={formGroupStyle}>
                <label className={labelStyle}>Faction Clock Impacts</label>
                <div className={sectionStyle}>
                    {factionContext.length === 0 ? (
                        <p className={noFactionsStyle}>
                            No factions are associated with this encounter. Add factions during encounter setup to track clock impacts.
                        </p>
                    ) : (
                        factionContext.map((faction) => (
                            <div key={faction.factionId} className={factionCardStyle}>
                                <div style={{ fontWeight: 600, marginBottom: 12 }}>
                                    {getFactionName(faction.factionId)} ({faction.relationship})
                                </div>
                                <div className={rowStyle}>
                                    <div className={formGroupStyle}>
                                        <label className={labelStyle} style={{ fontSize: '0.85rem' }}>Impact</label>
                                        <select
                                            className={selectStyle}
                                            value={factionImpacts[faction.factionId]?.impact || 'none'}
                                            onChange={(e) => handleImpactChange(faction.factionId, {
                                                impact: e.target.value as 'advance' | 'hinder' | 'none'
                                            })}
                                        >
                                            <option value="none">No Impact</option>
                                            <option value="advance">Advance Clock</option>
                                            <option value="hinder">Hinder Clock</option>
                                        </select>
                                    </div>
                                    {(factionImpacts[faction.factionId]?.impact === 'advance' ||
                                      factionImpacts[faction.factionId]?.impact === 'hinder') && (
                                        <div className={formGroupStyle}>
                                            <label className={labelStyle} style={{ fontSize: '0.85rem' }}>Segments</label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="12"
                                                className={numberInputStyle}
                                                value={factionImpacts[faction.factionId]?.segments || 1}
                                                onChange={(e) => handleImpactChange(faction.factionId, {
                                                    segments: Math.max(0, parseInt(e.target.value) || 0)
                                                })}
                                            />
                                        </div>
                                    )}
                                </div>
                                
                                {/* Display Faction Clock if available */}
                                {faction.clockImpact && (
                                    <div style={{ marginTop: 12 }}>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                                            Target Clock Progress
                                        </div>
                                        {(() => {
                                            const clock = getFactionClock(faction.factionId);
                                            if (!clock) {
                                                return (
                                                    <div style={{
                                                        fontSize: '0.85rem',
                                                        color: 'var(--medium-brown)',
                                                        padding: '8px',
                                                        backgroundColor: 'rgba(0,0,0,0.02)',
                                                        borderRadius: '4px'
                                                    }}>
                                                        No clock configured for this faction
                                                    </div>
                                                );
                                            }
                                            return (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <FactionClock
                                                        clock={clock}
                                                        size={80}
                                                        strokeWidth={16}
                                                        showLegend={false}
                                                    />
                                                    <div>
                                                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                                            {clock.objective}
                                                        </div>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                            {clock.progress} / {clock.segments} segments
                                                        </div>
                                                        {factionImpacts[faction.factionId]?.impact && (
                                                            <div style={{
                                                                fontSize: '0.8rem',
                                                                marginTop: '4px',
                                                                padding: '4px 8px',
                                                                borderRadius: '4px',
                                                                backgroundColor: factionImpacts[faction.factionId]?.impact === 'advance'
                                                                    ? 'rgba(42, 125, 42, 0.1)'
                                                                    : 'rgba(160, 45, 45, 0.1)',
                                                                color: factionImpacts[faction.factionId]?.impact === 'advance'
                                                                    ? 'var(--success-green)'
                                                                    : 'var(--error-red)'
                                                            }}>
                                                                {factionImpacts[faction.factionId]?.impact === 'advance' ? '⬆️ Will Advance' : '⬇️ Will Hinder'} by {factionImpacts[faction.factionId]?.segments || 0} segment{factionImpacts[faction.factionId]?.segments !== 1 ? 's' : ''}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Buttons */}
            <div className={buttonGroupStyle}>
                {onCancel && (
                    <button
                        type="button"
                        className={secondaryButtonStyle}
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    className={primaryButtonStyle}
                >
                    Record Outcome
                </button>
            </div>
        </form>
    );
};
