import React, { FC } from 'react';
import { useEncounterWizardStore } from '@/stores/encounterWizardStore';
import { GeneratorControls } from '../../adventure/framework/GeneratorControls';

const styles = {
    formControl: {
        marginBottom: 'var(--space-l)',
    },
    label: {
        display: 'block',
        marginBottom: 'var(--space-s)',
        fontWeight: 'bold',
    },
};

const CHALLENGE_TYPES = ["Combat", "Puzzle", "Social", "Skill Challenge", "Hybrid"];
const DIFFICULTIES = ["Easy", "Medium", "Hard", "Deadly"];

export const EncounterChallengeControls: FC = () => {
    const {
        challengeType,
        challengeDifficulty,
        setChallengeType,
        setChallengeDifficulty,
        generateChallengeNodeAction,
    } = useEncounterWizardStore();

    return (
        <GeneratorControls>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={styles.formControl}>
                    <label style={styles.label} htmlFor="challenge-type">Challenge Type</label>
                    <select
                        id="challenge-type"
                        value={challengeType}
                        onChange={(e) => setChallengeType(e.target.value)}
                    >
                        <option value="">-- Select a type --</option>
                        {CHALLENGE_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div style={styles.formControl}>
                    <label style={styles.label} htmlFor="challenge-difficulty">Intended Difficulty</label>
                    <select
                        id="challenge-difficulty"
                        value={challengeDifficulty}
                        onChange={(e) => setChallengeDifficulty(e.target.value)}
                    >
                        {DIFFICULTIES.map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: 'var(--space-l)', borderTop: '1px solid var(--border-light)' }}>
                    <button
                        className="primary-button"
                        onClick={generateChallengeNodeAction}
                        disabled={!challengeType}
                        style={{ width: '100%' }}
                    >
                        Generate Procedural Draft
                    </button>
                </div>
            </div>
        </GeneratorControls>
    );
};