
import React, { useState, FC, useCallback } from 'react';
import { css } from '@emotion/css';
import { generateTrapRules } from '../../utils/trapHelpers';
import { GeneratedTrap, TrapTier } from '../../types/trap';
import { TrapControls } from './TrapControls';
import { TrapPreview } from './TrapPreview';

const styles = {
    container: css`
        height: 100%;
    `,
    layout: css`
        display: grid;
        grid-template-columns: 280px 1fr;
        gap: var(--space-xl);
        height: 100%;
        align-items: flex-start;

        @media (max-width: 1024px) {
            grid-template-columns: 1fr;
        }
    `,
};

export const TrapGeneratorView: FC = () => {
    const [trap, setTrap] = useState<GeneratedTrap | null>(null);
    const [tier, setTier] = useState<TrapTier>('1-4');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const handleGenerate = useCallback(() => {
        setTrap(generateTrapRules(tier, selectedTags));
    }, [tier, selectedTags]);

    const handleUpdateTrap = (updatedTrap: GeneratedTrap) => {
        setTrap(updatedTrap);
    };

    return (
        <div className={styles.container}>
            <div className={styles.layout}>
                <TrapControls 
                    tier={tier}
                    setTier={setTier}
                    selectedTags={selectedTags}
                    setSelectedTags={setSelectedTags}
                    onGenerate={handleGenerate}
                    hasTrap={!!trap}
                />
                <TrapPreview 
                    trap={trap}
                    onUpdate={handleUpdateTrap}
                />
            </div>
        </div>
    );
};
