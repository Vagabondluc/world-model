
import React, { FC } from 'react';
import { css } from '@emotion/css';

interface CompendiumLinkProps {
    entityId: string;
    name: string;
    onNavigate: (id: string) => void;
}

const styles = {
    link: css`
        color: var(--dnd-red);
        text-decoration: none;
        border-bottom: 1px dotted var(--dnd-red);
        cursor: pointer;
        transition: all 0.2s;
        font-weight: 500;
        padding: 0 1px;
        border-radius: 2px;

        &:hover {
            background-color: rgba(146, 38, 16, 0.1);
            border-bottom-style: solid;
        }
    `
};

export const CompendiumLink: FC<CompendiumLinkProps> = ({ entityId, name, onNavigate }) => {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onNavigate(entityId);
    };

    return (
        <span 
            className={styles.link} 
            onClick={handleClick}
            title={`Go to ${name}`}
        >
            {name}
        </span>
    );
};
