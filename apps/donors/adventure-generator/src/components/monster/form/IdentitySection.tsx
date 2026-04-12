
import React, { FC } from 'react';
import { css } from '@emotion/css';
import { ALIGNMENTS, MONSTER_TYPES, CREATURE_ROLES } from '../../../data/constants';
import { useMonsterCreatorStore } from '@/stores/monsterCreatorStore';

const styles = {
    section: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-m);
        padding: var(--space-m);
        background-color: #fff;
        border-radius: var(--border-radius);
        border: 1px solid var(--border-light);
        box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    `,
    header: css`
        font-family: var(--header-font);
        font-size: 1.2rem;
        color: var(--dnd-red);
        border-bottom: 2px solid var(--medium-brown);
        padding-bottom: 6px;
        margin: 0 0 8px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `,
    grid2: css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-m);
        @media (max-width: 600px) { grid-template-columns: 1fr; }
    `,
    grid3: css`
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: var(--space-m);
        @media (max-width: 600px) { grid-template-columns: 1fr; }
    `,
    formControl: css`
        display: flex;
        flex-direction: column;
        gap: 6px;
    `,
    label: css`
        font-weight: 700;
        color: var(--dark-brown);
        font-family: var(--header-font);
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    `,
    input: css`
        width: 100%;
        padding: 8px 12px;
        border: 1px solid var(--medium-brown);
        border-radius: var(--border-radius);
        font-size: 0.95rem;
        font-family: var(--body-font);
        color: var(--dark-brown);
        background: #fff;
        transition: all 0.2s ease;

        &:focus {
            outline: none;
            border-color: var(--dnd-red);
            box-shadow: 0 0 0 3px rgba(146, 38, 16, 0.1);
        }
    `,
    select: css`
        width: 100%;
        padding: 8px 12px;
        border: 1px solid var(--medium-brown);
        border-radius: var(--border-radius);
        font-size: 0.95rem;
        font-family: var(--body-font);
        color: var(--dark-brown);
        background-color: #fff;
        cursor: pointer;
        
        &:focus {
            outline: none;
            border-color: var(--dnd-red);
            box-shadow: 0 0 0 3px rgba(146, 38, 16, 0.1);
        }
    `
};

export const IdentitySection: FC = () => {
    const store = useMonsterCreatorStore();

    return (
        <div className={styles.section}>
            <div className={styles.header}>
                <span>1. Core Identity</span>
            </div>

            <div className={styles.formControl}>
                <label className={styles.label}>Name</label>
                <input
                    className={styles.input}
                    type="text"
                    value={store.name}
                    onChange={e => store.setName(e.target.value)}
                    placeholder="e.g. Obsidian Heart Elemental"
                />
            </div>

            <div className={styles.grid2}>
                <div className={styles.formControl}>
                    <label className={styles.label}>Challenge Rating</label>
                    <input
                        className={styles.input}
                        type="number"
                        min="0"
                        max="30"
                        value={store.cr}
                        onChange={e => store.setCr(parseInt(e.target.value) || 0)}
                    />
                </div>
                <div className={styles.formControl}>
                    <label className={styles.label}>Role</label>
                    <select
                        className={styles.select}
                        value={store.role}
                        onChange={e => store.setRole(e.target.value)}
                    >
                        {CREATURE_ROLES.map(r => <option key={r.value} value={r.value}>{r.name}</option>)}
                    </select>
                </div>
            </div>

            <div className={styles.formControl}>
                <label className={styles.label}>Target CR (for Solver)</label>
                <select
                    className={styles.select}
                    value={store.targetCR ?? ''}
                    onChange={e => store.setTargetCR(e.target.value === '' ? null : parseFloat(e.target.value))}
                >
                    <option value="">Select target CR...</option>
                    {[0, 0.125, 0.25, 0.5, ...Array.from({length: 30}, (_, i) => i + 1)].map(cr => (
                        <option key={cr} value={cr}>
                            {cr === 0.125 ? '1/8' : cr === 0.25 ? '1/4' : cr === 0.5 ? '1/2' : cr}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.grid3}>
                <div className={styles.formControl}>
                    <label className={styles.label}>Type</label>
                    <select
                        className={styles.select}
                        value={store.creatureType}
                        onChange={e => store.setCreatureType(e.target.value)}
                    >
                        {MONSTER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div className={styles.formControl}>
                    <label className={styles.label}>Size</label>
                    <select
                        className={styles.select}
                        value={store.size}
                        onChange={e => store.setSize(e.target.value)}
                    >
                        <option value="Tiny">Tiny</option>
                        <option value="Small">Small</option>
                        <option value="Medium">Medium</option>
                        <option value="Large">Large</option>
                        <option value="Huge">Huge</option>
                        <option value="Gargantuan">Gargantuan</option>
                    </select>
                </div>
                <div className={styles.formControl}>
                    <label className={styles.label}>Alignment</label>
                    <select
                        className={styles.select}
                        value={store.alignment}
                        onChange={e => store.setAlignment(e.target.value)}
                    >
                        <option value="Unaligned">Unaligned</option>
                        {ALIGNMENTS.map(a => <option key={a.value} value={a.value}>{a.name}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
};
