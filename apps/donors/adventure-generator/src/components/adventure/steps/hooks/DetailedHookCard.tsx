
import React, { FC } from 'react';
import { css, cx } from '@emotion/css';
import { DetailedAdventure } from '../../../../schemas/adventure';
import { Card } from '../../../common/Card';

const styles = {
    hookTitle: css`
        font-size: 1.6rem;
        margin-top: 0;
        margin-bottom: var(--space-s);
        color: var(--dnd-red);
    `,
    tagContainer: css`
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-s);
        margin-bottom: var(--space-m);
    `,
    tag: css`
        background: var(--light-brown);
        color: var(--dark-brown);
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-family: var(--stat-body-font);
    `,
    plotTag: css`
        background-color: var(--medium-brown);
        color: var(--parchment-bg);
    `,
    hookSection: css`
        margin-top: var(--space-m);
        h3 { 
            font-size: 1.1rem; 
            color: var(--dark-brown); 
            border-bottom: 1px solid var(--light-brown);
            padding-bottom: 4px;
            margin-bottom: var(--space-s);
        }
    `,
    gmNotes: css`
        background-color: rgba(0,0,0,0.05);
        padding: var(--space-m);
        border-radius: var(--border-radius);
        font-size: 0.95rem;
    `
};

interface DetailedHookCardProps {
    adventure: DetailedAdventure;
    onSelect: () => void;
    onSave?: () => void;
    loading: boolean;
}

export const DetailedHookCard: FC<DetailedHookCardProps> = ({ adventure, onSelect, onSave, loading }) => {
    return (
        <Card variant="elevated">
            <Card.Body>
                <h2 className={styles.hookTitle}>{adventure.title}</h2>
                <div className={styles.tagContainer}>
                    {adventure.plot_type.map(p => <span key={p} className={cx(styles.tag, styles.plotTag)}>{p}</span>)}
                    {adventure.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
                </div>
                <div className={styles.hookSection}><h3>The Hook</h3><p>{adventure.hook}</p></div>
                <div className={styles.hookSection}><h3>Player Buy-In</h3><p>{adventure.player_buy_in}</p></div>
                <div className={styles.hookSection}><h3>Starter Scene</h3><p>{adventure.starter_scene}</p></div>
                <div className={cx(styles.hookSection, styles.gmNotes)}>
                    <h3>GM Notes</h3>
                    <p><strong>Twists Applied:</strong> {adventure.gm_notes.twists_applied.join(', ')}</p>
                    <p><strong>Escalation:</strong> {adventure.gm_notes.escalation}</p>
                </div>
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
