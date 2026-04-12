import React from 'react';
import { cn } from '../../utils/cn';
import { componentStyles } from '../../design/tokens';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'base' | 'interactive' | 'page';
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  variant = 'base',
  className,
  children,
  ...props
}, ref) => {
  const { card: cardStyles } = componentStyles;
  const variantClass = cardStyles[variant] || cardStyles.base;

  return (
    <div
      className={cn(
        variantClass,
        // Interactive variant is additive
        variant === 'interactive' && cardStyles.interactive,
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});
Card.displayName = 'Card';
