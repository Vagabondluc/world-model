import React from 'react';
import { cn } from '@/utils/cn';
import { LoaderCircle } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className,
  ...props
}, ref) => {
  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-semibold rounded-lg',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    size === 'sm' && 'px-3 py-1.5 text-sm h-8',
    size === 'md' && 'px-4 py-2 text-base h-10',
    size === 'lg' && 'px-6 py-3 text-lg h-12',
  ];

  const variantClasses = {
    primary: [
      'bg-amber-700 text-white',
      'hover:bg-amber-800 active:bg-amber-900',
      'focus:ring-amber-500',
      'shadow-lg hover:shadow-xl',
      'transform hover:scale-105 active:scale-95',
    ],
    secondary: [
      'bg-white text-gray-900 border border-gray-200',
      'hover:bg-gray-50 active:bg-gray-100',
      'focus:ring-amber-500',
      'shadow-sm hover:shadow-md',
    ],
    destructive: [
      'bg-red-600 text-white',
      'hover:bg-red-700 active:bg-red-800', 
      'focus:ring-red-500',
      'shadow-lg hover:shadow-xl',
    ],
    ghost: [
      'text-gray-600 hover:text-gray-900',
      'hover:bg-gray-100 active:bg-gray-200',
      'focus:ring-gray-500',
    ],
  };

  return (
    <button
      className={cn(
        ...baseClasses,
        ...variantClasses[variant],
        loading && 'cursor-wait',
        className
      )}
      disabled={disabled || loading}
      ref={ref}
      {...props}
    >
      {loading && <LoaderCircle className="animate-spin -ml-1 mr-3 h-4 w-4" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
