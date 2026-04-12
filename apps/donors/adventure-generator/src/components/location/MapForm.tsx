import React, { FC, useState } from 'react';
import { css } from '@emotion/css';
import { Modal } from '../common/Modal';
import { WorldMap } from '../../types/location';

interface MapFormProps {
    onSave: (mapData: Pick<WorldMap, 'name' | 'description' | 'imageUrl'>) => void;
    onClose: () => void;
}

const styles = {
    form: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-l);
    `,
    formGroup: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-s);
    `,
    actions: css`
        display: flex;
        justify-content: flex-end;
        gap: var(--space-m);
        margin-top: var(--space-l);
        padding-top: var(--space-m);
        border-top: var(--border-light);
    `,
};

export const MapForm: FC<MapFormProps> = ({ onSave, onClose }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Map name is required.');
            return;
        }
        onSave({ name, description, imageUrl });
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Create New Map">
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="map-name">Map Name</label>
                    <input
                        type="text"
                        id="map-name"
                        value={name}
                        onChange={e => { setName(e.target.value); setError(''); }}
                        placeholder="e.g., World Map, Continent of Gwessar"
                        className={error ? 'error' : ''}
                    />
                    {error && <span className="field-error">{error}</span>}
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="map-description">Description (Optional)</label>
                    <textarea
                        id="map-description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={3}
                        placeholder="A brief description of this map..."
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="map-image-url">Map Art URL (Optional)</label>
                    <input
                        type="text"
                        id="map-image-url"
                        value={imageUrl}
                        onChange={e => setImageUrl(e.target.value)}
                        placeholder="https://i.imgur.com/your-map.jpeg"
                    />
                </div>
                <div className={styles.actions}>
                    <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
                    <button type="submit" className="primary-button" disabled={!name.trim()}>Create Map</button>
                </div>
            </form>
        </Modal>
    );
};