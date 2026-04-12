import React from 'react';
import { discoveryEvents } from '../../../data/discoveryEvents';
import HelpTooltip from '../../shared/HelpTooltip';

interface DiscoveryEventSelectorProps {
    selectedRoll: number | '';
    onRollSelect: (roll: number) => void;
    disabled: boolean;
}

const DiscoveryEventSelector = ({ selectedRoll, onRollSelect, disabled }: DiscoveryEventSelectorProps) => {
    const rolls = Object.keys(discoveryEvents).map(Number);

    return (
        <div>
            <label htmlFor="discovery-roll" className="block text-sm font-medium text-gray-700 mb-1">
                Select your Discovery Event (from rule 4.1)
                <HelpTooltip text="Select the event corresponding to your 3d6 roll. This choice determines the type of element you will create and the context for the AI-generated narrative." />
            </label>
            <select
                id="discovery-roll"
                value={selectedRoll}
                onChange={(e) => onRollSelect(Number(e.target.value))}
                disabled={disabled}
                className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-amber-500"
            >
                <option value="" disabled>-- Select your roll --</option>
                {rolls.map(roll => (
                    <option key={roll} value={roll}>
                        {roll}: {discoveryEvents[roll].name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DiscoveryEventSelector;
