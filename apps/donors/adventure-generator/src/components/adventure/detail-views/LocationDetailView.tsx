
import React, { FC, memo, useMemo } from 'react';
import { css } from '@emotion/css';
import { LocationDetails, DungeonDetails, BattlemapDetails, SettlementDetails, SpecialLocationDetails, DungeonRoom, Battlefield } from '../../../types/location';
import { DetailViewLayout } from '../../common/DetailViewLayout';
import { Badge } from '../../common/Badge';
import { useCompendiumStore } from '@/stores/compendiumStore';
import { useWorkflowStore } from '@/stores/workflowStore';
import { useAppContext } from '../../../context/AppContext';
import { EntityImage } from '../../ai/EntityImage';
import { ReadAloudBlock } from '../../common/ReadAloudBlock';

interface LocationDetailViewProps {
    id: string;
}

const styles = {
    section: css`
        margin-bottom: var(--space-m);
        padding-bottom: var(--space-s);
        
        &:last-child { margin-bottom: 0; }
        h4 { margin-top: var(--space-m); }
    `,
    dungeonRoom: css`
        margin-bottom: var(--space-m);
        padding: var(--space-m);
        background-color: rgba(0,0,0,0.03);
        border-radius: var(--border-radius);
        border-left: 4px solid var(--dungeon-color);

        h4 { margin-top: 0; border-bottom: none; color: var(--dark-brown); }
        p { margin-bottom: 0; }
    `,
    battlefield: css`
         margin-bottom: var(--space-l);
         padding: var(--space-m);
         border: 1px dashed var(--battlemap-color);
         border-radius: var(--border-radius);

         h4 { margin-top: 0; color: var(--battlemap-color); border-bottom: none; }
    `
};

const LocationDetailViewFC: FC<LocationDetailViewProps> = ({ id }) => {
    const { apiService } = useAppContext();
    const entry = useCompendiumStore(state => state.compendiumEntries.find(e => e.id === id));
    const updateCompendiumEntry = useCompendiumStore(state => state.updateCompendiumEntry);

    const { loading, developLocation, setDetailingEntity } = useWorkflowStore(state => ({
        loading: state.loading,
        developLocation: state.developLocation,
        setDetailingEntity: state.setDetailingEntity,
    }));

    const details: LocationDetails | null = useMemo(() => {
        if (!entry || !entry.fullContent || entry.fullContent === '{}') return null;
        try {
            return JSON.parse(entry.fullContent);
        } catch (e) {
            console.error("Failed to parse location details:", e);
            return null;
        }
    }, [entry]);

    const onBack = () => setDetailingEntity(null);
    const onGenerate = (ctx: string) => developLocation(apiService!, id, ctx);
    const isLoading = loading.details?.type === 'location' && loading.details?.id === id;

    if (!entry) return <div>Location not found.</div>;
    const locationType = entry.tags[0] || 'Special Location';

    const handleImageUpdate = (url: string) => {
        if (entry && details) {
            const updatedDetails = { ...details, imageUrl: url };
            updateCompendiumEntry({ ...entry, fullContent: JSON.stringify(updatedDetails), lastModified: new Date() });
        }
    };

    const initialImageUrl = details && typeof (details as { imageUrl?: unknown }).imageUrl === 'string'
        ? (details as { imageUrl?: string }).imageUrl
        : undefined;

    return (
        <DetailViewLayout
            title={<>{entry.title} <Badge entityType="location" subType={locationType} style={{ marginLeft: 'var(--space-s)' }}>{locationType}</Badge></>}
            summaryLabel="Description"
            summary={entry.summary}
            hasDetails={!!details}
            onBack={onBack}
            onGenerate={onGenerate}
            isLoading={isLoading}
            origin={entry.origin}
        >
            {details && (
                <>
                    <EntityImage
                        entityName={entry.title}
                        description={entry.summary}
                        type="location"
                        initialImageUrl={initialImageUrl}
                        onImageGenerated={handleImageUpdate}
                    />

                    <ReadAloudBlock context={`${entry.title}: ${entry.summary}. ${JSON.stringify(details).substring(0, 500)}`} title={entry.title} />

                    <div>
                        {locationType === 'Dungeon' && (details as DungeonDetails).rooms?.map((room: DungeonRoom, i: number) => (
                            <div key={i} className={styles.dungeonRoom}><h4>{room.title}</h4><p>{room.description}</p></div>
                        ))}
                        {locationType === 'Battlemap' && (details as BattlemapDetails).battlefields?.map((bf: Battlefield, i: number) => (
                            <div key={i} className={styles.battlefield}><h4>Option {i + 1}: {bf.title}</h4><p>{bf.description}</p></div>
                        ))}
                        {locationType === 'Settlement' && (<>
                            <div className={styles.section}><h4>Overview</h4><p>{(details as SettlementDetails).overview}</p></div>
                            <div className={styles.section}><h4>Geography & Layout</h4><p>{(details as SettlementDetails).geography}</p></div>
                            <div className={styles.section}><h4>Society & Demographics</h4><p>{(details as SettlementDetails).society}</p></div>
                            <div className={styles.section}><h4>Economy & Trade</h4><p>{(details as SettlementDetails).economy}</p></div>
                            <div className={styles.section}><h4>Governance</h4><p>{(details as SettlementDetails).governance}</p></div>
                            <div className={styles.section}><h4>Culture & Entertainment</h4><p>{(details as SettlementDetails).culture}</p></div>
                            <div className={styles.section}><h4>Prominent Individuals</h4><p>{(details as SettlementDetails).individuals}</p></div>
                            <div className={styles.section}><h4>Challenges & Conflicts</h4><p>{(details as SettlementDetails).challenges}</p></div>
                            <div className={styles.section}><h4>Adventure Hooks</h4><p>{(details as SettlementDetails).adventureHooks}</p></div>
                        </>)}
                        {locationType === 'Special Location' && <p>{(details as SpecialLocationDetails).details}</p>}
                    </div>
                </>
            )}
        </DetailViewLayout>
    );
}

export const LocationDetailView = memo(LocationDetailViewFC);
