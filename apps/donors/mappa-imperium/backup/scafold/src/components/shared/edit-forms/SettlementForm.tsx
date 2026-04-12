import React from 'react';
import type { ElementFormProps, Settlement } from '../../../types';

const settlementPurposes = [ "Food", "Mining", "Industry", "Trade", "Military", "Religion", "Capital" ];

export const SettlementForm = ({ data, onDataChange, isReadOnly }: ElementFormProps<Settlement>) => {
    const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 disabled:bg-gray-100 bg-white text-gray-900";

    return (
        <>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                <select value={data.purpose} onChange={e => onDataChange({ purpose: e.target.value })} disabled={isReadOnly} className={`${inputClasses} capitalize`}>
                    {settlementPurposes.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={data.description} onChange={(e) => onDataChange({ description: e.target.value })} rows={6} className={inputClasses} required disabled={isReadOnly} />
            </div>
        </>
    );
};
