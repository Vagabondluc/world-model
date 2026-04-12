
import React, { FC, memo, useState } from 'react';
import { css, cx } from '@emotion/css';
import { GeneratedAdventure } from '../../../schemas/adventure';
import { LoreEntry } from '../../../types/compendium';
import { HooksSkeleton } from '../../common/LoadingSkeleton';
import { ArcaneTableModal } from './ArcaneTableModal';
import { useAdventureDataStore } from '@/stores/adventureDataStore';
import { useGeneratorConfigStore } from '@/stores/generatorConfigStore';
import { useWorkflowStore } from '@/stores/workflowStore';
import { useCompendiumStore } from '@/stores/compendiumStore';
import { useHistoryStore } from '@/stores/historyStore';
import { useCampaignStore } from '@/stores/campaignStore';
import { useAppContext } from '../../../context/AppContext';
import { HookCard } from './hooks/HookCard';
import { generateId } from '../../../utils/helpers';

const styles = {
    container: css`
        background-color: var(--card-bg);
        padding: var(--space-xl);
        border-radius: var(--border-radius);
        border: var(--border-main);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        margin-bottom: var(--space-l);
        h2 { margin-top: 0; }
    `,
    startOverBtn: css`
        float: right;
        margin-left: var(--space-m);
    `,
    matrixContainer: css`
        margin-bottom: var(--space-l);
        background-color: rgba(0,0,0,0.03);
        padding: var(--space-m);
        border-radius: var(--border-radius);
    `,
    matrixHeader: css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-s);
        h3 { margin: 0; font-size: 1.3rem; }
    `,
    matrixTable: css`
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
        th, td {
            border: 1px solid var(--border-light);
            padding: var(--space-s);
            text-align: center;
        }
        th {
            background-color: var(--card-bg);
            font-family: var(--header-font);
        }
        th:first-child { text-align: left; width: 60px; }
    `,
    refineSection: css`
        margin-top: var(--space-l);
        padding-top: var(--space-l);
        border-top: 1px solid var(--border-light);
        display: flex;
        flex-direction: column;
        gap: var(--space-s);
        h3 { font-size: 1.2rem; margin: 0; }
    `,
};

const HooksStepFC: FC = () => {
    const { apiService } = useAppContext();
    const { adventures, matrix } = useAdventureDataStore();
    const { context, generationMethod, setContext } = useGeneratorConfigStore();
    const { loading, reset, refineHooks, generateOutline } = useWorkflowStore();
    const { addLoreEntry } = useCompendiumStore();
    const { generationHistory } = useHistoryStore();
    const { showSystemMessage } = useCampaignStore();

    const onStartOver = () => {
        reset(false);
        useAdventureDataStore.getState().reset();
    };
    const onRefine = () => {
        if (apiService) refineHooks(apiService);
    };
    const onSelectHook = (hook: GeneratedAdventure) => {
        if (apiService) generateOutline(apiService, hook);
    };

    const onSaveHook = async (hook: GeneratedAdventure) => {
        // Get the most recent history ID (the one that generated these hooks)
        const lastHistory = generationHistory[0];
        const title = hook.type === 'simple' ? hook.premise : hook.title;

        // 1. Save to Compendium (Existing Logic)
        let content = "";
        if (hook.type === 'simple') {
            content = `**Premise:** ${hook.premise}\n\n**Origin:** ${hook.origin}\n\n**Positioning:** ${hook.positioning}\n\n**Stakes:** ${hook.stakes}`;
        } else {
            content = `**Hook:** ${hook.hook}\n\n**Player Buy-In:** ${hook.player_buy_in}\n\n**Starter Scene:** ${hook.starter_scene}\n\n**GM Notes:**\n* Escalation: ${hook.gm_notes.escalation}\n* Twists: ${hook.gm_notes.twists_applied.join(', ')}`;
        }

        const entry: LoreEntry = {
            id: generateId(),
            type: 'custom',
            title: title,
            content: content,
            tags: ['Adventure Hook', 'Arcane Library', ...(hook.type === 'detailed' ? hook.tags : [])],
            relatedLocationIds: [],
            relatedNpcIds: [],
            relatedFactionsIds: [],
            isPublicKnowledge: false,
            sources: ['Adventure Generator'],
            createdAt: new Date(),
            lastModified: new Date(),
            origin: {
                type: 'generator',
                generatorStep: 'hooks',
                historyStateId: lastHistory?.id,
                sourceId: title
            }
        };

        addLoreEntry(entry);

        // 2. Save to Ensemble Workspace (New Persistence Spec)
        try {
            const { EnsembleService } = await import('../../../services/ensembleService');
            await EnsembleService.saveAppObject('adventure-hook', hook, title);
            showSystemMessage('success', `Hook "${title}" saved to Compendium and Workspace!`);
        } catch (e) {
            console.error("Failed to save hook to workspace", e);
            showSystemMessage('success', `Hook "${title}" saved to Compendium (Workspace save failed).`);
        }
    };

    const [showTable, setShowTable] = useState(false);

    if (loading.hooks && !adventures.length) {
        return <HooksSkeleton />;
    }

    return (
        <div className={styles.container} aria-busy={loading.hooks || loading.refining}>
            <button className={cx("primary-button", styles.startOverBtn)} onClick={onStartOver}>Start Over</button>
            <h2>Step 2: Choose Your Quest</h2>
            <p>Here are the generated adventure hooks. Refine them with new context, save them for later, or choose one to develop instantly.</p>

            {generationMethod === 'arcane' && matrix && (
                <>
                    <div className={styles.matrixContainer}>
                        <div className={styles.matrixHeader}>
                            <h3>Arcane Matrix</h3>
                            <button className="secondary-button" style={{ fontSize: '0.9rem', padding: 'var(--space-xs) var(--space-s)' }} onClick={() => setShowTable(true)}>📜 View Reference Table</button>
                        </div>
                        <table className={styles.matrixTable} aria-label="Random number matrix">
                            <thead><tr><th></th><th>Action</th><th>McGuffin</th><th>Subject</th></tr></thead>
                            <tbody>{matrix.map((r, i) => (<tr key={i}><th>R{i + 1}</th>{r.map((c, j) => (<td key={j}>{c}</td>))}</tr>))}</tbody>
                        </table>
                    </div>
                    <div className={styles.refineSection}>
                        <h3>Refine Hooks</h3>
                        <textarea className="context-input" value={context} onChange={(e) => setContext(e.target.value)} aria-label="Refine campaign context" placeholder="Add more context to steer the next generation..." />
                        <div style={{ textAlign: 'right' }}><button className="action-button" onClick={onRefine} disabled={loading.refining}>{loading.refining ? 'Refining...' : 'Refine with New Context'}</button></div>
                    </div>
                </>
            )}

            {adventures.map((adv, i) => (
                <HookCard
                    key={i}
                    adventure={adv}
                    onSelect={onSelectHook}
                    onSave={onSaveHook}
                    loading={loading.outline}
                />
            ))}
            {showTable && <ArcaneTableModal onClose={() => setShowTable(false)} />}
        </div>
    );
}

export const HooksStep = memo(HooksStepFC);
