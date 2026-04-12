import React from 'react';
import type { GeographyType, PlacedGeography } from './GeographyPlacer';

interface RegionMapProps {
    placedGeography: PlacedGeography[];
    onPlace: (x: number, y: number) => void;
    placementType?: GeographyType;
}

const MAP_SIZE = 10;

const geographyStyles: { [key in GeographyType]: { icon: string; color: string } } = {
    Savanna: { icon: '🌾', color: 'bg-yellow-200' },
    Wetlands: { icon: '💧', color: 'bg-teal-300' },
    Hills: { icon: '🌄', color: 'bg-lime-300' },
    Lake: { icon: '🌊', color: 'bg-blue-400' },
    River: { icon: '🏞️', color: 'bg-blue-300' },
    Forest: { icon: '🌲', color: 'bg-green-400' },
    Mountains: { icon: '⛰️', color: 'bg-gray-400' },
    Desert: { icon: '🏜️', color: 'bg-orange-200' },
    Jungle: { icon: '🌴', color: 'bg-emerald-400' },
    Canyon: { icon: '🧱', color: 'bg-red-300' },
    Volcano: { icon: '🌋', color: 'bg-red-500' },
};

const RegionMap = ({ placedGeography, onPlace, placementType }: RegionMapProps) => {
    const grid: (GeographyType | null)[][] = Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(null));

    placedGeography.forEach(item => {
        if (grid[item.y] && grid[item.y][item.x] !== undefined) {
            grid[item.y][item.x] = item.type;
        }
    });

    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
             <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">Your Home Region</h3>
            <div className="grid grid-cols-10 gap-1 aspect-square border-2 border-gray-300 bg-gray-200 p-1">
                {grid.map((row, y) =>
                    row.map((cellType, x) => {
                        const isPlaced = cellType !== null;
                        const canPlace = placementType && !isPlaced;

                        const baseClasses = "w-full h-full flex items-center justify-center text-xl transition-colors duration-150 rounded-sm";
                        let cellClasses = isPlaced ? geographyStyles[cellType].color : 'bg-gray-50';
                        let content = isPlaced ? geographyStyles[cellType].icon : '';
                        let handleClick = () => {};

                        if (canPlace) {
                            cellClasses += " cursor-pointer hover:bg-blue-200 hover:ring-2 hover:ring-blue-500";
                            handleClick = () => onPlace(x, y);
                        }
                        
                        return (
                            <div key={`${x}-${y}`} className="aspect-square">
                                <button 
                                    onClick={handleClick}
                                    disabled={!canPlace}
                                    className={`${baseClasses} ${cellClasses}`}
                                    aria-label={isPlaced ? `Cell ${x},${y}: ${cellType}` : `Cell ${x},${y}: Empty. Click to place ${placementType}`}
                                >
                                    {content}
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default RegionMap;