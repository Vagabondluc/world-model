import React, { FC } from 'react';
import { z } from 'zod';
import { css, cx } from '@emotion/css';
import { Region, ManagedLocation, BiomeType } from '../../types/location';
import { BIOME_CONFIG } from '../../data/constants';
import { RegionSchema } from '../../schemas/location';
import { generateId } from '../../utils/helpers';
import { useZodForm } from '../../hooks/useZodForm';
import { Modal } from '../common/Modal';
import { StringListInput } from '../common/StringListInput';
import { useLocationStore } from '../../stores/locationStore';

interface RegionPanelProps {
    region: Partial<Region> | null;
    locations: ManagedLocation[];
    onSave: (region: Partial<Region>) => void;
    onClose: () => void;
    onDelete: (regionId: string) => void;
}

const styles = {
    form: css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-l);
        align-items: start;
        @media (max-width: 768px) {
            grid-template-columns: 1fr;
        }
    `,
    field: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-s);
    `,
    fullWidth: css`
        grid-column: 1 / -1;
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
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        margin-right: auto;
        &:hover{
            background-color:#801d1d;
        }
    `,
    locList: css`
        max-height: 150px;
        overflow-y: auto;
        background: rgba(0,0,0,0.03);
        padding: var(--space-s);
        border-radius: var(--border-radius);
    `,
    locItem: css`
        font-size: 0.9rem;
        padding: 4px;
        border-bottom: 1px solid rgba(0,0,0,0.05);
        &:last-child{
            border-bottom:none;
        }
    `
};

// Updated colors with better opacity for the new renderer
const REGION_COLORS = {
    'rgba(0, 100, 255, 0.2)': 'Blue',
    'rgba(220, 20, 60, 0.2)': 'Crimson',
    'rgba(34, 139, 34, 0.2)': 'Forest Green',
    'rgba(255, 215, 0, 0.2)': 'Gold',
    'rgba(148, 0, 211, 0.2)': 'Violet',
    'rgba(255, 140, 0, 0.2)': 'Orange',
    'rgba(0, 0, 0, 0.2)': 'Shadow (Grey)'
};

const RegionFormSchema = RegionSchema.extend({ id: z.string().optional() });
type RegionFormType = z.infer<typeof RegionFormSchema>;

const DEFAULT_REGION: Partial<RegionFormType> = {
    name: '', description: '', politicalControl: '', dangerLevel: 1, dominantBiome: 'grassland',
    mapId: '', 
    culturalNotes: '', keyFeatures: [], boundingBox: { minQ: -5, maxQ: 5, minR: -5, maxR: 5 }, 
    hexes: [], // Initialize hexes array
    color: 'rgba(0,100,255,0.2)'
};

export const RegionPanel: FC<RegionPanelProps> = ({ region, locations, onSave, onClose, onDelete }) => {
    const activeMapId = useLocationStore(s => s.activeMapId);
    const { values, errors, handleChange, setValue, validate } = useZodForm<RegionFormType>({
        schema: RegionFormSchema, 
        initialValues: { ...DEFAULT_REGION, ...region } as RegionFormType
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            if (!activeMapId) {
                console.error("Cannot save region: No active map ID.");
                return;
            }
            const saveData = { ...values, mapId: values.mapId || activeMapId, id: values.id || generateId() };
            onSave(saveData);
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={region?.id ? 'Edit Region' : 'Create New Region'} size="large">
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={cx(styles.field, styles.fullWidth)}>
                    <label>Region Name</label>
                    <input type="text" value={values.name} onChange={e => handleChange('name', e.target.value)} className={errors.name ? 'error' : ''} />
                    {errors.name && <span className="field-error">{errors.name}</span>}
                </div>

                <div className={cx(styles.field, styles.fullWidth)}>
                    <label>Description</label>
                    <textarea value={values.description} onChange={e => handleChange('description', e.target.value)} rows={3} className={errors.description ? 'error' : ''} />
                    {errors.description && <span className="field-error">{errors.description}</span>}
                </div>
                
                <div className={styles.field}>
                    <label>Political Control</label>
                    <input type="text" value={values.politicalControl} onChange={e => handleChange('politicalControl', e.target.value)} placeholder="e.g. The Crown" className={errors.politicalControl ? 'error' : ''} />
                    {errors.politicalControl && <span className="field-error">{errors.politicalControl}</span>}
                </div>
                
                <div className={styles.field}>
                    <label>Danger Level</label>
                    <select value={values.dangerLevel} onChange={e => handleChange('dangerLevel', parseInt(e.target.value))}>
                        <option value={1}>1 - Safe</option><option value={2}>2 - Low</option><option value={3}>3 - Moderate</option><option value={4}>4 - High</option><option value={5}>5 - Deadly</option>
                    </select>
                </div>

                <div className={styles.field}>
                    <label>Dominant Biome</label>
                    <select value={values.dominantBiome} onChange={e => handleChange('dominantBiome', e.target.value as BiomeType)}>
                        {Object.entries(BIOME_CONFIG).map(([k, b]) => (<option key={k} value={k}>{b.name}</option>))}
                    </select>
                </div>

                <div className={styles.field}>
                    <label>Region Color</label>
                    <select 
                        value={values.color} 
                        onChange={e => handleChange('color', e.target.value)}
                        style={{ borderLeft: `5px solid ${values.color}` }}
                    >
                        {Object.entries(REGION_COLORS).map(([value, name]) => (
                            <option key={value} value={value}>{name}</option>
                        ))}
                    </select>
                </div>

                <div className={cx(styles.field, styles.fullWidth)}>
                    <label>Cultural Notes</label>
                    <textarea value={values.culturalNotes} onChange={e => handleChange('culturalNotes', e.target.value)} rows={3} placeholder="e.g., Taboos, traditions, notable art forms..."/>
                </div>

                <div className={styles.fullWidth}>
                    <StringListInput label="Key Features" items={values.keyFeatures||[]} onChange={f => setValue('keyFeatures', f)} />
                </div>

                {region?.id && (
                    <div className={styles.fullWidth}>
                        <h4>Locations in Region ({locations.length})</h4>
                        {locations.length === 0 ? <p style={{fontStyle:'italic', color:'var(--medium-brown)'}}>None assigned.</p> : (
                            <div className={styles.locList}>
                                {locations.map(l => (<div key={l.id} className={styles.locItem}><strong>{l.name}</strong> [{l.hexCoordinate.q}, {l.hexCoordinate.r}]</div>))}
                            </div>
                        )}
                    </div>
                )}
                <div className={cx(styles.actions, styles.fullWidth)}>
                    {region?.id && <button type="button" className={styles.dangerBtn} onClick={() => onDelete(region.id!)}>Delete Region</button>}
                    <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
                    <button type="submit" className="primary-button">{region?.id ? 'Update' : 'Create'}</button>
                </div>
            </form>
        </Modal>
    );
};