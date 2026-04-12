import React from 'react';
import { Blocks, ToggleLeft, ToggleRight } from 'lucide-react';

interface AddonCardProps {
    name: string;
    description: string;
    isActive: boolean;
    onToggle: (enabled: boolean) => void;
}

export const AddonCard: React.FC<AddonCardProps> = ({ name, description, isActive, onToggle }) => {
    return (
        <div className={`
            group relative p-4 rounded-xl border transition-all duration-300
            ${isActive
                ? 'bg-purple-500/10 border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                : 'bg-white/5 border-white/10 hover:bg-white/10'}
        `}>
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 text-purple-300">
                    <Blocks className="w-5 h-5" />
                    <h3 className="font-bold">{name}</h3>
                </div>
                <button
                    onClick={() => onToggle(!isActive)}
                    className={`transition-colors ${isActive ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    {isActive ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                </button>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed">
                {description}
            </p>

            {isActive && (
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-purple-500/20 pointer-events-none" />
            )}
        </div>
    );
};
