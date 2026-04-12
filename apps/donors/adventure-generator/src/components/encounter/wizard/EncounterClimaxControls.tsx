
import React, { FC } from 'react';
import { useEncounterWizardStore } from '@/stores/encounterWizardStore';
import { ENCOUNTER_CLIMAX_DATA } from '../../../data/encounterData';
import { EncounterStageSimpleControls } from './common/EncounterStageSimpleControls';

export const EncounterClimaxControls: FC = () => {
    const {
        climaxType,
        setClimaxType,
        generateClimaxNodeAction,
    } = useEncounterWizardStore();

    return (
        <EncounterStageSimpleControls
            stage="climax"
            label="Climax Type"
            options={ENCOUNTER_CLIMAX_DATA.types}
            selectedValue={climaxType}
            onValueChange={setClimaxType}
            onGenerate={generateClimaxNodeAction}
        />
    );
};
