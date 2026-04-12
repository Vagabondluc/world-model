import React, { FC, useState, useMemo } from 'react';
import { NarrativeCard } from './NarrativeCard';
import { NarrativeHeader } from './NarrativeHeader';
import { NarrativeGrid } from './NarrativeGrid';
import { NarrativeTextarea } from './NarrativeTextarea';
import { TacticalList } from './TacticalList';
import { NarrativeFooter } from './NarrativeFooter';
import { css } from '@emotion/css';
import { AiNarrativeService } from '../../services/aiNarrativeService';
import { TacticalItem } from '../../types/narrative-kit';

import { aiManager } from '../../services/ai/aiManager';
import { z } from 'zod';

interface EncounterDesignPreviewProps {
    onBack?: () => void;
}

export const EncounterDesignPreview: FC<EncounterDesignPreviewProps> = ({ onBack }) => {
    const [title, setTitle] = useState('Crossroads Ambush');
    const [goal, setGoal] = useState('Break the Barricade');
    const [description, setDescription] = useState('Rain-slicked mud. Smells of wet fur and iron. A fallen log blocks the...');
    const [isAiLoading, setIsAiLoading] = useState(false);

    const [envItems, setEnvItems] = useState<TacticalItem[]>([
        { id: '1', text: 'Muddy Ground: -10ft Speed', icon: 'info' },
        { id: '2', text: 'Heavy Rain: Disadv. on Ranged', icon: 'info' }
    ]);

    const [challengeItems, setChallengeItems] = useState<TacticalItem[]>([
        { id: '1', text: 'Perception DC 13 (Spots Archers)', icon: 'check' },
        { id: '2', text: 'Strength DC 15 (Level the Log)', icon: 'check' }
    ]);

    const [opponentItems, setOpponentItems] = useState<TacticalItem[]>([
        { id: '1', text: '4x Bandits', icon: 'attack' },
        { id: '2', text: '1x Captain', icon: 'attack' },
        { id: '3', text: 'Motive: Steal the Cargo', icon: 'info' }
    ]);

    const [tacticsItems, setTacticsItems] = useState<TacticalItem[]>([
        { id: '1', text: 'Archers stay behind log.', icon: 'defense' },
        { id: '2', text: 'Captain charges if melee occurs.', icon: 'attack' }
    ]);

    const [outcomesItems, setOutcomesItems] = useState<TacticalItem[]>([
        { id: '1', text: 'Win: Cargo safe; Hook: Map found', icon: 'check' },
        { id: '2', text: 'Lose: Cargo stolen; Hook: Pursuit', icon: 'info' }
    ]);

    const [xpItems, setXpItems] = useState<TacticalItem[]>([
        { id: '1', text: 'Challenges: 500 XP', icon: 'info' },
        { id: '2', text: 'Combat: 1,500 XP', icon: 'info' },
        { id: '3', text: 'Total: 2,000 XP', icon: 'check' }
    ]);

    const handleFastFill = async () => {
        setIsAiLoading(true);
        try {
            const prompt = `Generate a D&D encounter design. Title: ${title}, Goal: ${goal}`;
            const schema = z.object({
                description: z.string().optional(),
                envItems: z.array(z.object({ id: z.string(), text: z.string(), icon: z.enum(['check', 'attack', 'defense', 'info']).optional() })).optional(),
                challengeItems: z.array(z.object({ id: z.string(), text: z.string(), icon: z.enum(['check', 'attack', 'defense', 'info']).optional() })).optional(),
                opponentItems: z.array(z.object({ id: z.string(), text: z.string(), icon: z.enum(['check', 'attack', 'defense', 'info']).optional() })).optional(),
                tacticsItems: z.array(z.object({ id: z.string(), text: z.string(), icon: z.enum(['check', 'attack', 'defense', 'info']).optional() })).optional(),
                outcomesItems: z.array(z.object({ id: z.string(), text: z.string(), icon: z.enum(['check', 'attack', 'defense', 'info']).optional() })).optional(),
                xpItems: z.array(z.object({ id: z.string(), text: z.string(), icon: z.enum(['check', 'attack', 'defense', 'info']).optional() })).optional()
            });

            const result = await aiManager.generateStructured<{
                description?: string;
                envItems?: TacticalItem[];
                challengeItems?: TacticalItem[];
                opponentItems?: TacticalItem[];
                tacticsItems?: TacticalItem[];
                outcomesItems?: TacticalItem[];
                xpItems?: TacticalItem[];
            }>(prompt, schema);

            // Update all state with generated data
            if (result.description) setDescription(result.description);
            if (result.envItems) setEnvItems(result.envItems);
            if (result.challengeItems) setChallengeItems(result.challengeItems);
            if (result.opponentItems) setOpponentItems(result.opponentItems);
            if (result.tacticsItems) setTacticsItems(result.tacticsItems);
            if (result.outcomesItems) setOutcomesItems(result.outcomesItems);
            if (result.xpItems) setXpItems(result.xpItems);

        } catch (error) {
            console.error("Failed to fast-fill encounter", error);
        } finally {
            setIsAiLoading(false);
        }
    };

    return (
        <div className={css`padding: 20px; background: #f0f0f0; min-height: 100vh; display: flex; justify-content: center; align-items: flex-start;`}>
            <NarrativeCard variant="default" className={css`width: 100%; max-width: 800px;`}>
                <NarrativeHeader
                    title={title}
                    goal={goal}
                    onAiFastFill={handleFastFill}
                    isLoading={isAiLoading}
                    onBack={onBack}
                />

                <NarrativeTextarea
                    label="DESCRIPTION (Sensory)"
                    value={description}
                    onChange={setDescription}
                />

                <NarrativeGrid
                    leftLabel="Environment Modifier"
                    left={<TacticalList items={envItems} />}
                    rightLabel="Challenge Steps"
                    right={<TacticalList items={challengeItems} />}
                />

                <NarrativeGrid
                    leftLabel="Opponents & Tactics"
                    left={<TacticalList items={opponentItems} />}
                    rightLabel="Tactics"
                    right={<TacticalList items={tacticsItems} />}
                />

                <NarrativeGrid
                    leftLabel="Outcomes"
                    left={<TacticalList items={outcomesItems} />}
                    rightLabel="XP Rewards"
                    right={<TacticalList items={xpItems} />}
                />

                <NarrativeFooter
                    leftActions={
                        <>
                            <button>Export Small Card</button>
                            <button>Push to Campaign</button>
                            <button>Preview Tabletop</button>
                        </>
                    }
                    rightActions={<button style={{ fontWeight: 'bold' }}>Done</button>}
                />
            </NarrativeCard>
        </div>
    );
};
