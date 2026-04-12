import React, { FC, useEffect } from 'react';
import { css } from '@emotion/css';
import { useEncounterWizardStore } from '@/stores/encounterWizardStore';
import { EncounterStage } from '../../../schemas';

const styles = {
    editorLayout: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-m);
    `,
    editorActions: css`
        display: flex;
        gap: var(--space-m);
        justify-content: flex-start;
        align-items: center;
        margin-bottom: var(--space-m);
    `,
    textarea: css`
        width: 100%;
        min-height: 150px;
        resize: vertical;
        font-family: var(--body-font);
        font-size: 1rem;
    `,
    navActions: css`
        display: flex;
        justify-content: space-between;
        margin-top: var(--space-m);
    `
};

const STAGES: EncounterStage[] = ["Setup", "Approach", "Twist", "Challenge", "Climax", "Aftermath"];

export const EncounterEditor: FC = () => {
    const {
        currentStage,
        nodes,
        aiDrafts,
        editedNarrative,
        setEditedNarrative,
        goToStage,
        useProceduralDraft,
        useAIDraft,
        mergeDrafts,
    } = useEncounterWizardStore();

    const currentNode = nodes.find(n => n.stage === currentStage);
    const aiDraftExists = currentNode ? !!aiDrafts[currentNode.id] : false;

    // This effect ensures that when a new procedural draft is generated for the current stage,
    // the editor text is updated automatically.
    useEffect(() => {
        if (currentNode && !editedNarrative) { // Only update if editor is empty to not overwrite user edits
            setEditedNarrative(currentNode.narrative);
        }
    }, [currentNode?.narrative, currentNode?.id]);


    const currentIndex = STAGES.indexOf(currentStage);
    const prevStage = currentIndex > 0 ? STAGES[currentIndex - 1] : null;
    const nextStage = currentIndex < STAGES.length - 1 ? STAGES[currentIndex + 1] : null;

    const canGoNext = !!currentNode;

    return (
        <div className={styles.editorLayout}>
            <div className={styles.editorActions}>
                <span>Seed editor with:</span>
                <button className="secondary-button" style={{ fontSize: '0.9rem' }} onClick={useProceduralDraft} disabled={!currentNode}>
                    Procedural Draft
                </button>
                <button className="secondary-button" style={{ fontSize: '0.9rem' }} onClick={useAIDraft} disabled={!aiDraftExists}>
                    ✨ AI Draft
                </button>
                <button className="secondary-button" style={{ fontSize: '0.9rem' }} onClick={mergeDrafts} disabled={!aiDraftExists}>
                    Merge Drafts
                </button>
            </div>
            <textarea
                className={styles.textarea}
                value={editedNarrative || ''}
                onChange={(e) => setEditedNarrative(e.target.value)}
                aria-label="Final narrative editor for the current stage"
                placeholder="The final narrative for this stage will be here. You can edit it directly."
            />
            <div className={styles.navActions}>
                <button className="secondary-button" onClick={() => prevStage && goToStage(prevStage as EncounterStage)} disabled={!prevStage}>
                    {prevStage ? `← Back: ${prevStage}` : '← Back'}
                </button>

                {nextStage ? (
                    <button className="primary-button" onClick={() => goToStage(nextStage as EncounterStage)} disabled={!canGoNext}>
                        Next: {nextStage} →
                    </button>
                ) : (
                    <button className="primary-button" disabled={!canGoNext}>
                        Finish (Save in Header)
                    </button>
                )}
            </div>
        </div>
    );
};