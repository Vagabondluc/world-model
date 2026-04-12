
import React, { FC, memo } from 'react';
import { css, cx } from '@emotion/css';
import { useGeneratorConfigStore } from '@/stores/generatorConfigStore';
import { useWorkflowStore } from '@/stores/workflowStore';
import { useAppContext } from '../../../context/AppContext';
import { PlotSelector } from './PlotSelector';
import { MethodSelector } from './MethodSelector';
import { SceneConfigPanel } from './SceneConfigPanel';

// --- Styles ---
const styles = {
    container: css`
        background-color: var(--card-bg);
        padding: var(--space-xl);
        border-radius: var(--border-radius);
        border: var(--border-main);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        margin-bottom: var(--space-l);
    `,
    patternOptions: css`
        margin-top: var(--space-l);
        padding-top: var(--space-l);
        border-top: var(--border-light);
        animation: fadeIn 0.3s ease-in;
    `,
    fullWidthInput: css`
        width: 100% !important;
        max-width: 100% !important;
        min-width: 100% !important;
        box-sizing: border-box !important;
        display: block;
    `
};

const InitialStepFC: FC = () => {
    // --- Store State ---
    const {
        context, generationMethod, combinationMethod, primaryPlot,
        primaryTwist
    } = useGeneratorConfigStore();

    // --- Store Actions ---
    const { setContext, updateConfig } = useGeneratorConfigStore();
    const { loading, generateHooks, generateFullOutline, setStep } = useWorkflowStore();

    // --- App Context for async actions ---
    const { apiService } = useAppContext();

    // --- Local derived state and handlers ---
    const isLoading = loading.hooks || loading.outline;

    const onGenerateHooks = () => generateHooks(apiService!);
    const onGenerateOutline = () => generateFullOutline(apiService!);
    const onStartDelve = () => setStep('delve');

    const onGenerate = () => {
        if (generationMethod === 'arcane') onGenerateHooks();
        else if (generationMethod === 'pattern') onGenerateOutline();
        else if (generationMethod === 'delve') onStartDelve();
    };

    let buttonText = 'Generate Adventure Hooks';
    if (generationMethod === 'pattern') buttonText = 'Generate Adventure Outline';
    if (generationMethod === 'delve') buttonText = 'Launch Quick Delve Generator';

    return (
        <div className={styles.container} aria-busy={isLoading}>
            <h2>Step 1: Set the Scene</h2>
            <p>Provide some context for your campaign, then choose a generation method.</p>

            <MethodSelector />

            {(generationMethod === 'arcane' || generationMethod === 'pattern') && (
                <textarea
                    className={cx("context-input", styles.fullWidthInput)}
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder={"Add session-specific context..."}
                    aria-label="Campaign context"
                />
            )}

            {generationMethod === 'pattern' && (
                <div className={styles.patternOptions}>
                    <h3>Adventure Configuration</h3>

                    <PlotSelector
                        combinationMethod={combinationMethod}
                        primaryPlot={primaryPlot}
                        primaryTwist={primaryTwist}
                        onCombinationMethodChange={(value) => updateConfig({ combinationMethod: value })}
                        onPrimaryPlotChange={(value) => updateConfig({ primaryPlot: value })}
                        onPrimaryTwistChange={(value) => updateConfig({ primaryTwist: value })}
                    />

                    <SceneConfigPanel />
                </div>
            )}

            <button className="primary-button" onClick={onGenerate} disabled={isLoading} style={{ marginTop: 'var(--space-xl)', width: '100%' }}>
                {isLoading ? 'Conjuring Ideas...' : buttonText}
            </button>
        </div>
    );
}

export const InitialStep = memo(InitialStepFC);
