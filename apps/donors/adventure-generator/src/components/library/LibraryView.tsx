import React, { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { useCampaignStore } from '../../stores/campaignStore';
import { Open5eService, Open5eMonster } from '../../services/open5eService';
import { SrdNormalizationService } from '../../services/srdNormalizationService';
import { RuleCurator } from '../../services/ruleCurator';
import { EnsembleService } from '../../services/ensembleService';

// Styles
const styles = {
    container: css`
        height: 100vh;
        display: flex;
        flex-direction: column;
        background: var(--bg-primary);
        color: var(--text-primary);
        padding: 2rem;
    `,
    header: css`
        margin-bottom: 2rem;
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 1rem;
    `,
    searchBar: css`
        width: 100%;
        padding: 0.8rem;
        font-size: 1.1rem;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        border-radius: 4px;
        margin-bottom: 1rem;
    `,
    grid: css`
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;
        overflow-y: auto;
        padding-bottom: 2rem;
    `,
    card: css`
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        padding: 1rem;
        border-radius: 8px;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
        
        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            border-color: var(--accent-color);
        }
    `,
    cardHeader: css`
        font-weight: bold;
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
        color: var(--accent-light);
    `,
    cardMeta: css`
        font-size: 0.9rem;
        color: var(--text-secondary);
        margin-bottom: 0.2rem;
    `,
    previewDrawer: css`
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        width: 400px; // Or dynamic
        background: var(--bg-secondary);
        border-left: 1px solid var(--border-color);
        padding: 2rem;
        box-shadow: -4px 0 20px rgba(0,0,0,0.5);
        z-index: 100;
        overflow-y: auto;
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
        
        &.open {
            transform: translateX(0);
        }
    `,
    btn: css`
        padding: 0.5rem 1rem;
        background: var(--accent-color);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 1rem;
        font-weight: bold;
        
        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    `
};

interface LibraryViewProps {
    onBack?: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Open5eMonster[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedMonster, setSelectedMonster] = useState<Open5eMonster | null>(null);
    const rootPath = useCampaignStore(s => s.rootPath);

    // Debounce Search
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (query.length < 2) return;
            setLoading(true);
            try {
                const hits = await Open5eService.searchMonsters(query);
                setResults(hits);
            } catch (e) {
                console.error("Search failed", e);
            } finally {
                setLoading(false);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleImport = async () => {
        if (!selectedMonster || !rootPath) return;

        try {
            // 1. Normalize
            const savedMonster = SrdNormalizationService.normalizeMonster(selectedMonster);

            // 2. Determine Path
            const savePath = RuleCurator.getMonsterPath(rootPath, savedMonster);

            // 3. Write File (Serialize to YAML)
            const yamlModule = await import('js-yaml');
            const yaml = (yamlModule as unknown as { default?: typeof import('js-yaml') }).default ?? yamlModule;
            const content = yaml.dump(savedMonster);

            await EnsembleService.writeMarkdown(savePath, '', content);

            useCampaignStore.getState().showSystemMessage('success', `Imported ${savedMonster.name} to vault.`);
            setSelectedMonster(null);
        } catch (e) {
            console.error(e);
            useCampaignStore.getState().showSystemMessage('error', "Import Failed: " + String(e));
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Library Access</h1>
                <p>Search standard reference documents (SRD) from Open5e.</p>
            </header>

            <input
                className={styles.searchBar}
                placeholder="Search monsters (e.g. Goblin, Dragon)..."
                value={query}
                onChange={e => setQuery(e.target.value)}
            />

            {loading && <div>Searching...</div>}

            <div className={styles.grid}>
                {results.map(m => (
                    <div key={m.slug} className={styles.card} onClick={() => setSelectedMonster(m)}>
                        <div className={styles.cardHeader}>{m.name}</div>
                        <div className={styles.cardMeta}>CR {m.challenge_rating} • {m.type}</div>
                        <div className={styles.cardMeta}>{m.document__title}</div>
                    </div>
                ))}
            </div>

            {/* Preview Drawer */}
            <div className={`${styles.previewDrawer} ${selectedMonster ? 'open' : ''}`}>
                {selectedMonster && (
                    <div>
                        <button onClick={() => setSelectedMonster(null)} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                        <h2>{selectedMonster.name}</h2>
                        <div className={styles.cardMeta}>{selectedMonster.size} {selectedMonster.type}, {selectedMonster.alignment}</div>
                        <hr />
                        <p><strong>AC:</strong> {selectedMonster.armor_class} ({selectedMonster.armor_desc})</p>
                        <p><strong>HP:</strong> {selectedMonster.hit_points} ({selectedMonster.hit_dice})</p>
                        <p><strong>Speed:</strong> {Object.entries(selectedMonster.speed).map(([k, v]) => `${k} ${v}ft`).join(', ')}</p>

                        {(selectedMonster.strength_save || selectedMonster.dexterity_save || selectedMonster.constitution_save || selectedMonster.intelligence_save || selectedMonster.wisdom_save || selectedMonster.charisma_save) && (
                            <p><strong>Saves:</strong> {
                                (
                                    [
                                        ['STR', selectedMonster.strength_save],
                                        ['DEX', selectedMonster.dexterity_save],
                                        ['CON', selectedMonster.constitution_save],
                                        ['INT', selectedMonster.intelligence_save],
                                        ['WIS', selectedMonster.wisdom_save],
                                        ['CHA', selectedMonster.charisma_save]
                                    ] as [string, number | null | undefined][]
                                )
                                    .filter(([_, v]) => v !== null && v !== undefined)
                                    .map(([l, v]) => `${l} +${v}`)
                                    .join(', ')
                            }</p>
                        )}

                        {Object.keys(selectedMonster.skills).length > 0 && (
                            <p><strong>Skills:</strong> {
                                Object.entries(selectedMonster.skills)
                                    .map(([k, v]) => `${k} +${v}`)
                                    .join(', ')
                            }</p>
                        )}
                        <h3>Actions</h3>
                        {selectedMonster.actions.map(action => (
                            <div key={action.name} style={{ marginBottom: '0.8rem' }}>
                                <strong>{action.name}.</strong> {action.desc}
                            </div>
                        ))}

                        {selectedMonster.special_abilities && (
                            <>
                                <h3>Traits</h3>
                                {selectedMonster.special_abilities.map(trait => (
                                    <div key={trait.name} style={{ marginBottom: '0.8rem' }}>
                                        <strong>{trait.name}.</strong> {trait.desc}
                                    </div>
                                ))}
                            </>
                        )}

                        <button className={styles.btn} onClick={handleImport}>
                            Import to Vault
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
