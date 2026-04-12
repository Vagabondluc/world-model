import React, { FC, ReactNode } from 'react';
import { css, cx } from '@emotion/css';
import { theme } from '../../styles/theme';

/**
 * Card Component - Base component for all card layouts
 * 
 * Provides a consistent card design with composition pattern.
 * Use subcomponents (Header, Badges, Body, Actions) for structured layouts.
 * 
 * @example
 * <Card variant="elevated" onClick={() => {}}>
 *   <Card.Header>
 *     <h3>Title</h3>
 *     <Card.Badges>
 *       <Badge>CR 5</Badge>
 *     </Card.Badges>
 *   </Card.Header>
 *   <Card.Body>Content here</Card.Body>
 *   <Card.Actions>
 *     <button>View</button>
 *   </Card.Actions>
 * </Card>
 */

export type CardVariant = 'default' | 'compact' | 'elevated' | 'interactive';

interface CardProps {
    variant?: CardVariant;
    className?: string;
    children: ReactNode;
    onClick?: () => void;
    'data-testid'?: string;
}

interface CardSubComponentProps {
    className?: string;
    children: ReactNode;
}

const styles = {
    card: css`
        background-color: var(--card-bg);
        border: var(--border-light);
        border-radius: var(--border-radius);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transition: all 0.2s ease;
        position: relative;
    `,
    default: css`
        padding: var(--space-m);
    `,
    compact: css`
        padding: var(--space-s);
    `,
    elevated: css`
        padding: var(--space-m);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    `,
    interactive: css`
        padding: var(--space-m);
        cursor: pointer;
        
        &:hover {
            border-color: var(--dark-brown);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateY(-3px);
        }
        
        &:active {
            transform: translateY(-1px);
        }
    `,
    header: css`
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        border-bottom: var(--border-light);
        padding-bottom: var(--space-s);
        margin-bottom: var(--space-s);
        
        h3, h4 {
            margin: 0;
            font-size: 1.2rem;
            color: var(--dark-brown);
            padding-right: var(--space-s);
            line-height: 1.3;
        }
        
        h4 {
            font-size: 1rem;
        }
    `,
    badges: css`
        display: flex;
        gap: 4px;
        flex-shrink: 0;
        flex-direction: column;
        align-items: flex-end;
    `,
    body: css`
        flex-grow: 1;
        color: var(--dark-brown);
        font-size: 0.9rem;
    `,
    actions: css`
        margin-top: var(--space-m);
        display: flex;
        justify-content: flex-end;
        gap: var(--space-s);
    `
};

// Main Card Component
export const Card: FC<CardProps> & {
    Header: FC<CardSubComponentProps>;
    Badges: FC<CardSubComponentProps>;
    Body: FC<CardSubComponentProps>;
    Actions: FC<CardSubComponentProps>;
} = ({ variant = 'default', className, children, onClick, 'data-testid': dataTestId }) => {
    return (
        <div
            className={cx(
                styles.card,
                styles[variant],
                className
            )}
            onClick={onClick}
            data-testid={dataTestId}
        >
            {children}
        </div>
    );
};

// Subcomponents
Card.Header = ({ className, children }: CardSubComponentProps) => (
    <div className={cx(styles.header, className)}>
        {children}
    </div>
);

Card.Badges = ({ className, children }: CardSubComponentProps) => (
    <div className={cx(styles.badges, className)}>
        {children}
    </div>
);

Card.Body = ({ className, children }: CardSubComponentProps) => (
    <div className={cx(styles.body, className)}>
        {children}
    </div>
);

Card.Actions = ({ className, children }: CardSubComponentProps) => (
    <div className={cx(styles.actions, className)}>
        {children}
    </div>
);

export default Card;
