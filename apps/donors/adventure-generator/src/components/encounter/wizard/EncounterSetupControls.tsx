
import React, { FC } from 'react';
import { useEncounterWizardStore } from '@/stores/encounterWizardStore';
import { useCompendiumStore } from '@/stores/compendiumStore';
import { GeneratorControls } from '../../adventure/framework/GeneratorControls';
import { useAppContext } from '../../../context/AppContext';

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

export const EncounterSetupControls: FC = () => {
    const { apiService } = useAppContext();
    const {
        encounterTitle,
        locationContext,
        factionContext,
        setEncounterTitle,
        setLocationContext,
        setFactionContext,
        generateSetupNodeAction,
        nodes,
        generateAIDraftAction,
        aiLoadingStage,
    } = useEncounterWizardStore();

    const allFactions = useCompendiumStore(s => s.compendiumEntries.filter(e => e.category === 'faction'));

    const handleFactionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIds = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);
        setFactionContext(selectedIds);
    };

    const setupNode = nodes.find(node => node.stage === 'Setup');
    const setupNodeExists = !!setupNode;
    const isAiLoading = aiLoadingStage === 'Setup';

    const handleGenerateAI = () => {
        if (apiService && setupNode) {
            generateAIDraftAction(apiService, setupNode.id);
        }
    };

    return (
        <GeneratorControls>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={styles.formControl}>
                    <label style={styles.label} htmlFor="encounter-title">Encounter Title</label>
                    <input
                        id="encounter-title"
                        type="text"
                        value={encounterTitle}
                        onChange={(e) => setEncounterTitle(e.target.value)}
                        placeholder="e.g., The Ritual of the Serpent Cult"
                    />
                </div>
                <div style={styles.formControl}>
                    <label style={styles.label} htmlFor="encounter-location">Location / Situation Context</label>
                    <textarea
                        id="encounter-location"
                        rows={5}
                        value={locationContext}
                        onChange={(e) => setLocationContext(e.target.value)}
                        placeholder="e.g., A crumbling bridge over a chasm during a blizzard. The party is being pursued."
                    />
                </div>
                <div style={styles.formControl}>
                    <label style={styles.label} htmlFor="encounter-factions">Involved Factions (Ctrl+Click for multiple)</label>
                    <select
                        id="encounter-factions"
                        multiple
                        value={factionContext || []}
                        onChange={handleFactionChange}
                        style={{ height: '150px' }}
                    >
                        {allFactions.map(faction => (
                            <option key={faction.id} value={faction.id}>
                                {faction.title}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{ marginTop: 'auto', paddingTop: 'var(--space-l)', borderTop: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-m)' }}>
                        <button
                            className="primary-button"
                            onClick={generateSetupNodeAction}
                            disabled={!locationContext.trim()}
                        >
                            Generate Draft
                        </button>
                        <button
                            className="secondary-button"
                            onClick={handleGenerateAI}
                            disabled={!setupNodeExists || isAiLoading}
                        >
                            {isAiLoading ? <><span className="loader"></span> Enhancing...</> : '✨ Enhance with AI'}
                        </button>
                    </div>
                </div>
            </div>
        </GeneratorControls>
    );
};
