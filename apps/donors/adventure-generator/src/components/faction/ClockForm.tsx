import React, { FC, useState, useEffect } from 'react';
import { css, cx } from '@emotion/css';
import { FactionClock, ResolutionMethod } from '../../types/faction';

interface ClockFormProps {
    clock?: Partial<FactionClock>;
    onSubmit: (clock: Partial<FactionClock>) => void;
    onCancel?: () => void;
    availableFactions?: string[];
    className?: string;
}

/**
 * ClockForm - Form for creating and editing faction clocks
 * 
 * Provides inputs for:
 * - Objective/goal name
 * - Number of segments (4, 6, 8, or 12)
 * - Current progress
 * - Resolution method
 * - Difficulty DC (optional)
 * - Ally/enemy faction selectors
 * - PC impact toggle
 */
export const ClockForm: FC<ClockFormProps> = ({
    clock,
    onSubmit,
    onCancel,
    availableFactions = [],
    className,
}) => {
    const [objective, setObjective] = useState(clock?.objective || '');
    const [segments, setSegments] = useState(clock?.segments || 6);
    const [progress, setProgress] = useState(clock?.progress || 0);
    const [resolutionMethod, setResolutionMethod] = useState<ResolutionMethod>(
        clock?.resolutionMethod || 'simple'
    );
    const [difficultyDC, setDifficultyDC] = useState<number | ''>(
        clock?.difficultyDC ?? ''
    );
    const [pcImpact, setPcImpact] = useState(clock?.pcImpact ?? false);
    const [selectedAllies, setSelectedAllies] = useState<string[]>(clock?.allies || []);
    const [selectedEnemies, setSelectedEnemies] = useState<string[]>(clock?.enemies || []);

    // Ensure progress never exceeds segments
    useEffect(() => {
        if (progress > segments) {
            setProgress(segments);
        }
    }, [segments, progress]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const clockData: Partial<FactionClock> = {
            id: clock?.id || '',
            objective,
            segments,
            progress,
            resolutionMethod,
            difficultyDC: difficultyDC === '' ? null : difficultyDC,
            pcImpact,
            allies: selectedAllies,
            enemies: selectedEnemies,
            events: clock?.events || [],
        };

        onSubmit(clockData);
    };

    const toggleAlly = (faction: string) => {
        setSelectedAllies(prev =>
            prev.includes(faction)
                ? prev.filter(f => f !== faction)
                : [...prev, faction]
        );
    };

    const toggleEnemy = (faction: string) => {
        setSelectedEnemies(prev =>
            prev.includes(faction)
                ? prev.filter(f => f !== faction)
                : [...prev, faction]
        );
    };

    const formStyle = css`
        display: flex;
        flex-direction: column;
        gap: 16px;
        font-family: var(--stat-body-font);
        color: var(--dark-brown);
    `;

    const formGroupStyle = css`
        display: flex;
        flex-direction: column;
        gap: 6px;
    `;

    const labelStyle = css`
        font-weight: 600;
        font-size: 0.9rem;
        color: var(--dark-brown);
    `;

    const inputStyle = css`
        padding: 8px 12px;
        border: 1px solid var(--input-border);
        border-radius: var(--border-radius);
        background-color: var(--input-bg);
        color: var(--input-text);
        font-family: var(--stat-body-font);
        font-size: 0.9rem;
        
        &:focus {
            outline: none;
            border-color: var(--input-focus);
            box-shadow: 0 0 0 2px rgba(146, 38, 16, 0.1);
        }
    `;

    const selectStyle = css`
        ${inputStyle}
        cursor: pointer;
    `;

    const rowStyle = css`
        display: flex;
        gap: 16px;
        
        @media (max-width: 600px) {
            flex-direction: column;
        }
    `;

    const checkboxContainerStyle = css`
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 0;
    `;

    const checkboxStyle = css`
        width: 18px;
        height: 18px;
        cursor: pointer;
        accent-color: var(--dnd-red);
    `;

    const factionListStyle = css`
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        max-height: 120px;
        overflow-y: auto;
        padding: 8px;
        border: 1px solid var(--input-border);
        border-radius: var(--border-radius);
        background-color: var(--input-bg);
    `;

    const factionTagStyle = (selected: boolean) => css`
        padding: 4px 10px;
        border-radius: 16px;
        font-size: 0.8rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        user-select: none;
        
        ${selected
            ? css`
                  background-color: var(--dnd-red);
                  color: white;
              `
            : css`
                  background-color: var(--light-brown);
                  color: var(--dark-brown);
                  
                  &:hover {
                      background-color: var(--medium-brown);
                  }
              `}
    `;

    const buttonGroupStyle = css`
        display: flex;
        gap: 12px;
        margin-top: 8px;
    `;

    const buttonStyle = (variant: 'primary' | 'secondary') => css`
        padding: 10px 20px;
        border-radius: var(--border-radius);
        font-family: var(--stat-body-font);
        font-weight: 600;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s ease;
        
        ${variant === 'primary'
            ? css`
                  background-color: var(--dnd-red);
                  color: white;
                  border: none;
                  
                  &:hover {
                      background-color: #7a1f0d;
                      transform: translateY(-1px);
                  }
                  
                  &:active {
                      transform: translateY(0);
                  }
              `
            : css`
                  background-color: var(--medium-brown);
                  color: var(--parchment-bg);
                  border: none;
                  
                  &:hover {
                      background-color: var(--dark-brown);
                  }
              `}
    `;

    const helperTextStyle = css`
        font-size: 0.8rem;
        color: var(--text-muted);
        margin-top: -4px;
    `;

    return (
        <form className={cx(formStyle, className)} onSubmit={handleSubmit}>
            {/* Objective */}
            <div className={formGroupStyle}>
                <label htmlFor="objective" className={labelStyle}>
                    Objective / Goal
                </label>
                <input
                    id="objective"
                    type="text"
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    className={inputStyle}
                    placeholder="e.g., 'Assassinate the mayor'"
                    required
                />
            </div>

            {/* Segments and Progress */}
            <div className={rowStyle}>
                <div className={formGroupStyle} style={{ flex: 1 }}>
                    <label htmlFor="segments" className={labelStyle}>
                        Total Segments
                    </label>
                    <select
                        id="segments"
                        value={segments}
                        onChange={(e) => setSegments(Number(e.target.value))}
                        className={selectStyle}
                    >
                        <option value={4}>4 Segments</option>
                        <option value={6}>6 Segments</option>
                        <option value={8}>8 Segments</option>
                        <option value={12}>12 Segments</option>
                    </select>
                </div>

                <div className={formGroupStyle} style={{ flex: 1 }}>
                    <label htmlFor="progress" className={labelStyle}>
                        Current Progress
                    </label>
                    <input
                        id="progress"
                        type="number"
                        min={0}
                        max={segments}
                        value={progress}
                        onChange={(e) => setProgress(Number(e.target.value))}
                        className={inputStyle}
                    />
                    <p className={helperTextStyle}>{progress} / {segments} segments filled</p>
                </div>
            </div>

            {/* Resolution Method */}
            <div className={formGroupStyle}>
                <label htmlFor="resolutionMethod" className={labelStyle}>
                    Resolution Method
                </label>
                <select
                    id="resolutionMethod"
                    value={resolutionMethod}
                    onChange={(e) => setResolutionMethod(e.target.value as ResolutionMethod)}
                    className={selectStyle}
                >
                    <option value="simple">Simple - Direct progress</option>
                    <option value="complex">Complex - Multiple conditions</option>
                    <option value="blended">Blended - Mixed approach</option>
                </select>
            </div>

            {/* Difficulty DC */}
            <div className={formGroupStyle}>
                <label htmlFor="difficultyDC" className={labelStyle}>
                    Difficulty DC (Optional)
                </label>
                <input
                    id="difficultyDC"
                    type="number"
                    min={1}
                    max={30}
                    value={difficultyDC}
                    onChange={(e) => setDifficultyDC(e.target.value === '' ? '' : Number(e.target.value))}
                    className={inputStyle}
                    placeholder="Leave empty for no DC"
                />
            </div>

            {/* PC Impact Toggle */}
            <div className={checkboxContainerStyle}>
                <input
                    id="pcImpact"
                    type="checkbox"
                    checked={pcImpact}
                    onChange={(e) => setPcImpact(e.target.checked)}
                    className={checkboxStyle}
                />
                <label htmlFor="pcImpact" className={labelStyle}>
                    PC Impact - This clock directly affects player characters
                </label>
            </div>

            {/* Allies */}
            {availableFactions.length > 0 && (
                <div className={formGroupStyle}>
                    <label className={labelStyle}>Allied Factions</label>
                    <div className={factionListStyle}>
                        {availableFactions.map(faction => (
                            <span
                                key={faction}
                                className={factionTagStyle(selectedAllies.includes(faction))}
                                onClick={() => toggleAlly(faction)}
                            >
                                {faction}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Enemies */}
            {availableFactions.length > 0 && (
                <div className={formGroupStyle}>
                    <label className={labelStyle}>Enemy Factions</label>
                    <div className={factionListStyle}>
                        {availableFactions.map(faction => (
                            <span
                                key={faction}
                                className={factionTagStyle(selectedEnemies.includes(faction))}
                                onClick={() => toggleEnemy(faction)}
                            >
                                {faction}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className={buttonGroupStyle}>
                <button type="submit" className={buttonStyle('primary')}>
                    {clock?.id ? 'Update Clock' : 'Create Clock'}
                </button>
                {onCancel && (
                    <button type="button" onClick={onCancel} className={buttonStyle('secondary')}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};
