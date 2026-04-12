
import React, { FC, memo } from 'react';
import { css, cx } from '@emotion/css';
import { MonsterIndexEntry } from '../../types/npc';
import { SOURCE_LABELS } from '../../services/databaseRegistry';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

interface MonsterCardProps {
    monster: MonsterIndexEntry;
    onClick: () => void;
    onDelete?: () => void;
}

const styles = {
    badge: css`
        background-color: var(--medium-brown);
        color: var(--parchment-bg);
        border-radius: var(--border-radius);
        padding: 2px 6px;
        text-align: center;
        font-size: 0.7rem;
        font-weight: bold;
        text-transform: uppercase;
        line-height: 1;
        display: block;
        white-space: nowrap;
    `,
    sourceBadge: css`
        background-color: var(--light-brown);
        color: var(--dark-brown);
        border: 1px solid var(--medium-brown);
    `,
    type: css`
        font-weight: bold;
        display: block;
        margin-bottom: var(--space-s);
    `
};

const MonsterCardComponent: FC<MonsterCardProps> = ({ monster, onClick, onDelete }) => {
    const { name, type, size, cr, source } = monster;
    const sourceLabel = SOURCE_LABELS[source || 'user'] || source || 'Custom';

    return (
        <Card variant="interactive" onClick={onClick}>
            <Card.Header>
                <h3>{name}</h3>
                <Card.Badges>
                    {source && source !== 'user' && <span className={cx(styles.badge, styles.sourceBadge)}>{sourceLabel}</span>}
                    <span className={styles.badge}>CR {cr}</span>
                </Card.Badges>
            </Card.Header>
            <Card.Body>
                <span className={styles.type}>{size} {type}</span>
            </Card.Body>
            <Card.Actions>
                <button className="action-button" onClick={onClick} style={{ fontSize: '0.9rem', padding: '4px 12px' }}>View</button>
                {onDelete && source === 'user' && (
                    <button
                        className="secondary-button"
                        style={{ fontSize: '0.9rem', padding: '4px 8px', color: 'var(--error-red)', borderColor: 'var(--error-red)' }}
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    >
                        Delete
                    </button>
                )}
            </Card.Actions>
        </Card>
    );
};

export const MonsterCard = memo(MonsterCardComponent);
