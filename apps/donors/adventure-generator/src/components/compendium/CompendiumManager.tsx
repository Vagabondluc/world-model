
import React, { FC, useEffect } from 'react';
import { css, cx } from '@emotion/css';
import { LoreForm } from './LoreForm';
import { CompendiumSearch } from './CompendiumSearch';
import { RelationshipMap } from './RelationshipMap';
import { BestiaryView } from '../bestiary/BestiaryView';
import { BiomeManagerView } from './BiomeManagerView';
import { TimelineView } from './visual/TimelineView';
import { LoreView } from './LoreView';
import { LoreDetailPanel } from './LoreDetailPanel';
import { CompendiumHeader, CompendiumTabs } from './CompendiumNavigation';
import { useCompendiumManagerLogic } from '../../hooks/useCompendiumManagerLogic';
import { HazardListView } from './HazardListView';

interface CompendiumManagerProps {
    onBack: () => void;
}

const styles = {
    container: css`
        flex: 1;
        display: flex;
        flex-direction: column;
        height: 100%;
        max-height: 100vh;
        overflow: hidden;
    `,
    mainContent: css`
        flex: 1;
        min-height: 0;
        display: grid;
        grid-template-columns: 1fr;
        overflow: hidden;
        transition: all 0.3s ease;
    `,
    mainContentWithDetails: css`
        grid-template-columns: 1fr 400px;

        @media (max-width: 1200px) {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr auto;
        }
    `,
    fullTab: css`
        display: flex;
        flex-direction: column;
        overflow: hidden;
        height: 100%;
        width: 100%;
    `,
    comingSoon: css`
         display: flex;
         flex-direction: column;
         align-items: center;
         justify-content: center;
         padding: var(--space-xxl);
         text-align: center;
         color: var(--medium-brown);
         height: 100%;
    `
};

export const CompendiumManager: FC<CompendiumManagerProps> = ({ onBack }) => {
    const {
        loreEntries, compendiumEntries, bestiary, hazards, areDatabasesLoaded,
        isFormOpen, editingEntry, activeTab, selectedEntry, allTags, loreTypes,
        setIsFormOpen, setEditingEntry, setActiveTab,
        openEntry, refreshEnabledDatabases, closeDetails,
        handleSaveLore, handleStartCreate, handleStartEdit, handleDeleteLore, handleNavigate
    } = useCompendiumManagerLogic();

    useEffect(() => {
        if ((activeTab === 'bestiary' || activeTab === 'biomes') && !areDatabasesLoaded) {
            refreshEnabledDatabases();
        }
    }, [activeTab, areDatabasesLoaded, refreshEnabledDatabases]);

    const showDetails = !!selectedEntry && activeTab !== 'bestiary' && activeTab !== 'biomes';

    return (
        <div className={styles.container}>
            <CompendiumHeader onBack={onBack} onCreate={activeTab === 'lore' ? handleStartCreate : null} />
            <CompendiumTabs activeTab={activeTab} setActiveTab={setActiveTab} counts={{ lore: loreEntries.length, bestiary: bestiary.length, hazards: hazards.length }} />
            <div className={cx(styles.mainContent, { [styles.mainContentWithDetails]: showDetails })}>
                {activeTab === 'lore' && (
                    <LoreView
                        onSelectEntry={(entry) => openEntry(entry.id)}
                        selectedEntryId={selectedEntry?.id}
                        onStartCreate={handleStartCreate}
                    />
                )}
                {activeTab === 'bestiary' && (<div className={styles.fullTab}><BestiaryView /></div>)}
                {activeTab === 'hazards' && (<div className={styles.fullTab}><HazardListView hazards={hazards} /></div>)}
                {activeTab === 'biomes' && (<div className={styles.fullTab}><BiomeManagerView /></div>)}
                {activeTab === 'timeline' && (
                    <div className={styles.fullTab}>
                        <TimelineView
                            entries={[...loreEntries, ...compendiumEntries]}
                            onSelectEntry={(entry) => openEntry(entry.id)}
                        />
                    </div>
                )}
                {activeTab === 'search' && (<CompendiumSearch loreEntries={loreEntries} compendiumEntries={compendiumEntries} onSelectEntry={(entry) => openEntry(entry.id)} />)}
                {activeTab === 'relationships' && (<RelationshipMap loreEntries={loreEntries} compendiumEntries={compendiumEntries} onSelectEntry={(entry) => openEntry(entry.id)} />)}
                {(activeTab === 'npcs' || activeTab === 'locations') && (<div className={styles.comingSoon}><h3>🚧 Coming Soon</h3><p>Integration with other managers is in progress.</p></div>)}

                {showDetails && selectedEntry && (
                    <LoreDetailPanel
                        entry={selectedEntry}
                        onClose={closeDetails}
                        onEdit={handleStartEdit}
                        onNavigate={handleNavigate}
                    />
                )}
            </div>
            {isFormOpen && (
                <LoreForm
                    lore={editingEntry}
                    loreTypes={loreTypes}
                    allTags={allTags}
                    onSave={handleSaveLore}
                    onClose={() => { setIsFormOpen(false); setEditingEntry(null); }}
                    onDelete={handleDeleteLore}
                />
            )}
        </div>
    );
};
