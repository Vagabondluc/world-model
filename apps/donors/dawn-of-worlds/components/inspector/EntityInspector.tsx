
import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { InspectorHeader } from './InspectorHeader';
import { WorldObjectCard } from './WorldObjectCard';

interface EntityInspectorProps {
  worldId: string;
  onClose: () => void;
  isError?: boolean;
}

export const EntityInspector: React.FC<EntityInspectorProps> = ({ worldId, onClose, isError }) => {
  const object = useGameStore(state => state.worldCache.get(worldId));

  if (!object) return null;

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
      <InspectorHeader 
        icon="public" 
        title={object.name || object.kind} 
        subtitle="Entity Inspector" 
        onClose={onClose} 
        isError={isError}
      />
      <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
        <WorldObjectCard object={object} detailed />
      </div>
    </div>
  );
};
