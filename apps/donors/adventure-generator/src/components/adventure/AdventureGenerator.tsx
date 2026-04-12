
import React, { FC } from 'react';
import { css } from '@emotion/css';
import { useWorkflowStore } from '../../stores/workflowStore';
import { InitialStep } from './steps/InitialStep';
import { HooksStep } from './steps/HooksStep';
import { OutlineHubView } from './steps/OutlineHubView';
import { DelveWizard } from './delve/DelveWizard';
import { SceneDetailView } from './detail-views/SceneDetailView';
import { LocationDetailView } from './detail-views/LocationDetailView';
import { FactionDetailView } from './detail-views/FactionDetailView';
import { NpcDetailView } from './detail-views/NpcDetailView';
import { GenerationErrorBoundary } from '../common/GenerationErrorBoundary';

const styles = {
    container: css`
        max-width: 1600px;
        margin: 0 auto;
    `,
    mainContent: css`
        /* Reserved for future high-level layout adjustments */
    `
};

export const AdventureGenerator: FC = () => {
    const { step, detailingEntity, error, setError } = useWorkflowStore(state => ({
        step: state.step,
        detailingEntity: state.detailingEntity,
        error: state.error,
        setError: state.setError
    }));

    if (error) {
        return (
            <div className="step-container">
                <div className="error-message" role="alert">
                    <h4>An Error Occurred During Generation</h4>
                    <p>{error}</p>
                    <button 
                        className="secondary-button" 
                        onClick={() => setError(null)}
                        aria-label="Dismiss error message"
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        );
    }
    
    const renderContent = () => {
        if (detailingEntity) {
            switch (detailingEntity.type) {
                case 'scene':
                    return <SceneDetailView id={detailingEntity.id} />;
                case 'location':
                    return <LocationDetailView id={detailingEntity.id} />;
                case 'npc':
                    return <NpcDetailView id={detailingEntity.id} />;
                case 'faction':
                    return <FactionDetailView id={detailingEntity.id} />;
                default: return null;
            }
        }

        switch (step) {
            case 'initial':
                return <InitialStep />;
            case 'hooks':
                return <HooksStep />;
            case 'outline':
                return <OutlineHubView />;
            case 'delve':
                return <DelveWizard />;
            default:
                return <div>Invalid step</div>;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainContent} aria-live="polite" aria-atomic="true">
                <GenerationErrorBoundary>
                    {renderContent()}
                </GenerationErrorBoundary>
            </div>
        </div>
    );
};