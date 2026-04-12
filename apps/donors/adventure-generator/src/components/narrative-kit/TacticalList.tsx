import React, { FC, ReactNode } from 'react';
import { css } from '@emotion/css';
import { CheckCircle2, Crosshair, Shield, HelpCircle } from 'lucide-react';
import { theme } from '../../styles/theme';

import { UITacticalItem, TacticalIconType } from '../../types/narrative-kit';

interface TacticalListProps {
    title?: string;
    items: UITacticalItem[];
    className?: string;
}

const styles = {
    container: css`
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing.s};
    `,
    header: css`
        font-family: ${theme.fonts.header};
        font-weight: bold;
        font-size: 0.85rem;
        color: ${theme.colors.textMuted};
        text-transform: uppercase;
        margin-bottom: 4px;
    `,
    list: css`
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 6px;
    `,
    item: css`
        display: flex;
        align-items: flex-start;
        gap: ${theme.spacing.s};
        font-size: 0.95rem;
        line-height: 1.4;
        color: ${theme.colors.text};
        padding: 4px 0;
    `,
    iconWrapper: css`
        color: ${theme.colors.accent};
        margin-top: 2px;
        flex-shrink: 0;
    `
};

const getIcon = (type: TacticalIconType) => {
    switch (type) {
        case 'attack': return <Crosshair size={16} />;
        case 'defense': return <Shield size={16} />;
        case 'info': return <HelpCircle size={16} />;
        case 'check': default: return <CheckCircle2 size={16} />;
    }
};

export const TacticalList: FC<TacticalListProps> = ({ title, items, className }) => {
    return (
        <div className={css(styles.container, className)}>
            {title && <div className={styles.header}>{title}</div>}
            <ul className={styles.list}>
                {items.map(item => (
                    <li key={item.id} className={styles.item}>
                        <span className={styles.iconWrapper}>
                            {typeof item.icon === 'string' ? getIcon(item.icon as TacticalIconType) : item.icon}
                        </span>
                        <span>{item.text}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
