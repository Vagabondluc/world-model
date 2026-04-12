import React, { FC, ReactNode } from 'react';
import { css, cx } from '@emotion/css';
import { Wand2, Maximize2, Minimize2, ChevronLeft } from 'lucide-react';
import { theme } from '../../styles/theme';

interface NarrativeHeaderProps {
    title: string;
    subtitle?: string;
    goal?: ReactNode;
    onAiFastFill?: () => void;
    isLoading?: boolean;
    onBack?: () => void;
    onToggleFullscreen?: () => void;
    viewMode?: 'small' | 'fullscreen';
    className?: string;
}

const styles = {
    container: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: ${theme.spacing.s};
        border-bottom: 1px solid ${theme.borders.light};
        gap: ${theme.spacing.m};
        
        @media (max-width: 600px) {
            flex-direction: column;
            align-items: flex-start;
        }
    `,
    leftSide: css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing.m};
    `,
    mainInfo: css`
        display: flex;
        align-items: baseline;
        gap: ${theme.spacing.m};
        flex: 1;
        flex-wrap: wrap;
    `,
    label: css`
        font-family: ${theme.fonts.header};
        font-weight: bold;
        color: ${theme.colors.textMuted};
        font-size: 0.85rem;
        text-transform: uppercase;
        margin-right: 4px;
    `,
    content: css`
        font-weight: 500;
        color: ${theme.colors.text};
        font-family: ${theme.fonts.header};
        font-size: 1.1rem;
    `,
    titleContainer: css`
        display: flex;
        flex-direction: column;
    `,
    titleText: css`
        font-weight: 500;
        color: ${theme.colors.text};
        font-family: ${theme.fonts.header};
        font-size: 1.1rem;
        margin: 0;
        padding: 0;
    `,
    subtitleText: css`
        font-size: 0.9rem;
        color: ${theme.colors.textMuted};
        margin-top: 2px;
    `,
    actions: css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing.s};
    `,
    backButton: css`
        display: flex;
        align-items: center;
        gap: 4px;
        background: transparent;
        border: none;
        color: ${theme.colors.accent};
        font-family: ${theme.fonts.header};
        font-weight: bold;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: ${theme.borders.radius};
        transition: background-color 0.2s;
        
        &:hover {
            background-color: rgba(146, 38, 16, 0.05);
        }
    `,
    aiButton: css`
        display: flex;
        align-items: center;
        gap: 6px;
        background-color: ${theme.colors.accent};
        color: white;
        border: none;
        padding: 6px 16px;
        border-radius: ${theme.borders.radius};
        font-family: ${theme.fonts.header};
        font-size: 0.9rem;
        cursor: pointer;
        transition: transform 0.1s, box-shadow 0.1s;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);

        &:hover {
            transform: translateY(-1px);
            box-shadow: 0 3px 6px rgba(0,0,0,0.25);
        }
        
        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    `,
    iconBtn: css`
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: none;
        color: ${theme.colors.textMuted};
        padding: 6px;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
            background-color: rgba(0,0,0,0.05);
            color: ${theme.colors.text};
        }
    `
};

export const NarrativeHeader: FC<NarrativeHeaderProps> = ({
    title, subtitle, goal, onAiFastFill, isLoading = false, onBack, onToggleFullscreen, viewMode = 'small', className
}) => {
    return (
        <div className={css(styles.container, className)}>
            <div className={styles.leftSide}>
                {onBack && (
                    <button className={styles.backButton} onClick={onBack}>
                        <ChevronLeft size={18} />
                        Back
                    </button>
                )}
                <div className={styles.mainInfo}>
                    <div>
                        <span className={styles.label}>Title:</span>
                        <div className={styles.titleContainer}>
                            <h2 className={styles.titleText}>{title}</h2>
                            {subtitle && <div className={styles.subtitleText}>{subtitle}</div>}
                        </div>
                    </div>
                    {goal && (
                        <div>
                            <span className={styles.label}>Goal:</span>
                            <span className={styles.content}>{goal}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.actions}>
                {onAiFastFill && (
                    <button
                        className={styles.aiButton}
                        onClick={onAiFastFill}
                        disabled={isLoading}
                        title="Auto-fill using AI"
                    >
                        <Wand2 size={14} className={isLoading ? css`animation: spin 1s linear infinite;` : ''} />
                        {isLoading ? 'Dreaming...' : 'AI Fast-Fill'}
                    </button>
                )}
                {onToggleFullscreen && (
                    <button
                        className={styles.iconBtn}
                        onClick={onToggleFullscreen}
                        title={viewMode === 'fullscreen' ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                    >
                        {viewMode === 'fullscreen' ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                    </button>
                )}
            </div>
        </div>
    );
};
