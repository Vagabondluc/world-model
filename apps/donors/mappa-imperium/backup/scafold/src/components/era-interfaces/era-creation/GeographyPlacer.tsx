import React, { useState, useCallback } from 'react';
import DiceRoller from './DiceRoller';
import RegionMap from './RegionMap';

export type GeographyType = 'Savanna' | 'Wetlands' | 'Hills' | 'Lake' | 'River' | 'Forest' | 'Mountains' | 'Desert' | 'Jungle' | 'Canyon' | 'Volcano';

export interface PlacedGeography {
    type: GeographyType;
    x: number;
    y: number;
}

const GEOGRAPHY_COUNT = 8;

const GeographyPlacer = () => {
    const [placedGeography, setPlacedGeography] = useState<PlacedGeography[]>([]);
    const [currentRoll, setCurrentRoll] = useState<{ roll: number; type: GeographyType } | null>(null);

    const handleRoll = useCallback((roll: number, type: GeographyType) => {
        setCurrentRoll({ roll, type });
    }, []);

    const handlePlacement = useCallback((x: number, y: number) => {
        if (!currentRoll) return;

        setPlacedGeography(prev => [...prev, { type: currentRoll.type, x, y }]);
        setCurrentRoll(null);
    }, [currentRoll]);

    const isComplete = placedGeography.length >= GEOGRAPHY_COUNT;
    const isPlacing = currentRoll !== null;

    return (
        <div className="space-y-6">
            <header>
                 <h2 className="text-3xl font-bold text-amber-800">1.2 Geography Placement</h2>
                 <p className="mt-2 text-lg text-gray-600">Roll the dice 8 times to determine the geography of your region, then place it on the map.</p>
            </header>
            
            <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
                <p className="text-xl font-semibold text-amber-800">
                    Progress: <span className="font-bold">{placedGeography.length} / {GEOGRAPHY_COUNT}</span> geography features placed.
                </p>
                {isComplete && <p className="mt-1 font-bold text-green-700">Geography placement complete!</p>}
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-1 space-y-4">
                    <DiceRoller onRoll={handleRoll} disabled={isPlacing || isComplete} />
                    {isPlacing && (
                         <div className="p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-800 rounded-r-lg animate-pulse">
                            <p className="font-bold">Place your {currentRoll.type} on the map below.</p>
                        </div>
                    )}
                </div>

                <div className="md:col-span-2">
                    <RegionMap 
                        placedGeography={placedGeography} 
                        onPlace={handlePlacement}
                        placementType={currentRoll?.type}
                    />
                </div>
            </div>
        </div>
    );
};

export default GeographyPlacer;