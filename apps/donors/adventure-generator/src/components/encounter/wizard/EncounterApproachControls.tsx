import React, { FC } from 'react';
import { useEncounterWizardStore } from '@/stores/encounterWizardStore';
import { GeneratorControls } from '../../adventure/framework/GeneratorControls';
import { ENCOUNTER_APPROACH_DATA } from '../../../data/encounterData';
import { useAppContext } from '../../../context/AppContext';

const styles = {
    formControl: {
        marginBottom: 'var(--space-l)',
    },
    label: {
        display: 'block',
        marginBottom: 'var(--space-s)',
        fontWeight: 'bold',
    },
    obstacleGroup: {
        marginBottom: 'var(--space-m)',
    },
    obstacleLabel: {
        fontWeight: 'bold',
        fontSize: '0.9rem',
        textTransform: 'capitalize' as const,
        marginBottom: 'var(--space-s)',
    },
    checkboxGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--space-s)',
    },
};

export const EncounterApproachControls: FC = () => {
    const { apiService } = useAppContext();
    const {
        approachMode,
        obstacles,
        setApproachMode,
        setObstacles,
        generateApproachNodeAction,
        nodes,
        generateAIDraftAction,
        aiLoadingStage,
    } = useEncounterWizardStore();

    const node = nodes.find(n => n.stage === 'Approach');
    const isAiLoading = aiLoadingStage === 'Approach';

    const handleObstacleChange = (obstacle: string) => {
        const newObstacles = obstacles.includes(obstacle)
            ? obstacles.filter(o => o !== obstacle)
            : [...obstacles, obstacle];
        setObstacles(newObstacles);
    };

    const handleGenerateAI = () => {
        if (apiService && node) {
            generateAIDraftAction(apiService, node.id);
        }
    };

    return (
        <GeneratorControls>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={styles.formControl}>
                    <label style={styles.label} htmlFor="approach-style">Approach Style</label>
                    <select
                        id="approach-style"
                        value={approachMode}
                        onChange={(e) => setApproachMode(e.target.value)}
                    >
                        <option value="">-- Select a style --</option>
                        {Object.entries(ENCOUNTER_APPROACH_DATA.styles).map(([style, data]) => (
                            <option key={style} value={style}>{style} - {data.description}</option>
                        ))}
                    </select>
                </div>

                <div style={styles.formControl}>
                    <label style={styles.label}>Potential Obstacles</label>
                    {Object.entries(ENCOUNTER_APPROACH_DATA.obstacles).map(([category, list]) => (
                        <div key={category} style={styles.obstacleGroup}>
                            <div style={styles.obstacleLabel}>{category}</div>
                            <div style={styles.checkboxGrid}>
                                {list.map(obstacle => (
                                    <label key={obstacle} className="custom-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={obstacles.includes(obstacle)}
                                            onChange={() => handleObstacleChange(obstacle)}
                                        />
                                        <span className="checkmark"></span>
                                        <span style={{ fontSize: '0.9rem' }}>{obstacle}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: 'var(--space-l)', borderTop: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-m)' }}>
                        <button
                            className="primary-button"
                            onClick={generateApproachNodeAction}
                            disabled={!approachMode}
                        >
                            Generate Draft
                        </button>
                        <button
                            className="secondary-button"
                            onClick={handleGenerateAI}
                            disabled={!node || isAiLoading}
                        >
                            {isAiLoading ? <><span className="loader"></span> Enhancing...</> : '✨ Enhance with AI'}
                        </button>
                    </div>
                </div>
            </div>
        </GeneratorControls>
    );
};