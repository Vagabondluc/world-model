

import React, { FC, useMemo } from 'react';
import { css } from '@emotion/css';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { MonsterResult } from './MonsterResult';
import { MonsterDesignerForm } from './MonsterDesignerForm';
import { CRSolverPanel } from './CRSolverPanel';
import { useMonsterCreator } from '../../hooks/useMonsterCreator';
import { useMonsterCreatorStore } from '../../stores/monsterCreatorStore';
import { calculateCR } from '../../utils/crCalculator';

const styles = {
    layout: css`
        display: grid;
        grid-template-columns: 1fr 1.5fr;
        gap: var(--space-l);
        align-items: flex-start;
        height: 100%;

        @media (max-width: 1200px) {
            grid-template-columns: 1fr;
        }
    `,
    formSection: css`
        min-width: 0;
    `,
    resultSection: css`
        min-width: 0;
    `,
    placeholder: css`
        text-align: center;
        padding: var(--space-xxl);
        background-color: rgba(0,0,0,0.03);
        border-radius: var(--border-radius);
        border: 2px dashed var(--border-light);
        color: var(--medium-brown);
        h3 { color: var(--dark-brown); margin-top: 0; }
    `
};

interface MonsterCreatorViewProps {
    onBack?: () => void;
}

export const MonsterCreatorView: FC<MonsterCreatorViewProps> = () => {
    const {
        isGenerating,
        generatedMonster,
        error,
        handleAIGeneration,
        handleProceduralGeneration,
        handleSave,
        updateGeneratedMonster,
        clearError,
        jobStatus,
        queuePosition,
        handleSolveCR,
        handleApplySolverResult,
        handleCancelSolverResult,
        solverResult
    } = useMonsterCreator();

    const store = useMonsterCreatorStore();

    // Calculate current CR for the generated monster
    const currentCR = useMemo(() => {
        if (!generatedMonster) return 0;
        const analysis = calculateCR(generatedMonster.profile, store.solverOptions.method);
        return analysis.finalCR;
    }, [generatedMonster, store.solverOptions.method]);

    return (
        <div>
            <div className={styles.layout}>
                <div className={styles.formSection}>
                    <MonsterDesignerForm
                        loading={isGenerating}
                        onGenerateAI={handleAIGeneration}
                        onGenerateProcedural={handleProceduralGeneration}
                    />
                </div>

                <div className={styles.resultSection}>
                    {error && (
                        <div className="error-message" style={{ marginBottom: 'var(--space-l)' }}>
                            <h4>Generation Error</h4>
                            <p>{error}</p>
                            <button className="secondary-button" onClick={clearError}>Dismiss</button>
                        </div>
                    )}

                    {isGenerating && (
                        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                            {jobStatus === 'queued' && (
                                <div className="badge" style={{ background: 'var(--accent-secondary)', color: 'white', display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '4px' }}>
                                    ⏳ Waiting in Queue {queuePosition !== undefined && queuePosition !== null ? `(Position: ${queuePosition})` : ''}
                                </div>
                            )}
                            {jobStatus === 'processing' && (
                                <div className="badge" style={{ background: 'var(--accent-primary)', color: 'white', display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '4px' }}>
                                    ⚡ Generating Content...
                                </div>
                            )}
                            <LoadingSkeleton type="detail-view" />
                        </div>
                    )}

                    {!isGenerating && !generatedMonster && (
                        <div className={styles.placeholder}>
                            <h3>Your creation will appear here</h3>
                            <p>Fill out the form and click a button to begin.</p>
                        </div>
                    )}

                    {generatedMonster && !isGenerating && (
                        <>
                            <CRSolverPanel
                                currentCR={currentCR}
                                targetCR={store.targetCR}
                                solverOptions={store.solverOptions}
                                isSolving={store.isSolving}
                                solverResult={solverResult}
                                onSetTargetCR={store.setTargetCR}
                                onSetSolverOptions={store.setSolverOptions}
                                onSolve={handleSolveCR}
                                onApplyResult={handleApplySolverResult}
                                onCancelResult={handleCancelSolverResult}
                            />
                            <MonsterResult
                                monster={generatedMonster}
                                onSave={handleSave}
                                onUpdate={updateGeneratedMonster}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
