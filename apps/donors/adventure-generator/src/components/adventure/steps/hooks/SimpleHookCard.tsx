
import React, { FC } from 'react';
import { css } from '@emotion/css';
import { SimpleAdventure } from '../../../../schemas/adventure';
import { Card } from '../../../common/Card';

const styles = {
    content: css`
        h2 { font-size: 1.5rem; margin-top: 0; }
        h3 { font-size: 1.1rem; color: var(--medium-brown); margin-top: var(--space-m); margin-bottom: var(--space-xs); }
        p { margin-bottom: var(--space-m); }
    `
};

interface SimpleHookCardProps {
    adventure: SimpleAdventure;
    onSelect: () => void;
    onSave?: () => void;
    loading: boolean;
}

export const SimpleHookCard: FC<SimpleHookCardProps> = ({ adventure, onSelect, onSave, loading }) => {
    return (
        <Card variant="default">
            <Card.Body className={styles.content}>
                <h2>"{adventure.premise}"</h2>
                <h3>Origin of the Problem</h3>
                <p>{adventure.origin}</p>
                <h3>Why Your Party?</h3>
                <p>{adventure.positioning}</p>
                <h3>Stakes</h3>
                <p>{adventure.stakes}</p>
            </Card.Body>
            <Card.Actions>
                {onSave && (
                    <button className="secondary-button" onClick={onSave} disabled={loading} title="Save to Compendium without starting">
                        💾 Save Hook
                    </button>
                )}
                <button className="action-button" onClick={onSelect} disabled={loading}>
                    Develop this Adventure
                </button>
            </Card.Actions>
        </Card>
    );
};
