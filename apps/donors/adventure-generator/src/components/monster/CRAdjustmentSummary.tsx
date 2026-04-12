import React, { FC } from 'react';
import { css } from '@emotion/css';
import { CRAdjustment } from '../../utils/monsterScaler';

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
        display: flex;
        justify-content: space-between;
        align-items: center;
    `,
    table: css`
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
        
        th {
            text-align: left;
            padding: var(--space-s);
            background: rgba(0, 0, 0, 0.03);
            border-bottom: 2px solid var(--border-main);
            font-family: var(--stat-title-font);
            color: var(--dark-brown);
        }
        
        td {
            padding: var(--space-s);
            border-bottom: 1px solid var(--border-light);
        }
        
        tr:last-child td {
            border-bottom: none;
        }
    `,
    propertyCell: css`
        font-weight: bold;
        color: var(--dark-brown);
    `,
    oldValueCell: css`
        color: var(--medium-brown);
        text-decoration: line-through;
    `,
    newValueCell: css`
        color: var(--dnd-red);
        font-weight: bold;
    `,
    reasonCell: css`
        color: var(--medium-brown);
        font-style: italic;
    `,
    axisBadge: css`
        display: inline-block;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: bold;
        margin-right: var(--space-s);
        
        &.defense {
            background: rgba(59, 130, 246, 0.1);
            color: #2563eb;
        }
        
        &.offense {
            background: rgba(239, 68, 68, 0.1);
            color: #dc2626;
        }
        
        &.balance {
            background: rgba(34, 197, 94, 0.1);
            color: #16a34a;
        }
    `,
    iterationCell: css`
        color: var(--light-brown);
        font-size: 0.8rem;
        text-align: center;
    `,
    significantRow: css`
        background: rgba(220, 38, 38, 0.05);
    `,
    groupHeader: css`
        background: rgba(0, 0, 0, 0.05);
        font-weight: bold;
        color: var(--dark-brown);
        padding: var(--space-s);
        font-family: var(--stat-title-font);
    `,
    emptyState: css`
        text-align: center;
        padding: var(--space-l);
        color: var(--medium-brown);
        font-style: italic;
    `
};

interface CRAdjustmentSummaryProps {
    adjustments: CRAdjustment[];
    onApply?: () => void;
    onCancel?: () => void;
}

const CRAdjustmentSummary: FC<CRAdjustmentSummaryProps> = ({ adjustments, onApply, onCancel }) => {
    if (adjustments.length === 0) {
        return (
            <div className={styles.container}>
                <h4 className={styles.header}>CR Adjustments</h4>
                <div className={styles.emptyState}>
                    No adjustments were made by the solver.
                </div>
            </div>
        );
    }

    // Group adjustments by axis
    const groupedAdjustments = adjustments.reduce((acc, adj) => {
        if (!acc[adj.axis]) {
            acc[adj.axis] = [];
        }
        acc[adj.axis].push(adj);
        return acc;
    }, {} as Record<string, CRAdjustment[]>);

    const axisOrder: Array<'defense' | 'offense' | 'balance'> = ['defense', 'offense', 'balance'];

    return (
        <div className={styles.container}>
            <h4 className={styles.header}>
                <span>CR Adjustments ({adjustments.length} changes)</span>
                {(onApply || onCancel) && (
                    <div style={{ display: 'flex', gap: 'var(--space-s)' }}>
                        {onCancel && (
                            <button className="secondary-button" onClick={onCancel}>
                                Cancel
                            </button>
                        )}
                        {onApply && (
                            <button className="primary-button" onClick={onApply}>
                                Apply Changes
                            </button>
                        )}
                    </div>
                )}
            </h4>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Property</th>
                        <th>Old Value</th>
                        <th>New Value</th>
                        <th>Reason</th>
                        <th>Iteration</th>
                    </tr>
                </thead>
                <tbody>
                    {axisOrder.map(axis => {
                        const axisAdjustments = groupedAdjustments[axis];
                        if (!axisAdjustments || axisAdjustments.length === 0) return null;

                        return (
                            <React.Fragment key={axis}>
                                <tr>
                                    <td colSpan={5} className={styles.groupHeader}>
                                        <span className={`${styles.axisBadge} ${axis}`}>
                                            {axis.charAt(0).toUpperCase() + axis.slice(1)}
                                        </span>
                                        {axisAdjustments.length} adjustment(s)
                                    </td>
                                </tr>
                                {axisAdjustments.map((adj, idx) => {
                                    const isSignificant = 
                                        typeof adj.oldValue === 'number' && 
                                        typeof adj.newValue === 'number' &&
                                        Math.abs(adj.newValue - adj.oldValue) > 
                                        (typeof adj.oldValue === 'number' ? adj.oldValue * 0.2 : 10);

                                    return (
                                        <tr key={`${axis}-${idx}`} className={isSignificant ? styles.significantRow : ''}>
                                            <td className={styles.propertyCell}>
                                                {adj.property}
                                            </td>
                                            <td className={styles.oldValueCell}>
                                                {adj.oldValue}
                                            </td>
                                            <td className={styles.newValueCell}>
                                                {adj.newValue}
                                            </td>
                                            <td className={styles.reasonCell}>
                                                {adj.reason}
                                            </td>
                                            <td className={styles.iterationCell}>
                                                {adj.iteration}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default CRAdjustmentSummary;
