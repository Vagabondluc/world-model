import React from 'react';
import type { Resource, ElementCard, Player } from '../../../../types';
import CustomResourceCreator from './CustomResourceCreator';

interface ResourcePlacerProps {
    currentPlayer: Player;
    onCreateElement: (element: Omit<ElementCard, 'id'>) => void;
    resourceCount: number;
    resourceLimit: number;
}

const ResourcePlacer = ({ 
    currentPlayer, 
    onCreateElement,
    resourceCount,
    resourceLimit,
}: ResourcePlacerProps) => {

    const handleCreateResource = (resource: Omit<Resource, 'id' | 'name'> & { name: string }) => {
        if (resourceCount < resourceLimit) {
            const newResourceData: Resource = {
                id: `data-${crypto.randomUUID()}`,
                ...resource,
            };
            onCreateElement({
                type: 'Resource',
                name: resource.name,
                owner: currentPlayer.playerNumber,
                era: 1,
                data: newResourceData,
            });
        }
    };

    const isComplete = resourceCount >= resourceLimit;

    return (
        <div className="space-y-6">
            <header>
                 <h2 className="text-3xl font-bold text-amber-800">1.4 Resources & Special Sites</h2>
                 <p className="mt-2 text-lg text-gray-600">Define two unique resources or special sites for your home region. These will become key locations for future settlements and stories.</p>
            </header>
            
            <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
                <p className="text-xl font-semibold text-amber-800">
                    Progress: <span className="font-bold">{resourceCount} / {resourceLimit}</span> resources defined.
                </p>
                {isComplete && <p className="mt-1 font-bold text-green-700">All unique resources have been defined!</p>}
            </div>

            <CustomResourceCreator 
                onCreate={handleCreateResource} 
                disabled={isComplete} 
            />
        </div>
    );
};

export default ResourcePlacer;