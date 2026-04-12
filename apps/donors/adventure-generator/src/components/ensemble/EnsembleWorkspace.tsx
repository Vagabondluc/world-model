import React, { FC, useEffect, useState } from 'react';
import { css } from '@emotion/css';
import { useEnsembleStore } from '../../stores/ensembleStore';
import { EnsembleService } from '../../services/ensembleService';
import { useCampaignStore } from '../../stores/campaignStore';
import { FileTreeView } from './FileTreeView';
import { MarkdownRenderer } from './MarkdownRenderer';
import { BlueprintCanvas } from './BlueprintCanvas';
import { FileSystemStore } from '../../services/fileSystemStore';
import { NodeMetadata } from '../../services/persistenceMappingService';
import { useAdventureDataStore } from '../../stores/adventureDataStore';
import { Delve } from '../../types/delve';
import { useEncounterWizardStore } from '../../stores/encounterWizardStore';
import { useWorkflowStore } from '../../stores/workflowStore';

const styles = {
    container: css`
        display: flex;
        height: 100%;
        background-color: var(--parchment-bg);
        color: var(--dark-brown);
    `,
    fileTree: css`
        width: 250px;
        border-right: 1px solid var(--medium-brown);
        padding: var(--space-m);
        overflow-y: auto;
    `,
    editorArea: css`
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: var(--space-l);
        overflow-y: auto;
    `,
    titleInput: css`
        font-family: var(--header-font);
        font-size: 2rem;
        border: none;
        background: transparent;
        border-bottom: 2px solid var(--border-light);
        margin-bottom: var(--space-m);
        outline: none;
        color: var(--dark-brown);
        
        &:focus {
            border-bottom-color: var(--dnd-red);
        }
    `,
    textarea: css`
        flex: 1;
        font-family: var(--body-font);
        font-size: 1.1rem;
        border: 1px solid var(--border-light);
        padding: var(--space-m);
        background: white;
        resize: none;
        outline: none;
        line-height: 1.6;
        
        &:focus {
            border-color: var(--medium-brown);
        }
    `,
    toolbar: css`
        display: flex;
        gap: var(--space-m);
        margin-bottom: var(--space-m);
    `,
    button: css`
        padding: 8px 16px;
        background: var(--dark-brown);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-family: var(--header-font);
        
        &:hover {
            opacity: 0.9;
        }

        &.primary {
            background: var(--dnd-red);
        }
    `
};

interface EnsembleWorkspaceProps {
    onBack?: () => void;
}

export const EnsembleWorkspace: FC<EnsembleWorkspaceProps> = () => {
    const rootPath = useCampaignStore(s => s.rootPath);
    const setActiveView = useCampaignStore(s => s.setActiveView);
    const { currentFile, fileContent, setFileContent, isDirty, setDirty, fileTree, setRootPath, activeWindow, currentMetadata } = useEnsembleStore();
    const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split' | 'graph'>('split');

    const handleOpenInGenerator = (metadata: NodeMetadata) => {
        switch (metadata.type) {
            case 'adventure-hook':
                useAdventureDataStore.setState({ adventures: [metadata.data], matrix: null });
                useWorkflowStore.getState().setStep('hooks');
                setActiveView('adventure');
                break;
            case 'narrative-encounter':
                useEncounterWizardStore.setState(metadata.data);
                setActiveView('encounter-designer');
                break;
            case 'quick-delve':
                useAdventureDataStore.setState({ activeDelve: metadata.data as Delve, delveView: 'hub' });
                useWorkflowStore.getState().setStep('delve');
                setActiveView('adventure');
                break;
            case 'dungeon-room':
                // If we open a room, we should ideally load the parent delve
                // For now, we load the room data and if it has a reference to an encounter, open that instead
                if (metadata.referenced_node) {
                    // This room is an encounter
                    EnsembleService.loadFileIntoStore(metadata.referenced_node).then(() => {
                        const nextMeta = useEnsembleStore.getState().currentMetadata;
                        if (nextMeta) handleOpenInGenerator(nextMeta);
                    });
                } else {
                    // Open in Delve Wizard at this specific room
                    // Note: This requires the parent delve to be loaded too, which reconstruct logic handles
                    useAdventureDataStore.setState({ activeRoomId: metadata.id, delveView: 'room-editor' });
                    useWorkflowStore.getState().setStep('delve');
                    setActiveView('adventure');
                }
                break;
        }
    };

    useEffect(() => {
        if (rootPath) {
            setRootPath(rootPath);
            EnsembleService.startWatching(rootPath);
        }
    }, [rootPath]);

    const handleSave = async () => {
        await EnsembleService.saveCurrentFile();
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (fileContent) {
            setFileContent(fileContent.frontmatter, e.target.value);
            setDirty(true);
        }
    };

    const handleSpawnPlayer = async () => {
        await EnsembleService.spawnPlayerWindow();
    };

    const handleFileSelect = (path: string) => {
        EnsembleService.loadFileIntoStore(path);
    };

    const handleExport = async () => {
        const selected = await FileSystemStore.openDirectoryDialog("Select Export Destination");
        if (selected) {
            await EnsembleService.exportVault(selected as string, 'hugo');
            alert("Export complete!");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.fileTree}>
                <h3 style={{ fontFamily: 'var(--header-font)', margin: '0 0 10px 0' }}>Ensemble Vault</h3>
                <div style={{ maxHeight: 'calc(100% - 40px)', overflowY: 'auto' }}>
                    <FileTreeView
                        tree={fileTree}
                        selectedPath={currentFile}
                        onSelect={handleFileSelect}
                    />
                </div>
            </div>

            <div className={styles.editorArea}>
                <div className={styles.toolbar}>
                    <div style={{ display: 'flex', gap: '4px', background: '#eee', padding: '2px', borderRadius: '4px' }}>
                        <button
                            className={cx(styles.button)}
                            style={{ background: viewMode === 'edit' ? 'var(--dark-brown)' : 'transparent', color: viewMode === 'edit' ? 'white' : 'black', fontSize: '0.8rem', padding: '4px 8px' }}
                            onClick={() => setViewMode('edit')}
                        >
                            Edit
                        </button>
                        <button
                            className={cx(styles.button)}
                            style={{ background: viewMode === 'split' ? 'var(--dark-brown)' : 'transparent', color: viewMode === 'split' ? 'white' : 'black', fontSize: '0.8rem', padding: '4px 8px' }}
                            onClick={() => setViewMode('split')}
                        >
                            Split
                        </button>
                        <button
                            className={cx(styles.button)}
                            style={{ background: viewMode === 'preview' ? 'var(--dark-brown)' : 'transparent', color: viewMode === 'preview' ? 'white' : 'black', fontSize: '0.8rem', padding: '4px 8px' }}
                            onClick={() => setViewMode('preview')}
                        >
                            Preview
                        </button>
                        <button
                            className={cx(styles.button)}
                            style={{ background: viewMode === 'graph' ? 'var(--dark-brown)' : 'transparent', color: viewMode === 'graph' ? 'white' : 'black', fontSize: '0.8rem', padding: '4px 8px' }}
                            onClick={() => setViewMode('graph')}
                        >
                            Graph
                        </button>
                    </div>

                    <div style={{ flex: 1 }} />

                    <button className={cx(styles.button, "primary")} onClick={handleSave} disabled={!isDirty}>
                        Save File
                    </button>
                    {useEnsembleStore.getState().currentMetadata && (
                        <button
                            className={cx(styles.button)}
                            style={{ background: 'var(--accent-primary)' }}
                            onClick={() => handleOpenInGenerator(useEnsembleStore.getState().currentMetadata!)}
                        >
                            Open in Generator ↗
                        </button>
                    )}
                    <button className={styles.button} onClick={handleSpawnPlayer}>
                        Open Player View
                    </button>
                    <button className={styles.button} onClick={handleExport}>
                        Export Vault
                    </button>
                </div>

                {viewMode === 'graph' ? (
                    <div style={{ flex: 1, borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                        <BlueprintCanvas />
                    </div>
                ) : currentFile ? (
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <input
                            className={styles.titleInput}
                            value={currentFile.split('\\').pop()?.replace('.md', '') || ''}
                            readOnly
                        />

                        <div style={{ display: 'flex', flex: 1, gap: '20px', overflow: 'hidden' }}>
                            {(viewMode === 'edit' || viewMode === 'split') && (
                                <textarea
                                    className={styles.textarea}
                                    style={{ flex: viewMode === 'split' ? 1 : 'none', width: viewMode === 'edit' ? '100%' : 'auto' }}
                                    value={fileContent?.content || ''}
                                    onChange={handleContentChange}
                                    placeholder="Write your adventure here..."
                                />
                            )}

                            {(viewMode === 'preview' || viewMode === 'split') && (
                                <div style={{
                                    flex: 1,
                                    background: 'white',
                                    padding: '20px',
                                    border: '1px solid var(--border-light)',
                                    overflowY: 'auto',
                                    backgroundColor: '#fffcf5' // Slightly warmer for preview
                                }}>
                                    <MarkdownRenderer
                                        content={fileContent?.content || ''}
                                        isGMView={activeWindow === 'gm'}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', fontSize: '1.5rem', color: '#ccc' }}>
                        Select a file to begin
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper for classnames
type ClassValue = string | false | null | undefined;

function cx(...args: ClassValue[]) {
    return args.filter(Boolean).join(' ');
}
