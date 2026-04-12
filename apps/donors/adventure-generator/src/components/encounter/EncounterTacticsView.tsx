import React, { FC, useState, useCallback } from 'react';
import { css } from '@emotion/css';
import { NarrativeCard } from '../narrative-kit/NarrativeCard';
import { NarrativeHeader } from '../narrative-kit/NarrativeHeader';
import { TacticalDeployment } from './TacticalDeployment';
import { theme } from '../../styles/theme';
import { AiNarrativeService } from '../../services/aiNarrativeService';
import { useAdventureDataStore } from '../../stores/adventureDataStore';
import { Shield, Target, Zap } from 'lucide-react';
import { EncounterCombatant, EncounterTactic } from '../../types/encounter';

import { aiManager } from '../../services/ai/aiManager';
import { z } from 'zod';

const styles = {
    container: css`
        padding: 20px;
        background: #f5f7f9;
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: flex-start;
    `,
    layout: css`
        display: grid;
        grid-template-columns: 1fr 350px;
        gap: ${theme.spacing.l};
        width: 100%;
        max-width: 1200px;
        @media (max-width: 1000px) {
            grid-template-columns: 1fr;
        }
    `,
    tacticsPanel: css`
        background: white;
        padding: 20px;
        border-radius: 8px;
        border: 1px solid ${theme.borders.light};
        display: flex;
        flex-direction: column;
        gap: 16px;
    `,
    tacticCard: css`
        padding: 12px;
        border-left: 4px solid ${theme.colors.accent};
        background: #fafafa;
        border-radius: 4px;
        h4 { margin: 0 0 8px 0; color: ${theme.colors.accent}; display: flex; align-items: center; gap: 8px; }
        p { margin: 4px 0; font-size: 0.9rem; }
    `
};

interface EncounterTacticsViewProps {
    onBack?: () => void;
}

export const EncounterTacticsView: FC<EncounterTacticsViewProps> = ({ onBack }) => {
    const [loading, setLoading] = useState(false);
    const [tactics, setTactics] = useState<EncounterTactic[]>([]);

    // Mock combatants
    const [combatants] = useState<EncounterCombatant[]>([
        { name: 'Goblin Boss', count: 1 },
        { name: 'Goblin Scrimishers', count: 4 }
    ]);

    const handleGenerateTactics = async () => {
        setLoading(true);
        try {
            const env = "A cramped, dimly lit cave with stalactites and a narrow stream.";
            const prompt = `Generate tactical combat behaviors for these combatants in this environment: ${env}. Combatants: ${JSON.stringify(combatants)}`;
            const schema = z.object({
                tactics: z.array(z.object({
                    name: z.string(),
                    role: z.string(),
                    priority: z.string(),
                    behavior: z.string()
                }))
            });

            const result = await aiManager.generateStructured(prompt, schema);
            const nextTactics = result.tactics as EncounterTactic[];
            setTactics(nextTactics);
            useAdventureDataStore.getState().setEncounterDesigns(nextTactics);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <NarrativeCard variant="default">
                <NarrativeHeader
                    title="Encounter Designer: Tactical Deployment"
                    onAiFastFill={handleGenerateTactics}
                    isLoading={loading}
                    onBack={onBack}
                />

                <div className={styles.layout}>
                    <TacticalDeployment />

                    <div className={styles.tacticsPanel}>
                        <h3 className={css`margin-top: 0; display: flex; justify-content: space-between; align-items: center;`}>
                            AI Combat Behaviors
                            {!tactics.length && !loading && (
                                <button className="secondary-button" style={{ fontSize: '0.7rem' }} onClick={handleGenerateTactics}>
                                    Generate
                                </button>
                            )}
                        </h3>

                        {loading && <p>Analyzing terrain and roles...</p>}

                        {!loading && !tactics.length && (
                            <p style={{ fontStyle: 'italic', color: theme.colors.textMuted }}>
                                No tactics generated. Use Fast-Fill to analyze unit roles.
                            </p>
                        )}

                        {tactics.map((t, i) => (
                            <div key={i} className={styles.tacticCard}>
                                <h4><Target size={16} /> {t.name}</h4>
                                <p><strong>Tactical Role:</strong> {t.role}</p>
                                <p><strong>Priority Target:</strong> {t.priority}</p>
                                <p><strong>Behavior:</strong> {t.behavior}</p>
                            </div>
                        ))}

                        <div className={css`margin-top: auto; padding-top: 16px; border-top: 1px solid #eee;`}>
                            <p style={{ fontSize: '0.8rem', color: theme.colors.textMuted }}>
                                <strong>Environment:</strong> Dimly lit cave, narrow stream.
                            </p>
                        </div>
                    </div>
                </div>
            </NarrativeCard>
        </div>
    );
};
