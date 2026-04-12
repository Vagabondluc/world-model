
import React, { FC, useState, memo, useMemo } from 'react';
import { css } from '@emotion/css';
import { MinorNpcDetails, MajorNpcDetails, CreatureDetails, NpcDetails } from '../../../types/npc';
import { CREATURE_ROLES } from '../../../data/constants';
import { DetailViewLayout } from '../../common/DetailViewLayout';
import { Statblock } from '../../common/Statblock';
import { Badge } from '../../common/Badge';
import { renderMonsterStatblock } from '../../../utils/statblockRenderer';
import { marked } from 'marked';
import { useCompendiumStore } from '@/stores/compendiumStore';
import { useWorkflowStore } from '@/stores/workflowStore';
import { useAppContext } from '../../../context/AppContext';
import { ChatInterface } from '../../ai/ChatInterface';
import { EntityImage } from '../../ai/EntityImage';
import { sanitizeHtml } from '../../../utils/sanitizeHtml';

interface NpcDetailViewProps {
    id: string;
}

const styles = {
    roleSelectorContainer: css`
        margin-bottom: var(--space-m);
    `,
    roleSelector: css`
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: var(--space-s);
        margin-top: var(--space-s);
    `,
    roleOption: css`
        background: var(--parchment-bg);
        padding: var(--space-s);
        border-radius: var(--border-radius);
        border: 1px solid var(--border-light);

        small { display: block; color: var(--medium-brown); line-height: 1.2; margin-top: 4px; }
    `,
    statblockControls: css`
        margin-top: var(--space-xl);
        padding-top: var(--space-l);
        border-top: 2px dashed var(--medium-brown);
    `,
    detailTable: css`
        width: 100%;
        border-collapse: collapse;
        font-size: 0.95rem;
        margin-bottom: var(--space-l);

        td {
            padding: var(--space-s);
            border-bottom: 1px solid var(--border-light);
        }
        td:first-child {
            background: rgba(0,0,0,0.03);
            width: 35%;
            color: var(--dark-brown);
        }
    `
};

const NpcDetailViewFC: FC<NpcDetailViewProps> = ({ id }) => {
    const { apiService } = useAppContext();
    const entry = useCompendiumStore(state => state.compendiumEntries.find(e => e.id === id));
    const updateCompendiumEntry = useCompendiumStore(state => state.updateCompendiumEntry);

    const { loading, developNpc, setDetailingEntity } = useWorkflowStore(state => ({
        loading: state.loading,
        developNpc: state.developNpc,
        setDetailingEntity: state.setDetailingEntity
    }));

    const [creatureRole, setCreatureRole] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false);

    const details: NpcDetails | null = useMemo(() => {
        if (!entry || !entry.fullContent || entry.fullContent === '{}') return null;
        try {
            return JSON.parse(entry.fullContent);
        } catch (e) {
            console.error("Failed to parse NPC details:", e);
            return null;
        }
    }, [entry]);

    const creatureDetails = details && entry?.tags[0] === 'Creature' ? details as CreatureDetails : null;
    const creatureAbilitiesHtml = useMemo(() => {
        if (!creatureDetails) return '';
        const raw = marked.parse(creatureDetails.abilitiesAndTraits);
        return sanitizeHtml(typeof raw === 'string' ? raw : '', { allowBasicFormatting: true });
    }, [creatureDetails]);
    const creatureActionsHtml = useMemo(() => {
        if (!creatureDetails) return '';
        const raw = marked.parse(creatureDetails.actions);
        return sanitizeHtml(typeof raw === 'string' ? raw : '', { allowBasicFormatting: true });
    }, [creatureDetails]);

    const onBack = () => setDetailingEntity(null);
    const onGenerateDetails = (ctx: string) => developNpc(apiService!, id, ctx, { creatureRole });
    const onSave = (npcId: string) => console.log("Saving NPC as Markdown:", npcId);

    const handleImageUpdate = (url: string) => {
        if (entry && details) {
            const updatedDetails = { ...details, imageUrl: url };
            updateCompendiumEntry({ ...entry, fullContent: JSON.stringify(updatedDetails), lastModified: new Date() });
        }
    };

    const initialImageUrl = details && typeof (details as { imageUrl?: unknown }).imageUrl === 'string'
        ? (details as { imageUrl?: string }).imageUrl
        : undefined;

    if (!entry) return <div>NPC not found.</div>;
    const isGeneratingDetails = loading.details?.type === 'npc' && loading.details?.id === entry.id;
    const npcType = entry.tags[0] || 'Minor';

    const additionalControls = npcType === 'Creature' && !details ? (
        <div className={styles.roleSelectorContainer}>
            <h4>Creature Role</h4>
            <div className={styles.roleSelector}>
                {CREATURE_ROLES.map(role => (
                    <label key={role.value} className={`custom-radio ${styles.roleOption}`}>
                        <input type="radio" name="creatureRole" value={role.value} checked={creatureRole === role.value} onChange={() => setCreatureRole(role.value)} />
                        <span className="radio-checkmark"></span>
                        <div><span>{role.name}</span><small>{role.description}</small></div>
                    </label>
                ))}
            </div>
        </div>
    ) : null;

    const statblockFooter = details && npcType === 'Creature' ? (
        <div className={styles.statblockControls}>
            <h4>Statblock</h4>
            <Statblock html={renderMonsterStatblock({ id: entry.id, name: entry.title, profile: details as CreatureDetails })} />
        </div>
    ) : null;

    return (
        <DetailViewLayout
            title={<>{entry.title} <Badge entityType="npc" subType={npcType} style={{ marginLeft: 'var(--space-s)' }}>{npcType}</Badge></>}
            summaryLabel="Summary"
            summary={entry.summary}
            hasDetails={!!details}
            onBack={onBack}
            onGenerate={onGenerateDetails}
            isLoading={isGeneratingDetails || false}
            headerActions={details && (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="secondary-button" onClick={() => setIsChatOpen(true)} title="Chat with this NPC">💬 Chat</button>
                    <button className="action-button" onClick={() => onSave(entry.id)}>Save as MD</button>
                </div>
            )}
            additionalControls={additionalControls}
            footer={statblockFooter}
            origin={entry.origin}
        >
            {details && (
                <>
                    <EntityImage
                        entityName={entry.title}
                        description={entry.summary}
                        type="npc"
                        initialImageUrl={initialImageUrl}
                        onImageGenerated={handleImageUpdate}
                    />

                    {npcType === 'Minor' && ((details as MinorNpcDetails) && (<></>))}
                    {(npcType === 'Major' || npcType === 'Antagonist') && ((details as MajorNpcDetails) && (<></>))}
                    {npcType === 'Creature' && (
                        <>
                            <div><h4>Reference Table</h4>
                                <table className={styles.detailTable}><tbody>
                                    {Object.entries((details as CreatureDetails).table).map(([key, value]) => (
                                        <tr key={key}><td><strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</strong></td><td>{String(value)}</td></tr>
                                    ))}
                                </tbody></table>
                            </div>
                            <div><h4>Abilities & Traits</h4><div dangerouslySetInnerHTML={{ __html: creatureAbilitiesHtml }}></div></div>
                            <div><h4>Actions</h4><div dangerouslySetInnerHTML={{ __html: creatureActionsHtml }}></div></div>
                            <div><h4>Roleplaying & Tactics</h4><p>{(details as CreatureDetails).roleplayingAndTactics}</p></div>
                        </>
                    )}
                </>
            )}
            {isChatOpen && details && (
                <ChatInterface
                    entityName={entry.title}
                    roleplayContext={JSON.stringify(details)}
                    onClose={() => setIsChatOpen(false)}
                />
            )}
        </DetailViewLayout>
    );
}
export const NpcDetailView = memo(NpcDetailViewFC);
