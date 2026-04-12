import React, { FC, useMemo } from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkWikiLink from 'remark-wiki-link';
import remarkRehype from 'remark-rehype';
import rehypeReact from 'rehype-react';
import * as prod from 'react/jsx-runtime';
import { css } from '@emotion/css';
import { EnsembleService } from '../../services/ensembleService';
import { useEnsembleStore } from '../../stores/ensembleStore';
import type { Options as RehypeReactOptions } from 'rehype-react';

const styles = {
    content: css`
        font-family: var(--body-font);
        line-height: 1.6;
        color: var(--dark-brown);
        
        h1, h2, h3 {
            font-family: var(--header-font);
            color: var(--dnd-red);
        }
        
        pre {
            background: #f4f4f4;
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
        }
        
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1rem 0;
        }
        
        th, td {
            border: 1px solid var(--border-light);
            padding: 8px;
            text-align: left;
        }
        
        th {
            background-color: var(--parchment-bg);
        }

        .gm-secret {
            background-color: #fffaf0;
            border: 1px dashed var(--dnd-red);
            padding: 10px;
            margin: 10px 0;
            position: relative;
            
            &::before {
                content: 'SECRET';
                position: absolute;
                top: -10px;
                right: 10px;
                background: var(--dnd-red);
                color: white;
                font-size: 0.7rem;
                padding: 2px 6px;
                border-radius: 3px;
                font-family: var(--header-font);
            }
        }
    `
};

interface MarkdownRendererProps {
    content: string;
    isGMView?: boolean;
}

export const MarkdownRenderer: FC<MarkdownRendererProps> = ({ content, isGMView = true }) => {
    const fileTree = useEnsembleStore(s => s.fileTree);
    const rootPath = useEnsembleStore(s => s.rootPath);

    // Basic secret parsing for now (regex based until custom remark plugin is refined)
    const processedContent = useMemo(() => {
        if (isGMView) {
            return content.replace(/%% secret %%([\s\S]*?)%% end %%/g, '<div class="gm-secret">$1</div>');
        } else {
            return content.replace(/%% secret %%([\s\S]*?)%% end %%/g, '');
        }
    }, [content, isGMView]);

    const reactContent = useMemo(() => {
        try {
            const rehypeOptions: RehypeReactOptions = {
                Fragment: prod.Fragment,
                jsx: prod.jsx,
                jsxs: prod.jsxs,
                components: {
                    a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
                        const isWikiLink = props.className?.includes('internal');
                        const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
                            e.preventDefault();
                            if (isWikiLink && rootPath) {
                                const label = typeof props.title === 'string'
                                    ? props.title
                                    : (typeof props.children === 'string' ? props.children : '');
                                const fileName = `${label}.md`;
                                const path = `${rootPath}/${fileName}`.replace(/\//g, '\\');
                                try {
                                    await EnsembleService.loadFileIntoStore(path);
                                } catch (err) {
                                    console.warn("Could not navigate to wiki link target", path);
                                }
                            }
                        };
                        return (
                            <a
                                {...props}
                                onClick={handleClick}
                                style={{
                                    color: isWikiLink ? 'var(--dnd-red)' : 'inherit',
                                    textDecoration: 'underline',
                                    cursor: 'pointer'
                                }}
                            >
                                {props.children}
                            </a>
                        );
                    }
                }
            };
            return unified()
                .use(remarkParse)
                .use(remarkGfm)
                .use(remarkWikiLink, {
                    aliasDivider: '|',
                    pageResolver: (name: string) => [name.replace(/ /g, '_')],
                    hrefTemplate: (permalink: string) => permalink
                })
                .use(remarkRehype, { allowDangerousHtml: true })
                .use(rehypeReact, rehypeOptions)
                .processSync(processedContent).result;
        } catch (e) {
            console.error("Markdown rendering error:", e);
            return <div>Error rendering markdown.</div>;
        }
    }, [processedContent, rootPath]);

    return (
        <div className={styles.content}>
            {reactContent}
        </div>
    );
};
