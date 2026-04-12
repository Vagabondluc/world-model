// FIX: This file contains JSX syntax within a .ts file, causing numerous compilation errors.
// As it appears to be a planning document rather than active source code, the content has been commented out to resolve these errors.
/*
// src/components/ui/Button.tsx - Modern button system
import React from 'react';
import { designTokens, componentVariants } from '@/design/tokens';
import { cn } from '@/utils/classNames';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  playerId?: number; // For player-themed buttons
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  playerId,
  loading = false,
  disabled,
  children,
  className,
  ...props
}) => {
  const baseClasses = [
    // Base styles
    'inline-flex items-center justify-center',
    'font-semibold rounded-lg',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    
    // Size variants
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

  // Player-specific styling
  const playerClasses = playerId && designTokens.colors.players[playerId] ? [
    `bg-[${designTokens.colors.players[playerId].primary}] text-white`,
    `hover:bg-[${designTokens.colors.players[playerId].dark}]`,
    'focus:ring-current shadow-lg hover:shadow-xl',
    'transform hover:scale-105 active:scale-95',
  ] : [];

  return (
    <button
      className={cn(
        ...baseClasses,
        ...(playerId ? playerClasses : variantClasses[variant]),
        loading && 'cursor-wait',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {children}
    </button>
  );
};

// src/components/ui/Card.tsx - Enhanced card system
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'player';
  playerId?: number;
  elevation?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  playerId,
  elevation = 'md',
  children,
  className,
  ...props
}) => {
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
      'hover:-translate-y-1 hover:border-gray-300',
    ],
    player: playerId ? [
      'border-gray-200',
      `border-l-4 border-l-[${designTokens.colors.players[playerId]?.primary}]`,
    ] : ['border-gray-200'],
  };

  return (
    <div
      className={cn(
        ...baseClasses,
        elevationClasses[elevation],
        ...variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// src/components/ui/Input.tsx - Form input system
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helpText,
  leftIcon,
  rightIcon,
  className,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 text-sm">{leftIcon}</span>
          </div>
        )}
        
        <input
          id={inputId}
          className={cn(
            // Base styles
            'block w-full rounded-lg border transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent',
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
            
            // Padding based on icons
            leftIcon ? 'pl-10' : 'pl-3',
            rightIcon ? 'pr-10' : 'pr-3',
            'py-2',
            
            // State-based styling
            error
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500'
              : 'border-gray-300 placeholder-gray-400 focus:ring-amber-500',
            
            className
          )}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <span className="text-gray-400 text-sm">{rightIcon}</span>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p className="text-sm text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  );
};

// src/components/ui/CollaborationIndicator.tsx - New collaboration UI
interface CollaborationIndicatorProps {
  activeUsers: Array<{
    id: number;
    name: string;
    playerId: number;
    status: 'online' | 'away' | 'editing';
    lastSeen?: Date;
  }>;
  currentActivity?: string;
}

export const CollaborationIndicator: React.FC<CollaborationIndicatorProps> = ({
  activeUsers,
  currentActivity
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {activeUsers.slice(0, 3).map((user) => (
          <div
            key={user.id}
            className={cn(
              'w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-sm font-bold',
              `bg-[${designTokens.colors.players[user.playerId]?.primary}]`,
            )}
            title={`${user.name} - ${user.status}`}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
        ))}
        
        {activeUsers.length > 3 && (
          <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-400 flex items-center justify-center text-white text-xs font-bold">
            +{activeUsers.length - 3}
          </div>
        )}
      </div>
      
      {currentActivity && (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>{currentActivity}</span>
        </div>
      )}
    </div>
  );
};

// src/components/ui/Toast.tsx - Notification system
interface ToastProps {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  onClose: () => void;
  autoClose?: number; // milliseconds
}

export const Toast: React.FC<ToastProps> = ({
  type,
  title,
  message,
  onClose,
  autoClose = 5000
}) => {
  React.useEffect(() => {
    if (autoClose > 0) {
      const timer = setTimeout(onClose, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  const typeStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800', 
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  const icons = {
    info: '🛈',
    success: '✓',
    warning: '⚠',
    error: '✕',
  };

  return (
    <div className={cn(
      'fixed top-4 right-4 max-w-sm w-full',
      'border rounded-lg p-4 shadow-lg',
      'transform transition-all duration-300',
      'animate-in slide-in-from-top-2',
      typeStyles[type]
    )}>
      <div className="flex items-start gap-3">
        <span className="text-lg" role="img" aria-label={type}>
          {icons[type]}
        </span>
        
        <div className="flex-1">
          <h3 className="font-semibold">{title}</h3>
          {message && (
            <p className="mt-1 text-sm opacity-90">{message}</p>
          )}
        </div>
        
        <button
          onClick={onClose}
          className="text-current opacity-50 hover:opacity-100 transition-opacity"
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
*/
