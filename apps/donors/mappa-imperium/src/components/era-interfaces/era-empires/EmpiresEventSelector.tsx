import React from 'react';
import { empiresEvents } from '../../../data/empiresEvents';
import HelpTooltip from '../../shared/HelpTooltip';

interface EmpiresEventSelectorProps {
    selectedRoll: number | '';
    onRollSelect: (roll: number) => void;
}

const EmpiresEventSelector = ({ selectedRoll, onRollSelect }: EmpiresEventSelectorProps) => {
    const rolls = Object.keys(empiresEvents).map(Number);

    return (
        <div>
            <label htmlFor="empires-roll" className="block text-sm font-medium text-gray-700 mb-1">
                Select your Empire Event (from rule 5.1)
                <HelpTooltip text="Select the event corresponding to your 3d6 roll. This choice determines the type of element you will create and the context for the AI-generated narrative." />
            </label>
            <select
                id="empires-roll"
                value={selectedRoll}
                onChange={(e) => onRollSelect(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-amber-500"
            >
                <option value="" disabled>-- Select your roll --</option>
                {rolls.map(roll => (
                    <option key={roll} value={roll}>
                        {roll}: {empiresEvents[roll].name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default EmpiresEventSelector;
