
import React, { FC } from 'react';
import { ManagedLocation, Region, InteractionMode } from '../../../types/location';
import { LocationCard } from '../LocationCard';
import { SidebarList } from './SidebarList';

interface SidebarLocationListProps {
    locations: ManagedLocation[];
    regions: Region[];
    selectedLocationId?: string;
    onLocationSelect: (location: ManagedLocation) => void;
    interactionMode: InteractionMode;
    hasSearchQuery: boolean;
}

export const SidebarLocationList: FC<SidebarLocationListProps> = ({ 
    locations, regions, selectedLocationId, onLocationSelect, interactionMode, hasSearchQuery 
}) => {
    return (
        <SidebarList
            title={`Locations (${locations.length})`}
            items={locations}
            emptyMessage={hasSearchQuery ? 'No locations match search.' : 'No locations created for this map yet.'}
            // FIX: Explicitly typed 'location' as ManagedLocation to fix 'property regionId/id does not exist on unknown' errors occurring due to inference failure in generic SidebarList
            renderItem={(location: ManagedLocation) => {
                const region = regions.find(r => r.id === location.regionId);
                return (
                    <LocationCard
                        key={location.id}
                        location={location}
                        region={region}
                        isSelected={selectedLocationId === location.id}
                        onClick={() => interactionMode === 'inspect' && onLocationSelect(location)}
                    />
                );
            }}
        />
    );
};
