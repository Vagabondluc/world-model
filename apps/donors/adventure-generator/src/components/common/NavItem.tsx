import React, { FC } from 'react';
import { css, cx } from '@emotion/css';
import { ActiveView, DrawerType } from '../../stores/campaignStore';

const styles = {
    navButton: css`
        background: transparent;
        border: 1px solid transparent;
        color: var(--light-brown);
        padding: var(--space-m);
        border-radius: var(--border-radius);
        cursor: pointer;
        width: 100%;
        text-align: left;
        font-family: var(--header-font);
        font-size: 1.15rem;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: var(--space-s);

        &:hover {
            background-color: rgba(0,0,0,0.2);
            color: var(--parchment-bg);
            border-color: var(--medium-brown);
            transform: translateX(5px);
        }
    `,
    activeNavButton: css`
        background-color: var(--parchment-bg) !important;
        color: var(--dark-brown) !important;
        border-color: var(--parchment-bg) !important;
        font-weight: bold;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transform: translateX(5px);
    `,
};

interface NavItemProps {
    view: ActiveView | DrawerType;
    icon: string;
    label: string;
    isDrawer?: boolean;
    isActive: boolean;
    onClick: (view: ActiveView | DrawerType, isDrawer: boolean) => void;
}

export const NavItem: FC<NavItemProps> = ({ view, icon, label, isDrawer = false, isActive, onClick }) => {
    return (
        <button
            onClick={() => onClick(view, isDrawer)}
            className={cx(styles.navButton, { [styles.activeNavButton]: isActive })}
            title={`Go to ${label}`}
            aria-current={isActive ? 'page' : undefined}
        >
            <span>{icon}</span>
            <span>{label}</span>
        </button>
    );
};
