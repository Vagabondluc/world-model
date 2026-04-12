
import React, { FC } from 'react';
import { useEncounterWizardStore } from '../../stores/encounterWizardStore';
import { useCompendiumStore } from '../../stores/compendiumStore';
import { useCampaignStore } from '../../stores/campaignStore';
import { CompendiumEntry } from '../../schemas';
import { generateId } from '../../utils/helpers';
import { GeneratorShell } from '../adventure/framework/GeneratorShell';
import { ProceduralPanel } from '../adventure/framework/ProceduralPanel';
import { AIPanel } from '../adventure/framework/AIPanel';
import { FinalEditor } from '../adventure/framework/FinalEditor';
import { EncounterSetupControls } from './wizard/EncounterSetupControls';
import { EncounterNodeDetail } from './wizard/EncounterNodeDetail';
import { EncounterApproachControls } from './wizard/EncounterApproachControls';
import { EncounterTwistControls } from './wizard/EncounterTwistControls';
import { EncounterChallengeControls } from './wizard/EncounterChallengeControls';
import { EncounterClimaxControls } from './wizard/EncounterClimaxControls';
import { EncounterAftermathControls } from './wizard/EncounterAftermathControls';
import { EncounterEditor } from './wizard/EncounterEditor';

export const EncounterWizard: FC = () => {
    const { currentStage, nodes, aiDrafts, aiLoadingStage, encounterTitle, reset } = useEncounterWizardStore();
    const { addCompendiumEntries } = useCompendiumStore();
    const { showSystemMessage, setActiveView } = useCampaignStore();
    const { saveCurrentEdits } = useEncounterWizardStore.getState();

    const currentStageNode = nodes.find(node => node.stage === currentStage);
    const aiDraft = currentStageNode ? aiDrafts[currentStageNode.id] : null;
    const isAiLoading = aiLoadingStage === currentStage;

    const handleSaveEncounter = async () => {
        saveCurrentEdits(); // Commit any pending editor changes

        const { nodes: finalNodes, encounterTitle, locationContext, factionContext } = useEncounterWizardStore.getState();

        if (finalNodes.length === 0 || !encounterTitle.trim()) {
            showSystemMessage('error', 'Cannot save an empty encounter or one without a title.');
            return;
        }

        const now = new Date();
        const newEntries: CompendiumEntry[] = [];
        const encounterId = generateId();

        // Collect all thematic tags safely
        const tagsSet = new Set<string>(['encounter-summary']);
        finalNodes.forEach(n => {
            if (n.thematicTags) {
                n.thematicTags.forEach(t => tagsSet.add(t));
            }
        });

        const parentEntry: CompendiumEntry = {
            id: encounterId,
            category: 'lore',
            title: encounterTitle,
            summary: `A ${finalNodes.length}-stage encounter in ${locationContext || 'an unknown location'}.`,
            content: `A ${finalNodes.length}-stage encounter in ${locationContext || 'an unknown location'}.`,
            fullContent: JSON.stringify({
                title: encounterTitle,
                location: locationContext || '',
                factions: factionContext || [],
                stages: finalNodes.map(n => n.id)
            }),
            tags: Array.from(tagsSet),
            relationships: { connectedEntries: finalNodes.map(n => n.id), mentionedIn: [] },
            visibility: 'dm-only',
            importance: 'major',
            createdAt: now,
            lastModified: now,
        };
        newEntries.push(parentEntry);

        finalNodes.forEach(node => {
            newEntries.push({
                id: node.id,
                category: 'event',
                title: `${encounterTitle}: ${node.stage}`,
                summary: node.narrative.substring(0, 150) + (node.narrative.length > 150 ? '...' : ''),
                content: node.narrative,
                fullContent: JSON.stringify(node),
                tags: ['encounter-scene', node.stage, ...node.thematicTags],
                relationships: { connectedEntries: [encounterId, ...node.continuityRefs], mentionedIn: [] },
                visibility: 'dm-only',
                importance: 'minor',
                createdAt: now,
                lastModified: now,
            });
        });

        addCompendiumEntries(newEntries);

        // 2. Save to Ensemble Workspace (New Persistence Spec)
        try {
            const { EnsembleService } = await import('../../services/ensembleService');
            const { PersistenceMappingService } = await import('../../services/persistenceMappingService');

            const state = useEncounterWizardStore.getState();

            // We can't use saveAppObject directly if we want to customize the metadata path/behavior easily,
            // but for now, we'll just ensure the state includes the parent info and let saveAppObject handle it.
            const encounterPath = await EnsembleService.saveAppObject('narrative-encounter', state, encounterTitle);

            // CROSS-LINK: If this was promoted from a room, update the room file to point here
            if (encounterPath && state.parentNodeId) {
                const roomFile = await EnsembleService.readMarkdown(state.parentNodeId);
                const roomMeta = PersistenceMappingService.deserializeFromMarkdown(roomFile.frontmatter);
                if (roomMeta) {
                    roomMeta.referenced_node = encounterPath;
                    const updatedRoomMd = PersistenceMappingService.serializeToMarkdown(roomMeta);
                    const roomParts = updatedRoomMd.split('---\n');
                    await EnsembleService.writeMarkdown(state.parentNodeId, roomParts[1], roomParts.slice(2).join('---\n').trim());
                }
            }

            showSystemMessage('success', `Encounter "${encounterTitle}" saved and linked to dungeon.`);
        } catch (e) {
            console.error("Failed to save encounter to workspace", e);
            showSystemMessage('success', `Encounter "${encounterTitle}" saved to Compendium (Workspace save failed).`);
        }

        reset();
        setActiveView('compendium');
    };

    const renderControls = () => {
        switch (currentStage) {
            case 'Setup':
                return <EncounterSetupControls />;
            case 'Approach':
                return <EncounterApproachControls />;
            case 'Twist':
                return <EncounterTwistControls />;
            case 'Challenge':
                return <EncounterChallengeControls />;
            case 'Climax':
                return <EncounterClimaxControls />;
            case 'Aftermath':
                return <EncounterAftermathControls />;
            default:
                return null;
        }
    };

    return (
        <GeneratorShell
            header={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Narrative Encounter Designer - Stage: {currentStage}</h2>
                    <button className="primary-button" onClick={handleSaveEncounter} disabled={nodes.length === 0}>
                        Save Encounter
                    </button>
                </div>
            }
            controls={renderControls()}
            procedural={
                <ProceduralPanel>
                    {currentStageNode ? (
                        <EncounterNodeDetail node={currentStageNode} />
                    ) : (
                        <p style={{ fontStyle: 'italic', color: 'var(--medium-brown)', textAlign: 'center', padding: 'var(--space-xl)' }}>
                            Procedural encounter elements will appear here once you provide context and click "Generate".
                        </p>
                    )}
                </ProceduralPanel>
            }
            ai={
                <AIPanel>
                    {isAiLoading && <div className="loader" style={{ margin: 'auto' }}></div>}
                    {!isAiLoading && aiDraft && (
                        <div>
                            <h4>{aiDraft.title}</h4>
                            <p style={{ whiteSpace: 'pre-wrap' }}>{aiDraft.narrative}</p>
                        </div>
                    )}
                    {!isAiLoading && !aiDraft && (
                        <p style={{ fontStyle: 'italic', color: 'var(--medium-brown)', textAlign: 'center', padding: 'var(--space-xl)' }}>
                            After generating a procedural draft, you can enhance it with AI to create a rich narrative description.
                        </p>
                    )}
                </AIPanel>
            }
            editor={
                <FinalEditor>
                    <EncounterEditor />
                </FinalEditor>
            }
        />
    );
};
