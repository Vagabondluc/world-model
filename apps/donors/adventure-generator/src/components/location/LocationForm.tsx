
import React, { FC } from 'react';
import { z } from 'zod';
import { css } from '@emotion/css';
import { ManagedLocation, Region, BiomeType } from '../../types/location';
import { BIOME_CONFIG } from '../../data/constants';
import { ManagedLocationSchema } from '../../schemas/location';
import { useZodForm } from '../../hooks/useZodForm';
import { Modal } from '../common/Modal';
import { StringListInput } from '../common/StringListInput';
import { useLocationStore } from '../../stores/locationStore';

interface LocationFormProps {
    location: Partial<ManagedLocation>;
    regions: Region[];
    onSave: (location: ManagedLocation) => void;
    onClose: () => void;
    onDelete: (locationId: string) => void;
}

const styles = {
    form: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-l);
    `,
    row: css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-l);
        @media (max-width: 600px) { grid-template-columns: 1fr; }
    `,
    field: css`
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
    dangerBtn: css`
        background-color: var(--error-red);
        color: #fff;
        border: none;
        padding: var(--space-s) var(--space-m);
        border-radius: var(--border-radius);
        cursor: pointer;
        margin-right: auto;
        &:hover { background-color: #801d1d; }
    `,
    subMapSection: css`
        background: rgba(0,0,0,0.03);
        padding: var(--space-m);
        border-radius: var(--border-radius);
        border: 1px dashed var(--medium-brown);
    `
};

const FormDateSchema = z.union([z.date(), z.string()]);

const LocationFormSchema = ManagedLocationSchema.extend({
    id: z.string().optional(),
    createdAt: FormDateSchema.optional(),
    lastModified: FormDateSchema.optional()
});

type LocationFormType = z.infer<typeof LocationFormSchema>;

const DEFAULT_LOCATION: LocationFormType = {
    name: '', description: '', type: 'Special Location',
    mapId: '', 
    hexCoordinate: { q: 0, r: 0 }, biome: 'grassland', regionId: '',
    isKnownToPlayers: false, discoveryStatus: 'undiscovered',
    connectedLocations: [], loreReferences: [], customTags: [], notes: '',
    id: undefined,
    createdAt: undefined,
    lastModified: undefined,
    associatedMapId: undefined
};

export const LocationForm: FC<LocationFormProps> = ({ location, regions, onSave, onClose, onDelete }) => {
    const activeMapId = useLocationStore(s => s.activeMapId);
    const addMap = useLocationStore(s => s.addMap);
    const { values, errors, handleChange, setValue, validate } = useZodForm<LocationFormType>({
        schema: LocationFormSchema,
        initialValues: { ...DEFAULT_LOCATION, ...location, hexCoordinate: { ...DEFAULT_LOCATION.hexCoordinate, ...(location.hexCoordinate || {}) } }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            if (!activeMapId) {
                console.error("Cannot save location: No active map ID.");
                return;
            }
            const saveData = { ...values, mapId: values.mapId || activeMapId, id: values.id || '', createdAt: values.createdAt || new Date(), lastModified: new Date() };
            onSave(saveData as ManagedLocation);
        }
    };

    const handleCreateSubMap = () => {
        if (values.name) {
            const newMap = addMap({
                name: `${values.name} (Sub-Map)`,
                description: `Local map for ${values.name}.`,
            });
            setValue('associatedMapId', newMap.id);
        } else {
            alert('Please name the location first.');
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={location.id ? 'Edit Location' : 'Create New Location'} size="large">
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                    <label htmlFor="loc-name">Name</label>
                    <input type="text" id="loc-name" value={values.name} onChange={e => handleChange('name', e.target.value)} className={errors.name ? 'error' : ''} />
                    {errors.name && <span className="field-error">{errors.name}</span>}
                </div>

                <div className={styles.field}>
                    <label htmlFor="loc-desc">Description</label>
                    <textarea id="loc-desc" value={values.description} onChange={e => handleChange('description', e.target.value)} rows={3} className={errors.description ? 'error' : ''} />
                    {errors.description && <span className="field-error">{errors.description}</span>}
                </div>

                <div className={styles.row}>
                    <div className={styles.field}>
                        <label htmlFor="loc-type">Type</label>
                        <select id="loc-type" value={values.type} onChange={e => handleChange('type', e.target.value)}>
                            <option value="Special Location">Special Location</option>
                            <option value="Settlement">Settlement</option>
                            <option value="Dungeon">Dungeon</option>
                            <option value="Battlemap">Battlemap</option>
                        </select>
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="loc-region">Region</label>
                        <select id="loc-region" value={values.regionId} onChange={e => handleChange('regionId', e.target.value)}>
                            <option value="">No Region</option>
                            {regions.map(r => (<option key={r.id} value={r.id}>{r.name}</option>))}
                        </select>
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.field}>
                        <label htmlFor="loc-biome">Biome</label>
                        <select id="loc-biome" value={values.biome} onChange={e => handleChange('biome', e.target.value as BiomeType)}>
                            {Object.entries(BIOME_CONFIG).map(([key, biome]) => (<option key={key} value={key}>{biome.name}</option>))}
                        </select>
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="loc-status">Discovery Status</label>
                        <select id="loc-status" value={values.discoveryStatus} onChange={e => handleChange('discoveryStatus', e.target.value)}>
                            <option value="undiscovered">Undiscovered</option>
                            <option value="rumored">Rumored</option>
                            <option value="explored">Explored</option>
                            <option value="mapped">Mapped</option>
                        </select>
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.field}>
                        <label>Hex Q</label>
                        <input type="number" value={values.hexCoordinate.q} onChange={e => setValue('hexCoordinate', { ...values.hexCoordinate, q: parseInt(e.target.value) || 0 })} />
                    </div>
                    <div className={styles.field}>
                        <label>Hex R</label>
                        <input type="number" value={values.hexCoordinate.r} onChange={e => setValue('hexCoordinate', { ...values.hexCoordinate, r: parseInt(e.target.value) || 0 })} />
                    </div>
                </div>

                <label className="custom-checkbox" style={{ marginBottom: 0 }}>
                    <input type="checkbox" checked={values.isKnownToPlayers} onChange={e => handleChange('isKnownToPlayers', e.target.checked)} />
                    <span className="checkmark"></span>Known to Players
                </label>
                
                <StringListInput label="Tags" items={values.customTags || []} onChange={tags => setValue('customTags', tags)} />
                
                <div className={styles.field}>
                    <label htmlFor="loc-notes">GM Notes</label>
                    <textarea id="loc-notes" value={values.notes} onChange={e => handleChange('notes', e.target.value)} rows={3} placeholder="Secrets, hooks..." />
                </div>
                
                <div className={styles.subMapSection}>
                    <label>Sub-Map Integration</label>
                    {values.associatedMapId ? (
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                             <span>✅ Linked to Map ID: <small>{values.associatedMapId}</small></span>
                             <button type="button" className="secondary-button" style={{padding: '4px 8px', fontSize: '0.8rem'}} onClick={() => setValue('associatedMapId', undefined)}>Unlink</button>
                        </div>
                    ) : (
                        <button type="button" className="secondary-button" onClick={handleCreateSubMap}>+ Create Sub-Map for this Location</button>
                    )}
                </div>
                
                <div className={styles.actions}>
                    {location.id && <button type="button" className={styles.dangerBtn} onClick={() => onDelete(location.id!)}>Delete</button>}
                    <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
                    <button type="submit" className="primary-button">{location.id ? 'Update' : 'Create'}</button>
                </div>
            </form>
        </Modal>
    );
};
