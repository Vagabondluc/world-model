import React from 'react';
import FeatureSelector from './FeatureSelector';
import type { EraCreationContextType } from '../../../types';

interface GeographyAdvisorProps {
    state: EraCreationContextType;
}

const GeographyAdvisor = ({ state }: GeographyAdvisorProps) => {
    return (
        <div className="space-y-6">
            <header>
                 <h2 className="text-3xl font-bold text-amber-800">Geography Placement</h2>
                 <p className="mt-2 text-lg text-gray-600">Select the landmass and geography you rolled in Foundry VTT to receive AI-powered advice on its realistic placement.</p>
            </header>

            <div className="p-6 border rounded-lg bg-white shadow-sm space-y-6">
                <FeatureSelector state={state} />
            </div>
        </div>
    );
};

export default GeographyAdvisor;
