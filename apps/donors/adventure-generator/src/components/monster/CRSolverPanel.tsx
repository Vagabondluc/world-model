import React, { FC, useState } from 'react';
import { css } from '@emotion/css';
import { CRSolverOptions, CRSolverResult } from '../../utils/monsterScaler';
import { CRComparisonDisplay } from './CRComparisonDisplay';
import CRAdjustmentSummary from './CRAdjustmentSummary';

const styles = {
    container: css`
        background: var(--card-bg);
        border: var(--border-main);
        border-radius: var(--border-radius);
        padding: var(--space-l);
        margin-bottom: var(--space-l);
    `,
    header: css`
        font-family: var(--header-font);
        color: var(--dark-brown);
        font-size: 1.3rem;
        margin: 0 0 var(--space-m) 0;
        padding-bottom: var(--space-s);
        border-bottom: 2px solid var(--border-main);
        display: flex;
        justify-content: space-between;
        align-items: center;
    `,
    collapsibleToggle: css`
        background: none;
        border: none;
        color: var(--dnd-red);
        cursor: pointer;
        font-size: 1.5rem;
        padding: 0;
        line-height: 1;
        
        &:hover {
            color: #701a1a;
        }
    `,
    optionsSection: css`
        margin-bottom: var(--space-l);
        padding: var(--space-m);
        background: rgba(0, 0, 0, 0.02);
        border-radius: var(--border-radius);
    `,
    optionsGrid: css`
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-m);
        
        @media (max-width: 768px) {
            grid-template-columns: 1fr;
        }
    `,
    sliderContainer: css`
        display: flex;
        align-items: center;
        gap: var(--space-s);

        input[type="range"] {
            flex: 1;
        }
    `,
    sliderValue: css`
        min-width: 50px;
        text-align: center;
        font-weight: bold;
        color: var(--dnd-red);
    `,
    checkboxContainer: css`
        display: flex;
        align-items: center;
        gap: var(--space-s);

        input[type="checkbox"] {
            width: 20px;
            height: 20px;
            cursor: pointer;
        }
    `,
    formGroup: css`
        margin-bottom: var(--space-m);
        
        label {
            display: block;
            font-weight: bold;
            margin-bottom: var(--space-s);
            color: var(--dark-brown);
            font-family: var(--stat-title-font);
        }
        
        select, input[type="number"] {
            width: 100%;
            padding: 8px 12px;
            background: var(--input-bg);
            border: 1px solid var(--input-border);
            border-radius: 4px;
            font-family: var(--body-font);
            font-size: 1rem;
        }
        
        .sliderContainer {
            display: flex;
            align-items: center;
            gap: var(--space-s);
            
            input[type="range"] {
                flex: 1;
            }
            
            .sliderValue {
                min-width: 50px;
                text-align: center;
                font-weight: bold;
                color: var(--dnd-red);
            }
        }
        
        .checkboxContainer {
            display: flex;
            align-items: center;
            gap: var(--space-s);
            
            input[type="checkbox"] {
                width: 20px;
                height: 20px;
                cursor: pointer;
            }
        }
    `,
    actions: css`
        display: flex;
        gap: var(--space-m);
        margin-bottom: var(--space-l);
        
        button {
            flex: 1;
        }
    `,
    resultsSection: css`
        animation: slideIn 0.3s ease-out;
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `,
    statusIndicator: css`
        display: flex;
        align-items: center;
        gap: var(--space-s);
        padding: var(--space-m);
        border-radius: var(--border-radius);
        margin-bottom: var(--space-m);
        
        &.success {
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid #16a34a;
            color: #16a34a;
        }
        
        &.failure {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid #dc2626;
            color: #dc2626;
        }
        
        &.loading {
            background: rgba(59, 130, 246, 0.1);
            border: 1px solid #2563eb;
            color: #2563eb;
        }
    `,
    warnings: css`
        margin-top: var(--space-m);
        padding: var(--space-m);
        background: rgba(251, 191, 36, 0.1);
        border-left: 4px solid #f59e0b;
        border-radius: 4px;
        
        h5 {
            margin: 0 0 var(--space-s) 0;
            color: #d97706;
            font-family: var(--stat-title-font);
        }
        
        ul {
            margin: 0;
            padding-left: 1.2rem;
            
            li {
                margin-bottom: 4px;
                color: var(--medium-brown);
            }
        }
    `,
    collapsedContent: css`
        display: none;
    `,
    expandedContent: css`
        display: block;
    `
};

interface CRSolverPanelProps {
    currentCR: number;
    targetCR: number | null;
    solverOptions: CRSolverOptions;
    isSolving: boolean;
    solverResult: CRSolverResult | null;
    onSetTargetCR: (cr: number | null) => void;
    onSetSolverOptions: (options: Partial<CRSolverOptions>) => void;
    onSolve: () => Promise<void>;
    onApplyResult: () => void;
    onCancelResult: () => void;
}

// CR values for dropdown
const CR_VALUES = [
    0, 0.125, 0.25, 0.5,
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30
];

const formatCR = (cr: number): string => {
    if (cr === 0.125) return '1/8';
    if (cr === 0.25) return '1/4';
    if (cr === 0.5) return '1/2';
    return cr.toString();
};

export const CRSolverPanel: FC<CRSolverPanelProps> = ({
    currentCR,
    targetCR,
    solverOptions,
    isSolving,
    solverResult,
    onSetTargetCR,
    onSetSolverOptions,
    onSolve,
    onApplyResult,
    onCancelResult
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleSolve = async () => {
        if (targetCR === null) return;
        await onSolve();
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span>CR Solver</span>
                <button 
                    className={styles.collapsibleToggle}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? '▶' : '▼'}
                </button>
            </div>

            <div className={isCollapsed ? styles.collapsedContent : styles.expandedContent}>
                <CRComparisonDisplay 
                    currentCR={currentCR}
                    targetCR={targetCR}
                    analysis={solverResult ? {
                        defensiveCR: solverResult.convergenceDetails.defensiveCR,
                        offensiveCR: solverResult.convergenceDetails.offensiveCR,
                        finalCR: solverResult.finalCR,
                        hp: 0,
                        effectiveHP: 0,
                        ac: 0,
                        effectiveAC: 0,
                        dpr: 0,
                        attackBonus: 0,
                        saveDC: 0,
                        warnings: [],
                        breakdown: []
                    } : undefined}
                />

                <div className={styles.optionsSection}>
                    <h4 style={{ margin: '0 0 var(--space-m) 0', color: 'var(--dark-brown)' }}>
                        Solver Options
                    </h4>
                    
                    <div className={styles.optionsGrid}>
                        <div className={styles.formGroup}>
                            <label>Target CR</label>
                            <select 
                                value={targetCR ?? ''}
                                onChange={(e) => onSetTargetCR(
                                    e.target.value === '' ? null : parseFloat(e.target.value)
                                )}
                            >
                                <option value="">Select CR...</option>
                                {CR_VALUES.map(cr => (
                                    <option key={cr} value={cr}>
                                        {formatCR(cr)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Resolution Method</label>
                            <select 
                                value={solverOptions.method}
                                onChange={(e) => onSetSolverOptions({ 
                                    method: e.target.value as 'dmg' | 'alternate' 
                                })}
                            >
                                <option value="dmg">DMG (Damage-based)</option>
                                <option value="alternate">Alternate Method</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Max Iterations</label>
                            <div className={styles.sliderContainer}>
                                <input 
                                    type="range" 
                                    min="5" 
                                    max="50" 
                                    value={solverOptions.maxIterations}
                                    onChange={(e) => onSetSolverOptions({ 
                                        maxIterations: parseInt(e.target.value) 
                                    })}
                                />
                                <span className={styles.sliderValue}>
                                    {solverOptions.maxIterations}
                                </span>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Balance Threshold</label>
                            <div className={styles.sliderContainer}>
                                <input 
                                    type="range" 
                                    min="0.5" 
                                    max="5" 
                                    step="0.5"
                                    value={solverOptions.balanceThreshold}
                                    onChange={(e) => onSetSolverOptions({ 
                                        balanceThreshold: parseFloat(e.target.value) 
                                    })}
                                />
                                <span className={styles.sliderValue}>
                                    {solverOptions.balanceThreshold}
                                </span>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Convergence Threshold</label>
                            <div className={styles.sliderContainer}>
                                <input 
                                    type="range" 
                                    min="0.05" 
                                    max="0.5" 
                                    step="0.05"
                                    value={solverOptions.convergenceThreshold}
                                    onChange={(e) => onSetSolverOptions({ 
                                        convergenceThreshold: parseFloat(e.target.value) 
                                    })}
                                />
                                <span className={styles.sliderValue}>
                                    {solverOptions.convergenceThreshold}
                                </span>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Preserve Features</label>
                            <div className={styles.checkboxContainer}>
                                <input 
                                    type="checkbox" 
                                    checked={solverOptions.preserveFeatures}
                                    onChange={(e) => onSetSolverOptions({ 
                                        preserveFeatures: e.target.checked 
                                    })}
                                />
                                <span>Keep special traits and abilities</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button 
                        className="primary-button"
                        onClick={handleSolve}
                        disabled={targetCR === null || isSolving}
                    >
                        {isSolving ? (
                            <>
                                <span className="loader"></span>
                                {' '}Optimizing...
                            </>
                        ) : '⚡ Auto-Optimize'}
                    </button>
                    {solverResult && (
                        <button 
                            className="secondary-button"
                            onClick={onCancelResult}
                        >
                            Cancel
                        </button>
                    )}
                </div>

                {isSolving && (
                    <div className={`${styles.statusIndicator} loading`}>
                        <span className="loader"></span>
                        <span>Running CR solver...</span>
                    </div>
                )}

                {solverResult && (
                    <div className={styles.resultsSection}>
                        <div className={`${styles.statusIndicator} ${solverResult.success ? 'success' : 'failure'}`}>
                            <span>
                                {solverResult.success ? '✓' : '✗'}{' '}
                                {solverResult.success ? 'Optimization Complete' : 'Optimization Failed'}
                            </span>
                        </div>

                        <div className={styles.warnings}>
                            <h5>Details</h5>
                            <ul>
                                <li>Final CR: {solverResult.finalCR.toFixed(2)} (Target: {solverResult.targetCR.toFixed(2)})</li>
                                <li>Iterations: {solverResult.iterations}</li>
                                <li>Original CR: {solverResult.originalCR.toFixed(2)}</li>
                                {solverResult.convergenceDetails.reachedThreshold && (
                                    <li>✓ Reached convergence threshold</li>
                                )}
                            </ul>
                        </div>

                        {solverResult.warnings.length > 0 && (
                            <div className={styles.warnings}>
                                <h5>Warnings</h5>
                                <ul>
                                    {solverResult.warnings.map((warning, idx) => (
                                        <li key={idx}>{warning}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <CRAdjustmentSummary 
                            adjustments={solverResult.adjustments}
                            onApply={solverResult.success ? onApplyResult : undefined}
                            onCancel={onCancelResult}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
