import React, { FC, useState } from 'react';
import { css } from '@emotion/css';
import { theme } from '../../../styles/theme';
import { GeneratedTrap } from '../../../types/trap';
import { TrapCard } from './TrapCard';
import { TrapTimeline } from './TrapTimeline';
import { GMControls } from './GMControls';
import { ComponentMatrix } from './ComponentMatrix';
import { buildTrapCheckResults, TrapCheckResult } from '../../../utils/trapChecks';

interface ActiveTrapPanelProps {
    trap: Partial<GeneratedTrap>;
    onUpdate: (field: keyof GeneratedTrap, value: string) => void;
    onComponentSelect?: (type: string, value: string) => void;
    onGenerateMatrix?: () => void;
    onApplyTheme?: () => void;
    onGenerateTrap?: (tier: string) => void;
}

const styles = {
    container: css`
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        padding: 0;
    `,
    mainLayout: css`
        display: grid;
        grid-template-columns: 1fr 350px;
        gap: 1.5rem;
        
        @media (max-width: 1200px) {
            grid-template-columns: 1fr;
        }
    `,
    leftColumn: css`
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    `,
    advancedSection: css`
        margin-top: 1rem;
        padding: 1.5rem;
        background: #fafaf9;
        border-radius: 8px;
        border: 1px dashed #e5e1d8;
    `,
    advancedHeader: css`
        font-family: ${theme.fonts.header};
        font-size: 0.9rem;
        font-weight: bold;
        color: ${theme.colors.textMuted};
        text-transform: uppercase;
        margin-bottom: 0.75rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `,
    advancedNote: css`
        font-size: 0.85rem;
        color: ${theme.colors.textMuted};
        font-style: italic;
        margin-bottom: 1rem;
    `
};

export const ActiveTrapPanel: FC<ActiveTrapPanelProps> = ({
    trap,
    onUpdate,
    onComponentSelect,
    onGenerateMatrix,
    onApplyTheme,
    onGenerateTrap
}) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [checkResults, setCheckResults] = useState<TrapCheckResult[]>([]);

    const handleRollCheck = () => {
        setCheckResults(buildTrapCheckResults(trap));
    };

    return (
        <div className={styles.container}>
            {/* Main Layout: Card + Controls */}
            <div className={styles.mainLayout}>
                {/* Left Column: Trap Card */}
                <div className={styles.leftColumn}>
                    <TrapCard trap={trap} onUpdate={onUpdate} />
                    <TrapTimeline />
                </div>

                {/* Right Column: GM Controls */}
                <GMControls
                    trap={trap}
                    showAdvanced={showAdvanced}
                    onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
                    onRollCheck={handleRollCheck}
                    onGenerateTrap={onGenerateTrap}
                    checkResults={checkResults}
                />
            </div>

            {/* Advanced Section: Component Matrix */}
            {showAdvanced && (
                <div className={styles.advancedSection}>
                    <div className={styles.advancedHeader}>
                        <span>⚙️</span>
                        <span>Trap Anatomy (Advanced)</span>
                    </div>
                    <div className={styles.advancedNote}>
                        This shows the underlying component structure used to generate the trap.
                    </div>
                    <ComponentMatrix
                        onSelect={onComponentSelect || (() => { })}
                        onGenerateMatrix={onGenerateMatrix || (() => { })}
                        onApplyTheme={onApplyTheme || (() => { })}
                        values={{
                            Clue: trap.description,
                            Trigger: trap.trigger,
                            Danger: trap.effect,
                            Modifier: trap.name
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default ActiveTrapPanel;
