
import { useState, useCallback, useMemo } from 'react';
import { ManagedLocation, Region, HexCoordinate, WorldMap } from '../types/location';
import { useLocationStore } from '../stores/locationStore';
import { useCampaignStore } from '../stores/campaignStore';
import { generateId, sanitizeImageUrl } from '../utils/helpers';

export const useLocationManagerLogic = () => {
    const campaignConfig = useCampaignStore(s => s.config);
    
    // Store State
    const activeMapId = useLocationStore(s => s.activeMapId);
    // Explicit casting for circular dependency resolution if needed, though here we rely on the types
    const allLocations = useLocationStore(s => s.locations) as Record<string, ManagedLocation>;
    const allRegions = useLocationStore(s => s.regions) as Record<string, Region>;
    const allMaps = useLocationStore(s => s.maps) as Record<string, WorldMap>;

    const layers = useLocationStore(s => s.layers);
    const layerOrder = useLocationStore(s => s.layerOrder);
    const activeLayerId = useLocationStore(s => s.activeLayerId);
    const viewSettings = useLocationStore(s => s.getViewSettings());
    
    const interactionMode = useLocationStore(s => s.interactionMode);
    const draftRegionHexes = useLocationStore(s => s.draftRegionHexes);
    const editingRegionId = useLocationStore(s => s.editingRegionId);
    
    // Store Actions
    const addLocation = useLocationStore(s => s.addLocation);
    const updateLocation = useLocationStore(s => s.updateLocation);
    const removeLocation = useLocationStore(s => s.removeLocation);
    const addRegion = useLocationStore(s => s.addRegion);
    const updateRegion = useLocationStore(s => s.updateRegion);
    const removeRegion = useLocationStore(s => s.removeRegion);
    const paintHexBiome = useLocationStore(s => s.paintHexBiome);
    const updateViewSettings = useLocationStore(s => s.updateViewSettings);
    const setInteractionMode = useLocationStore(s => s.setInteractionMode);
    const toggleDraftHex = useLocationStore(s => s.toggleDraftHex);
    const setDraftHexes = useLocationStore(s => s.setDraftHexes);
    const setEditingRegionId = useLocationStore(s => s.setEditingRegionId);
    const addMap = useLocationStore(s => s.addMap);
    const setActiveMapId = useLocationStore(s => s.setActiveMapId);

    // Local UI State
    const [selectedLocation, setSelectedLocation] = useState<Partial<ManagedLocation> | null>(null);
    const [selectedRegion, setSelectedRegion] = useState<Partial<Region> | null>(null);
    const [isCreatingRegionModalOpen, setIsCreatingRegionModalOpen] = useState(false);
    const [isCreatingMap, setIsCreatingMap] = useState(false);

    // Derived Data
    const activeMap = useMemo(() => activeMapId ? allMaps[activeMapId] : null, [allMaps, activeMapId]);
    
    const locations = useMemo(() => 
        Object.values(allLocations).filter((loc) => loc.mapId === activeMapId),
    [allLocations, activeMapId]);

    const regions = useMemo(() => 
        Object.values(allRegions).filter((reg) => reg.mapId === activeMapId),
    [allRegions, activeMapId]);

    // Handlers
    const handleCreateLocation = useCallback((locationData: Partial<ManagedLocation>) => {
        if (!activeMap) return;
        const newLocation: ManagedLocation = {
            id: generateId(),
            mapId: activeMap.id,
            name: locationData.name || 'New Location',
            description: locationData.description || '',
            type: locationData.type || 'Special Location',
            hexCoordinate: locationData.hexCoordinate || { q: 0, r: 0 },
            biome: locationData.biome || 'grassland',
            regionId: locationData.regionId || '',
            isKnownToPlayers: locationData.isKnownToPlayers ?? false,
            discoveryStatus: locationData.discoveryStatus || 'undiscovered',
            connectedLocations: [], loreReferences: [], customTags: [], notes: '',
            createdAt: new Date(), lastModified: new Date(),
            details: locationData.details,
            worldName: campaignConfig.worldName, 
        };
        addLocation(newLocation);
        setSelectedLocation(newLocation);
    }, [addLocation, campaignConfig.worldName, activeMap]);

    const handleCreateRegion = useCallback((regionData: Partial<Region>) => {
        if (!activeMap) return;
        const newRegion: Region = {
            id: generateId(),
            mapId: activeMap.id,
            name: regionData.name || 'New Region',
            description: regionData.description || '',
            politicalControl: regionData.politicalControl || 'Unknown',
            dangerLevel: regionData.dangerLevel || 1,
            dominantBiome: regionData.dominantBiome || 'grassland',
            culturalNotes: regionData.culturalNotes || '',
            keyFeatures: regionData.keyFeatures || [],
            boundingBox: regionData.boundingBox || { minQ: -5, maxQ: 5, minR: -5, maxR: 5 },
            hexes: regionData.hexes || [],
            color: regionData.color || 'rgba(0,100,255,0.2)'
        };
        addRegion(newRegion);
        setIsCreatingRegionModalOpen(false);
        setSelectedRegion(newRegion);
    }, [addRegion, activeMap]);

    const handleCreateMap = (mapData: Pick<WorldMap, 'name' | 'description' | 'imageUrl'>) => {
        const newMap = addMap(mapData);
        setActiveMapId(newMap.id);
        setIsCreatingMap(false);
    };

    const handleHexClick = useCallback((coordinate: HexCoordinate) => {
        if (!activeMap) return;
        const hexBiomes = useLocationStore.getState().getHexBiomes();
        switch (interactionMode) {
            case 'location_place':
                setInteractionMode('inspect');
                const existingBiome = hexBiomes[`${coordinate.q},${coordinate.r}`] || 'grassland';
                setSelectedLocation({ hexCoordinate: coordinate, biome: existingBiome, regionId: selectedRegion?.id || '' });
                break;
            case 'biome_paint':
                const selectedPaintBiome = useLocationStore.getState().selectedPaintBiome;
                paintHexBiome(coordinate, selectedPaintBiome);
                break;
            case 'region_draft':
                toggleDraftHex(coordinate);
                break;
            case 'inspect':
            default:
                setSelectedLocation(null);
                break;
        }
    }, [interactionMode, selectedRegion, paintHexBiome, toggleDraftHex, setInteractionMode, activeMap]);
    
    const handleBgSettingChange = (prop: 'url' | 'scale' | 'opacity', value: string | number) => {
        const prev = viewSettings.backgroundImage;
        if (prop === 'url') {
            const url = sanitizeImageUrl(value as string);
            updateViewSettings({ backgroundImage: url ? { url, scale: prev?.scale || 'cover', opacity: prev?.opacity ?? 0.3 } : undefined });
        } else if (prev) {
            updateViewSettings({ backgroundImage: { ...prev, [prop]: value } as any });
        }
    };

    const handleFinishRegionDraft = (regionData: Partial<Region>) => {
        if (editingRegionId) {
            const originalRegion = regions.find(r => r.id === editingRegionId);
            if (originalRegion) {
                updateRegion({ 
                    ...originalRegion, 
                    boundingBox: regionData.boundingBox || originalRegion.boundingBox, 
                    hexes: regionData.hexes || originalRegion.hexes 
                });
            }
            setEditingRegionId(null);
        } else {
            setSelectedRegion(regionData);
            setIsCreatingRegionModalOpen(true);
        }
    };

    const handleStartRegionEdit = (region: Region) => {
        setDraftHexes(region.hexes || []);
        setEditingRegionId(region.id);
        setInteractionMode('region_draft');
    };

    return {
        // State
        activeMap,
        locations,
        regions,
        layers,
        layerOrder,
        activeLayerId,
        viewSettings,
        interactionMode,
        draftRegionHexes,
        selectedLocation,
        selectedRegion,
        isCreatingRegionModalOpen,
        isCreatingMap,

        // Setters
        setSelectedLocation,
        setSelectedRegion,
        setIsCreatingRegionModalOpen,
        setIsCreatingMap,

        // Actions
        setActiveMapId,
        updateLocation,
        removeLocation,
        updateRegion,
        removeRegion,
        updateViewSettings,
        
        // Handlers
        handleCreateLocation,
        handleCreateRegion,
        handleCreateMap,
        handleHexClick,
        handleBgSettingChange,
        handleFinishRegionDraft,
        handleStartRegionEdit
    };
};
