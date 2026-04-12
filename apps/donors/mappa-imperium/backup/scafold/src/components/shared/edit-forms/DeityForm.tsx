import React, { useState, useRef } from 'react';
import type { ElementFormProps, Deity } from '../../../types';
import EmojiPicker from '../EmojiPicker';

export const DeityForm = ({ data, onDataChange, isReadOnly }: ElementFormProps<Deity>) => {
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 disabled:bg-gray-100 bg-white text-gray-900";

    return (
        <>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                    <input type="text" value={data.domain} onChange={e => onDataChange({ domain: e.target.value })} className={inputClasses} required disabled={isReadOnly} />
                </div>
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Map Emoji</label>
                    <button ref={triggerRef} type="button" onClick={() => !isReadOnly && setIsPickerOpen(!isPickerOpen)} className={`w-full py-2 border border-gray-300 rounded-md shadow-sm text-2xl ${inputClasses}`} disabled={isReadOnly}>{data.emoji}</button>
                    <EmojiPicker isOpen={isPickerOpen} onClose={() => setIsPickerOpen(false)} onSelect={(emoji) => onDataChange({ emoji: emoji })} triggerRef={triggerRef} />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Symbol Description</label>
                <input type="text" value={data.symbol} onChange={(e) => onDataChange({ symbol: e.target.value })} className={inputClasses} required disabled={isReadOnly} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={data.description} onChange={(e) => onDataChange({ description: e.target.value })} rows={6} className={inputClasses} required disabled={isReadOnly} />
            </div>
        </>
    );
};
