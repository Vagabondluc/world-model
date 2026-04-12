
import React, { FC, useState } from 'react';
import { css } from '@emotion/css';
import { useWorkflowStore } from '@/stores/workflowStore';
import { useAdventureDataStore } from '@/stores/adventureDataStore';
import { generateDelve } from '../../../utils/delveGenerator';
import { DelveTheme } from '../../../types/delve';
import { SessionManager } from '../../../services/sessionManager';
import { SimpleRoomCard } from '../delve/SimpleRoomCard';

const styles = {
    container: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-l);
        max-width: 900px;
        margin: 0 auto;
    `,
    header: css`
        text-align: center;
        margin-bottom: var(--space-l);
    `,
    controls: css`
        display: flex;
        gap: var(--space-m);
        align-items: flex-end;
        padding: var(--space-m);
        background: var(--card-bg);
        border: 1px solid var(--border-light);
        border-radius: var(--border-radius);
        
        @media (max-width: 600px) {
            flex-direction: column;
            align-items: stretch;
        }
    `,
    roomList: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-m);
    `,
    actions: css`
        display: flex;
        justify-content: space-between;
        margin-top: var(--space-l);
        padding-top: var(--space-m);
        border-top: 1px solid var(--border-light);
    `
};

export const QuickDelveStep: FC = () => {
    const { setStep } = useWorkflowStore();
    const { activeDelve, setActiveDelve, reset: resetData } = useAdventureDataStore();

    const [theme, setTheme] = useState<DelveTheme>('crypt');
    const [level, setLevel] = useState(1);

    const handleGenerate = () => {
        const delve = generateDelve(theme, level);
        setActiveDelve(delve);
    };

    const handleStartOver = () => {
        resetData();
        setStep('initial');
    };

    const handleExport = () => {
        if (!activeDelve) return;

        let text = `# ${activeDelve.title}\n`;
        text += `Theme: ${activeDelve.theme} | Level: ${activeDelve.level}\n`;
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
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Quick Delve Generator</h2>
                <p>Create a linear 5-room dungeon instantly.</p>
            </div>

            {!activeDelve && (
                <div className={styles.controls}>
                    <div style={{ flex: 1 }}>
                        <label>Theme</label>
                        <select value={theme} onChange={e => setTheme(e.target.value as DelveTheme)} style={{ marginBottom: 0 }}>
                            <option value="crypt">Crypt</option>
                            <option value="ruin">Ruin</option>
                            <option value="cavern">Cavern</option>
                            <option value="tower">Tower</option>
                            <option value="sewer">Sewer</option>
                        </select>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label>Party Level ({level})</label>
                        <input
                            type="range"
                            min="1" max="20"
                            value={level}
                            onChange={e => setLevel(parseInt(e.target.value))}
                            style={{ marginBottom: 0 }}
                        />
                    </div>
                    <button className="primary-button" onClick={handleGenerate}>Generate Delve</button>
                </div>
            )}

            {activeDelve && (
                <>
                    <div className={styles.roomList}>
                        <div style={{ textAlign: 'center', marginBottom: 'var(--space-m)' }}>
                            <h3 style={{ margin: 0 }}>{activeDelve.title}</h3>
                            {activeDelve.seed && <small style={{ color: 'var(--medium-brown)', userSelect: 'all' }}>Seed: {activeDelve.seed}</small>}
                        </div>

                        {activeDelve.rooms.map((room, i) => (
                            <SimpleRoomCard key={room.id} room={room} index={i} />
                        ))}
                    </div>

                    <div className={styles.actions}>
                        <button className="secondary-button" onClick={() => setActiveDelve(null)}>Back</button>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="secondary-button" onClick={handleExport}>Export to Text</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
