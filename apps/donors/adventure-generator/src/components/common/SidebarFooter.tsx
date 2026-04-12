import React, { FC } from 'react';
import { css } from '@emotion/css';
import { NavItem } from './NavItem';
import { ActiveView, DrawerType } from '../../stores/campaignStore';

const styles = {
    footer: css`
        margin-top: auto;
        padding-top: var(--space-l);
        border-top: 1px solid var(--medium-brown);
    `
};

interface SidebarFooterProps {
    activeDrawer: DrawerType;
    onNavigate: (view: ActiveView | DrawerType, isDrawer: boolean) => void;
}

export const SidebarFooter: FC<SidebarFooterProps> = ({ activeDrawer, onNavigate }) => {
    return (
        <div className={styles.footer}>
            <NavItem
                view="settings"
                icon="💾"
                label="Session"
                isDrawer={true}
                isActive={activeDrawer === 'settings'}
                onClick={onNavigate}
            />
        </div>
    );
};
