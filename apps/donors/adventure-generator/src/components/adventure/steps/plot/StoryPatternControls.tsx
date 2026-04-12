
import React, { FC, useMemo } from 'react';
import { css } from '@emotion/css';
import { PLOTS, UNIVERSAL_TWISTS } from '../../../../data/plotPatterns';

const styles = {
    plotGroup: css`
        margin-bottom: var(--space-l);
        background-color: rgba(0,0,0,0.03);
        padding: var(--space-m);
        border-radius: var(--border-radius);

        h4 {
            margin-top: 0;
            margin-bottom: var(--space-m);
            color: var(--dark-brown);
            border-bottom: 1px solid var(--light-brown);
            padding-bottom: var(--space-s);
        }
    `,
    plotSelectors: css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-m);
        @media (max-width: 768px) { grid-template-columns: 1fr; }
    `,
};

interface PlotPattern {
    name: string;
    group: string;
    twists: string[];
    concept?: string;
    conflict?: string;
}

interface StoryPatternControlsProps {
    combinationMethod: string;
    primaryPlot: string;
    primaryTwist: string;
    onPrimaryPlotChange: (value: string) => void;
    onPrimaryTwistChange: (value: string) => void;
}

export const StoryPatternControls: FC<StoryPatternControlsProps> = ({
    combinationMethod,
    primaryPlot,
    primaryTwist,
    onPrimaryPlotChange,
    onPrimaryTwistChange
}) => {
    const plotGroups = useMemo(() => {
        return PLOTS.reduce((acc, plot) => {
            (acc[plot.group] = acc[plot.group] || []).push(plot);
            return acc;
        }, {} as Record<string, PlotPattern[]>);
    }, []);

    const currentPrimaryPlot = useMemo(() => PLOTS.find(p => p.name === primaryPlot) as PlotPattern | undefined, [primaryPlot]);

    return (
        <div className={styles.plotGroup}>
            <h4>{combinationMethod ? 'Primary Plot' : 'Plot Pattern'}</h4>
            <div className={styles.plotSelectors}>
                <div>
                    <label htmlFor="plot-selector-primary">Choose a Plot (Optional)</label>
                    <select 
                        id="plot-selector-primary" 
                        style={{ width: '100%' }} 
                        value={primaryPlot} 
                        onChange={(e) => { onPrimaryPlotChange(e.target.value); onPrimaryTwistChange('__NO_TWIST__'); }}
                    >
                        <option value="">Let the AI choose a random plot</option>
                        {Object.entries(plotGroups).map(([groupName, plots]: [string, PlotPattern[]]) => (
                            <optgroup label={groupName} key={groupName}>
                                {plots.map(plot => <option key={plot.name} value={plot.name}>{plot.name}</option>)}
                            </optgroup>
                        ))}
                    </select>
                </div>
                {primaryPlot && currentPrimaryPlot && (
                    <div>
                        <label htmlFor="twist-selector-primary">
                            {combinationMethod ? 'Secondary Plot Element / Twist' : 'Add a Twist (Optional)'}
                        </label>
                        <select 
                            id="twist-selector-primary" 
                            style={{ width: '100%' }} 
                            value={primaryTwist} 
                            onChange={(e) => onPrimaryTwistChange(e.target.value)}
                        >
                            <option value="__NO_TWIST__">No Twist</option>
                            <option value="__RANDOM_TWIST__">Let AI choose a random twist</option>
                            {currentPrimaryPlot.twists.map(twist => <option key={twist} value={twist}>{twist}</option>)}
                            <optgroup label="Universal Twists">
                                {UNIVERSAL_TWISTS.map(twist => <option key={twist} value={twist}>{twist}</option>)}
                            </optgroup>
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
};
