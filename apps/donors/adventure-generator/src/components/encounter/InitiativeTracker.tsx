import React, { FC, useState } from 'react';
import { css, cx } from '@emotion/css';
import { useEncounterStore } from '../../stores/encounterStore';
import { Loot } from '../../schemas';
import { EncounterBalancer } from './EncounterBalancer';
import { LootResultModal } from './LootResultModal';
import { generateLoot } from '../../services/lootGenerator';
import { useAppContext } from '../../context/AppContext';
import { useCampaignStore } from '../../stores/campaignStore';
import { useAdventureDataStore } from '../../stores/adventureDataStore';
import { CombatantRow } from './CombatantRow';
import { AddCombatantForm } from './AddCombatantForm';

const styles = {
    container: css`
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: var(--space-l);
        background-color: var(--parchment-bg);
    `,
    controls: css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-l);
        padding-bottom: var(--space-m);
        border-bottom: 2px solid var(--medium-brown);
        flex-wrap: wrap;
        gap: var(--space-m);
    `,
    list: css`
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: var(--space-s);
    `,
    headerRow: css`
        display: grid;
        grid-template-columns: 50px 2fr 1fr 1fr 2fr 50px;
        align-items: center;
        padding: var(--space-m);
        gap: var(--space-m);
        font-weight: bold;
        background: var(--medium-brown);
        color: var(--parchment-bg);
        border: none;
        margin-bottom: var(--space-s);
        border-radius: var(--border-radius);
    `
};

interface InitiativeTrackerProps {
    onBack?: () => void;
}

export const InitiativeTracker: FC<InitiativeTrackerProps> = () => {
    const { apiService } = useAppContext();
    const { config: campaignConfig } = useCampaignStore();
    const store = useEncounterStore();
    const { encounterDesigns } = useAdventureDataStore();

    const [lootResult, setLootResult] = useState<Loot | null>(null);
    const [isLootLoading, setIsLootLoading] = useState(false);

    const handleAdd = (data: { name: string, initBonus: number, hp: number, ac: number, xp: number, type: 'player' | 'npc' }) => {
        store.addCombatant({
            name: data.name,
            initiative: 0,
            initiativeBonus: data.initBonus,
            hp: data.hp,
            maxHp: data.hp,
            ac: data.ac,
            xp: data.type === 'npc' ? data.xp : undefined,
            type: data.type,
            conditions: [],
        });
    };

    const handleInjectTactics = () => {
        if (!encounterDesigns || encounterDesigns.length === 0) return;

        // This is a simplified injection. Ideally we map specific tactic roles to stats.
        // For now, we just create empty combatants with the names/roles from tactics.
        encounterDesigns.forEach(t => {
            store.addCombatant({
                name: t.name,
                initiative: 0,
                initiativeBonus: 0,
                hp: 10, // Default placeholders
                maxHp: 10,
                ac: 10,
                type: 'npc',
                conditions: [],
            });
        });
    };

    const handleGenerateLoot = async () => {
        if (!apiService) return;
        const defeatedNpcs = store.combatants.filter(c => c.type === 'npc' && c.hp <= 0);
        if (defeatedNpcs.length === 0) return;

        setIsLootLoading(true);
        setLootResult(null);

        const totalXp = defeatedNpcs.reduce((sum, c) => sum + (c.xp || 0), 0);
        const monsterTypes = [...new Set(defeatedNpcs.map(c => c.name.replace(/\s\d+$/, '').trim()))].join(', ');

        try {
            const loot = await generateLoot(apiService, campaignConfig, totalXp, defeatedNpcs.length, monsterTypes);
            setLootResult(loot);
        } catch (e) {
            console.error("Loot generation failed", e);
        } finally {
            setIsLootLoading(false);
        }
    };

    const defeatedNpcsCount = store.combatants.filter(c => c.type === 'npc' && c.hp <= 0).length;

    return (
        <div className={styles.container}>
            <div className={styles.controls}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                    <h2 style={{ margin: 0 }}>⚔️ Encounter</h2>
                    {store.isActive && <span style={{ fontSize: '1.1rem', color: 'var(--dnd-red)', fontWeight: 'bold' }}>Round {store.round}</span>}
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button className="secondary-button" onClick={store.rollNPCInitiative} title="Roll initiative for all NPCs">🎲 NPCs</button>
                    <button className="secondary-button" onClick={store.sortCombatants} title="Sort by initiative">Sort</button>

                    {encounterDesigns.length > 0 && (
                        <button className="secondary-button" onClick={handleInjectTactics} title={`Import ${encounterDesigns.length} tactical units`}>
                            📥 Import Tactics
                        </button>
                    )}


                    <button className="secondary-button" onClick={handleGenerateLoot} disabled={isLootLoading || defeatedNpcsCount === 0} title="Generate loot for defeated enemies">
                        {isLootLoading ? '...' : '💰 Loot'}
                    </button>

                    <div style={{ width: '1px', background: 'var(--medium-brown)', margin: '0 4px', opacity: 0.3 }}></div>

                    <button className="secondary-button" onClick={store.resetEncounter} title="Reset round to 1 and stop combat">Restart</button>
                    <button className="secondary-button" style={{ color: 'var(--error-red)', borderColor: 'var(--error-red)' }} onClick={store.clearEncounter} title="Remove all combatants">Clear</button>

                    <div style={{ width: '1px', background: 'var(--medium-brown)', margin: '0 4px', opacity: 0.3 }}></div>

                    {store.isActive && <button className="secondary-button" onClick={store.previousTurn}>◀</button>}
                    <button className="primary-button" onClick={store.isActive ? store.nextTurn : store.startEncounter}>
                        {store.isActive ? 'Next Turn ▶' : 'Start Combat'}
                    </button>
                </div>
            </div>

            <div className={styles.headerRow}>
                <div>Init</div>
                <div>Name</div>
                <div>HP</div>
                <div>AC</div>
                <div>Conditions</div>
                <div></div>
            </div>

            <div className={styles.list}>
                {store.combatants.map((c, idx) => (
                    <CombatantRow
                        key={c.id}
                        combatant={c}
                        isActive={store.isActive && idx === store.currentTurnIndex}
                        onUpdate={store.updateCombatant}
                        onRemove={store.removeCombatant}
                        onSetInitiative={store.setInitiative}
                    />
                ))}
                {store.combatants.length === 0 && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#888', fontStyle: 'italic' }}>
                        No combatants. Add some below or generate an encounter!
                    </div>
                )}
            </div>

            <EncounterBalancer />

            <AddCombatantForm onAdd={handleAdd} />

            {lootResult && <LootResultModal loot={lootResult} onClose={() => setLootResult(null)} />}
        </div>
    );
};
