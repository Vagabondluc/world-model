
import React, { FC } from 'react';
import { css, cx } from '@emotion/css';
import { useGeneratorConfigStore } from '@/stores/generatorConfigStore';

const styles = {
    methodSelector: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-m);
        margin-bottom: var(--space-l);
        width: 100%;
    `,
    methodRadio: css`
        background: var(--card-bg);
        padding: var(--space-m);
        padding-left: 90px !important; /* Increased padding and force priority to separate text from checkmark */
        border-radius: var(--border-radius);
        border: var(--border-light);
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        box-sizing: border-box;
        
        /* Override the generic .radio-checkmark position for this specific card-like radio */
        .radio-checkmark {
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
        }
    `,
};

export const MethodSelector: FC = () => {
    const { generationMethod, updateConfig } = useGeneratorConfigStore();

    return (
        <div className={styles.methodSelector}>
            <label className={cx("custom-radio", styles.methodRadio)}>
                <input
                    type="radio"
                    name="generationMethod"
                    value="arcane"
                    checked={generationMethod === 'arcane'}
                    onChange={() => updateConfig({ generationMethod: 'arcane' })}
                />
                <span className="radio-checkmark"></span>
                <div>
                    <span className="radio-title">Arcane Library Method</span>
                    <small style={{ display: 'block', color: 'var(--medium-brown)' }}>Generates 5 simple adventure hooks. Quick and classic.</small>
                </div>
            </label>
            <label className={cx("custom-radio", styles.methodRadio)}>
                <input
                    type="radio"
                    name="generationMethod"
                    value="pattern"
                    checked={generationMethod === 'pattern'}
                    onChange={() => updateConfig({ generationMethod: 'pattern' })}
                />
                <span className="radio-checkmark"></span>
                <div>
                    <span className="radio-title">Plot Pattern Method</span>
                    <small style={{ display: 'block', color: 'var(--medium-brown)' }}>Builds a full adventure outline using structured patterns and twists.</small>
                </div>
            </label>
            <label className={cx("custom-radio", styles.methodRadio)}>
                <input
                    type="radio"
                    name="generationMethod"
                    value="delve"
                    checked={generationMethod === 'delve'}
                    onChange={() => updateConfig({ generationMethod: 'delve' })}
                />
                <span className="radio-checkmark"></span>
                <div>
                    <span className="radio-title">Quick Delve</span>
                    <small style={{ display: 'block', color: 'var(--medium-brown)' }}>Generates a linear 5-room dungeon instantly. No AI required.</small>
                </div>
            </label>
        </div>
    );
};
