
import React, { FC, memo, useMemo } from 'react';
import { css } from '@emotion/css';
import { FactionDetails } from '../../../types/faction';
import { DetailViewLayout } from '../../common/DetailViewLayout';
import { Badge } from '../../common/Badge';
import { FactionClockPanel } from '../../faction/FactionClockPanel';
import { useCompendiumStore } from '@/stores/compendiumStore';
import { useWorkflowStore } from '@/stores/workflowStore';
import { useAppContext } from '../../../context/AppContext';

interface FactionDetailViewProps {
    id: string;
}

const styles = {
    section: css`
        margin-bottom: var(--space-l);
        padding: var(--space-m);
        background-color: rgba(0,0,0,0.02);
        border-radius: var(--border-radius);
        border-left: 4px solid var(--medium-brown);

        h4 { margin-top: 0; border-bottom: none; padding-bottom: 0; }
        ul { margin-bottom: 0; padding-left: var(--space-l); }
        li { margin-bottom: var(--space-s); }
    `
};

const FactionDetailViewFC: FC<FactionDetailViewProps> = ({ id }) => {
    const { apiService } = useAppContext();
    const entry = useCompendiumStore(state => state.compendiumEntries.find(e => e.id === id));

    const { loading, developFaction, setDetailingEntity } = useWorkflowStore(state => ({
        loading: state.loading,
        developFaction: state.developFaction,
        setDetailingEntity: state.setDetailingEntity,
    }));

    const details: FactionDetails | null = useMemo(() => {
        if (!entry || !entry.fullContent || entry.fullContent === '{}') return null;
        try {
            return JSON.parse(entry.fullContent);
        } catch (e) {
            console.error("Failed to parse faction details:", e);
            return null;
        }
    }, [entry]);

    const onBack = () => setDetailingEntity(null);
    const onGenerate = (ctx: string) => developFaction(apiService!, id, ctx);
    const isLoading = loading.details?.type === 'faction' && loading.details?.id === id;

    if (!entry) return <div>Faction not found.</div>;
    const category = entry.tags[0] || 'Unknown';

    return (
        <DetailViewLayout
            title={<>
                {entry.title}
                <Badge entityType="faction" subType={category} style={{ marginLeft: 'var(--space-s)' }}>{category}</Badge>
            </>}
            summaryLabel="Primary Goal"
            summary={entry.summary}
            hasDetails={!!details}
            onBack={onBack}
            onGenerate={onGenerate}
            isLoading={isLoading}
            origin={entry.origin}
        >
            {details && (
                <div>
                    <div className={styles.section}><h4>Identity & Ideology</h4><p><strong>Identity:</strong> {details.identity}</p><p><strong>Ideology:</strong> {details.ideology}</p></div>
                    <div className={styles.section}><h4>Operations & Power</h4><p><strong>Area of Operation:</strong> {details.areaOfOperation}</p><p><strong>Power Level:</strong> {details.powerLevel}</p></div>
                    <div className={styles.section}><h4>Goals</h4><ul><li><strong>Short-Term:</strong> {details.shortTermGoal}</li><li><strong>Mid-Term:</strong> {details.midTermGoal}</li><li><strong>Long-Term:</strong> {details.longTermGoal}</li></ul></div>
                </div>
            )}
            
            {/* Faction Clock Management */}
            <div style={{ marginTop: 'var(--space-l)' }}>
                <FactionClockPanel
                    factionId={id}
                    factionName={entry?.title}
                />
            </div>
        </DetailViewLayout>
    )
}

export const FactionDetailView = memo(FactionDetailViewFC);
