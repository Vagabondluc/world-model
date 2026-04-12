
import React, { FC, memo, useMemo, useState } from 'react';
import { css } from '@emotion/css';
import { SceneDetails } from '../../../types/scene';
import { DetailViewLayout } from '../../common/DetailViewLayout';
import { useCompendiumStore } from '@/stores/compendiumStore';
import { useWorkflowStore } from '@/stores/workflowStore';
import { useAppContext } from '../../../context/AppContext';
import { OracleOverlay } from '../OracleOverlay';

interface SceneDetailViewProps {
    id: string;
}

const styles = {
    sceneType: css`
        font-size: 1rem;
        font-weight: normal;
        color: var(--medium-brown);
        background-color: var(--parchment-bg);
        padding: 2px 8px;
        border-radius: 12px;
        border: 1px solid var(--light-brown);
        vertical-align: middle;
        margin-left: var(--space-s);
    `,
    npcProfile: css`
        margin-bottom: var(--space-m);
        padding: var(--space-m);
        background-color: rgba(0,0,0,0.03);
        border-radius: var(--border-radius);
        border-left: 3px solid var(--medium-brown);

        p { margin: 0 0 var(--space-s) 0; }
        p:last-child { margin-bottom: 0; }
    `
};

const SceneDetailViewFC: FC<SceneDetailViewProps> = ({ id }) => {
    const { apiService } = useAppContext();
    const entry = useCompendiumStore(state => state.compendiumEntries.find(e => e.id === id));

    const { loading, developScene, setDetailingEntity } = useWorkflowStore(state => ({
        loading: state.loading,
        developScene: state.developScene,
        setDetailingEntity: state.setDetailingEntity,
    }));

    const [isOracleOpen, setIsOracleOpen] = useState(false);

    const details: SceneDetails | null = useMemo(() => {
        if (!entry || !entry.fullContent || entry.fullContent === '{}') return null;
        try {
            return JSON.parse(entry.fullContent);
        } catch (e) {
            console.error("Failed to parse scene details:", e);
            return null;
        }
    }, [entry]);

    const onBack = () => setDetailingEntity(null);
    const onGenerate = (ctx: string) => developScene(apiService!, id, ctx);
    const isLoading = loading.details?.type === 'scene' && loading.details?.id === id;

    if (!entry) return <div>Scene not found.</div>;

    return (
        <DetailViewLayout
            title={<>{entry.title} <span className={styles.sceneType}>{entry.tags[0]}</span></>}
            summaryLabel="Core Challenge"
            summary={entry.summary}
            hasDetails={!!details}
            onBack={onBack}
            onGenerate={onGenerate}
            isLoading={isLoading}
            headerActions={details && (
                <button className="secondary-button" onClick={() => setIsOracleOpen(true)} title="Predict likely outcomes">🔮 Oracle</button>
            )}
            origin={entry.origin}
        >
            {details && (<>
                <h4>Introduction</h4><p>{details.introduction}</p>
                <h4>Interaction Points</h4><ul>{details.interactionPoints.map((p, i) => <li key={i}>{p}</li>)}</ul>
                {details.npcs && details.npcs.length > 0 && (<>
                    <h4>NPCs</h4>{details.npcs.map((n, i) => (
                        <div className={styles.npcProfile} key={i}>
                            <p><strong>{n.name}</strong></p>
                            <p>{n.description}</p>
                            <p style={{ fontStyle: 'italic', color: 'var(--medium-brown)' }}>Motivation: {n.motivation}</p>
                        </div>
                    ))}
                </>)}
                <h4>DM Notes</h4><p>{details.dmNotes}</p>
            </>)}

            {isOracleOpen && details && (
                <OracleOverlay
                    context={`Scene: ${entry.title}. Challenge: ${entry.summary}. Details: ${JSON.stringify(details)}`}
                    onClose={() => setIsOracleOpen(false)}
                />
            )}
        </DetailViewLayout>
    );
}

export const SceneDetailView = memo(SceneDetailViewFC);
