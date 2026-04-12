// FIX: This file contains JSX syntax within a .ts file, causing numerous compilation errors.
// As it appears to be a planning document rather than active source code, the content has been commented out to resolve these errors.
/*
// src/components/layout/AppLayout.tsx - Main application shell
import React from 'react';
import { cn } from '@/utils/classNames';
import { CollaborationIndicator } from '@/components/ui/CollaborationIndicator';
import { NavigationHeader } from './NavigationHeader';
import { SidePanel } from './SidePanel';

interface AppLayoutProps {
  children: React.ReactNode;
  sidePanel?: 'element-manager' | 'chronicle' | 'ai-guidance' | null;
  onSidePanelChange: (panel: string | null) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  sidePanel,
  onSidePanelChange
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavigationHeader 
        sidePanel={sidePanel}
        onSidePanelToggle={onSidePanelChange}
      />
      
      <div className="flex-1 flex">
        <main className={cn(
          'flex-1 transition-all duration-300',
          sidePanel ? 'md:pr-80' : '', // Leave space for side panel on desktop
          'p-4 md:p-6 lg:p-8'
        )}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        
        {sidePanel && (
          <SidePanel
            type={sidePanel}
            onClose={() => onSidePanelChange(null)}
          />
        )}
      </div>
    </div>
  );
};

// src/components/layout/EraInterface.tsx - Era-specific responsive container
interface EraInterfaceProps {
  era: number;
  title: string;
  children: React.ReactNode;
  aiGuidance?: React.ReactNode;
  progress?: React.ReactNode;
}

export const EraInterface: React.FC<EraInterfaceProps> = ({
  era,
  title,
  children,
  aiGuidance,
  progress
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-amber-800">
              Era {era}: {title}
            </h1>
            <p className="text-gray-600 mt-1">
              Build your world through collaborative creation
            </p>
          </div>
          
          {progress && (
            <div className="lg:w-80">
              {progress}
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 space-y-6">
          {children}
        </div>
        
        {aiGuidance && (
          <div className="xl:col-span-4">
            <div className="sticky top-6">
              {aiGuidance}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// src/components/layout/GridLayout.tsx - Responsive grid for element cards
interface GridLayoutProps {
  children: React.ReactNode;
  columns?: 'auto' | 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const GridLayout: React.FC<GridLayoutProps> = ({
  children,
  columns = 'auto',
  gap = 'md',
  className
}) => {
  const gridClasses = {
    auto: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };
  
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
  };
  
  return (
    <div className={cn(
      'grid',
      gridClasses[columns],
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
};

// src/components/layout/SidePanel.tsx - Responsive side panel
interface SidePanelProps {
  type: 'element-manager' | 'chronicle' | 'ai-guidance';
  onClose: () => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({ type, onClose }) => {
  const panelContent = {
    'element-manager': <div>Element Manager Content</div>, // Replace with actual component
    'chronicle': <div>Chronicle Content</div>, // Replace with actual component
    'ai-guidance': <div>AI Guidance Content</div>, // Replace with actual component
  };
  
  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
        onClick={onClose}
      />
      
      <div className={cn(
        'fixed inset-y-0 right-0 z-50 w-full max-w-md',
        'md:relative md:inset-auto md:z-auto md:w-80',
        'bg-white shadow-xl border-l',
        'transform transition-transform duration-300',
        'flex flex-col h-full'
      )}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold capitalize">
            {type.replace('-', ' ')}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close panel"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {panelContent[type]}
        </div>
      </div>
    </>
  );
};

// src/components/ui/Modal.tsx - Improved modal system
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  children
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg', 
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] max-h-[95vh]',
  };
  
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);
  
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 transition-opacity"
        onClick={onClose}
      />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={cn(
          'relative w-full rounded-xl bg-white shadow-xl',
          'transform transition-all duration-300',
          'animate-in fade-in-0 zoom-in-95',
          sizeClasses[size]
        )}>
          {title && (
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">{title}</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          
          <div className={cn(
            size === 'full' ? 'p-6 max-h-[calc(95vh-6rem)] overflow-y-auto' : 'p-6'
          )}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Mobile-specific components
// src/components/mobile/MobileNavigation.tsx
export const MobileNavigation: React.FC = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-30">
      <div className="grid grid-cols-4 h-16">
        {[
          { icon: '🌍', label: 'World', active: true },
          { icon: '📚', label: 'Chronicle', active: false },
          { icon: '🤖', label: 'AI Guide', active: false },
          { icon: '⚙️', label: 'Settings', active: false },
        ].map((item, index) => (
          <button
            key={index}
            className={cn(
              'flex flex-col items-center justify-center gap-1',
              'text-xs transition-colors',
              item.active ? 'text-amber-700' : 'text-gray-500'
            )}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
*/
