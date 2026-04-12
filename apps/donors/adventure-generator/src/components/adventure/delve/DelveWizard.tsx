
import React, { FC, useState } from 'react';
import { css } from '@emotion/css';
import { useWorkflowStore } from '@/stores/workflowStore';
import { useAdventureDataStore } from '@/stores/adventureDataStore';
import { generateDelve } from '../../../utils/delveGenerator';
import { generateDelveConcepts } from '../../../utils/delve/conceptGenerator';
import { DelveTheme, DelveConcept } from '../../../types/delve';
import { SessionManager } from '../../../services/sessionManager';
import { GeneratorShell } from '../framework/GeneratorShell';
import { ProceduralPanel } from '../framework/ProceduralPanel';
import { GeneratorControls } from '../framework/GeneratorControls';
import { DelveConceptSelector } from './DelveConceptSelector';
import { DelveHub } from './DelveHub';
import { DelveRoomEditor } from './DelveRoomEditor';

const styles = {
    setupContainer: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-l);
        padding: var(--space-l);
    `,
    formGroup: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-s);
    `,
    actions: css`
        display: flex;
        justify-content: space-between;
        align-items: center;
    `
};

export const DelveWizard: FC = () => {
    const { setStep } = useWorkflowStore();
    const {
        activeDelve, setActiveDelve,
        delveView, setDelveView,
        currentConcepts, setCurrentConcepts,
        activeRoomId, setActiveRoomId,
        reset: resetData
    } = useAdventureDataStore();

    // Local state for setup
    const [theme, setTheme] = useState<DelveTheme>('crypt');
    const [level, setLevel] = useState(5);

    const handleGenerateConcepts = () => {
        const concepts = generateDelveConcepts(theme);
        setCurrentConcepts(concepts);
        setDelveView('concepts');
    };

    const handleSelectConcept = (concept: DelveConcept) => {
        const delve = generateDelve(concept, level);
        setActiveDelve(delve);
        setDelveView('hub');
    };

    const handleEnterRoom = (roomId: string) => {
        setActiveRoomId(roomId);
        setDelveView('room-editor');
    };

    const handleRoomNext = () => {
        if (!activeDelve || !activeRoomId) return;
        const currentIndex = activeDelve.rooms.findIndex(r => r.id === activeRoomId);
        if (currentIndex < activeDelve.rooms.length - 1) {
            setActiveRoomId(activeDelve.rooms[currentIndex + 1].id);
        } else {
            setDelveView('hub');
            setActiveRoomId(null);
        }
    };

    const handleRoomPrev = () => {
        if (!activeDelve || !activeRoomId) return;
        const currentIndex = activeDelve.rooms.findIndex(r => r.id === activeRoomId);
        if (currentIndex > 0) {
            setActiveRoomId(activeDelve.rooms[currentIndex - 1].id);
        } else {
            setDelveView('hub');
            setActiveRoomId(null);
        }
    };

    const handleFinishDelve = () => {
        setDelveView('hub');
        setActiveRoomId(null);
    };

    const handleExport = async () => {
        if (!activeDelve) return;

        // 1. Standard Markdown Export (Existing Logic)
        let text = `# ${activeDelve.title}\n`;
        text += `Theme: ${activeDelve.theme} | Level: ${activeDelve.level}\n`;
        if (activeDelve.concept) {
            text += `Concept: ${activeDelve.concept.description}\n`;
        }
        if (activeDelve.seed) {
            text += `Seed: ${activeDelve.seed}\n\n`;
        } else {
            text += `\n`;
        }

        activeDelve.rooms.forEach(room => {
            text += `## ${room.title}\n`;
            text += `> ${room.narrative}\n`;
            if (room.sensory) text += `*${Object.values(room.sensory).join(' ')}*\n\n`;
            if (room.features.length > 0) text += `Features: ${room.features.join(', ')}\n`;
            if (room.mechanics.encounter) text += `Encounter: ${room.mechanics.encounter.monsters.join(', ')} (${room.mechanics.encounter.difficulty})\n`;
            if (room.mechanics.trap) text += `Trap: ${room.mechanics.trap.trigger} -> ${room.mechanics.trap.effect} (DC ${room.mechanics.trap.dc})\n`;
            if (room.mechanics.treasure) text += `Treasure: ${room.mechanics.treasure.join(', ')}\n`;
            text += `\n`;
        });

        SessionManager.saveMarkdownFile(text, `${activeDelve.title.replace(/\s+/g, '_')}.md`);

        // 2. Save to Ensemble Workspace (New Persistence Spec)
        try {
            const { EnsembleService } = await import('../../../services/ensembleService');
            await EnsembleService.saveAppObject('quick-delve', activeDelve, activeDelve.title);
            // We don't necessarily need an extra system message if standard export worked, 
            // but it helps confirm the workspace save.
        } catch (e) {
            console.error("Failed to save delve to workspace", e);
        }
    };

    const handleExit = () => {
        resetData();
        setStep('initial');
    };

    // Render Setup View
    if (delveView === 'setup') {
        return (
            <GeneratorShell
                header={<h2>Quick Delve: Setup</h2>}
                controls={
                    <GeneratorControls>
                        <div className={styles.setupContainer}>
                            <div className={styles.formGroup}>
                                <label>Theme</label>
                                <select value={theme} onChange={e => setTheme(e.target.value as DelveTheme)}>
                                    <option value="crypt">Crypt</option>
                                    <option value="ruin">Ruin</option>
                                    <option value="cavern">Cavern</option>
                                    <option value="tower">Tower</option>
                                    <option value="sewer">Sewer</option>
                                    <option value="haunted_mansion">Haunted Mansion</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Party Level ({level})</label>
                                <input
                                    type="range"
                                    min="1" max="20"
                                    value={level}
                                    onChange={e => setLevel(parseInt(e.target.value))}
                                />
                            </div>
                            <div style={{ marginTop: 'auto' }}>
                                <button className="primary-button" style={{ width: '100%' }} onClick={handleGenerateConcepts}>
                                    Generate Concepts →
                                </button>
                            </div>
                        </div>
                    </GeneratorControls>
                }
                procedural={
                    <ProceduralPanel>
                        <div style={{ padding: 'var(--space-xl)', textAlign: 'center', color: 'var(--medium-brown)' }}>
                            <p>Select a theme and level to generate concept hooks for your dungeon.</p>
                        </div>
                    </ProceduralPanel>
                }
                editor={<div />} // Empty footer
            />
        );
    }

    // Render Concepts View
    if (delveView === 'concepts') {
        return (
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-l)' }}>
                <div className={styles.actions}>
                    <button className="secondary-button" onClick={() => setDelveView('setup')}>← Back</button>
                    <h2>Select a Concept</h2>
                    <div style={{ width: '80px' }}></div>
                </div>
                <DelveConceptSelector
                    concepts={currentConcepts}
                    onSelect={handleSelectConcept}
                />
            </div>
        );
    }

    // Render Hub View
    if (delveView === 'hub' && activeDelve) {
        return (
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'var(--space-l)' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-l)' }}>
                    <h2 style={{ margin: 0 }}>{activeDelve.title}</h2>
                    <p style={{ color: 'var(--medium-brown)' }}>{activeDelve.concept?.description}</p>
                </div>

                <DelveHub
                    delve={activeDelve}
                    onSelectRoom={handleEnterRoom}
                />

                <div className={styles.actions} style={{ marginTop: 'var(--space-xl)', borderTop: '1px solid var(--border-light)', paddingTop: 'var(--space-m)' }}>
                    <button className="secondary-button" onClick={handleExit}>Exit Generator</button>
                    <button className="primary-button" onClick={handleExport}>Export to Text</button>
                </div>
            </div>
        );
    }

    // Render Room Editor View
    if (delveView === 'room-editor' && activeDelve && activeRoomId) {
        const room = activeDelve.rooms.find(r => r.id === activeRoomId);
        const index = activeDelve.rooms.findIndex(r => r.id === activeRoomId);

        if (room) {
            return (
                <DelveRoomEditor
                    room={room}
                    stageIndex={index + 1}
                    totalStages={activeDelve.rooms.length}
                    onNext={handleRoomNext}
                    onPrev={handleRoomPrev}
                    onFinish={handleFinishDelve}
                />
            );
        }
    }

    return <div>Error: Invalid State</div>;
};
