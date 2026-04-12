import React from 'react';
import { collapseEvents } from '../../../data/collapseEvents';
import HelpTooltip from '../../shared/HelpTooltip';

interface CollapseEventSelectorProps {
    selectedRoll: number | '';
    onRollSelect: (roll: number) => void;
}

const CollapseEventSelector = ({ selectedRoll, onRollSelect }: CollapseEventSelectorProps) => {
    const rolls = Object.keys(collapseEvents).map(Number);

    return (
        <div>
            <label htmlFor="collapse-roll" className="block text-sm font-medium text-gray-700 mb-1">
                Select your Collapse Event (from rule 6.1)
                <HelpTooltip text="Select the event corresponding to your 3d6 roll. This choice determines the type of element you will create and the context for the AI-generated narrative." />
            </label>
            <select
                id="collapse-roll"
                value={selectedRoll}
                onChange={(e) => onRollSelect(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-amber-500"
            >
                <option value="" disabled>-- Select your roll --</option>
                {rolls.map(roll => (
                    <option key={roll} value={roll}>
                        {roll}: {collapseEvents[roll].name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CollapseEventSelector;