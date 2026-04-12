// @ts-nocheck
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { GenerationParams } from '../types';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultOpen = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-stone-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-stone-50 hover:bg-stone-100 transition-colors"
      >
        <h3 className="text-sm font-semibold text-stone-700">{title}</h3>
        <ChevronDown
          className={`w-4 h-4 text-stone-500 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && (
        <div className="px-4 py-3 bg-white border-t border-stone-200 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
};

interface ParameterSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  unit?: string;
}

export const ParameterSlider: React.FC<ParameterSliderProps> = ({
  label,
  value,
  min,
  max,
  step = 0.1,
  onChange,
  unit = '',
}) => {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <label className="text-xs font-medium text-stone-600">{label}</label>
        <span className="font-mono text-xs text-stone-500">
          {value.toFixed(2)}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
      />
    </div>
  );
};

interface ParameterToggleProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  description?: string;
}

export const ParameterToggle: React.FC<ParameterToggleProps> = ({
  label,
  value,
  onChange,
  description,
}) => {
  return (
    <label className="flex items-start justify-between p-2 rounded-lg hover:bg-stone-50 cursor-pointer">
      <div>
        <p className="text-xs font-medium text-stone-700">{label}</p>
        {description && (
          <p className="text-[10px] text-stone-500 mt-0.5">{description}</p>
        )}
      </div>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-emerald-600 mt-0.5"
      />
    </label>
  );
};

interface SelectInputProps {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  value,
  options,
  onChange,
}) => {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-stone-600 block">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
