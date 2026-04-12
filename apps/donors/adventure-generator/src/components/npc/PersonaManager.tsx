import React, { FC } from 'react';
import { css } from '@emotion/css';
import { theme } from '../../styles/theme';
import { Wand2, RefreshCcw, User, Scroll, Shield } from 'lucide-react';
import { NpcPersona } from '../../types/npc';

interface PersonaManagerProps {
    data: NpcPersona;
    onChange: (data: Partial<NpcPersona>) => void;
}

const styles = {
    container: css`
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing.m};
        padding: ${theme.spacing.m};
        border-right: 1px solid ${theme.borders.light};
    `,
    sectionTitle: css`
        font-family: ${theme.fonts.header};
        font-size: 0.9rem;
        font-weight: bold;
        color: ${theme.colors.textMuted};
        text-transform: uppercase;
        margin-bottom: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `,
    inputGroup: css`
        display: flex;
        flex-direction: column;
        gap: 8px;
    `,
    label: css`
        font-size: 0.8rem;
        font-weight: bold;
        color: ${theme.colors.textMuted};
    `,
    input: css`
        padding: 8px;
        border: 1px solid ${theme.borders.light};
        border-radius: 4px;
        font-family: ${theme.fonts.body};
        width: 100%;
        &:focus { border-color: ${theme.colors.accent}; outline: none; }
    `,
    rollIcon: css`
        cursor: pointer;
        color: ${theme.colors.accent};
        &:hover { opacity: 0.8; }
    `
};

export const PersonaManager: FC<PersonaManagerProps> = ({ data, onChange }) => {

    const handleRoll = (field: string) => {
        // Mock roll logic
        const mockValues: Record<string, string[]> = {
            archetype: ['The Reluctant Hero', 'The Cynical Scholar', 'The Jolly Merchant', 'The Haunted Veteran'],
            motivation: ['Redemption', 'Greed', 'Knowledge', 'Protecting a Secret'],
            quirk: ['Always whistles', 'Counts coins compulsively', 'Refuses to look at hands', 'Speaks in third person'],
            flaw: ['Arrogant', 'Easily spooked', 'Obsessive', 'Vengeful']
        };

        const possible = mockValues[field];
        if (possible) {
            const random = possible[Math.floor(Math.random() * possible.length)];
            onChange({ [field]: random });
        }
    };

    const handleQuickPersona = () => {
        onChange({
            archetype: 'The Skeptical Alchemist',
            motivation: 'Discovering immortality',
            quirk: 'Sniffs everything',
            flaw: 'Phobia of mice'
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.sectionTitle}>
                NPC Identity
                <button className="secondary-button" style={{ padding: '2px 8px', fontSize: '0.7rem' }} onClick={handleQuickPersona}>
                    <Wand2 size={12} style={{ marginRight: '4px' }} />
                    Quick Persona
                </button>
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Name</label>
                <input
                    className={styles.input}
                    value={data.name}
                    onChange={(e) => onChange({ name: e.target.value })}
                />
            </div>

            <div className={styles.inputGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label className={styles.label}>Race / Ancestry</label>
                </div>
                <input
                    className={styles.input}
                    value={data.race || ''}
                    onChange={(e) => onChange({ race: e.target.value })}
                    placeholder="e.g. Elf, Dwarf, Human"
                />
            </div>

            <div className={styles.inputGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label className={styles.label}>Role / Profession</label>
                </div>
                <input
                    className={styles.input}
                    value={data.role || ''}
                    onChange={(e) => onChange({ role: e.target.value })}
                    placeholder="e.g. Blacksmith, Guard"
                />
            </div>

            <div className={styles.inputGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label className={styles.label}>Alignment</label>
                </div>
                <input
                    className={styles.input}
                    value={data.alignment || ''}
                    onChange={(e) => onChange({ alignment: e.target.value })}
                    placeholder="e.g. Chaotic Good"
                />
            </div>

            <div className={styles.inputGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label className={styles.label}>Archetype</label>
                    <RefreshCcw size={12} className={styles.rollIcon} onClick={() => handleRoll('archetype')} />
                </div>
                <input
                    className={styles.input}
                    value={data.archetype}
                    onChange={(e) => onChange({ archetype: e.target.value })}
                    placeholder="e.g. Master Thief"
                />
            </div>

            <div className={styles.inputGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label className={styles.label}>Motivation</label>
                    <RefreshCcw size={12} className={styles.rollIcon} onClick={() => handleRoll('motivation')} />
                </div>
                <input
                    className={styles.input}
                    value={data.motivation}
                    onChange={(e) => onChange({ motivation: e.target.value })}
                    placeholder="e.g. Seeking Revenge"
                />
            </div>

            <div className={styles.inputGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label className={styles.label}>Defining Quirk</label>
                    <RefreshCcw size={12} className={styles.rollIcon} onClick={() => handleRoll('quirk')} />
                </div>
                <input
                    className={styles.input}
                    value={data.quirk}
                    onChange={(e) => onChange({ quirk: e.target.value })}
                    placeholder="e.g. Constant fidgeting"
                />
            </div>

            <div className={styles.inputGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label className={styles.label}>Signature Flaw</label>
                    <RefreshCcw size={12} className={styles.rollIcon} onClick={() => handleRoll('flaw')} />
                </div>
                <input
                    className={styles.input}
                    value={data.flaw}
                    onChange={(e) => onChange({ flaw: e.target.value })}
                    placeholder="e.g. Gullible"
                />
            </div>
        </div>
    );
};
