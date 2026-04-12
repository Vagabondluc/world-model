import React from 'react';
import { cn } from '../../utils/cn';
import { componentStyles } from '../../design/tokens';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'icon';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  className,
  children,
  ...props
}, ref) => {
  const { button: btnStyles } = componentStyles;
  const variantClass = btnStyles[variant] || btnStyles.primary;

  return (
    <button
      className={cn(
        btnStyles.base,
        variantClass,
        className
      )}
      ref={ref}
      {...props}
    >
        {children}
    </button>
  );
});
Button.displayName = 'Button';
