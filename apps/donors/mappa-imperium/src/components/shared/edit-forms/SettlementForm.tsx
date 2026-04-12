import React from 'react';

export const SettlementForm = ({ data, onDataChange, isReadOnly }: any) => {
    return (
        <div>
            <label className="block text-sm font-bold mb-2">Description</label>
            <textarea
                value={data.desc || ''}
                onChange={e => onDataChange({ desc: e.target.value })}
                disabled={isReadOnly}
                className="w-full border rounded p-2"
                rows={4}
            />
        </div>
    );
};
