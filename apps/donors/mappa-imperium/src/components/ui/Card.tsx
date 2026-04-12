import React from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive';
  elevation?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  variant = 'default',
  elevation = 'md',
  children,
  className,
  ...props
}, ref) => {
  const baseClasses = [
    'bg-white rounded-xl border transition-all duration-200',
  ];

  const elevationClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  const variantClasses = {
    default: ['border-gray-200'],
    interactive: [
      'border-gray-200 hover:shadow-lg cursor-pointer',
      'hover:-translate-y-1 hover:border-amber-400',
    ],
  };

  return (
    <div
      className={cn(
        ...baseClasses,
        elevationClasses[elevation],
        ...variantClasses[variant],
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
