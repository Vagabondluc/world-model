

import React, { FC, useState } from 'react';
import { css, cx } from '@emotion/css';
import { useCampaignStore } from '../../stores/campaignStore';
import { DATABASE_SOURCES } from '../../data/databaseSources';

const styles = {
    container: css`
        height: 100%;
        display: flex;
        flex-direction: column;
    `,
    layout: css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-xl);
        flex-grow: 1;
        min-height: 0;
        @media (max-width: 900px) {
            grid-template-columns: 1fr;
        }
    `,
    panel: css`
        display: flex;
        flex-direction: column;
        overflow: hidden;
    `,
    list: css`
        flex-grow: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: var(--space-m);
        padding-right: var(--space-s);
    `,
    details: css`
        background-color: rgba(0,0,0,0.03);
        padding: var(--space-l);
        border-radius: var(--border-radius);
        border: 1px solid var(--border-light);
    `,
    dbItem: css`
        padding: var(--space-m);
        border: 2px solid var(--light-brown);
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: all 0.2s ease;
        background-color: var(--parchment-bg);
        &:hover {
            border-color: var(--medium-brown);
            transform: translateY(-2px);
        }
    `,
    selectedItem: css`
        border-color: var(--dnd-red);
        background-color: #fff;
    `,
    itemHeader: css`
        display: flex;
        align-items: center;
        gap: var(--space-m);
    `,
    itemDesc: css`
        font-size: 0.9rem;
        color: var(--medium-brown);
        margin-top: var(--space-s);
    `,
    licenseBadge: css`
        font-size: 0.8rem;
        background-color: var(--medium-brown);
        color: var(--parchment-bg);
        padding: 2px 8px;
        border-radius: 12px;
        white-space: nowrap;
    `,
    detailHeader: css`
        font-family: var(--header-font);
        font-size: 1.2rem;
        margin-bottom: var(--space-m);
        border-bottom: 1px solid var(--light-brown);
        padding-bottom: var(--space-s);
    `,
    detailSection: css`
        margin-bottom: var(--space-m);
        h4 { margin: 0 0 var(--space-xs) 0; font-size: 1rem; color: var(--dark-brown); }
        p, ul { margin: 0; font-size: 0.95rem; }
        ul { padding-left: var(--space-l); }
    `,
    detailActions: css`
        margin-top: var(--space-l);
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-s);
        button { font-size: 0.9rem; padding: 4px 10px; }
    `,
    controlsHeader: css`
        margin-bottom: var(--space-m);
    `
};

export const DatabaseManager: FC = () => {
    const config = useCampaignStore(s => s.config);
    const updateConfig = useCampaignStore(s => s.updateConfig);
    
    const [selectedId, setSelectedId] = useState<string>(config.enabledDatabases?.[0] || DATABASE_SOURCES[0].id);

    const handleToggle = (id: string) => {
        const currentSelection = config.enabledDatabases || [];
        const newSelection = currentSelection.includes(id)
            ? currentSelection.filter(dbId => dbId !== id)
            : [...currentSelection, id];
        updateConfig('enabledDatabases', newSelection);
    };

    const handleSelectAll = () => {
        const allIds = DATABASE_SOURCES.map(db => db.id);
        updateConfig('enabledDatabases', allIds);
    };

    const handleDeselectAll = () => {
        updateConfig('enabledDatabases', []);
    };

    const selectedDbDetails = DATABASE_SOURCES.find(db => db.id === selectedId) || DATABASE_SOURCES[0];

    return (
        <div className={styles.container} style={{ padding: 0, border: 'none' }}>
            <div className={styles.layout}>
                <div className={styles.panel}>
                    <div className={styles.controlsHeader}>
                        <button className="secondary-button" onClick={handleSelectAll}>Select All</button>
                        <button className="secondary-button" onClick={handleDeselectAll} style={{ marginLeft: 'var(--space-s)' }}>Deselect All</button>
                    </div>
                    <div className={styles.list}>
                        {DATABASE_SOURCES.map(db => (
                            <div key={db.id} className={cx(styles.dbItem, { [styles.selectedItem]: selectedId === db.id })} onClick={() => setSelectedId(db.id)}>
                                <div className={styles.itemHeader}>
                                    <label className="custom-checkbox" onClick={e => e.stopPropagation()}>
                                        <input type="checkbox" checked={config.enabledDatabases?.includes(db.id)} onChange={() => handleToggle(db.id)} />
                                        <span className="checkmark"></span>
                                    </label>
                                    <h3 style={{ margin: 0, flexGrow: 1 }}>{db.name}</h3>
                                    <span className={styles.licenseBadge}>{db.license}</span>
                                </div>
                                <p className={styles.itemDesc}>{db.shortDescription}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.panel}>
                    <div className={styles.details}>
                        <h3 className={styles.detailHeader}>📜 License Details</h3>
                        <div className={styles.detailSection}>
                            <h4>License</h4>
                            <p>{selectedDbDetails.licenseDetails.fullName}</p>
                        </div>
                        <div className={styles.detailSection}>
                            <h4>Source</h4>
                            <p>{selectedDbDetails.name}</p>
                        </div>
                        <div className={styles.detailSection}>
                            <h4>You May:</h4>
                            <ul>{selectedDbDetails.licenseDetails.permissions.map((p, i) => <li key={i}>{p}</li>)}</ul>
                        </div>
                        <div className={styles.detailSection}>
                            <h4>You Must:</h4>
                            <ul>{selectedDbDetails.licenseDetails.requirements.map((r, i) => <li key={i}>{r}</li>)}</ul>
                        </div>
                        {selectedDbDetails.licenseDetails.exclusions.length > 0 && (
                            <div className={styles.detailSection}>
                                <h4>Excluded:</h4>
                                <ul>{selectedDbDetails.licenseDetails.exclusions.map((e, i) => <li key={i}>{e}</li>)}</ul>
                            </div>
                        )}
                        <div className={styles.detailActions}>
                            <button className="secondary-button" onClick={() => alert('Coming soon!')}>View Full License</button>
                            <button className="secondary-button" onClick={() => alert('Coming soon!')}>Copy Attribution</button>
                            {selectedDbDetails.licenseDetails.sourceUrl && (
                                <a href={selectedDbDetails.licenseDetails.sourceUrl} target="_blank" rel="noopener noreferrer" className="secondary-button">Open Source Page</a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};