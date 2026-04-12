import React, { useState, useEffect } from 'react';
import { Dices } from 'lucide-react';
import { Button } from '@mi/components/ui/Button';

interface SeedControlsProps {
    seed: string;
    onSeedChange: (seed: string) => void;
    className?: string;
}

export const SeedControls: React.FC<SeedControlsProps> = ({
    seed,
    onSeedChange,
    className = ''
}) => {
    const [inputValue, setInputValue] = useState(seed);
    const [error, setError] = useState<string | null>(null);

    // Sync internal state if prop changes external (e.g. randomize)
    useEffect(() => {
        setInputValue(seed);
        validateSeed(seed);
    }, [seed]);

    const validateSeed = (val: string) => {
        if (!val.trim()) {
            setError('Seed cannot be empty');
            return false;
        }
        if (!/^[a-zA-Z0-9\-_]+$/.test(val)) {
            setError('Alphanumeric, dashes, and underscores only');
            return false;
        }
        if (val.length > 64) {
            setError('Max 64 characters');
            return false;
        }
        setError(null);
        return true;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);
        if (validateSeed(val)) {
            onSeedChange(val);
        }
    };

    const handleRandomize = () => {
        const newSeed = Math.random().toString(36).substring(7).toUpperCase();
        setInputValue(newSeed);
        onSeedChange(newSeed);
        setError(null);
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    World Seed
                </label>
                {error && <span className="text-xs text-red-500 font-medium animate-pulse">{error}</span>}
            </div>

            <div className="flex gap-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleChange}
                        className={`w-full p-2 pr-8 font-mono text-sm border rounded-lg focus:ring-2 focus:outline-none transition-all ${error
                            ? 'border-red-300 bg-red-50 focus:ring-red-200 text-red-900'
                            : 'border-stone-200 bg-stone-50 focus:ring-indigo-500 text-stone-700'
                            }`}
                        placeholder="Enter seed..."
                    />
                </div>

                <Button
                    variant="secondary"
                    onClick={handleRandomize}
                    title="Roll Random Seed"
                    className="px-3 border-stone-200 hover:bg-stone-100 hover:border-stone-300"
                >
                    <Dices className="w-5 h-5 text-stone-600" />
                </Button>
            </div>
        </div>
    );
};
