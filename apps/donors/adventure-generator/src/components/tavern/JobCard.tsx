
import React, { FC } from 'react';
import { css } from '@emotion/css';
import { JobPost } from '../../schemas/tavern';
import { JobPost as ProceduralJobPost } from '../../types/jobGenerator';
import { Card } from '../common/Card';

const styles = {
    header: css`
        border-bottom: 1px dashed var(--light-brown);
        
        h4 {
            margin: 0;
            color: var(--dnd-red);
            font-family: var(--header-font);
            font-size: 1.2rem;
        }
    `,
    sectionTitle: css`
        font-weight: bold;
        font-size: 0.85rem;
        text-transform: uppercase;
        color: var(--medium-brown);
        margin-bottom: 4px;
    `,
    list: css`
        margin: 0;
        padding-left: var(--space-l);
        font-size: 0.9rem;
        li { margin-bottom: 2px; }
    `,
    tags: css`
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-top: var(--space-s);
    `,
    tag: css`
        background-color: var(--dark-brown);
        color: var(--parchment-bg);
        font-size: 0.75rem;
        padding: 2px 6px;
        border-radius: 4px;
    `,
};

interface JobCardProps {
    job: JobPost | ProceduralJobPost;
    onDesignEncounter: (job: JobPost | ProceduralJobPost) => void;
}

const hasDetails = (job: JobPost | ProceduralJobPost): job is ProceduralJobPost => {
    return 'details' in job && typeof job.details === 'string';
};

export const JobCard: FC<JobCardProps> = ({ job, onDesignEncounter }) => {
    return (
        <Card variant="default">
            <div className={styles.header}>
                <h4>{job.title}</h4>
            </div>
            <Card.Body>
                <p>{job.summary}</p>

                {hasDetails(job) && job.details && (
                    <p style={{ fontSize: '0.9rem', color: '#444' }}><em>{job.details}</em></p>
                )}

                {job.rewards.length > 0 && (
                    <div>
                        <div className={styles.sectionTitle}>💰 Rewards</div>
                        <ul className={styles.list}>
                            {job.rewards.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                    </div>
                )}

                {job.complications.length > 0 && (
                    <div>
                        <div className={styles.sectionTitle}>⚠️ Complications</div>
                        <ul className={styles.list}>
                            {job.complications.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>
                    </div>
                )}

                {job.tags && (
                    <div className={styles.tags}>
                        {job.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
                    </div>
                )}
            </Card.Body>
            <Card.Actions>
                <button className="action-button" onClick={() => onDesignEncounter(job)}>
                    ⚔️ Design Encounter
                </button>
            </Card.Actions>
        </Card>
    );
};
