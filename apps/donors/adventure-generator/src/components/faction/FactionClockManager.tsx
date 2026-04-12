import React, { FC, useState } from 'react';
import { css, cx } from '@emotion/css';
import { FactionClock as FactionClockType } from '../../types/faction';
import { useFactionClockStore } from '../../stores/factionClockStore';
import { FactionClock } from './FactionClock';
import { ClockForm } from './ClockForm';

interface FactionClockManagerProps {
    factionId: string;
    factionName: string;
    availableFactions?: string[];
    className?: string;
}

/**
 * FactionClockManager - Component for managing faction clocks
 * 
 * Features:
 * - List all faction clocks grouped by faction
 * - Each clock shows visual display, objective, progress, resolution method
 * - Edit button (opens ClockForm)
 * - Delete button
 * - "Add Clock" button per faction
 * - "Roll All Clocks" button (opens DowntimeRoller)
 * - Filter/sort options
 */
export const FactionClockManager: FC<FactionClockManagerProps> = ({
    factionId,
    factionName,
    availableFactions = [],
    className,
}) => {
    const {
        clocks,
        addClock,
        updateClock,
        deleteClock,
        openClockForm,
        closeClockForm,
        isClockFormOpen,
        editingClock,
    } = useFactionClockStore();

    type ClockSort = 'name' | 'progress' | 'segments';
    type ClockFilterStatus = 'all' | 'active' | 'complete';

    const [sortBy, setSortBy] = useState<ClockSort>('name');
    const [filterStatus, setFilterStatus] = useState<ClockFilterStatus>('all');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    const factionClocks = clocks[factionId] || [];

    // Filter and sort clocks
    const filteredClocks = factionClocks
        .filter(clock => {
            if (filterStatus === 'active') return clock.progress < clock.segments;
            if (filterStatus === 'complete') return clock.progress >= clock.segments;
            return true;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.objective.localeCompare(b.objective);
                case 'progress':
                    return b.progress - a.progress;
                case 'segments':
                    return b.segments - a.segments;
                default:
                    return 0;
            }
        });

    const handleAddClock = (clockData: Partial<FactionClockType>) => {
        const newClock: FactionClockType = {
            id: `clock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            objective: clockData.objective || '',
            segments: clockData.segments || 6,
            progress: clockData.progress || 0,
            resolutionMethod: clockData.resolutionMethod || 'simple',
            difficultyDC: clockData.difficultyDC || null,
            allies: clockData.allies || [],
            enemies: clockData.enemies || [],
            pcImpact: clockData.pcImpact || false,
            events: clockData.events || [],
        };
        addClock(factionId, newClock);
        closeClockForm();
    };

    const handleEditClock = (clockData: Partial<FactionClockType>) => {
        if (editingClock) {
            updateClock(editingClock.factionId, editingClock.clockId, clockData);
            closeClockForm();
        }
    };

    const handleDeleteClock = (clockId: string) => {
        deleteClock(factionId, clockId);
        setShowDeleteConfirm(null);
    };

    const containerStyle = css`
        display: flex;
        flex-direction: column;
        gap: 20px;
        font-family: var(--stat-body-font);
        color: var(--dark-brown);
    `;

    const headerStyle = css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 16px;
        border-bottom: 2px solid var(--medium-brown);
    `;

    const titleStyle = css`
        font-family: var(--header-font);
        font-size: 1.5rem;
        color: var(--dark-brown);
        margin: 0;
    `;

    const controlsStyle = css`
        display: flex;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;
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
    `;

    const buttonStyle = (variant: 'primary' | 'secondary' | 'danger') => css`
        padding: 10px 20px;
        border-radius: var(--border-radius);
        font-family: var(--stat-body-font);
        font-weight: 600;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
        
        ${variant === 'primary'
            ? css`
                  background-color: var(--dnd-red);
                  color: white;
                  
                  &:hover {
                      background-color: #7a1f0d;
                      transform: translateY(-1px);
                  }
              `
            : variant === 'danger'
            ? css`
                  background-color: var(--error-red);
                  color: white;
                  
                  &:hover {
                      background-color: #8b0000;
                  }
              `
            : css`
                  background-color: var(--medium-brown);
                  color: var(--parchment-bg);
                  
                  &:hover {
                      background-color: var(--dark-brown);
                  }
              `}
    `;

    const clocksGridStyle = css`
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
    `;

    const clockCardStyle = css`
        background-color: var(--card-bg);
        border: 1px solid var(--medium-brown);
        border-radius: var(--border-radius);
        padding: 20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        gap: 16px;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        
        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
    `;

    const clockHeaderStyle = css`
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
    `;

    const clockInfoStyle = css`
        flex: 1;
        min-width: 0;
    `;

    const objectiveStyle = css`
        font-weight: 700;
        font-size: 1.1rem;
        color: var(--dark-brown);
        margin-bottom: 4px;
        line-height: 1.3;
    `;

    const metaStyle = css`
        font-size: 0.85rem;
        color: var(--text-muted);
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
    `;

    const badgeStyle = (variant: 'success' | 'warning' | 'neutral') => css`
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        
        ${variant === 'success'
            ? css`
                  background-color: var(--success-green);
                  color: white;
              `
            : variant === 'warning'
            ? css`
                  background-color: #f59e0b;
                  color: white;
              `
            : css`
                  background-color: var(--medium-brown);
                  color: var(--parchment-bg);
              `}
    `;

    const clockActionsStyle = css`
        display: flex;
        gap: 8px;
    `;

    const iconButtonStyle = (variant: 'edit' | 'delete') => css`
        width: 32px;
        height: 32px;
        border-radius: var(--border-radius);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        transition: all 0.2s ease;
        
        ${variant === 'edit'
            ? css`
                  background-color: var(--medium-brown);
                  color: var(--parchment-bg);
                  
                  &:hover {
                      background-color: var(--dark-brown);
                  }
              `
            : css`
                  background-color: var(--error-red);
                  color: white;
                  
                  &:hover {
                      background-color: #8b0000;
                  }
              `}
    `;

    const clockDetailsStyle = css`
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding-top: 12px;
        border-top: 1px solid var(--light-brown);
    `;

    const detailRowStyle = css`
        display: flex;
        justify-content: space-between;
        font-size: 0.85rem;
    `;

    const detailLabelStyle = css`
        color: var(--text-muted);
    `;

    const detailValueStyle = css`
        font-weight: 600;
        color: var(--dark-brown);
    `;

    const modalOverlayStyle = css`
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 20px;
    `;

    const modalContentStyle = css`
        background-color: var(--card-bg);
        border: 2px solid var(--medium-brown);
        border-radius: var(--border-radius);
        padding: 24px;
        max-width: 600px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    `;

    const modalHeaderStyle = css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--light-brown);
    `;

    const modalTitleStyle = css`
        font-family: var(--header-font);
        font-size: 1.3rem;
        color: var(--dark-brown);
        margin: 0;
    `;

    const closeButtonStyle = css`
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-muted);
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &:hover {
            color: var(--dark-brown);
        }
    `;

    const emptyStateStyle = css`
        text-align: center;
        padding: 40px 20px;
        color: var(--text-muted);
        background-color: rgba(0, 0, 0, 0.02);
        border-radius: var(--border-radius);
        border: 1px dashed var(--light-brown);
    `;

    const emptyStateIconStyle = css`
        font-size: 3rem;
        margin-bottom: 16px;
    `;

    const emptyStateTextStyle = css`
        font-size: 1.1rem;
        color: var(--medium-brown);
        margin-bottom: 8px;
    `;

    const emptyStateSubtextStyle = css`
        font-size: 0.9rem;
        color: var(--text-muted);
    `;

    const confirmDialogStyle = css`
        background-color: var(--card-bg);
        border: 2px solid var(--error-red);
        border-radius: var(--border-radius);
        padding: 20px;
        max-width: 400px;
    `;

    const confirmTitleStyle = css`
        font-family: var(--header-font);
        font-size: 1.1rem;
        color: var(--error-red);
        margin: 0 0 12px 0;
    `;

    const confirmMessageStyle = css`
        font-size: 0.9rem;
        color: var(--dark-brown);
        margin-bottom: 16px;
        line-height: 1.4;
    `;

    const confirmActionsStyle = css`
        display: flex;
        gap: 12px;
        justify-content: flex-end;
    `;

    // Get the clock being edited
    const editingClockData = editingClock
        ? factionClocks.find(c => c.id === editingClock.clockId)
        : undefined;

    return (
        <div className={cx(containerStyle, className)}>
            {/* Header */}
            <div className={headerStyle}>
                <h2 className={titleStyle}>{factionName} Clocks</h2>
                <div className={controlsStyle}>
                    <select
                        value={filterStatus}
                        onChange={(e) => {
                            const next = e.target.value;
                            if (next === 'all' || next === 'active' || next === 'complete') {
                                setFilterStatus(next);
                            }
                        }}
                        className={selectStyle}
                    >
                        <option value="all">All Clocks</option>
                        <option value="active">Active</option>
                        <option value="complete">Complete</option>
                    </select>
                    <select
                        value={sortBy}
                        onChange={(e) => {
                            const next = e.target.value;
                            if (next === 'name' || next === 'progress' || next === 'segments') {
                                setSortBy(next);
                            }
                        }}
                        className={selectStyle}
                    >
                        <option value="name">Sort by Name</option>
                        <option value="progress">Sort by Progress</option>
                        <option value="segments">Sort by Segments</option>
                    </select>
                    <button
                        onClick={() => openClockForm(factionId)}
                        className={buttonStyle('primary')}
                    >
                        + Add Clock
                    </button>
                </div>
            </div>

            {/* Clocks Grid */}
            {filteredClocks.length > 0 ? (
                <div className={clocksGridStyle}>
                    {filteredClocks.map((clock) => (
                        <div key={clock.id} className={clockCardStyle}>
                            <div className={clockHeaderStyle}>
                                <div className={clockInfoStyle}>
                                    <div className={objectiveStyle}>{clock.objective}</div>
                                    <div className={metaStyle}>
                                        <span className={badgeStyle(
                                            clock.progress >= clock.segments ? 'success' : 'neutral'
                                        )}>
                                            {clock.progress >= clock.segments ? 'Complete' : 'Active'}
                                        </span>
                                        <span>{clock.resolutionMethod}</span>
                                        {clock.pcImpact && <span>⚡ PC Impact</span>}
                                    </div>
                                </div>
                                <div className={clockActionsStyle}>
                                    <button
                                        onClick={() => openClockForm(factionId, clock.id)}
                                        className={iconButtonStyle('edit')}
                                        title="Edit Clock"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(clock.id)}
                                        className={iconButtonStyle('delete')}
                                        title="Delete Clock"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>

                            {/* Visual Clock */}
                            <FactionClock
                                clock={clock}
                                size={120}
                                strokeWidth={20}
                                showLegend={false}
                            />

                            {/* Clock Details */}
                            <div className={clockDetailsStyle}>
                                <div className={detailRowStyle}>
                                    <span className={detailLabelStyle}>Progress</span>
                                    <span className={detailValueStyle}>
                                        {clock.progress} / {clock.segments}
                                    </span>
                                </div>
                                {clock.difficultyDC && (
                                    <div className={detailRowStyle}>
                                        <span className={detailLabelStyle}>Difficulty</span>
                                        <span className={detailValueStyle}>DC {clock.difficultyDC}</span>
                                    </div>
                                )}
                                {clock.allies.length > 0 && (
                                    <div className={detailRowStyle}>
                                        <span className={detailLabelStyle}>Allies</span>
                                        <span className={detailValueStyle}>
                                            {clock.allies.join(', ')}
                                        </span>
                                    </div>
                                )}
                                {clock.enemies.length > 0 && (
                                    <div className={detailRowStyle}>
                                        <span className={detailLabelStyle}>Enemies</span>
                                        <span className={detailValueStyle}>
                                            {clock.enemies.join(', ')}
                                        </span>
                                    </div>
                                )}
                                <div className={detailRowStyle}>
                                    <span className={detailLabelStyle}>Events</span>
                                    <span className={detailValueStyle}>{clock.events.length}</span>
                                </div>
                            </div>

                            {/* Delete Confirmation */}
                            {showDeleteConfirm === clock.id && (
                                <div className={modalOverlayStyle} onClick={() => setShowDeleteConfirm(null)}>
                                    <div className={confirmDialogStyle} onClick={(e) => e.stopPropagation()}>
                                        <h3 className={confirmTitleStyle}>Delete Clock?</h3>
                                        <p className={confirmMessageStyle}>
                                            Are you sure you want to delete "{clock.objective}"? This action cannot be undone.
                                        </p>
                                        <div className={confirmActionsStyle}>
                                            <button
                                                onClick={() => setShowDeleteConfirm(null)}
                                                className={buttonStyle('secondary')}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClock(clock.id)}
                                                className={buttonStyle('danger')}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className={emptyStateStyle}>
                    <div className={emptyStateIconStyle}>⏰</div>
                    <div className={emptyStateTextStyle}>
                        {filterStatus === 'all' 
                            ? 'No clocks yet' 
                            : `No ${filterStatus} clocks`}
                    </div>
                    <div className={emptyStateSubtextStyle}>
                        Click "Add Clock" to create your first faction clock
                    </div>
                </div>
            )}

            {/* Clock Form Modal */}
            {isClockFormOpen && (
                <div className={modalOverlayStyle} onClick={closeClockForm}>
                    <div className={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                        <div className={modalHeaderStyle}>
                            <h3 className={modalTitleStyle}>
                                {editingClock ? 'Edit Clock' : 'New Clock'}
                            </h3>
                            <button onClick={closeClockForm} className={closeButtonStyle}>
                                ×
                            </button>
                        </div>
                        <ClockForm
                            clock={editingClockData}
                            onSubmit={editingClock ? handleEditClock : handleAddClock}
                            onCancel={closeClockForm}
                            availableFactions={availableFactions}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
