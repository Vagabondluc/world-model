
import React, { FC } from 'react';
import { useEncounterWizardStore } from '@/stores/encounterWizardStore';
import { ENCOUNTER_TWIST_DATA } from '../../../data/encounterData';
import { EncounterStageSimpleControls } from './common/EncounterStageSimpleControls';

export const EncounterTwistControls: FC = () => {
    const {
        twistType,
        setTwistType,
        generateTwistNodeAction,
    } = useEncounterWizardStore();

    return (
        <EncounterStageSimpleControls
            stage="twist"
            label="Twist Type"
            options={ENCOUNTER_TWIST_DATA.types}
            selectedValue={twistType}
            onValueChange={setTwistType}
            onGenerate={generateTwistNodeAction}
        />
    );
};
