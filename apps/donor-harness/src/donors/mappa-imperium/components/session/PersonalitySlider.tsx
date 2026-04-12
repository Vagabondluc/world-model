import React from 'react';
import { componentStyles } from '../../design/tokens';
import { cn } from '../../utils/cn';

export interface PersonalitySliderProps {
    label: string;
    value: number;
    description: string;
    onChange: (value: number) => void;
}

export const PersonalitySlider = ({ label, value, description, onChange }: PersonalitySliderProps) => (
    <div>
        <label className={cn(componentStyles.form.label, "flex justify-between")}>
            <span>{label}</span>
            <span className="font-bold text-amber-700">{value}</span>
        </label>
        <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            className={componentStyles.input.range}
            title={description}
        />
        <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
);
