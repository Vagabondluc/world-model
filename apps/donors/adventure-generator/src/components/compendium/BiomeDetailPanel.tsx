
import React, { FC, useMemo } from 'react';
import { css } from '@emotion/css';
import { BiomeType } from '../../types/location';
import { BIOME_CONFIG } from '../../data/constants';
import { MonsterIndexEntry } from '../../types/npc';
import { useCampaignStore } from '../../stores/campaignStore';
import { SOURCE_LABELS } from '../../services/databaseRegistry';

const styles = {
    detailPanel: css`
        width: 400px;
        background-color: var(--card-bg);
        border-left: var(--border-main);
        display: flex;
        flex-direction: column;
        overflow: hidden;

        @media (max-width: 900px) {
            position: fixed;
            top: 0; right: 0; bottom: 0;
            z-index: 100;
            box-shadow: -5px 0 20px rgba(0,0,0,0.3);
        }
    `,
    detailHeader: css`
        padding: var(--space-l);
        color: var(--parchment-bg);
        display: flex;
        justify-content: space-between;
        align-items: flex-start;

        h3 { margin: 0; font-size: 1.8rem; font-family: var(--header-font); }
        button { background: transparent; border: none; color: var(--parchment-bg); font-size: 1.5rem; cursor: pointer; }
    `,
    detailContent: css`
        padding: var(--space-l);
        overflow-y: auto;
        flex: 1;
    `,
    section: css`
        margin-bottom: var(--space-l);
        h4 { 
            margin-top: 0; 
            border-bottom: 1px solid var(--light-brown); 
            padding-bottom: var(--space-xs);
            margin-bottom: var(--space-s);
            color: var(--dark-brown);
        }
        ul { padding-left: var(--space-l); margin: 0; }
        li { margin-bottom: 4px; }
    `,
    encounterList: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-s);
    `,
    encounterItem: css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--parchment-bg);
        padding: var(--space-s) var(--space-m);
        border-radius: var(--border-radius);
        border: 1px solid var(--border-light);
        
        span { font-weight: bold; color: var(--dark-brown); }
        small { color: var(--medium-brown); }
    `,
    removeBtn: css`
        background: transparent;
        border: none;
        color: var(--error-red);
        cursor: pointer;
        font-size: 1.2rem;
        opacity: 0.6;
        &:hover { opacity: 1; }
    `,
    addArea: css`
        margin-top: var(--space-m);
        display: flex;
        gap: var(--space-s);
        select { flex: 1; margin-bottom: 0; }
    `
};

interface BiomeDetailPanelProps {
    selectedBiome: BiomeType;
    onClose: () => void;
    allMonsters: MonsterIndexEntry[];
}

export const BiomeDetailPanel: FC<BiomeDetailPanelProps> = ({ selectedBiome, onClose, allMonsters }) => {
    const biomeData = useCampaignStore(s => s.biomeData);
    const addCreatureToBiome = useCampaignStore(s => s.addCreatureToBiome);
    const removeCreatureFromBiome = useCampaignStore(s => s.removeCreatureFromBiome);
    const [selectedCreatureId, setSelectedCreatureId] = React.useState('');

    const handleAddCreature = () => {
        if (selectedBiome && selectedCreatureId) {
            addCreatureToBiome(selectedBiome, selectedCreatureId);
            setSelectedCreatureId('');
        }
    };

    const getBiomeIcon = (biome: string): string => {
        switch (biome.toLowerCase()) {
            case 'arctic': return '❄️';
            case 'coastal': return '🏖️';
            case 'desert': return '🏜️';
            case 'forest': return '🌲';
            case 'grassland': return '🌾';
            case 'hill': return '⛰️';
            case 'jungle': return '🌴';
            case 'mountain': return '🏔️';
            case 'swamp': return '🐊';
            case 'underdark': return '🦇';
            case 'underwater': return '🐙';
            case 'urban': return '🏙️';
            case 'planar': return '🔮';
            case 'wasteland': return '☠️';
            case 'volcanic': return '🌋';
            default: return '🌍';
        }
    }

    return (
        <div className={styles.detailPanel}>
            <div className={styles.detailHeader} style={{ backgroundColor: BIOME_CONFIG[selectedBiome].color }}>
                <h3>{getBiomeIcon(selectedBiome)} {BIOME_CONFIG[selectedBiome].name}</h3>
                <button onClick={onClose}>×</button>
            </div>
            <div className={styles.detailContent}>
                <div className={styles.section}>
                    <h4>Description</h4>
                    <p>{BIOME_CONFIG[selectedBiome].description}</p>
                </div>
                <div className={styles.section}>
                    <h4>Common Features</h4>
                    <ul>
                        {BIOME_CONFIG[selectedBiome].commonFeatures.map((feature, i) => (
                            <li key={i}>{feature}</li>
                        ))}
                    </ul>
                </div>
                <div className={styles.section}>
                    <h4>Encounter Table</h4>
                    {(!biomeData[selectedBiome] || biomeData[selectedBiome].creatureIds.length === 0) ? (
                        <p style={{ fontStyle: 'italic', color: 'var(--medium-brown)' }}>No creatures assigned yet.</p>
                    ) : (
                        <div className={styles.encounterList}>
                            {biomeData[selectedBiome].creatureIds.map(creatureId => {
                                const creature = allMonsters.find(m => m.id === creatureId);
                                return (
                                    <div key={creatureId} className={styles.encounterItem}>
                                        <div>
                                            <span>{creature?.name || 'Unknown Creature'}</span>
                                            {creature && <small> (CR {creature.cr})</small>}
                                        </div>
                                        <button className={styles.removeBtn} onClick={() => removeCreatureFromBiome(selectedBiome, creatureId)} title="Remove from biome">×</button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    
                    <div className={styles.addArea}>
                        <select value={selectedCreatureId} onChange={(e) => setSelectedCreatureId(e.target.value)} aria-label="Select creature to add">
                            <option value="">Select creature from bestiary...</option>
                            {allMonsters.map((monster => {
                                const sourceLabel = SOURCE_LABELS[monster.source || 'user'] || monster.source || 'Custom';
                                return (
                                    <option key={monster.id} value={monster.id}>
                                        {monster.name} (CR {monster.cr}) [{sourceLabel}]
                                    </option>
                                );
                            }))}
                        </select>
                        <button className="action-button" onClick={handleAddCreature} disabled={!selectedCreatureId}>Add</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
