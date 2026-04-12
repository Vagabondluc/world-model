import React from 'react';
import type { ElementCard, Location } from '../../../types';
import SacredSiteCreatorForm from './SacredSiteCreatorForm';
import LocationCard from './LocationCard';

interface SacredSiteCreatorProps {
    deityCount: number;
    playerDeities: ElementCard[];
    playerSacredSites: ElementCard[];
    onSacredSiteCreated: (location: Omit<Location, 'id'>, year: number) => void;
    onStartOver: () => void;
}

const SacredSiteCreator = ({
    deityCount,
    playerDeities,
    playerSacredSites,
    onSacredSiteCreated,
    onStartOver
}: SacredSiteCreatorProps) => {

    const allSitesPlaced = playerSacredSites.length >= deityCount && deityCount > 0;

    return (
        <div className="space-y-6">
             <header className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold text-amber-800">2.5 Place Sacred Sites</h2>
                    <p className="mt-2 text-lg text-gray-600">For each deity in your pantheon, create a sacred site where their influence is strongest.</p>
                </div>
                <button onClick={onStartOver} className="text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-md transition-colors">Start Over</button>
            </header>

            <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
                <p className="text-xl font-semibold text-amber-800">
                    Progress: <span className="font-bold">{playerSacredSites.length} / {deityCount}</span> sacred sites placed.
                </p>
                {allSitesPlaced && <p className="mt-1 font-bold text-green-700">All sacred sites have been placed! This Era is complete.</p>}
            </div>

            <SacredSiteCreatorForm
                pantheon={playerDeities}
                playerSacredSites={playerSacredSites}
                onCreate={onSacredSiteCreated}
                disabled={allSitesPlaced}
            />
        </div>
    );
};

export default SacredSiteCreator;