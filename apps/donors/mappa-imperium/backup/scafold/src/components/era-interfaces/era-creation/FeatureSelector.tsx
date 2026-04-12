import React from 'react';
import { useEraCreation } from '../../../contexts/EraCreationContext';
import type { GeographyType } from '../../../types';

const geographyTypes: { name: GeographyType; icon: string; }[] = [
    { name: 'Savanna', icon: '🌾' },
    { name: 'Wetlands', icon: '💧' },
    { name: 'Hills', icon: '🌄' },
    { name: 'Lake', icon: '🌊' },
    { name: 'River', icon: '🏞️' },
    { name: 'Forest', icon: '🌲' },
    { name: 'Mountains', icon: '⛰️' },
    { name: 'Desert', icon: '🏜️' },
    { name: 'Jungle', icon: '🌴' },
    { name: 'Canyon', icon: '🧱' },
    { name: 'Volcano', icon: '🌋' },
];

const landmassTypes: string[] = [
    '1 Large Continent',
    '1 Large + 1 Small isle',
    '1 Large + 2 Small isles',
    '2 Medium islands',
    '3 Medium islands',
    'Archipelago with at least 4 islands',
];

const staticAdvice: Record<GeographyType, { title: string; advice: string; }> = {
    Mountains: { title: "Continental Spines", advice: "Form the backbone of landmasses, create rain shadows, and are the source of most rivers. Excellent for strategic defense and mining." },
    Forest: { title: "Lungs of the World", advice: "Requires a water source to thrive. Can be dense or sparse, providing resources like wood and game. Ideal for hiding locations or creating natural barriers." },
    River: { title: "Veins of the Land", advice: "Flows from high ground (mountains, hills) to low ground (lakes, oceans). Creates fertile floodplains essential for agriculture, trade, and travel." },
    Lake: { title: "Heart of the Region", advice: "Often fed by rivers and can be the source for others. A stable water source that is excellent for supporting large settlements." },
    Hills: { title: "Transitional Terrain", advice: "Often found between mountains and plains. Good for defense without being impassable. Can be rich in stone quarries and minerals." },
    Wetlands: { title: "Bogs and Marshes", advice: "Low-lying, waterlogged areas near rivers, lakes, or coasts. Difficult to traverse but rich in unique flora, fauna, and resources." },
    Desert: { title: "Arid Wastelands", advice: "Form in areas with little rainfall, often in the rain shadow of mountains or deep inland. Characterized by extreme temperatures and scarce water." },
    Jungle: { title: "Dense and Humid", advice: "A hot, humid, and dense type of forest typically found in tropical zones. High biodiversity makes it rich in rare resources but difficult to explore." },
    Savanna: { title: "Grassy Plains", advice: "Vast grasslands with scattered trees, acting as a transition between desert and forest biomes. Supports large herds of animals." },
    Canyon: { title: "Earth Scar", advice: "A deep, narrow gorge carved by a river over millennia. Acts as a significant natural barrier and a highly defensible location." },
    Volcano: { title: "Fire Mountain", advice: "Can create incredibly fertile soil from its ash, but poses a constant threat. Often found along tectonic plate boundaries or as part of a mountain range." },
};

const getLandmassOptions = (landmassType: string): string[] => {
    if (!landmassType) return [];
    switch (landmassType) {
        case '1 Large Continent': return ['Large Continent'];
        case '1 Large + 1 Small isle': return ['Large Continent', 'Small Isle 1'];
        case '1 Large + 2 Small isles': return ['Large Continent', 'Small Isle 1', 'Small Isle 2'];
        case '2 Medium islands': return ['Medium Island 1', 'Medium Island 2'];
        case '3 Medium islands': return ['Medium Island 1', 'Medium Island 2', 'Medium Island 3'];
        case 'Archipelago with at least 4 islands': return ['Archipelago Isle 1', 'Archipelago Isle 2', 'Archipelago Isle 3', 'Archipelago Isle 4'];
        default: return [];
    }
};

const FeatureSelector = () => {
    const { landmassType, features, setState, handleFeatureChange } = useEraCreation();
    const landmassOptions = getLandmassOptions(landmassType);

    return (
        <>
            <div>
                <label htmlFor="landmassType" className="block text-lg font-semibold text-gray-700 mb-2">
                    1. Select Your Landmass Structure
                </label>
                <select
                    id="landmassType"
                    value={landmassType}
                    onChange={(e) => setState({ landmassType: e.target.value })}
                    className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                >
                    <option value="">-- From rule 1.1 --</option>
                    {landmassTypes.map(lt => <option key={lt} value={lt}>{lt}</option>)}
                </select>
            </div>
             <hr/>
            <h3 className="text-lg font-semibold text-gray-700">2. Assign 8 Geography Features to Landmasses</h3>
            <div className="space-y-4">
                {features.map((feature, index) => (
                    <div key={feature.id} className="grid md:grid-cols-2 gap-4 items-start p-4 bg-gray-50 rounded-lg border">
                        <div>
                            <div className="flex items-center gap-4 mb-2">
                                <span className="font-bold text-gray-600">{index + 1}.</span>
                                <select
                                    value={feature.type}
                                    onChange={(e) => handleFeatureChange(feature.id, 'type', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                                >
                                    <option value="">-- Select Geography --</option>
                                    {geographyTypes.map(g => <option key={g.name} value={g.name}>{g.name}</option>)}
                                </select>
                            </div>
                            {feature.type && (
                                 <select
                                    value={feature.landmassIndex}
                                    onChange={(e) => {
                                        const value = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                                        handleFeatureChange(feature.id, 'landmassIndex', value);
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                                    disabled={!landmassType}
                                    aria-label={`Assign ${feature.type} to a landmass`}
                                >
                                    <option value="">-- Assign to Landmass --</option>
                                    {landmassOptions.map((lo, idx) => <option key={idx} value={idx}>{lo}</option>)}
                                </select>
                            )}
                        </div>
                        {feature.type && staticAdvice[feature.type] && (
                            <div className="p-3 bg-amber-50 border-l-4 border-amber-400 text-amber-900 rounded-r-md">
                                <h4 className="font-bold">{staticAdvice[feature.type].title}</h4>
                                <p className="text-sm">{staticAdvice[feature.type].advice}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    )
}

export default FeatureSelector;