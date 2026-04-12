
import React, { FC } from 'react';
import { useEncounterWizardStore } from '@/stores/encounterWizardStore';
import { ENCOUNTER_AFTERMATH_DATA } from '../../../data/encounterData';
import { EncounterStageSimpleControls } from './common/EncounterStageSimpleControls';

export const EncounterAftermathControls: FC = () => {
    const {
        aftermathType,
        setAftermathType,
        generateAftermathNodeAction,
    } = useEncounterWizardStore();

    return (
        <EncounterStageSimpleControls
            stage="aftermath"
            label="Encounter Outcome"
            options={ENCOUNTER_AFTERMATH_DATA.types}
            selectedValue={aftermathType}
            onValueChange={setAftermathType}
            onGenerate={generateAftermathNodeAction}
        />
    );
};
