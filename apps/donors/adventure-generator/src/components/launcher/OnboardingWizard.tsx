import React, { useState } from 'react';
import { css } from '@emotion/css';
import { Modal } from '../common/Modal';
import { FileSystemStore } from '../../services/fileSystemStore';

interface OnboardingWizardProps {
    onComplete: (rootPath: string) => void;
    onCancel: () => void;
}

const styles = {
    form: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-l);
    `,
    section: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-s);
    `,
    label: css`
        font-weight: 700;
        color: var(--dark-brown);
        font-family: var(--header-font);
    `,
    input: css`
        width: 100%;
        padding: 0.8rem 1rem;
        border: 1px solid var(--border-light);
        border-radius: var(--border-radius);
        background: var(--input-bg);
        color: var(--text-color);
        font-family: var(--body-font);

        &:focus {
            outline: 2px solid var(--dnd-red);
            outline-offset: 1px;
        }
    `,
    helper: css`
        color: var(--medium-brown);
        font-size: 0.9rem;
        line-height: 1.5;
    `,
    row: css`
        display: flex;
        gap: var(--space-s);
        align-items: center;
        flex-wrap: wrap;
    `,
    path: css`
        flex: 1;
        min-width: 220px;
        padding: 0.8rem 1rem;
        border: 1px solid var(--border-light);
        border-radius: var(--border-radius);
        background: rgba(255, 255, 255, 0.45);
        color: var(--text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    `,
    actions: css`
        display: flex;
        justify-content: flex-end;
        gap: var(--space-s);
        padding-top: var(--space-s);
        border-top: 1px solid rgba(124, 82, 42, 0.15);
    `,
    error: css`
        color: var(--dnd-red);
        font-size: 0.95rem;
        font-weight: 600;
    `,
};

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete, onCancel }) => {
    const [campaignName, setCampaignName] = useState('New Adventure');
    const [rootPath, setRootPath] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleBrowse = async () => {
        setError(null);
        try {
            const selected = await FileSystemStore.openCampaignDialog();
            if (selected) {
                setRootPath(selected);
            }
        } catch (e) {
            console.error('Failed to choose campaign folder', e);
            setError('Could not open the folder picker.');
        }
    };

    const handleCreate = async () => {
        const name = campaignName.trim();
        if (!rootPath) {
            setError('Choose a campaign folder first.');
            return;
        }
        if (!name) {
            setError('Enter a campaign name.');
            return;
        }

        setIsCreating(true);
        setError(null);
        try {
            await FileSystemStore.initializeCampaign(rootPath, name);
            onComplete(rootPath);
        } catch (e) {
            console.error('Failed to create campaign', e);
            setError((e as Error).message || 'Could not create the campaign.');
            setIsCreating(false);
        }
    };

    return (
        <Modal isOpen onClose={onCancel} title="Create Campaign">
            <form
                className={styles.form}
                onSubmit={(event) => {
                    event.preventDefault();
                    void handleCreate();
                }}
            >
                <div className={styles.section}>
                    <div className={styles.label}>Campaign name</div>
                    <input
                        className={styles.input}
                        type="text"
                        value={campaignName}
                        onChange={(event) => setCampaignName(event.target.value)}
                        placeholder="New Adventure"
                        autoFocus
                    />
                    <div className={styles.helper}>
                        This becomes the visible world name in the campaign config.
                    </div>
                </div>

                <div className={styles.section}>
                    <div className={styles.label}>Campaign folder</div>
                    <div className={styles.row}>
                        <div className={styles.path} title={rootPath || ''}>
                            {rootPath || 'No folder selected'}
                        </div>
                        <button type="button" className="secondary-button" onClick={handleBrowse}>
                            Browse
                        </button>
                    </div>
                    <div className={styles.helper}>
                        Durable state will be written into the selected folder, including the canonical <code>world-model</code> bundle.
                    </div>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.actions}>
                    <button type="button" className="secondary-button" onClick={onCancel} disabled={isCreating}>
                        Cancel
                    </button>
                    <button type="submit" className="primary-button" disabled={isCreating || !rootPath}>
                        {isCreating ? 'Creating...' : 'Create Campaign'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
