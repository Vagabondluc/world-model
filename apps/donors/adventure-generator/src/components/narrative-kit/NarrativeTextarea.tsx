import React, { FC } from 'react';
import { css } from '@emotion/css';
import { theme } from '../../styles/theme';

interface NarrativeTextareaProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    rows?: number;
}

const styles = {
    container: css`
        display: flex;
        flex-direction: column;
        gap: 4px;
        width: 100%;
    `,
    label: css`
        font-family: ${theme.fonts.header};
        font-weight: bold;
        font-size: 0.85rem;
        color: ${theme.colors.textMuted};
        text-transform: uppercase;
    `,
    textarea: css`
        width: 100%;
        padding: 12px;
        border: 1px solid ${theme.colors.inputBorder};
        border-radius: ${theme.borders.radius};
        font-family: ${theme.fonts.body};
        font-size: 1rem;
        line-height: 1.5;
        color: ${theme.colors.inputText};
        background-color: ${theme.colors.inputBg};
        resize: vertical;
        min-height: 80px;
        transition: border-color 0.2s, box-shadow 0.2s;

        &:focus {
            outline: none;
            border-color: ${theme.colors.inputFocus};
            box-shadow: 0 0 0 3px rgba(106, 76, 147, 0.1);
        }

        &::placeholder {
            color: ${theme.colors.inputPlaceholder};
            font-style: italic;
        }
    `
};

export const NarrativeTextarea: FC<NarrativeTextareaProps> = ({ label, value, onChange, placeholder, className, rows = 3 }) => {
    return (
        <div className={css(styles.container, className)}>
            {label && <label className={styles.label}>{label}</label>}
            <textarea
                className={styles.textarea}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
            />
        </div>
    );
};
