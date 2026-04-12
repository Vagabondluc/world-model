import React, { useState, useRef } from 'react';
import type { ElementFormProps, Location } from '../../../types';
import EmojiPicker from '../EmojiPicker';

const siteTypes = [ 'bottomless pit', 'lone mountain', 'hot spring', 'rock tower', 'small lake', 'ancient tree', 'cave', 'volcano', 'grove', 'henge', 'geyser', 'natural' ];

export const LocationForm = ({ data, onDataChange, isReadOnly }: ElementFormProps<Location>) => {
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 disabled:bg-gray-100 bg-white text-gray-900";

    return (
        <>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Site Type</label>
                     <select value={data.siteType} onChange={e => onDataChange({ siteType: e.target.value })} disabled={isReadOnly} className={`${inputClasses} capitalize`}>
                        {siteTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>
                 <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
                    <button ref={triggerRef} type="button" onClick={() => !isReadOnly && setIsPickerOpen(!isPickerOpen)} className={`w-full py-2 border border-gray-300 rounded-md shadow-sm text-2xl ${inputClasses}`} disabled={isReadOnly}>{data.symbol}</button>
                    <EmojiPicker isOpen={isPickerOpen} onClose={() => setIsPickerOpen(false)} onSelect={(emoji) => onDataChange({ symbol: emoji })} triggerRef={triggerRef} />
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={data.description} onChange={(e) => onDataChange({ description: e.target.value })} rows={6} className={inputClasses} required disabled={isReadOnly} />
            </div>
        </>
    );
};
