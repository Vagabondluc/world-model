import React, { FC, useMemo } from 'react';
import { css } from '@emotion/css';
import { theme } from '../../../styles/theme';
import { GeneratedTrap } from '../../../types/trap';
import { sanitizeHtml } from '../../../utils/sanitizeHtml';

interface TrapCardProps {
    trap: Partial<GeneratedTrap>;
    onUpdate: (field: keyof GeneratedTrap, value: string) => void;
}

const styles = {
    card: css`
        background: white;
        border-radius: 8px;
        padding: 2rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        border: 1px solid #e5e1d8;
        font-family: ${theme.fonts.body};
    `,
    trapName: css`
        font-size: 1.5rem;
        font-weight: 700;
        color: ${theme.colors.text};
        margin-bottom: 1.5rem;
        padding: 0.5rem;
        border: 2px solid transparent;
        border-radius: 4px;
        transition: all 0.2s;
        cursor: text;
        
        &:hover {
            border-color: #e5e1d8;
            background: #fafaf9;
        }
        
        &:focus {
            outline: none;
            border-color: ${theme.colors.accent};
            background: white;
        }
    `,
    section: css`
        margin-bottom: 1.5rem;
        
        &:last-child {
            margin-bottom: 0;
        }
    `,
    sectionHeader: css`
        font-weight: 600;
        letter-spacing: 0.025em;
        color: ${theme.colors.textMuted};
        text-transform: uppercase;
        font-size: 0.75rem;
        margin-bottom: 0.5rem;
    `,
    field: css`
        padding: 1rem;
        border: 2px solid transparent;
        border-radius: 4px;
        background: white;
        transition: all 0.2s;
        cursor: text;
        min-height: 3rem;
        font-size: 1rem;
        line-height: 1.5;
        color: ${theme.colors.text};
        
        &:hover {
            border-color: #e5e1d8;
            background: #fafaf9;
        }
        
        &:focus {
            outline: none;
            border-color: ${theme.colors.accent};
            background: white;
        }
        
        &:empty:before {
            content: attr(data-placeholder);
            color: ${theme.colors.textMuted};
            font-style: italic;
        }
    `,
    consequences: css`
        list-style: none;
        padding: 0;
        margin: 0;
    `,
    consequenceItem: css`
        padding: 0.5rem 0 0.5rem 1.5rem;
        position: relative;
        font-size: 1rem;
        color: ${theme.colors.text};
        
        &:before {
            content: '•';
            position: absolute;
            left: 0.5rem;
            color: #c44536;
            font-weight: bold;
        }
    `
};

export const TrapCard: FC<TrapCardProps> = ({ trap, onUpdate }) => {
    const handleFieldChange = (field: keyof GeneratedTrap, element: HTMLDivElement) => {
        onUpdate(field, element.textContent || '');
    };

    const descriptionHtml = useMemo(
        () => sanitizeHtml(trap.description || '', { allowBasicFormatting: true }),
        [trap.description]
    );
    const triggerHtml = useMemo(
        () => sanitizeHtml(trap.trigger || '', { allowBasicFormatting: true }),
        [trap.trigger]
    );
    const effectHtml = useMemo(
        () => sanitizeHtml(trap.effect || '', { allowBasicFormatting: true }),
        [trap.effect]
    );

    return (
        <div className={styles.card}>
            {/* Trap Name */}
            <div
                className={styles.trapName}
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleFieldChange('name', e.currentTarget)}
            >
                {trap.name || '🎯 Untitled Trap'}
            </div>

            {/* What the players notice */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>What the players notice</div>
                <div
                    className={styles.field}
                    contentEditable
                    suppressContentEditableWarning
                    data-placeholder="Describe the warning signs or clues..."
                    onBlur={(e) => handleFieldChange('description', e.currentTarget)}
                    dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                />
            </div>

            {/* What triggers it */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>What triggers it</div>
                <div
                    className={styles.field}
                    contentEditable
                    suppressContentEditableWarning
                    data-placeholder="What action or event sets off the trap?"
                    onBlur={(e) => handleFieldChange('trigger', e.currentTarget)}
                    dangerouslySetInnerHTML={{ __html: triggerHtml }}
                />
            </div>

            {/* What happens */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>What happens</div>
                <div
                    className={styles.field}
                    contentEditable
                    suppressContentEditableWarning
                    data-placeholder="Describe the trap's effect..."
                    onBlur={(e) => handleFieldChange('effect', e.currentTarget)}
                    dangerouslySetInnerHTML={{ __html: effectHtml }}
                />
            </div>

            {/* Consequence */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>Consequence</div>
                <ul className={styles.consequences}>
                    {trap.rules && trap.rules.length > 0 ? (
                        <>
                            {trap.rules[0].area && (
                                <li className={styles.consequenceItem}>{trap.rules[0].area}</li>
                            )}
                            {trap.rules[0].damage && (
                                <li className={styles.consequenceItem}>{trap.rules[0].damage} damage</li>
                            )}
                            {trap.rules[0].condition && (
                                <li className={styles.consequenceItem}>{trap.rules[0].condition} condition</li>
                            )}
                        </>
                    ) : (
                        <li className={styles.consequenceItem} style={{ color: theme.colors.textMuted, fontStyle: 'italic' }}>
                            No consequences defined
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default TrapCard;
