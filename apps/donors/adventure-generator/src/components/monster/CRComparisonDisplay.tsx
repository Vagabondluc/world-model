import React, { FC } from 'react';
import { css } from '@emotion/css';
import { CRAnalysis } from '../../utils/crCalculator';

const styles = {
    container: css`
        background: var(--card-bg);
        border: var(--border-main);
        border-radius: var(--border-radius);
        padding: var(--space-m);
        margin-bottom: var(--space-m);
    `,
    header: css`
        font-family: var(--header-font);
        color: var(--dark-brown);
        font-size: 1.1rem;
        margin: 0 0 var(--space-m) 0;
        padding-bottom: var(--space-s);
        border-bottom: 1px solid var(--border-light);
    `,
    comparisonGrid: css`
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-m);
        margin-bottom: var(--space-m);
    `,
    crValue: css`
        text-align: center;
        padding: var(--space-s);
        background: rgba(0, 0, 0, 0.02);
        border-radius: 4px;
        
        .label {
            display: block;
            font-size: 0.8rem;
            color: var(--medium-brown);
            margin-bottom: 4px;
        }
        
        .value {
            display: block;
            font-size: 1.5rem;
            font-weight: bold;
            font-family: var(--stat-title-font);
        }
    `,
    difference: css`
        text-align: center;
        padding: var(--space-s);
        border-radius: 4px;
        
        .label {
            display: block;
            font-size: 0.8rem;
            color: var(--medium-brown);
            margin-bottom: 4px;
        }
        
        .value {
            display: block;
            font-size: 1.5rem;
            font-weight: bold;
            font-family: var(--stat-title-font);
        }
        
        &.positive {
            background: rgba(34, 197, 94, 0.1);
            color: #16a34a;
        }
        
        &.negative {
            background: rgba(239, 68, 68, 0.1);
            color: #dc2626;
        }
        
        &.neutral {
            background: rgba(0, 0, 0, 0.02);
            color: var(--dark-brown);
        }
    `,
    breakdown: css`
        margin-top: var(--space-m);
        padding-top: var(--space-m);
        border-top: 1px solid var(--border-light);
        
        .breakdown-row {
            display: flex;
            justify-content: space-between;
            padding: 4px 0;
            font-size: 0.9rem;
            
            .label {
                color: var(--medium-brown);
            }
            
            .value {
                font-weight: bold;
                color: var(--dark-brown);
            }
        }
    `
};

interface CRComparisonDisplayProps {
    currentCR: number;
    targetCR: number | null;
    analysis?: CRAnalysis;
}

export const CRComparisonDisplay: FC<CRComparisonDisplayProps> = ({ currentCR, targetCR, analysis }) => {
    const crDiff = targetCR !== null ? targetCR - currentCR : 0;
    const diffClass = Math.abs(crDiff) < 0.25 ? 'neutral' : (crDiff > 0 ? 'positive' : 'negative');
    const diffLabel = targetCR !== null ? (crDiff > 0 ? `+${crDiff.toFixed(2)}` : crDiff.toFixed(2)) : '-';
    
    return (
        <div className={styles.container}>
            <h4 className={styles.header}>CR Comparison</h4>
            
            <div className={styles.comparisonGrid}>
                <div className={styles.crValue}>
                    <span className="label">Current CR</span>
                    <span className="value">{currentCR.toFixed(2)}</span>
                </div>
                
                <div className={`${styles.difference} ${diffClass}`}>
                    <span className="label">Difference</span>
                    <span className="value">{diffLabel}</span>
                </div>
                
                <div className={styles.crValue}>
                    <span className="label">Target CR</span>
                    <span className="value">{targetCR !== null ? targetCR.toFixed(2) : '-'}</span>
                </div>
            </div>
            
            {analysis && (
                <div className={styles.breakdown}>
                    <div className="breakdown-row">
                        <span className="label">Defensive CR:</span>
                        <span className="value">{analysis.defensiveCR.toFixed(2)}</span>
                    </div>
                    <div className="breakdown-row">
                        <span className="label">Offensive CR:</span>
                        <span className="value">{analysis.offensiveCR.toFixed(2)}</span>
                    </div>
                </div>
            )}
        </div>
    );
};
