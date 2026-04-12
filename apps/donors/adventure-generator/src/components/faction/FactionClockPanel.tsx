import React, { FC, useState } from 'react';
import { css, cx } from '@emotion/css';
import { useFactionClockStore } from '../../stores/factionClockStore';
import { FactionClockManager } from './FactionClockManager';
import { DowntimeRoller } from './DowntimeRoller';
import { ProgressEventViewer } from './ProgressEventViewer';

type TabType = 'clocks' | 'downtime' | 'history';

interface FactionClockPanelProps {
    factionId?: string;
    factionName?: string;
    availableFactions?: string[];
    className?: string;
}

/**
 * FactionClockPanel - Main container for faction clock management
 * 
 * Features:
 * - Tabs for Clocks, Downtime, and History views
 * - Integration with factionClockStore for state management
 * - Responsive layout
 * - Integration with compendiumStore for faction data
 */
export const FactionClockPanel: FC<FactionClockPanelProps> = ({
    factionId,
    factionName = 'Faction',
    availableFactions = [],
    className,
}) => {
    const { clocks } = useFactionClockStore();
    const [activeTab, setActiveTab] = useState<TabType>('clocks');

    // If no factionId is specified, use the first available faction
    const activeFactionId = factionId || (Object.keys(clocks)[0] || undefined);
    const activeFactionName = factionName || activeFactionId || 'Faction';

    const containerStyle = css`
        display: flex;
        flex-direction: column;
        gap: 0;
        font-family: var(--stat-body-font);
        color: var(--dark-brown);
        height: 100%;
        overflow: hidden;
    `;

    const tabsContainerStyle = css`
        display: flex;
        gap: 0;
        border-bottom: 2px solid var(--medium-brown);
        flex-shrink: 0;
    `;

    const tabStyle = (isActive: boolean) => css`
        padding: 12px 24px;
        background-color: ${isActive ? 'var(--card-bg)' : 'transparent'};
        border: none;
        border-bottom: 3px solid ${isActive ? 'var(--dnd-red)' : 'transparent'};
        font-family: var(--stat-body-font);
        font-weight: 600;
        font-size: 0.95rem;
        color: ${isActive ? 'var(--dark-brown)' : 'var(--text-muted)'};
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
        top: 1px;
        
        &:hover:not(:disabled) {
            background-color: rgba(0, 0, 0, 0.05);
            color: var(--dark-brown);
        }
        
        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    `;

    const tabContentStyle = css`
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        padding: 20px;
        background-color: var(--view-bg);
    `;

    const factionSelectorStyle = css`
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 20px;
        background-color: var(--card-bg);
        border-bottom: 1px solid var(--light-brown);
        flex-shrink: 0;
    `;

    const labelStyle = css`
        font-weight: 600;
        color: var(--text-muted);
        font-size: 0.9rem;
    `;

    const selectStyle = css`
        padding: 8px 12px;
        border: 1px solid var(--input-border);
        border-radius: var(--border-radius);
        background-color: var(--input-bg);
        color: var(--input-text);
        font-family: var(--stat-body-font);
        font-size: 0.9rem;
        cursor: pointer;
        min-width: 200px;
    `;

    const statsStyle = css`
        display: flex;
        gap: 24px;
        margin-left: auto;
    `;

    const statItemStyle = css`
        display: flex;
        flex-direction: column;
        align-items: center;
    `;

    const statValueStyle = css`
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--dnd-red);
        line-height: 1;
    `;

    const statLabelStyle = css`
        font-size: 0.75rem;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-top: 4px;
    `;

    // Calculate stats
    const allClocks = activeFactionId ? (clocks[activeFactionId] || []) : [];
    const activeClocks = allClocks.filter(c => c.progress < c.segments);
    const completedClocks = allClocks.filter(c => c.progress >= c.segments);
    const totalEvents = allClocks.reduce((sum, c) => sum + c.events.length, 0);

    const availableFactionIds = Object.keys(clocks);

    return (
        <div className={cx(containerStyle, className)}>
            {/* Faction Selector and Stats */}
            {availableFactionIds.length > 0 && (
                <div className={factionSelectorStyle}>
                    <span className={labelStyle}>Viewing:</span>
                    <select
                        value={activeFactionId || ''}
                        onChange={(e) => {
                            // This would typically update parent state
                            // For now, we'll just log it
                            console.log('Selected faction:', e.target.value);
                        }}
                        className={selectStyle}
                    >
                        {availableFactionIds.map(fid => (
                            <option key={fid} value={fid}>
                                {availableFactions.includes(fid) ? fid : `Faction (${fid.slice(0, 8)}...)`}
                            </option>
                        ))}
                    </select>
                    <div className={statsStyle}>
                        <div className={statItemStyle}>
                            <span className={statValueStyle}>{allClocks.length}</span>
                            <span className={statLabelStyle}>Total</span>
                        </div>
                        <div className={statItemStyle}>
                            <span className={statValueStyle}>{activeClocks.length}</span>
                            <span className={statLabelStyle}>Active</span>
                        </div>
                        <div className={statItemStyle}>
                            <span className={statValueStyle}>{completedClocks.length}</span>
                            <span className={statLabelStyle}>Complete</span>
                        </div>
                        <div className={statItemStyle}>
                            <span className={statValueStyle}>{totalEvents}</span>
                            <span className={statLabelStyle}>Events</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className={tabsContainerStyle}>
                <button
                    onClick={() => setActiveTab('clocks')}
                    className={tabStyle(activeTab === 'clocks')}
                >
                    ⏰ Clocks
                </button>
                <button
                    onClick={() => setActiveTab('downtime')}
                    className={tabStyle(activeTab === 'downtime')}
                    disabled={!activeFactionId || allClocks.length === 0}
                >
                    🎲 Downtime
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={tabStyle(activeTab === 'history')}
                    disabled={!activeFactionId || allClocks.length === 0}
                >
                    📜 History
                </button>
            </div>

            {/* Tab Content */}
            <div className={tabContentStyle}>
                {activeTab === 'clocks' && activeFactionId && (
                    <FactionClockManager
                        factionId={activeFactionId}
                        factionName={activeFactionName}
                        availableFactions={availableFactions}
                    />
                )}
                
                {activeTab === 'downtime' && (
                    <DowntimeRoller factionId={activeFactionId} />
                )}
                
                {activeTab === 'history' && activeFactionId && (
                    <ProgressEventViewer factionId={activeFactionId} />
                )}
                
                {activeFactionId && allClocks.length === 0 && activeTab !== 'clocks' && (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        color: 'var(--text-muted)',
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⏰</div>
                        <div style={{ fontSize: '1.1rem', color: 'var(--medium-brown)' }}>
                            No clocks to display
                        </div>
                        <div style={{ fontSize: '0.9rem', marginTop: '8px' }}>
                            Switch to the Clocks tab to create your first faction clock
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
