
import React from 'react';

interface ToggleButtonProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
    iconOn?: string;
    iconOff?: string;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
    label,
    isActive,
    onClick,
    iconOn = 'toggle_on',
    iconOff = 'toggle_off'
}) => {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${isActive
                    ? 'bg-primary/10 border-primary/40 text-primary'
                    : 'bg-black/20 border-white/5 text-text-muted hover:bg-black/40'
                }`}
        >
            {label}
            <span className="material-symbols-outlined text-sm">
                {isActive ? iconOn : iconOff}
            </span>
        </button>
    );
};
