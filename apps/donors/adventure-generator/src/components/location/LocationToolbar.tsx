
import React, { FC } from 'react';
import { css, cx } from '@emotion/css';
import { useLocationStore } from '../../stores/locationStore';
import { InteractionMode } from '../../types/location';

const styles = {
    toolbar: css`
        position: absolute;
        top: var(--space-m);
        left: var(--space-m);
        z-index: 20;
        display: flex;
        gap: var(--space-s);
        padding: var(--space-s);
        background-color: var(--dark-brown);
        color: var(--parchment-bg);
        align-items: center;
        border-radius: var(--border-radius);
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        border: 2px solid var(--medium-brown);
    `,
    toolGroup: css`
        display: flex;
        gap: 2px;
        padding-right: var(--space-s);
        border-right: 1px solid rgba(255,255,255,0.2);
        
        &:last-child { border-right: none; padding-right: 0; }
    `,
    toolButton: css`
        background: transparent;
        border: none;
        color: var(--light-brown);
        padding: 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1.4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        min-width: 40px;
        min-height: 40px;

        &:hover {
            background-color: rgba(255,255,255,0.1);
            color: var(--parchment-bg);
            transform: translateY(-1px);
        }
    `,
    activeTool: css`
        background-color: var(--dnd-red) !important;
        color: var(--parchment-bg) !important;
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
    `
};

export const LocationToolbar: FC = () => {
    const interactionMode = useLocationStore(s => s.interactionMode);
    const setInteractionMode = useLocationStore(s => s.setInteractionMode);

    const ToolButton = ({ mode, icon, title }: { mode: InteractionMode, icon: string, title: string }) => (
        <button
            className={cx(styles.toolButton, { [styles.activeTool]: interactionMode === mode })}
            onClick={() => setInteractionMode(mode)}
            title={title}
            aria-pressed={interactionMode === mode}
        >
            {icon}
        </button>
    );

    return (
        <div className={styles.toolbar} role="toolbar" aria-label="Map Tools">
            <div className={styles.toolGroup}>
                <ToolButton mode="inspect" icon="🔍" title="Inspect Mode (Select & View)" />
            </div>
            <div className={styles.toolGroup}>
                <ToolButton mode="location_place" icon="📍" title="Place Location" />
                <ToolButton mode="region_draft" icon="🗺️" title="Draft Region" />
                <ToolButton mode="biome_paint" icon="🖌️" title="Paint Biomes" />
                <ToolButton mode="fog_paint" icon="☁️" title="Fog of War (Reveal/Hide)" />
            </div>
        </div>
    );
};
