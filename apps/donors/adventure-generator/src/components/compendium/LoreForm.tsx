
import React, { FC } from 'react';
import { z } from 'zod';
import { css } from '@emotion/css';
import { LoreEntry } from '../../types/compendium';
import { LoreEntrySchema } from '../../schemas/lore';
import { useZodForm } from '../../hooks/useZodForm';
import { Modal } from '../common/Modal';
import { StringListInput } from '../common/StringListInput';

interface LoreFormProps {
    lore: LoreEntry | null;
    loreTypes: Array<{ value: string; label: string; icon: string }>;
    allTags: string[];
    onSave: (lore: Partial<LoreEntry>) => void;
    onClose: () => void;
    onDelete: (loreId: string) => void;
}

const LoreFormSchema = LoreEntrySchema.extend({
    id: z.string().optional(),
    createdAt: z.date().optional(),
    lastModified: z.date().optional()
});

type LoreFormType = z.infer<typeof LoreFormSchema>;

const DEFAULT_LORE: LoreFormType = {
    type: 'custom',
    title: '',
    content: '',
    tags: [],
    relatedLocationIds: [],
    relatedNpcIds: [],
    relatedFactionsIds: [],
    isPublicKnowledge: true,
    sources: []
};

const styles = {
    form: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-m);
    `,
    row: css`
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: var(--space-m);
        @media (max-width: 600px) { grid-template-columns: 1fr; }
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
    `
};

export const LoreForm: FC<LoreFormProps> = ({ lore, loreTypes, allTags, onSave, onClose, onDelete }) => {
    const { values, errors, handleChange, setValue, validate } = useZodForm<LoreFormType>({
        schema: LoreFormSchema,
        initialValues: { ...DEFAULT_LORE, ...lore }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSave(values as LoreEntry);
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={lore ? 'Edit Lore Entry' : 'Create New Lore Entry'} size="large">
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.row}>
                    <div className="form-group">
                        <label htmlFor="lore-title">Title</label>
                        <input 
                            type="text" id="lore-title" value={values.title || ''} 
                            onChange={(e) => handleChange('title', e.target.value)} 
                            className={errors.title ? 'error' : ''}
                        />
                        {errors.title && <span className="field-error">{errors.title}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="lore-type">Type</label>
                        <select id="lore-type" value={values.type || 'custom'} onChange={(e) => handleChange('type', e.target.value)}>
                            {loreTypes.map(type => (<option key={type.value} value={type.value}>{type.icon} {type.label}</option>))}
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="lore-content">Content</label>
                    <textarea 
                        id="lore-content" value={values.content || ''} 
                        onChange={(e) => handleChange('content', e.target.value)} rows={10} 
                        placeholder="Write your lore content here..." className={errors.content ? 'error' : ''}
                    />
                    {errors.content && <span className="field-error">{errors.content}</span>}
                </div>
                <div className="form-group">
                    <label className="custom-checkbox">
                        <input type="checkbox" checked={values.isPublicKnowledge ?? true} onChange={(e) => handleChange('isPublicKnowledge', e.target.checked)} />
                        <span className="checkmark"></span>Public Knowledge
                    </label>
                </div>

                <StringListInput 
                    label="Tags"
                    items={values.tags || []}
                    onChange={(newTags) => setValue('tags', newTags)}
                    placeholder="Add a tag..."
                    suggestions={allTags}
                />

                <StringListInput 
                    label="Sources"
                    items={values.sources || []}
                    onChange={(newSources) => setValue('sources', newSources)}
                    placeholder="Add a source (e.g., Player Handbook pg. 42)..."
                />

                <div className={styles.actions}>
                    {lore && (<button type="button" onClick={() => onDelete(lore.id!)} className={styles.dangerBtn}>Delete</button>)}
                    <button type="button" onClick={onClose} className="secondary-button">Cancel</button>
                    <button type="submit" className="primary-button">{lore ? 'Update Lore' : 'Create Lore'}</button>
                </div>
            </form>
        </Modal>
    );
};
