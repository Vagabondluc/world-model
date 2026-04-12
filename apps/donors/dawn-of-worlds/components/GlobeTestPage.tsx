/**
 * Debug test page for globe renderer
 */

import React, { useState } from 'react';

import GlobeRenderer from './globe/GlobeRenderer';
import { GeneratorType } from '../logic/globe/overlay/hexGrid';

const GlobeTestPage: React.FC = () => {
    const [subdivisions, setSubdivisions] = useState(3);
    const [generatorType, setGeneratorType] = useState<GeneratorType>(GeneratorType.SIMPLEX);
    const [seed, setSeed] = useState(Date.now());

    const handleSeedChange = () => {
        setSeed(Date.now());
    };

    return (
        <div className="h-screen w-screen bg-[#050505] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-white/5">
                <h1 className="text-3xl font-black text-white font-display mb-2">
                    🌍 Globe Renderer Test
                </h1>
                <p className="text-text-muted text-sm">
                    Epic 045 Phase 2 - Three.js Integration
                </p>
            </div>

            {/* Controls */}
            <div className="p-6 border-b border-white/10 bg-white/5 flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <label className="text-white text-sm font-bold">Subdivision Level:</label>
                    <input
                        type="range"
                        min="0"
                        max="4"
                        value={subdivisions}
                        onChange={(e) => setSubdivisions(Number(e.target.value))}
                        className="w-48"
                    />
                    <span className="text-primary font-mono text-sm">S{subdivisions}</span>
                </div>

                <div className="flex items-center gap-4 text-xs text-text-muted">
                    <div>
                        <span className="font-bold">Vertices:</span>{' '}
                        {subdivisions === 0 && '12'}
                        {subdivisions === 1 && '42'}
                        {subdivisions === 2 && '162'}
                        {subdivisions === 3 && '642'}
                        {subdivisions === 4 && '2562'}
                    </div>
                </div>

                <div className="h-8 w-px bg-white/10 mx-2"></div>

                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <label className="text-white text-xs font-bold mb-1">Generator:</label>
                        <div className="flex bg-black/40 rounded p-1 gap-1">
                            <button
                                onClick={() => setGeneratorType(GeneratorType.SIMPLE)}
                                className={`px-2 py-1 text-xs rounded ${generatorType === GeneratorType.SIMPLE ? 'bg-primary text-black font-bold' : 'text-text-muted hover:text-white'}`}
                            >
                                Simple
                            </button>
                            <button
                                onClick={() => setGeneratorType(GeneratorType.SIMPLEX)}
                                className={`px-2 py-1 text-xs rounded ${generatorType === GeneratorType.SIMPLEX ? 'bg-primary text-black font-bold' : 'text-text-muted hover:text-white'}`}
                            >
                                Simplex
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-white text-xs font-bold mb-1">Seed:</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={seed}
                                onChange={(e) => setSeed(Number(e.target.value))}
                                className="w-24 bg-black/40 border border-white/10 rounded px-2 text-xs text-white"
                            />
                            <button
                                onClick={handleSeedChange}
                                className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs text-white"
                            >
                                🎲
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Globe Renderer */}
            <div className="flex-1 relative">
                <GlobeRenderer
                    radius={1.0}
                    subdivisions={subdivisions}
                    generatorType={generatorType}
                    seed={seed}
                    key={`${subdivisions}-${generatorType}-${seed}`} // Force re-render on any change
                />

                {/* Instructions */}
                <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-sm border border-white/10 rounded-lg p-4 text-xs text-white/70 max-w-xs">
                    <div className="font-bold text-white mb-2">Controls:</div>
                    <div className="space-y-1">
                        <div>• <span className="text-primary">Left Click + Drag</span> - Rotate</div>
                        <div>• <span className="text-primary">Right Click + Drag</span> - Pan</div>
                        <div>• <span className="text-primary">Scroll</span> - Zoom</div>
                        <div>• <span className="text-primary">Auto-rotate</span> enabled</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobeTestPage;
