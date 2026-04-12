import React from 'react';
import type { ElementFormProps, Event, War, Monument, Character } from '../../../types';

type GenericData = Event | War | Monument | Character;

export const GenericDescriptionForm = ({ data, onDataChange, isReadOnly }: ElementFormProps<GenericData>) => {
    const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 disabled:bg-gray-100 bg-white text-gray-900";

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={data.description} onChange={(e) => onDataChange({ description: e.target.value })} rows={10} className={inputClasses} required disabled={isReadOnly} />
        </div>
    );
};
