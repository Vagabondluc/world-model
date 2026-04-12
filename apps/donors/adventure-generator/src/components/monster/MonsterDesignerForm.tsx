
import React, { FC } from 'react';
import { css } from '@emotion/css';
import { IdentitySection } from './form/IdentitySection';
import { TagSection } from './form/TagSection';
import { ProceduralTuning } from './form/ProceduralTuning';

const styles = {
    container: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-l);
        animation: fadeIn 0.4s ease-out;
        padding-bottom: var(--space-xl);

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `,
    actions: css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-m);
        margin-top: var(--space-s);
    `
};

interface MonsterDesignerFormProps {
    loading: boolean;
    onGenerateAI: () => void;
    onGenerateProcedural: () => void;
}

export const MonsterDesignerForm: FC<MonsterDesignerFormProps> = ({ loading, onGenerateAI, onGenerateProcedural }) => {
    return (
        <div className={styles.container}>
            <IdentitySection />
            <TagSection />
            <ProceduralTuning />

            <div className={styles.actions}>
                <button 
                    className="primary-button" 
                    onClick={onGenerateAI} 
                    disabled={loading}
                    title="Use AI to generate a complete monster based on all settings."
                >
                    {loading ? <><span className="loader"></span> Generating...</> : '✨ Fabricate (AI)'}
                </button>
                <button 
                    className="secondary-button" 
                    onClick={onGenerateProcedural} 
                    disabled={loading}
                    title="Instantly generate a balanced statblock using rules (ignores Concept text)."
                >
                    ⚡ Quick Draft
                </button>
            </div>
        </div>
    );
};
