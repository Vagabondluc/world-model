
import React from 'react';

interface ModalHeaderProps {
    title: string;
    subtitle?: string;
    icon?: string;
    onClose: () => void;
    className?: string;
    children?: React.ReactNode;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
    title,
    subtitle,
    icon,
    onClose,
    className = '',
    children
}) => {
    return (
        <div className={`h-20 px-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02] shrink-0 ${className}`}>
            <div className="flex items-center gap-6">
                {icon && (
                    <div className="size-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary border border-primary/20">
                        <span className="material-symbols-outlined text-xl">{icon}</span>
                    </div>
                )}
                <div>
                    <h1 className="text-xl font-black text-white font-display tracking-tight uppercase">{title}</h1>
                    {subtitle && (
                        <p className="text-[10px] text-text-muted uppercase tracking-widest">{subtitle}</p>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-4">
                {children}
                <button
                    onClick={onClose}
                    className="size-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
        </div>
    );
};
