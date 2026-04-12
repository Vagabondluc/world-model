
import React, { FC } from 'react';
import { css } from '@emotion/css';
import DOMPurify from 'dompurify';

interface StatblockProps {
    html: string;
}

const styles = {
    container: css`
        background-color: #fdf1dc; /* Parchment background */
        border: 1px solid #d2b48c;
        padding: var(--space-m);
        font-family: var(--body-font); /* Use Lora for book-like feel */
        margin-top: var(--space-l);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        color: var(--dark-brown);

        h3 {
            font-family: var(--stat-title-font); /* Sorts Mill Goudy */
            font-size: 1.6rem;
            font-weight: 700;
            color: var(--dnd-red);
            border-bottom: 1px solid var(--dnd-red);
            margin: 0 0 var(--space-s) 0;
            padding-bottom: var(--space-xs);
            line-height: 1.2;

            /* Section headers like "Actions", "Legendary Actions" */
            &:not(:first-of-type) {
                font-size: 1.3rem;
                margin-top: var(--space-m);
            }
        }

        p, ul, li {
            margin: 0;
            padding: 0;
            font-size: 0.95rem;
            line-height: 1.5;
            color: var(--dark-brown);
        }

        p {
            margin-bottom: var(--space-s);
        }

        /* Subtitle like 'Medium humanoid...' */
        h3 + p > em {
            color: var(--dark-brown);
            font-size: 0.9rem;
            font-family: var(--body-font); /* Lora */
        }
        
        hr {
            border: none;
            border-top: 1px solid var(--dnd-red);
            margin: var(--space-m) 0;
        }
        
        strong {
            font-weight: bold;
            color: var(--dark-brown);
        }

        em {
            font-style: italic;
        }

        /* Ability/Action titles */
        p > strong {
            font-style: italic;
        }
        p > strong > em, p > em > strong {
            font-style: italic;
            font-weight: 700;
            color: var(--dark-brown);
        }

        /* Top-level lists for AC, HP, Skills */
        & > ul {
            list-style: none;
            padding: 0;
            margin: var(--space-s) 0;
            
            & > li {
                margin-bottom: 2px;
            }
        }

        /* Spell lists which usually follow a paragraph */
        p + ul {
            list-style: none;
            padding-left: 1em;
            margin: var(--space-xs) 0 var(--space-s) 0;

            li {
                margin-bottom: 2px;
            }
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: var(--space-s) 0;
            color: var(--dark-brown);
        }

        th, td {
            text-align: center;
            padding: 2px;
            font-size: 0.9rem;
        }
        
        thead th {
             font-weight: bold;
             color: var(--dnd-red);
        }
        
        /* Remove borders from table, rely on HR for separation */
        table, th, td {
            border: none;
        }
    `
};

export const Statblock: FC<StatblockProps> = ({ html }) => {
    const sanitizedHtml = DOMPurify.sanitize(html);
    return (
        <div className={styles.container} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
    );
};