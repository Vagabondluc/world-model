import React, { FC } from 'react';
import { css } from '@emotion/css';
import { theme } from '../../../styles/theme';
import { Wand2 } from 'lucide-react';

interface ComponentSlotProps {
    label: string;
    onRoll: () => void;
    currentValue?: string;
}

const slotStyles = {
    container: css`
        display: flex;
        flex-direction: column;
        gap: 4px;
        background: ${theme.colors.card};
        padding: 8px;
        border: 1px solid ${theme.borders.light};
        border-radius: 4px;
        font-size: 0.8rem;
    `,
    header: css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: ${theme.colors.textMuted};
        font-weight: bold;
        text-transform: uppercase;
    `,
    value: css`
        flex: 1;
        padding: 4px;
        border: 1px solid ${theme.borders.light};
        background: #fdfdfd;
        border-radius: 2px;
        min-height: 24px;
        font-family: ${theme.fonts.body};
    `,
    rollBtn: css`
        background: transparent;
        border: none;
        color: ${theme.colors.accent};
        cursor: pointer;
        padding: 2px;
        display: flex;
        align-items: center;
        &:hover { opacity: 0.8; }
    `
};

const ComponentSlot: FC<ComponentSlotProps> = ({ label, onRoll, currentValue }) => (
    <div className={slotStyles.container}>
        <div className={slotStyles.header}>
            <span>{label}</span>
            <button className={slotStyles.rollBtn} onClick={onRoll} title="Roll Component">
                <Wand2 size={12} />
            </button>
        </div>
        <div className={slotStyles.value}>{currentValue || '-'}</div>
    </div>
);

interface ComponentMatrixProps {
    onSelect: (type: string, value: string) => void;
    onGenerateMatrix: () => void;
    onApplyTheme: () => void;
    values: Record<string, string | undefined>;
}

export const ComponentMatrix: FC<ComponentMatrixProps> = ({
    onSelect,
    onGenerateMatrix,
    onApplyTheme,
    values
}) => {
    // 6x4 Grid
    const categories = ['Clue', 'Trigger', 'Danger', 'Modifier'];
    const rows = 6;

    const handleRoll = (cat: string, row: number) => {
        onSelect(cat, `Random ${cat} ${row}`);
    };

    return (
        <div className={css`display: flex; flex-direction: column; gap: 16px;`}>
            <div className={css`
                font-family: ${theme.fonts.header};
                font-size: 0.85rem;
                font-weight: bold;
                color: ${theme.colors.textMuted};
                text-transform: uppercase;
                border-bottom: 2px solid ${theme.colors.accent};
                padding-bottom: 4px;
            `}>
                Component Matrix (6x4)
            </div>

            <div className={css`
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 8px;
            `}>
                {categories.map(cat => (
                    <div key={cat} className={css`display: flex; flex-direction: column; gap: 8px;`}>
                        {Array.from({ length: rows }).map((_, i) => (
                            <ComponentSlot
                                key={i}
                                label={`${i + 1}. ${cat}`}
                                onRoll={() => handleRoll(cat, i + 1)}
                                currentValue={i === 0 ? values[cat] : undefined}
                            />
                        ))}
                    </div>
                ))}
            </div>

            <div className={css`display: flex; gap: 8px; margin-top: 8px;`}>
                <button
                    className="secondary-button"
                    style={{ fontSize: '0.75rem' }}
                    onClick={onGenerateMatrix}
                >
                    Generate 6x4 Matrix
                </button>
                <button
                    className="secondary-button"
                    style={{ fontSize: '0.75rem' }}
                    onClick={onApplyTheme}
                >
                    Apply Theme
                </button>
            </div>
        </div>
    );
};

export default ComponentMatrix;
