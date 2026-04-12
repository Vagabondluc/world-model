import React, { useState, useRef } from 'react';
import type { ElementFormProps, Resource } from '../../../types';
import EmojiPicker from '../EmojiPicker';

const resourceTypes: Resource['type'][] = ['mineral', 'flora', 'fauna', 'magical', 'other'];

export const ResourceForm = ({ data, onDataChange, isReadOnly }: ElementFormProps<Resource>) => {
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 disabled:bg-gray-100 bg-white text-gray-900";

    return (
        <>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                        value={data.type}
                        onChange={e => onDataChange({ type: e.target.value as Resource['type'] })}
                        disabled={isReadOnly}
                        className={inputClasses}
                    >
                        {resourceTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
                    <button ref={triggerRef} type="button" onClick={() => !isReadOnly && setIsPickerOpen(!isPickerOpen)} className={`w-full py-2 border border-gray-300 rounded-md shadow-sm text-2xl ${inputClasses}`} disabled={isReadOnly}>{data.symbol}</button>
                    <EmojiPicker isOpen={isPickerOpen} onClose={() => setIsPickerOpen(false)} onSelect={(emoji) => onDataChange({ symbol: emoji })} triggerRef={triggerRef} />
                </div>
            </div>
            <div>
                <label htmlFor="editElementProps" className="block text-sm font-medium text-gray-700 mb-1">
                    Properties & Uniqueness
                </label>
                <textarea id="editElementProps" value={data.properties} onChange={(e) => onDataChange({ properties: e.target.value })} rows={8} className={inputClasses} required disabled={isReadOnly} />
            </div>
        </>
    );
};
