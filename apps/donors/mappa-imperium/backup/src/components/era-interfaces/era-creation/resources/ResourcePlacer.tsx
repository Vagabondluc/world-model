import React from 'react';
import type { Resource, ElementCard } from '../../../../types';
import CustomResourceCreator from './CustomResourceCreator';
import { useGameStore } from '../../../../stores/gameStore';
import { componentStyles } from '../../../../design/tokens';

const RESOURCE_LIMIT = 2;

const ResourcePlacer = () => {
    const { currentPlayer, createElement, elements } = useGameStore();

    // Derive resource count from store
    const resourceCount = React.useMemo(() => {
        if (!currentPlayer) return 0;
        return elements.filter(el => el.type === 'Resource' && el.owner === currentPlayer.playerNumber && el.era === 1).length;
    }, [elements, currentPlayer]);

    const handleCreateResource = (resource: Omit<Resource, 'id' | 'name'> & { name: string }) => {
        if (!currentPlayer) return;
        
        if (resourceCount < RESOURCE_LIMIT) {
            const newResourceData: Resource = {
                id: `data-${crypto.randomUUID()}`,
                ...resource,
            };
            createElement({
                type: 'Resource',
                name: resource.name,
                owner: currentPlayer.playerNumber,
                era: 1,
                data: newResourceData,
            });
        }
    };

    const isComplete = resourceCount >= RESOURCE_LIMIT;

    return (
        <div className="space-y-6">
            <header>
                 <h2 className="text-3xl font-bold text-amber-800">1.4 Resources & Special Sites</h2>
                 <p className="mt-2 text-lg text-gray-600">Define two unique resources or special sites for your home region. These will become key locations for future settlements and stories.</p>
            </header>
            
            <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
                <p className="text-xl font-semibold text-amber-800">
                    Progress: <span className="font-bold">{resourceCount} / {RESOURCE_LIMIT}</span> resources defined.
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
