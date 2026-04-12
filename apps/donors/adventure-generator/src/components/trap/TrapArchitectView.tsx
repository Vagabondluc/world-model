import React, { FC, useState, useCallback } from 'react';
import { css } from '@emotion/css';
import { NarrativeCard } from '../narrative-kit/NarrativeCard';
import { NarrativeHeader } from '../narrative-kit/NarrativeHeader';
import { ActiveTrapPanel } from './architect';
import { GeneratedTrap, TrapTier } from '../../types/trap';
import { theme } from '../../styles/theme';
import { rollComponent, generateTrapRules } from '../../utils/trapHelpers';
import { useCompendiumStore } from '../../stores/compendiumStore';
import { useCampaignStore } from '../../stores/campaignStore';
import { generateId } from '../../utils/helpers';

const styles = {
    container: css`
        display: flex;
        height: 100vh;
        background: var(--parchment-bg);
    `,
    sidebar: css`
        width: 250px;
        background: ${theme.colors.card};
        border-right: 1px solid ${theme.borders.light};
        padding: ${theme.spacing.m};
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing.m};
    `,
    backButton: css`
        display: flex;
        align-items: center;
        gap: 8px;
        padding: ${theme.spacing.s} ${theme.spacing.m};
        background: transparent;
        border: none;
        color: ${theme.colors.accent};
        cursor: pointer;
        font-family: ${theme.fonts.header};
        font-weight: bold;
        font-size: 0.9rem;
        
        &:hover {
            opacity: 0.8;
        }
    `,
    sidebarSection: css`
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing.s};
    `,
    sidebarTitle: css`
        font-family: ${theme.fonts.header};
        font-size: 0.8rem;
        text-transform: uppercase;
        color: ${theme.colors.textMuted};
        margin-bottom: ${theme.spacing.xs};
    `,
    sidebarButton: css`
        padding: ${theme.spacing.s} ${theme.spacing.m};
        background: ${theme.colors.accent};
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-family: ${theme.fonts.header};
        font-size: 0.9rem;
        text-align: left;
        transition: opacity 0.2s;
        
        &:hover {
            opacity: 0.9;
        }
        
        &.secondary {
            background: ${theme.colors.card};
            color: ${theme.colors.text};
            border: 1px solid ${theme.borders.light};
        }
    `,
    content: css`
        flex: 1;
        overflow-y: auto;
        display: flex;
        justify-content: center;
        align-items: flex-start;
    `,
    layout: css`
        width: 100%;
        max-width: 1400px;
        padding: ${theme.spacing.l};
    `,
};

interface TrapArchitectViewProps {
    onBack?: () => void;
}

export const TrapArchitectView: FC<TrapArchitectViewProps> = ({ onBack }) => {
    const addCompendiumEntries = useCompendiumStore(s => s.addCompendiumEntries);
    const showSystemMessage = useCampaignStore(s => s.showSystemMessage);

    const [activeTrap, setActiveTrap] = useState<Partial<GeneratedTrap>>({
        name: 'The Crushing Slab',
        description: 'A faint dust falls from the ceiling as you step on a loose tile.',
        trigger: 'Pressure Plate (Loose Tile)',
        effect: 'Stone slab grinds downward (1d10 bludgeoning)',
    });

    const handleGenerateTrap = (tier: string) => {
        const newTrap = generateTrapRules(tier as TrapTier);
        setActiveTrap(newTrap);
        showSystemMessage('success', `Generated: "${newTrap.name}"!`);
    };

    const handleTrapUpdate = useCallback((field: keyof GeneratedTrap, value: string) => {
        setActiveTrap(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    const handleComponentSelect = useCallback((type: string, value: string) => {
        const rolled = rollComponent(type);
        setActiveTrap(prev => {
            const next = { ...prev };
            if (type.toLowerCase() === 'clue') next.description = rolled;
            if (type.toLowerCase() === 'trigger') next.trigger = rolled;
            if (type.toLowerCase() === 'danger') next.effect = rolled;
            if (type.toLowerCase() === 'modifier') next.name = rolled + " " + (next.name || "Trap");
            return next;
        });
    }, []);

    const handleSave = () => {
        if (!activeTrap.name) return;

        addCompendiumEntries([{
            id: generateId(),
            category: 'hazard',
            title: activeTrap.name,
            content: activeTrap.effect || '',
            summary: activeTrap.description || '',
            fullContent: JSON.stringify(activeTrap),
            tags: ['trap', 'hazard'],
            createdAt: new Date(),
            lastModified: new Date()
        }]);

        showSystemMessage('success', `"${activeTrap.name}" saved to Compendium!`);
    };

    const handleGenerateMatrix = () => {
        // Implementation for random matrix generation
        console.log("Generating fresh 6x4 matrix...");
    };

    const handleApplyTheme = () => {
        // Implementation for themed matrix generation (e.g. frost, fire, arcane)
        console.log("Applying theme to matrix...");
    };

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                {onBack && (
                    <button className={styles.backButton} onClick={onBack}>
                        ← Back
                    </button>
                )}

                <div className={styles.sidebarSection}>
                    <div className={styles.sidebarTitle}>Quick Generate</div>
                    <button
                        className={styles.sidebarButton}
                        onClick={() => handleGenerateTrap('simple')}
                    >
                        🎲 Simple Trap
                    </button>
                    <button
                        className={styles.sidebarButton}
                        onClick={() => handleGenerateTrap('dangerous')}
                    >
                        ⚠️ Dangerous Trap
                    </button>
                    <button
                        className={styles.sidebarButton}
                        onClick={() => handleGenerateTrap('deadly')}
                    >
                        💀 Deadly Trap
                    </button>
                </div>

                <div className={styles.sidebarSection}>
                    <div className={styles.sidebarTitle}>Actions</div>
                    <button
                        className={`${styles.sidebarButton} secondary`}
                        onClick={handleSave}
                    >
                        💾 Save to Compendium
                    </button>
                </div>
            </aside>

            <div className={styles.content}>
                <NarrativeCard variant="default">
                    <NarrativeHeader
                        title="Trap Architect: Hazard Generator"
                        onAiFastFill={() => console.log('AI Fill')}
                    />

                    <div className={styles.layout}>
                        <ActiveTrapPanel
                            trap={activeTrap}
                            onUpdate={handleTrapUpdate}
                            onComponentSelect={handleComponentSelect}
                            onGenerateMatrix={handleGenerateMatrix}
                            onApplyTheme={handleApplyTheme}
                            onGenerateTrap={handleGenerateTrap}
                        />
                    </div>
                </NarrativeCard>
            </div>
        </div>
    );
};
