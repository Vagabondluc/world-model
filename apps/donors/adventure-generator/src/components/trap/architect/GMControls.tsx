import React, { FC, useState } from 'react';
import { css } from '@emotion/css';
import { theme } from '../../../styles/theme';
import { Settings, Dice3 } from 'lucide-react';
import { GeneratedTrap } from '../../../types/trap';
import { TrapCheckResult } from '../../../utils/trapChecks';

interface GMControlsProps {
    trap: Partial<GeneratedTrap>;
    showAdvanced: boolean;
    onToggleAdvanced: () => void;
    onRollCheck?: () => void;
    onGenerateTrap?: (tier: string) => void;
    checkResults?: TrapCheckResult[];
}

const styles = {
    container: css`
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        border: 1px solid #e5e1d8;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        height: fit-content;
        position: sticky;
        top: 1rem;
    `,
    header: css`
        font-family: ${theme.fonts.header};
        font-size: 0.9rem;
        font-weight: bold;
        color: ${theme.colors.textMuted};
        text-transform: uppercase;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid ${theme.colors.accent};
    `,
    section: css`
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    `,
    sectionTitle: css`
        font-weight: 600;
        font-size: 0.875rem;
        color: ${theme.colors.text};
        margin-bottom: 0.25rem;
    `,
    controlRow: css`
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    `,
    label: css`
        font-size: 0.75rem;
        color: ${theme.colors.textMuted};
        text-transform: uppercase;
        letter-spacing: 0.025em;
    `,
    value: css`
        font-size: 0.9rem;
        color: ${theme.colors.text};
        font-weight: 500;
    `,
    input: css`
        padding: 0.5rem;
        border: 1px solid #e5e1d8;
        border-radius: 4px;
        font-size: 0.9rem;
        font-family: ${theme.fonts.body};
        transition: all 0.2s;
        
        &:focus {
            outline: none;
            border-color: ${theme.colors.accent};
            box-shadow: 0 0 0 2px ${theme.colors.accent}22;
        }
    `,
    checkbox: css`
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        cursor: pointer;
        
        input {
            width: 1rem;
            height: 1rem;
            cursor: pointer;
        }
    `,
    checkResults: css`
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        padding: 0.25rem 0;
    `,
    checkResultRow: css`
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 0.5rem;
        text-transform: none;
    `,
    checkResultLabel: css`
        font-size: 0.7rem;
        color: ${theme.colors.textMuted};
        letter-spacing: 0.08em;
    `,
    checkResultValue: css`
        font-size: 0.8rem;
        font-weight: 600;
        text-align: right;
    `,
    divider: css`
        height: 1px;
        background: #e5e1d8;
        margin: 0.5rem 0;
    `,
    button: css`
        padding: 0.75rem;
        background: ${theme.colors.accent};
        color: white;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        font-size: 0.9rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        transition: all 0.2s;
        
        &:hover {
            background: #7a1e0d;
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        &:active {
            transform: translateY(0);
        }
    `,
    generateButton: css`
        padding: 0.875rem;
        background: linear-gradient(135deg, #059669 0%, #047857 100%);
        color: white;
        border: none;
        border-radius: 6px;
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.625rem;
        transition: all 0.2s;
        box-shadow: 0 2px 6px rgba(5, 150, 105, 0.3);
        
        &:hover {
            background: linear-gradient(135deg, #047857 0%, #065f46 100%);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(5, 150, 105, 0.4);
        }
        
        &:active {
            transform: translateY(0);
        }
        
        span:first-child {
            font-size: 1.25rem;
        }
    `,
    advancedButton: css`
        padding: 0.75rem;
        background: transparent;
        color: ${theme.colors.textMuted};
        border: 1px solid #e5e1d8;
        border-radius: 6px;
        font-weight: 500;
        font-size: 0.85rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        transition: all 0.2s;
        
        &:hover {
            border-color: ${theme.colors.accent};
            color: ${theme.colors.accent};
        }
    `
};

export const GMControls: FC<GMControlsProps> = ({
    trap,
    showAdvanced,
    onToggleAdvanced,
    onRollCheck,
    onGenerateTrap,
    checkResults
}) => {
    const [tier, setTier] = useState<string>('5-10');
    const [warningEnabled, setWarningEnabled] = useState(true);
    const [actionEnabled, setActionEnabled] = useState(true);
    const [impactEnabled, setImpactEnabled] = useState(true);
    const [partialSuccess, setPartialSuccess] = useState(false);

    const detectionDC = trap.countermeasures?.detection.dc || 15;
    const detectionSkill = trap.countermeasures?.detection.skill || 'Deduction / Reason';
    const disarmSkill = trap.countermeasures?.disarm.skill || 'Thieves\' Tools / Strength';
    const disarmDC = trap.countermeasures?.disarm.dc || 15;

    return (
        <div className={styles.container}>
            <div className={styles.header}>GM Controls</div>
            {checkResults && checkResults.length > 0 && (
                <div className={styles.section}>
                    <div className={styles.sectionTitle}>Last Checks</div>
                    <div className={styles.checkResults}>
                        {checkResults.map((result) => (
                            <div key={result.label} className={styles.checkResultRow}>
                                <span className={styles.checkResultLabel}>{result.label}</span>
                                <span
                                    className={styles.checkResultValue}
                                    style={{ color: result.success ? theme.colors.success : theme.colors.error }}
                                >
                                    {result.summary}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Generation Section */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}>Generate Trap</div>
                <div className={styles.controlRow}>
                    <div className={styles.label}>Tier</div>
                    <select
                        className={styles.input}
                        value={tier}
                        onChange={(e) => setTier(e.target.value)}
                    >
                        <option value="1-4">Tier 1-4 (Low)</option>
                        <option value="5-10">Tier 5-10 (Mid)</option>
                        <option value="11-16">Tier 11-16 (High)</option>
                        <option value="17-20">Tier 17-20 (Epic)</option>
                    </select>
                </div>
                <button
                    className={styles.generateButton}
                    onClick={() => onGenerateTrap?.(tier)}
                >
                    <span>🎲</span>
                    <span>Generate Trap</span>
                </button>
            </div>

            <div className={styles.divider} />

            {/* Detection */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}>Detection</div>
                <div className={styles.controlRow}>
                    <div className={styles.label}>Skill</div>
                    <div className={styles.value}>{detectionSkill}</div>
                </div>
                <div className={styles.controlRow}>
                    <div className={styles.label}>DC</div>
                    <input
                        type="number"
                        className={styles.input}
                        defaultValue={detectionDC}
                    />
                </div>
            </div>

            {/* Counterplay */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}>Counterplay</div>
                <div className={styles.controlRow}>
                    <div className={styles.label}>Disable</div>
                    <div className={styles.value}>{disarmSkill}</div>
                </div>
                <div className={styles.controlRow}>
                    <div className={styles.label}>DC</div>
                    <input
                        type="number"
                        className={styles.input}
                        defaultValue={disarmDC}
                    />
                </div>
                <label className={styles.checkbox}>
                    <input
                        type="checkbox"
                        checked={partialSuccess}
                        onChange={(e) => setPartialSuccess(e.target.checked)}
                    />
                    <span>Partial success allowed</span>
                </label>
            </div>

            <div className={styles.divider} />

            {/* Timing Sequence */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}>Timing Sequence</div>
                <label className={styles.checkbox}>
                    <input
                        type="checkbox"
                        checked={warningEnabled}
                        onChange={(e) => setWarningEnabled(e.target.checked)}
                    />
                    <span>Warning</span>
                </label>
                <label className={styles.checkbox}>
                    <input
                        type="checkbox"
                        checked={actionEnabled}
                        onChange={(e) => setActionEnabled(e.target.checked)}
                    />
                    <span>Action</span>
                </label>
                <label className={styles.checkbox}>
                    <input
                        type="checkbox"
                        checked={impactEnabled}
                        onChange={(e) => setImpactEnabled(e.target.checked)}
                    />
                    <span>Impact</span>
                </label>
            </div>

            {/* Roll Check */}
            <button className={styles.button} onClick={onRollCheck}>
                <Dice3 size={18} />
                <span>Roll Check</span>
            </button>

            <div className={styles.divider} />

            {/* Advanced Toggle */}
            <button className={styles.advancedButton} onClick={onToggleAdvanced}>
                <Settings size={16} />
                <span>{showAdvanced ? 'Hide' : 'Show'} Advanced</span>
            </button>
        </div>
    );
};

export default GMControls;
