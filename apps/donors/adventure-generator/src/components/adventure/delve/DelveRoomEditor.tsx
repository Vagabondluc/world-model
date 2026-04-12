
import React, { FC, useState, useEffect, useCallback } from 'react';
import { css } from '@emotion/css';
import { DelveSceneNode } from '../../../types/delve';
import { GeneratorShell } from '../framework/GeneratorShell';
import { ProceduralPanel } from '../framework/ProceduralPanel';
import { FinalEditor } from '../framework/FinalEditor';
import { AIPanel } from '../framework/AIPanel';
import { DelveRoomControls } from './DelveRoomControls';
import { DelveRoomDetail } from './DelveRoomDetail';
import { useAdventureDataStore } from '@/stores/adventureDataStore';
import { generateDelveSceneNode, getDifficultyTier } from '../../../utils/delveGenerator';
import { SeededRNG } from '../../../utils/seededRng';
import { useAppContext } from '../../../context/AppContext';
import { useCampaignStore } from '@/stores/campaignStore';
import { CONFIG } from '../../../data/constants';

const styles = {
    editorLayout: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-m);
    `,
    editorActions: css`
        display: flex;
        gap: var(--space-m);
        justify-content: flex-start;
        align-items: center;
        margin-bottom: var(--space-m);
    `,
    textarea: css`
        width: 100%;
        min-height: 120px;
        resize: vertical;
    `,
    navActions: css`
        display: flex;
        justify-content: space-between;
        margin-top: var(--space-m);
    `
};

interface DelveRoomEditorProps {
    room: DelveSceneNode;
    stageIndex: number;
    totalStages: number;
    onNext: () => void;
    onPrev: () => void;
    onFinish: () => void;
}

export const DelveRoomEditor: FC<DelveRoomEditorProps> = ({ room, stageIndex, totalStages, onNext, onPrev, onFinish }) => {
    const { apiService } = useAppContext();
    const campaignConfig = useCampaignStore(s => s.config);
    const { activeDelve, updateDelveRoom } = useAdventureDataStore();
    const isLastStage = stageIndex === totalStages;
    const [editedNarrative, setEditedNarrative] = useState(room.narrative);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiDraft, setAiDraft] = useState<string | null>(null);

    // Reset editor text when the room prop changes
    useEffect(() => {
        setEditedNarrative(room.narrative);
        setAiDraft(null);
    }, [room]);

    const handleRegenerate = useCallback(() => {
        if (!activeDelve) return;

        const { theme, level, concept } = activeDelve;
        const tier = getDifficultyTier(level);
        const rng = new SeededRNG(crypto.randomUUID());
        const newNode = generateDelveSceneNode(room.stage, theme, level, tier, rng, concept?.tags || []);

        const titlePrefixMatch = room.title.match(/^(Room \d+: )/);
        const newTitle = titlePrefixMatch ? `${titlePrefixMatch[0]}${newNode.title}` : newNode.title;

        const updatedNode = { ...newNode, id: room.id, title: newTitle };
        updateDelveRoom(updatedNode);
    }, [activeDelve, room, updateDelveRoom]);

    const handleUseProcedural = () => {
        setEditedNarrative(room.narrative);
    };

    const handleUseAI = async () => {
        if (!apiService || !activeDelve) return;
        setAiLoading(true);
        setAiDraft('Generating...');
        try {
            const prompt = `Rewrite this dungeon room description to be more immersive and detailed.
Theme: ${activeDelve.theme}
Title: ${room.title}
Current Description: ${room.narrative}
Sensory Details: ${room.sensory.sound}, ${room.sensory.smell}
Features: ${room.features.join(', ')}
Tone: Dark, Atmospheric, Fantasy.`;

            const response = await apiService.generateTextContent(prompt, campaignConfig.aiModel || CONFIG.AI_MODEL);
            setAiDraft(response);
            setEditedNarrative(response);
        } catch (e) {
            console.error(e);
            setAiDraft("Failed to generate AI draft. Check API configuration.");
        } finally {
            setAiLoading(false);
        }
    };

    const handleNext = () => {
        const updatedNode = { ...room, narrative: editedNarrative };
        updateDelveRoom(updatedNode);
        onNext();
    };

    const handleFinish = () => {
        const updatedNode = { ...room, narrative: editedNarrative };
        updateDelveRoom(updatedNode);
        onFinish();
    };

    return (
        <GeneratorShell
            header={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Quick Delve - Room {stageIndex}: {room.stage.charAt(0).toUpperCase() + room.stage.slice(1)}</h2>
                </div>
            }
            controls={
                <DelveRoomControls room={room} onRegenerate={handleRegenerate} />
            }
            procedural={
                <ProceduralPanel>
                    <DelveRoomDetail room={room} />
                </ProceduralPanel>
            }
            ai={
                <AIPanel>
                    {aiLoading && aiDraft === 'Generating...' && <div className="loader center" style={{ margin: 'var(--space-xl) auto' }}></div>}
                    {aiDraft && <p>{aiDraft}</p>}
                    {!aiDraft &&
                        <p style={{ fontStyle: 'italic', color: 'var(--medium-brown)', textAlign: 'center', padding: 'var(--space-xl)' }}>
                            AI enhancements for this room will be available here.
                        </p>
                    }
                </AIPanel>
            }
            editor={
                <FinalEditor>
                    <div className={styles.editorLayout}>
                        <div className={styles.editorActions}>
                            <span>Seed editor with:</span>
                            <button className="secondary-button" style={{ fontSize: '0.9rem' }} onClick={handleUseProcedural}>Procedural Draft</button>
                            <button
                                className="secondary-button"
                                style={{ fontSize: '0.9rem' }}
                                onClick={handleUseAI}
                                disabled={aiLoading || !apiService}
                            >
                                {aiLoading ? <><span className="loader"></span> Generating...</> : '✨ AI Draft'}
                            </button>
                            <div style={{ flex: 1 }} />
                            <button
                                className="action-button"
                                style={{ background: 'var(--dnd-red)', fontSize: '0.9rem' }}
                                onClick={() => {
                                    const { initializeFromRoom } = require('../../../stores/encounterWizardStore').useEncounterWizardStore.getState();
                                    initializeFromRoom(room, activeDelve?.id || '');
                                    useCampaignStore.getState().setActiveView('encounter-designer');
                                }}
                            >
                                ⚔️ Promote to Narrative Encounter
                            </button>
                        </div>
                        <textarea
                            className={styles.textarea}
                            value={editedNarrative}
                            onChange={(e) => setEditedNarrative(e.target.value)}
                            aria-label="Room narrative editor"
                        />
                        <div className={styles.navActions}>
                            <div style={{ display: 'flex', gap: 'var(--space-s)' }}>
                                <button className="secondary-button" onClick={onFinish}>Back to Hub</button>
                                <button className="secondary-button" onClick={onPrev} disabled={stageIndex <= 1}>
                                    ← Previous Room
                                </button>
                            </div>
                            {isLastStage ? (
                                <button className="primary-button" onClick={handleFinish}>
                                    Finish & Save Delve
                                </button>
                            ) : (
                                <button className="primary-button" onClick={handleNext}>
                                    Save & Continue →
                                </button>
                            )}
                        </div>
                    </div>
                </FinalEditor>
            }
        />
    );
};
