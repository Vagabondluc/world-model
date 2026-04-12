
import React, { FC, useState } from 'react';
import { css } from '@emotion/css';

const styles = {
    addForm: css`
        margin-top: var(--space-l);
        padding-top: var(--space-l);
        border-top: 1px solid var(--medium-brown);
        display: flex;
        gap: var(--space-m);
        align-items: flex-end;
        flex-wrap: wrap;
    `
};

interface AddCombatantFormProps {
    onAdd: (data: { name: string, initBonus: number, hp: number, ac: number, xp: number, type: 'player' | 'npc' }) => void;
}

export const AddCombatantForm: FC<AddCombatantFormProps> = ({ onAdd }) => {
    const [newName, setNewName] = useState('');
    const [newInit, setNewInit] = useState('0');
    const [newHP, setNewHP] = useState('10');
    const [newAC, setNewAC] = useState('10');
    const [newXP, setNewXP] = useState('0');
    const [newType, setNewType] = useState<'player' | 'npc'>('npc');

    const handleAdd = () => {
        if (!newName) return;
        onAdd({
            name: newName,
            initBonus: parseInt(newInit) || 0,
            hp: parseInt(newHP) || 10,
            ac: parseInt(newAC) || 10,
            xp: parseInt(newXP) || 0,
            type: newType
        });
        setNewName('');
        setNewInit('0');
        setNewHP('10');
        setNewAC('10');
        setNewXP('0');
    };

    return (
        <div className={styles.addForm}>
            <div className="form-group" style={{flex: 2, marginBottom: 0}}>
                <label>Name</label>
                <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Goblin 1" />
            </div>
            <div className="form-group" style={{flex: 1, marginBottom: 0}}>
                <label>Init Bonus</label>
                <input type="number" value={newInit} onChange={e => setNewInit(e.target.value)} />
            </div>
            <div className="form-group" style={{flex: 1, marginBottom: 0}}>
                <label>HP</label>
                <input type="number" value={newHP} onChange={e => setNewHP(e.target.value)} />
            </div>
            <div className="form-group" style={{flex: 1, marginBottom: 0}}>
                <label>AC</label>
                <input type="number" value={newAC} onChange={e => setNewAC(e.target.value)} />
            </div>
            <div className="form-group" style={{flex: 1, marginBottom: 0}}>
                <label>XP</label>
                <input type="number" value={newXP} onChange={e => setNewXP(e.target.value)} disabled={newType === 'player'} />
            </div>
            <div className="form-group" style={{flex: 1, marginBottom: 0}}>
                <label>Type</label>
                <select
                    value={newType}
                    onChange={e => setNewType(e.target.value === 'player' ? 'player' : 'npc')}
                >
                    <option value="npc">NPC</option>
                    <option value="player">Player</option>
                </select>
            </div>
            <button className="action-button" onClick={handleAdd} style={{height: '42px'}}>Add Combatant</button>
        </div>
    );
};
