import React, { FC, useState } from 'react';
import { css } from '@emotion/css';
import { NarrativeCard } from '../narrative-kit/NarrativeCard';
import { NarrativeHeader } from '../narrative-kit/NarrativeHeader';
import { PersonaManager } from './PersonaManager';
import { theme } from '../../styles/theme';
import { aiManager } from '../../services/ai/aiManager';
import { proceduralNpcService } from '../../services/procedural/proceduralNpcService';
import { NpcPersona } from '../../types/npc';
import { z } from 'zod';

// --- Data Models ---
const DEFAULT_NPC: NpcPersona = {
    name: 'New NPC',
    race: '',
    role: '',
    alignment: '',
    appearance: '',
    motivations: '',
    personalityTraits: '',
    flaws: '',
    catchphrase: '',
    mannerisms: '',
    speechPatterns: '',
    knowledgeAvailable: '',
    knowledgeSecret: '',
    bonds: '',
    roleplayingCues: [],
    backstory: '',
    detailedPersonality: '',
    archetype: '',
    motivation: '',
    quirk: '',
    flaw: ''
};

const styles = {
    container: css`
        padding: 20px;
        background: ${theme.colors.viewBg};
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: flex-start;
    `,
    layout: css`
        display: grid;
        grid-template-columns: 350px 1fr;
        gap: ${theme.spacing.l};
        width: 100%;
        max-width: 98%;
        @media (max-width: 1100px) {
            grid-template-columns: 1fr;
        }
    `,
    column: css`
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing.m};
    `,
    // -- UI Components for Ledger Layout --
    ledgerCard: css`
        background: ${theme.colors.contentBoxBg};
        border-radius: 8px;
        border: 1px solid ${theme.borders.light};
        padding: ${theme.spacing.m};
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    `,
    dataGrid: css`
        display: grid;
        grid-template-columns: 110px 1fr;
        gap: 8px 16px;
        font-size: 0.95rem;
        
        strong {
            color: ${theme.colors.textMuted};
            text-transform: uppercase;
            font-size: 0.8rem;
            align-self: center;
        }
        span {
            color: ${theme.colors.text};
            font-family: ${theme.fonts.body};
        }
    `,
    sectionTitle: css`
        font-family: ${theme.fonts.header};
        color: ${theme.colors.accent};
        margin: 0 0 ${theme.spacing.s} 0;
        border-bottom: 2px solid ${theme.colors.accent};
        padding-bottom: 4px;
        font-size: 1.2rem;
    `,
    proseBlock: css`
        font-family: ${theme.fonts.body};
        line-height: 1.6;
        white-space: pre-wrap;
        color: ${theme.colors.text};
        
        p { margin-bottom: 1em; }
    `,
    roleplayBox: css`
        background: ${theme.colors.card}; 
        border-left: 4px solid ${theme.colors.accent};
        padding: ${theme.spacing.m};
        border-radius: 0 4px 4px 0;
    `
};

interface ChroniclerViewProps {
    onBack?: () => void;
}

export const ChroniclerView: FC<ChroniclerViewProps> = ({ onBack }) => {
    const [npcData, setNpcData] = useState<NpcPersona>(DEFAULT_NPC);
    const [loading, setLoading] = useState(false);

    const handleGenerateFull = async () => {
        setLoading(true);
        try {
            // Updated Prompt using the exact Script V1 text as instruction
            const systemPrompt = `
                Create a unique NPC for a D&D campaign. As a professional creative writer, your task is to develop a well-rounded, detailed, and comprehensive personality that fits within D&D's alignment framework. The character should be a unique blend of traits, styles, and mannerisms, but avoid direct references to existing characters.

                The NPC should be designed for easy roleplaying by a gamemaster. The table should provide a quick reference, while the text block expands on the character's backstory and personality. Use explicit language and provide in-depth details to create a vivid and engaging character.
                
                Current Context: Name: ${npcData.name}, Role: ${npcData.role || 'Any'}
            `;

            const schema = z.object({
                // Table Data
                name: z.string().describe("NPC Name"),
                race: z.string().describe("NPC Race"),
                role: z.string().describe("Profession / Role"),
                alignment: z.string().describe("D&D Alignment"),
                appearance: z.string().describe("Brief physical description"),
                motivations: z.string().describe("One-line summary of goals"),
                personalityTraits: z.string().describe("One-line summary of traits"),
                flaws: z.string().describe("Key flaws or weaknesses"),
                catchphrase: z.string().describe("Short catch phrase or slang"),
                mannerisms: z.string().describe("Notable habits or behaviors"),
                speechPatterns: z.string().describe("Speech patterns or style"),
                knowledgeAvailable: z.string().describe("Knowledge readily shared"),
                knowledgeSecret: z.string().describe("Hidden/Secret knowledge"),
                bonds: z.string().describe("Important relationships"),
                roleplayingCues: z.array(z.string()).describe("List of cues (e.g., 'Speaks slowly')"),

                // Narrative Blocks
                backstory: z.string().describe("Concise backstory, expanding on table details."),
                detailedPersonality: z.string().describe("Detailed breakdown: Motivations, Morals, Personality, Flaws.")
            });

            const result = await aiManager.generateStructured(systemPrompt, schema);
            setNpcData(prev => ({ ...prev, ...result }));
        } catch (e) {
            console.warn("AI Generation failed, falling back to procedural generation...", e);
            // Fallback: Generate procedurally based on current inputs
            const proceduralData = proceduralNpcService.generate(npcData);
            setNpcData(prev => ({ ...prev, ...proceduralData }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <NarrativeCard variant="default">
                <NarrativeHeader
                    title="NPC Chronicler"
                    subtitle="Script V1 Implementation"
                    onAiFastFill={handleGenerateFull}
                    isLoading={loading}
                    onBack={onBack}
                />

                <div className={styles.layout}>
                    {/* LEFT COLUMN: Quick Reference & Identity */}
                    <div className={styles.column}>
                        {/* 1. Identity Card */}
                        <div className={styles.ledgerCard}>
                            <h3 className={styles.sectionTitle}>Identity</h3>
                            <PersonaManager
                                data={npcData}
                                onChange={(d) => setNpcData({ ...npcData, ...d })}
                            />

                            <div className={css`margin-top: 16px; border-top: 1px solid ${theme.borders.light}; padding-top: 16px;`}>
                                <div className={styles.dataGrid}>
                                    <strong>Race</strong> <span>{npcData.race || "—"}</span>
                                    <strong>Role</strong> <span>{npcData.role || "—"}</span>
                                    <strong>Alignment</strong> <span>{npcData.alignment || "—"}</span>
                                    <strong>Appearance</strong> <span>{npcData.appearance || "—"}</span>
                                </div>
                            </div>
                        </div>

                        {/* 2. Roleplay Cues */}
                        <div className={styles.ledgerCard}>
                            <h3 className={styles.sectionTitle}>Roleplay Cues</h3>
                            <div className={styles.roleplayBox}>
                                <p><strong>Speech:</strong> {npcData.speechPatterns || "—"}</p>
                                <p><strong>Mannerism:</strong> {npcData.mannerisms || "—"}</p>
                                <p><strong>Catchphrase:</strong> <em>"{npcData.catchphrase || "—"}"</em></p>
                                <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                                    {npcData.roleplayingCues && npcData.roleplayingCues.map((cue, i) => (
                                        <li key={i}>{cue}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* 3. Secrets & Bonds */}
                        <div className={styles.ledgerCard}>
                            <h3 className={styles.sectionTitle}>Knowledge & Bonds</h3>
                            <p><strong>Open Knowledge:</strong> {npcData.knowledgeAvailable || "—"}</p>
                            <div className={css`background: rgba(0,0,0,0.05); padding: 8px; border-radius: 4px; margin: 8px 0;`}>
                                <p><strong>Secret Knowledge:</strong> {npcData.knowledgeSecret || "—"}</p>
                            </div>
                            <p><strong>Bonds:</strong> {npcData.bonds || "—"}</p>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: The Chronicle (Narrative) */}
                    <div className={styles.column}>
                        {/* Backstory */}
                        <div className={styles.ledgerCard}>
                            <h3 className={styles.sectionTitle}>The Backstory</h3>
                            <div className={styles.proseBlock}>
                                {npcData.backstory ? npcData.backstory : <em style={{ color: theme.colors.textMuted }}>Generate an NPC to read their history...</em>}
                            </div>
                        </div>

                        {/* Detailed Personality */}
                        <div className={styles.ledgerCard}>
                            <h3 className={styles.sectionTitle}>Psychological Profile</h3>

                            <div className={styles.dataGrid} style={{ marginBottom: '16px' }}>
                                <strong>Motivation</strong> <span>{npcData.motivations || "—"}</span>
                                <strong>Traits</strong> <span>{npcData.personalityTraits || "—"}</span>
                                <strong>Flaws</strong> <span>{npcData.flaws || "—"}</span>
                            </div>

                            <div className={styles.proseBlock}>
                                {npcData.detailedPersonality ? npcData.detailedPersonality : <em style={{ color: theme.colors.textMuted }}>Deep psychological analysis pending...</em>}
                            </div>
                        </div>
                    </div>
                </div>
            </NarrativeCard>
        </div>
    );
};
