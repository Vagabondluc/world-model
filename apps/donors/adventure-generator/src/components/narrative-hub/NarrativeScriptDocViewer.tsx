import React, { FC, useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { Book, ChevronLeft, FileText, Info } from 'lucide-react';
import { theme } from '../../styles/theme';
import { MarkdownRenderer } from '../ensemble/MarkdownRenderer';
import { FileSystemStore } from '../../services/fileSystemStore';

interface NarrativeScriptDocViewerProps {
    scriptId?: string; // Optional: Show docs for a specific script
    onBack: () => void;
}

const styles = {
    container: css`
        display: flex;
        height: 100%;
        background: ${theme.colors.bg};
        color: ${theme.colors.text};
    `,
    sidebar: css`
        width: 250px;
        background: ${theme.colors.card};
        border-right: 1px solid ${theme.borders.light};
        padding: ${theme.spacing.m};
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing.s};
    `,
    content: css`
        flex: 1;
        padding: ${theme.spacing.xl};
        overflow-y: auto;
    `,
    navItem: css`
        padding: ${theme.spacing.s} ${theme.spacing.m};
        cursor: pointer;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: ${theme.fonts.header};
        &:hover { background: rgba(0,0,0,0.05); }
    `,
    activeNavItem: css`
        background: ${theme.colors.accent} !important;
        color: white;
    `,
    backButton: css`
        display: flex;
        align-items: center;
        gap: 8px;
        padding: ${theme.spacing.s} ${theme.spacing.m};
        margin-bottom: ${theme.spacing.m};
        background: transparent;
        border: none;
        color: ${theme.colors.accent};
        cursor: pointer;
        font-family: ${theme.fonts.header};
        font-weight: bold;
    `
};

export const NarrativeScriptDocViewer: FC<NarrativeScriptDocViewerProps> = ({ scriptId, onBack }) => {
    const [activeDoc, setActiveDoc] = useState<string>('taxonomy');
    const [docContent, setDocContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    const docs = [
        { id: 'taxonomy', title: 'UI Taxonomy', path: 'docs/UI_TAXONOMY.md', icon: <Book size={16} /> },
        { id: 'script', title: 'Script Definition', path: `docs/Narrative Scripts/mockups/wireframes/${scriptId}-wireframe.md`, icon: <FileText size={16} />, hidden: !scriptId },
    ];

    useEffect(() => {
        const loadDoc = async () => {
            setIsLoading(true);
            const doc = docs.find(d => d.id === activeDoc);
            if (doc && await FileSystemStore.fileExists(doc.path)) {
                try {
                    const content = await FileSystemStore.readFileContent(doc.path);
                    setDocContent(content);
                } catch (e) {
                    setDocContent("Failed to load documentation.");
                }
            } else {
                setDocContent("Documentation file not found.");
            }
            setIsLoading(false);
        };
        loadDoc();
    }, [activeDoc, scriptId]);

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <button className={styles.backButton} onClick={onBack}>
                    <ChevronLeft size={18} />
                    Back to Hub
                </button>
                <h4 style={{ margin: '0 0 10px 10px', textTransform: 'uppercase', fontSize: '0.8rem', color: theme.colors.textMuted }}>Documentation</h4>
                {docs.filter(d => !d.hidden).map(doc => (
                    <div
                        key={doc.id}
                        className={css(styles.navItem, activeDoc === doc.id && styles.activeNavItem)}
                        onClick={() => setActiveDoc(doc.id)}
                    >
                        {doc.icon}
                        {doc.title}
                    </div>
                ))}
            </aside>
            <main className={styles.content}>
                {isLoading ? (
                    <div style={{ textAlign: 'center', marginTop: '100px' }}>Loading...</div>
                ) : (
                    <MarkdownRenderer content={docContent} />
                )}
            </main>
        </div>
    );
};
