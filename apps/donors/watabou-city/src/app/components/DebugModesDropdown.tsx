// @ts-nocheck
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { DebugMode } from '../types';
import { useCityStore } from '../state';

interface DebugModesDropdownProps {
  modes: DebugMode[];
}

export const DebugModesDropdown: React.FC<DebugModesDropdownProps> = ({ modes }) => {
  const [open, setOpen] = useState(false);
  const { toggleDebugMode } = useCityStore();
  const activeCount = modes.filter((m) => m.enabled).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl transition-colors text-sm font-medium text-stone-700"
      >
        <span>
          Debug Modes{activeCount > 0 && <span className="ml-2 font-bold text-emerald-600">({activeCount})</span>}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-stone-500 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-stone-200 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="max-h-72 overflow-y-auto">
            {modes.map((mode) => (
              <label
                key={mode.id}
                className="flex items-start gap-3 px-4 py-3 hover:bg-stone-50 cursor-pointer border-b border-stone-100 last:border-b-0"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={mode.enabled}
                      onChange={() => toggleDebugMode(mode.id)}
                      className="h-4 w-4 accent-emerald-600 mt-0.5"
                    />
                    <p className="text-sm font-medium text-stone-700">{mode.label}</p>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">{mode.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
