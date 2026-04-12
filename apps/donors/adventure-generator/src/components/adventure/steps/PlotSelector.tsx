
import React, { FC } from 'react';
import { CombinationSelector } from './plot/CombinationSelector';
import { StoryPatternControls } from './plot/StoryPatternControls';

interface PlotSelectorProps {
    combinationMethod: string;
    primaryPlot: string;
    primaryTwist: string;
    onCombinationMethodChange: (value: string) => void;
    onPrimaryPlotChange: (value: string) => void;
    onPrimaryTwistChange: (value: string) => void;
}

export const PlotSelector: FC<PlotSelectorProps> = ({
    combinationMethod,
    primaryPlot,
    primaryTwist,
    onCombinationMethodChange,
    onPrimaryPlotChange,
    onPrimaryTwistChange
}) => {
    return (
        <>
            <CombinationSelector 
                selectedMethod={combinationMethod} 
                onChange={onCombinationMethodChange} 
            />

            <StoryPatternControls
                combinationMethod={combinationMethod}
                primaryPlot={primaryPlot}
                primaryTwist={primaryTwist}
                onPrimaryPlotChange={onPrimaryPlotChange}
                onPrimaryTwistChange={onPrimaryTwistChange}
            />
        </>
    );
};
