import React from 'react';
import { WorldGenerator } from '../../logic/worldGenerators';

interface GenerationMethodSelectorProps {
    generators: WorldGenerator[];
    onSelect: (generatorId: string) => void;
    onBack: () => void;
}

const GenerationMethodSelector: React.FC<GenerationMethodSelectorProps> = ({ generators, onSelect, onBack }) => {
    return (
        <div className="fixed inset-0 z-50 bg-[#050505] flex items-center justify-center">
            <div className="max-w-5xl w-full p-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-black text-white font-display mb-4">Choose Your Genesis</h1>
                    <p className="text-text-muted text-sm uppercase tracking-widest">Select how you want to forge your world</p>
                </div>

                {/* Generator Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {generators.map(generator => (
                        <button
                            key={generator.id}
                            onClick={() => onSelect(generator.id)}
                            disabled={generator.experimental && generator.id === 'globe'}
                            className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 text-left ${generator.experimental && generator.id === 'globe'
                                    ? 'border-white/10 bg-white/5 opacity-50 cursor-not-allowed'
                                    : 'border-white/20 bg-white/5 hover:border-primary/50 hover:bg-primary/10 hover:shadow-[0_0_40px_rgba(127,19,236,0.3)] cursor-pointer'
                                }`}
                        >
                            {/* Icon */}
                            <div className="flex items-start gap-6 mb-6">
                                <div className={`size-16 rounded-xl flex items-center justify-center ${generator.experimental && generator.id === 'globe'
                                        ? 'bg-white/10 text-white/30'
                                        : 'bg-primary/20 text-primary border border-primary/20 group-hover:border-primary/50'
                                    }`}>
                                    <span className="material-symbols-outlined text-4xl">{generator.icon}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-2xl font-bold text-white">{generator.name}</h2>
                                        {generator.experimental && (
                                            <span className="px-2 py-1 text-[9px] font-bold uppercase tracking-widest bg-amber-500/20 text-amber-500 border border-amber-500/30 rounded">
                                                Coming Soon
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-text-muted leading-relaxed">{generator.description}</p>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="space-y-2">
                                {generator.id === 'classic' && (
                                    <>
                                        <div className="flex items-center gap-2 text-xs text-white/60">
                                            <span className="material-symbols-outlined text-sm text-green-500">check_circle</span>
                                            Fast generation (~100ms)
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-white/60">
                                            <span className="material-symbols-outlined text-sm text-green-500">check_circle</span>
                                            Simple noise patterns
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-white/60">
                                            <span className="material-symbols-outlined text-sm text-green-500">check_circle</span>
                                            Immediate gameplay
                                        </div>
                                    </>
                                )}
                                {generator.id === 'globe' && (
                                    <>
                                        <div className="flex items-center gap-2 text-xs text-white/60">
                                            <span className="material-symbols-outlined text-sm text-primary">pending</span>
                                            3D planet visualization
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-white/60">
                                            <span className="material-symbols-outlined text-sm text-primary">pending</span>
                                            Climate simulation
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-white/60">
                                            <span className="material-symbols-outlined text-sm text-primary">pending</span>
                                            Region extraction
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Hover Effect */}
                            {!generator.experimental && (
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/10 rounded-2xl pointer-events-none transition-all duration-300" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Back Button */}
                <div className="flex justify-center">
                    <button
                        onClick={onBack}
                        className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 text-white font-bold uppercase tracking-widest text-xs rounded-lg transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Back to Main Menu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GenerationMethodSelector;
