
import React, { FC, useState, useMemo } from 'react';
import { css, cx } from '@emotion/css';
import { BiomeType } from '../../types/location';
import { BIOME_CONFIG } from '../../data/constants';
import { MonsterIndexEntry } from '../../types/npc';
import { useCampaignStore } from '../../stores/campaignStore';
import { getMonsterType } from '../../utils/monsterHelpers';
import { BiomeDetailPanel } from './BiomeDetailPanel';

const styles = {
    container: css`
        display: flex;
        height: 100%;
        overflow: hidden;
    `,
    gridContainer: css`
        flex: 1;
        overflow-y: auto;
        padding: var(--space-l);
        padding-right: var(--space-s);
    `,
    grid: css`
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: var(--space-l);
    `,
    card: css`
        background: var(--card-bg);
        border-radius: var(--border-radius);
        overflow: hidden;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        border: 2px solid transparent;

        &:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 16px rgba(0,0,0,0.15);
        }
    `,
    selectedCard: css`
        border-color: var(--dark-brown);
    `,
    colorStrip: css`
        height: 60px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
    `,
    cardContent: css`
        padding: var(--space-m);
        h4 { margin: 0 0 var(--space-s) 0; font-size: 1.2rem; color: var(--dark-brown); }
        p { margin: 0; font-size: 0.9rem; color: var(--medium-brown); line-height: 1.4; }
    `,
    encounterCount: css`
        margin-top: var(--space-s);
        font-size: 0.85rem;
        font-weight: bold;
        color: var(--dnd-red);
    `,
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

export const BiomeManagerView: FC = () => {
    const [selectedBiome, setSelectedBiome] = useState<BiomeType | null>(null);
    const biomeData = useCampaignStore(s => s.biomeData);
    const userMonsters = useCampaignStore(s => s.bestiary);
    const loadedMonsterIndex = useCampaignStore(s => s.loadedMonsterIndex);

    const allMonstersForList = useMemo(() => {
        const userMonsterIndexItems: MonsterIndexEntry[] = userMonsters.map(m => ({
            id: m.id,
            name: m.name,
            cr: m.profile.table.challengeRating?.split(' ')[0] || '?',
            type: getMonsterType(m),
            size: m.profile.table.size,
            isSrd: false,
            source: 'user'
        }));
        // loadedMonsterIndex now contains entries from all enabled databases
        return [...userMonsterIndexItems, ...loadedMonsterIndex].sort((a, b) => a.name.localeCompare(b.name));
    }, [userMonsters, loadedMonsterIndex]);

    return (
        <div className={styles.container}>
            <div className={styles.gridContainer}>
                <div className={styles.grid}>
                    {(Object.entries(BIOME_CONFIG) as [BiomeType, typeof BIOME_CONFIG[BiomeType]][]).map(([key, config]) => {
                        const encounterCount = biomeData[key]?.creatureIds.length || 0;
                        return (
                            <div 
                                key={key} 
                                className={cx(styles.card, { [styles.selectedCard]: selectedBiome === key })}
                                onClick={() => setSelectedBiome(key)}
                            >
                                <div className={styles.colorStrip} style={{ backgroundColor: config.color }}>
                                    {getBiomeIcon(key)}
                                </div>
                                <div className={styles.cardContent}>
                                    <h4>{config.name}</h4>
                                    <p>{config.description}</p>
                                    <div className={styles.encounterCount}>
                                        🐾 {encounterCount} creatures
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {selectedBiome && (
                <BiomeDetailPanel 
                    selectedBiome={selectedBiome} 
                    onClose={() => setSelectedBiome(null)} 
                    allMonsters={allMonstersForList}
                />
            )}
        </div>
    );
};
