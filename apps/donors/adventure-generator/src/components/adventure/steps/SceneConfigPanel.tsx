
import React, { FC } from 'react';
import { css } from '@emotion/css';
import { SceneTypeOption } from '../../../types/scene';
import { CONFIG, SCENE_TYPE_OPTIONS } from '../../../data/constants';
import { useGeneratorConfigStore } from '@/stores/generatorConfigStore';

const styles = {
    optionGroup: css`
        margin-bottom: var(--space-l);
    `,
    gridSelector: css`
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-m);
    `,
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
    sliderContainer: css`
        padding: var(--space-s) 0;
    `,
    slider: css`
        -webkit-appearance: none;
        width: 100%;
        height: 8px;
        border-radius: 4px;
        background: var(--medium-brown);
        outline: none;
        opacity: 0.8;
        transition: opacity .2s;
        margin-top: var(--space-s);

        &:hover { opacity: 1; }

        &::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: var(--dnd-red);
            cursor: pointer;
            border: 2px solid var(--parchment-bg);
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }
    `,
};

export const SceneConfigPanel: FC = () => {
    const { sceneCount, sceneTypes, updateConfig } = useGeneratorConfigStore();

    const handleSceneTypeChange = (type: SceneTypeOption) => {
        updateConfig({ sceneTypes: { ...sceneTypes, [type]: !sceneTypes[type] } });
    };

    return (
        <>
            <div className={styles.plotGroup}>
                <h4>Include Scene Types</h4>
                <div className={styles.gridSelector}>
                    {SCENE_TYPE_OPTIONS.map(type => (
                        <label key={type} className="custom-checkbox" style={{ minWidth: '150px', background: 'var(--parchment-bg)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-light)', marginBottom: 0 }}>
                            <input type="checkbox" checked={sceneTypes[type]} onChange={() => handleSceneTypeChange(type)} />
                            <span className="checkmark" style={{ top: '50%', transform: 'translateY(-50%)', left: '12px' }}></span>
                            <span style={{ marginLeft: '8px' }}>{type}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className={styles.optionGroup}>
                <label htmlFor="scene-count-slider" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Number of Scenes</span>
                    <span style={{ fontWeight: 'bold', color: 'var(--dnd-red)', fontSize: '1.2rem' }}>{sceneCount}</span>
                </label>
                <div className={styles.sliderContainer}>
                    <input
                        id="scene-count-slider"
                        type="range"
                        min={CONFIG.SCENE_COUNT_RANGE.MIN}
                        max={CONFIG.SCENE_COUNT_RANGE.MAX}
                        value={sceneCount}
                        onChange={(e) => updateConfig({ sceneCount: parseInt(e.target.value, 10) })}
                        className={styles.slider}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--medium-brown)', marginTop: '4px' }}>
                        <span>Short ({CONFIG.SCENE_COUNT_RANGE.MIN})</span>
                        <span>Long ({CONFIG.SCENE_COUNT_RANGE.MAX})</span>
                    </div>
                </div>
            </div>
        </>
    );
};
