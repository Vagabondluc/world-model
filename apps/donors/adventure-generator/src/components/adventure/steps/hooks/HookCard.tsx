
import React, { FC } from 'react';
import { GeneratedAdventure } from '../../../../schemas/adventure';
import { SimpleHookCard } from './SimpleHookCard';
import { DetailedHookCard } from './DetailedHookCard';

interface HookCardProps {
    adventure: GeneratedAdventure;
    onSelect: (hook: GeneratedAdventure) => void;
    onSave?: (hook: GeneratedAdventure) => void;
    loading: boolean;
}

export const HookCard: FC<HookCardProps> = ({ adventure, onSelect, onSave, loading }) => {
    if (adventure.type === 'simple') {
        return (
            <SimpleHookCard 
                adventure={adventure} 
                onSelect={() => onSelect(adventure)} 
                onSave={onSave ? () => onSave(adventure) : undefined}
                loading={loading} 
            />
        );
    }
    return (
        <DetailedHookCard 
            adventure={adventure} 
            onSelect={() => onSelect(adventure)} 
            onSave={onSave ? () => onSave(adventure) : undefined}
            loading={loading} 
        />
    );
};
