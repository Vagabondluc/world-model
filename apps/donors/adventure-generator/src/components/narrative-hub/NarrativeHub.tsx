import React, { FC, useEffect, useState, useMemo } from 'react';
import { css } from '@emotion/css';
import { Search, Filter, BookOpen, Settings, ChevronRight, Info, Book } from 'lucide-react';
import { NarrativeCard } from '../narrative-kit/NarrativeCard';
import { NarrativeHeader } from '../narrative-kit/NarrativeHeader';
import { theme } from '../../styles/theme';
import { useCampaignStore } from '../../stores/campaignStore';
import { useNavigationStore } from '../../stores/navigationStore';
import { NarrativeScriptService } from '../../services/narrativeScriptService';
import { MarkdownNarrativeService, NarrativeScriptDefinition } from '../../services/markdownNarrativeService';
import { NarrativeScriptMetadata, NarrativeScriptViewMode } from '../../types/narrative';
import { EncounterDesignPreview } from '../narrative-kit/EncounterDesignPreview';
import { NarrativeScriptRenderer } from '../narrative-kit/NarrativeScriptRenderer';
import { NarrativeScriptDocViewer } from './NarrativeScriptDocViewer';

const styles = {
    container: css`
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing.l};
        padding: ${theme.spacing.l};
        height: 100%;
        color: ${theme.colors.text};
    `,
    searchBar: css`
        display: flex;
        gap: ${theme.spacing.m};
        align-items: center;
        background: ${theme.colors.card};
        padding: ${theme.spacing.s} ${theme.spacing.m};
        border-radius: ${theme.borders.radius};
        border: 1px solid ${theme.borders.light};
    `,
    searchInput: css`
        flex: 1;
        border: none;
        background: transparent;
        font-family: ${theme.fonts.body};
        font-size: 1.1rem;
        color: ${theme.colors.text};
        &:focus { outline: none; }
    `,
    grid: css`
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: ${theme.spacing.l};
        overflow-y: auto;
    `,
    scriptCard: css`
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
        &:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }
    `,
    categoryBadge: css`
        font-size: 0.75rem;
        padding: 2px 8px;
        border-radius: 12px;
        background: ${theme.colors.accent};
        color: white;
        text-transform: uppercase;
        font-weight: bold;
    `,
    emptyState: css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: ${theme.spacing.xxl};
        text-align: center;
        color: ${theme.colors.textMuted};
    `
};

export const NarrativeHub: FC = () => {
    const [scripts, setScripts] = useState<NarrativeScriptMetadata[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [viewMode, setViewMode] = useState<NarrativeScriptViewMode>('hub');
    const [activeScript, setActiveScript] = useState<NarrativeScriptMetadata | null>(null);
    const [parsedDefinition, setParsedDefinition] = useState<NarrativeScriptDefinition | null>(null);
    const { pushView } = useNavigationStore();

    useEffect(() => {
        const load = async () => {
            const data = await NarrativeScriptService.getScripts();
            setScripts(data);
        };
        load();
    }, []);

    const filteredScripts = useMemo(() => {
        return scripts.filter(s => {
            const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [scripts, searchTerm, selectedCategory]);

    const categories = useMemo(() => {
        return ['All', ...Array.from(new Set(scripts.map(s => s.category)))];
    }, [scripts]);

    const handleOpenScript = async (script: NarrativeScriptMetadata) => {
        setActiveScript(script);
        try {
            const content = await NarrativeScriptService.getScriptContent(script.filePath);
            const definition = MarkdownNarrativeService.parseWireframe(script.id, content);
            setParsedDefinition(definition);
            setViewMode('architect');
        } catch (e) {
            console.error("Failed to parse script", e);
            // Fallback to basic view if parsing fails
            setViewMode('architect');
        }
    };

    const handleOpenDocs = (e: React.MouseEvent, script: NarrativeScriptMetadata) => {
        e.stopPropagation();
        setActiveScript(script);
        setViewMode('detail');
    };

    if (viewMode === 'detail' && activeScript) {
        return <NarrativeScriptDocViewer scriptId={activeScript.id} onBack={() => setViewMode('hub')} />;
    }

    if (viewMode === 'architect' && activeScript) {
        // Special case: For EncounterDesign, use the specialized preview if we want to keep it
        // But for this task, we want to prove the dynamic renderer works.
        // I'll use the dynamic renderer for EVERYTHING else.

        if (parsedDefinition) {
            return (
                <div style={{ padding: '20px', height: '100%', overflowY: 'auto', background: '#f0f0f0' }}>
                    <NarrativeScriptRenderer
                        definition={parsedDefinition}
                        onBack={() => setViewMode('hub')}
                        onSave={(data) => console.log('Saving Script Data', data)}
                    />
                </div>
            );
        }

        // Generic fallback if parsing wasn't done yet or failed
        return (
            <NarrativeCard isFullscreen={true}>
                <NarrativeHeader
                    title={activeScript.title}
                    onBack={() => setViewMode('hub')}
                    viewMode="fullscreen"
                />
                <div style={{ padding: '40px', textAlign: 'center' }}>
                    <h2 style={{ fontFamily: theme.fonts.header }}>{activeScript.title} Architect</h2>
                    <p style={{ fontFamily: theme.fonts.body, fontStyle: 'italic' }}>
                        Loading script definition...
                    </p>
                </div>
            </NarrativeCard>
        );
    }

    return (
        <div className={styles.container}>
            <header>
                <h1 style={{ fontFamily: theme.fonts.header, textAlign: 'left', marginBottom: theme.spacing.s }}>Narrative Hub</h1>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <p style={{ color: theme.colors.textMuted, fontStyle: 'italic' }}>Discover and run narrative design scripts for your campaign.</p>
                    <button
                        onClick={() => setViewMode('detail')}
                        className="secondary-button"
                        style={{ fontSize: '0.8rem', padding: '4px 12px' }}
                    >
                        <Book size={14} style={{ marginRight: '6px' }} />
                        UI Documentation
                    </button>
                </div>
            </header>

            <div className={styles.searchBar}>
                <Search size={20} color={theme.colors.textMuted} />
                <input
                    className={styles.searchInput}
                    placeholder="Search scripts (Encounter, NPC, Mystery...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Filter size={20} color={theme.colors.textMuted} />
                <select
                    style={{ background: 'transparent', border: 'none', color: theme.colors.textMuted, cursor: 'pointer' }}
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <h3 style={{ fontFamily: theme.fonts.header, margin: '0 0 10px 0' }}>Core Tools</h3>
            <div className={styles.grid} style={{ marginBottom: theme.spacing.xl }}>
                <NarrativeCard className={styles.scriptCard} onClick={() => pushView('traps')}>
                    <span className={styles.categoryBadge} style={{ background: theme.colors.accent }}>Architect</span>
                    <h3 style={{ fontFamily: theme.fonts.header, margin: '8px 0' }}>Trap Architect</h3>
                    <p style={{ fontSize: '0.9rem', color: theme.colors.textMuted }}>Build complex hazards with the component matrix.</p>
                </NarrativeCard>

                <NarrativeCard className={styles.scriptCard} onClick={() => pushView('npcs')}>
                    <span className={styles.categoryBadge} style={{ background: theme.colors.accent }}>Generator</span>
                    <h3 style={{ fontFamily: theme.fonts.header, margin: '8px 0' }}>NPC Chronicler</h3>
                    <p style={{ fontSize: '0.9rem', color: theme.colors.textMuted }}>Create deep personas with voices and mannerisms.</p>
                </NarrativeCard>

                <NarrativeCard className={styles.scriptCard} onClick={() => pushView('encounter-designer')}>
                    <span className={styles.categoryBadge} style={{ background: 'var(--dnd-red)' }}>Combat</span>
                    <h3 style={{ fontFamily: theme.fonts.header, margin: '8px 0' }}>Encounter Designer</h3>
                    <p style={{ fontSize: '0.9rem', color: theme.colors.textMuted }}>Plan technical combat encounters and AI behavior.</p>
                </NarrativeCard>
            </div>

            <h3 style={{ fontFamily: theme.fonts.header, margin: '0 0 10px 0' }}>Community Scripts</h3>
            <div className={styles.grid}>
                {filteredScripts.length > 0 ? filteredScripts.map(script => (
                    <NarrativeCard
                        key={script.id}
                        variant="default"
                        className={styles.scriptCard}
                        onClick={() => handleOpenScript(script)}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className={styles.categoryBadge}>{script.category}</span>
                            <button
                                onClick={(e) => handleOpenDocs(e, script)}
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex' }}
                                title="View Documentation"
                            >
                                <Info size={18} color={theme.colors.textMuted} />
                            </button>
                        </div>
                        <h3 style={{ fontFamily: theme.fonts.header, margin: '8px 0' }}>{script.title}</h3>
                        <p style={{ fontSize: '0.9rem', color: theme.colors.textMuted, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {script.description}
                        </p>
                        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', color: theme.colors.accent }}>
                            <ChevronRight size={20} />
                        </div>
                    </NarrativeCard>
                )) : (
                    <div className={styles.emptyState}>
                        <Search size={48} color={theme.colors.textLight} />
                        <h3>No scripts found</h3>
                        <p>Try adjusting your search or category filter.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
