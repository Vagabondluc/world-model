import React, { FC, PropsWithChildren, useEffect } from 'react';
import { cx } from '@emotion/css';

interface OverlayProps {
    isOpen: boolean;
    onClose: () => void;
    className: string;
    keepMounted?: boolean;
    closeOnBackdrop?: boolean;
    closeOnEscape?: boolean;
    lockBodyScroll?: boolean;
}

export const Overlay: FC<PropsWithChildren<OverlayProps>> = ({
    isOpen,
    onClose,
    className,
    keepMounted = false,
    closeOnBackdrop = true,
    closeOnEscape = true,
    lockBodyScroll = true,
    children,
}) => {
    useEffect(() => {
        if (!closeOnEscape) return;
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [closeOnEscape, isOpen, onClose]);

    useEffect(() => {
        if (!lockBodyScroll) return;
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen, lockBodyScroll]);

    if (!isOpen && !keepMounted) return null;

    return (
        <div
            className={cx(className, { open: isOpen })}
            onClick={closeOnBackdrop ? onClose : undefined}
            aria-hidden="true"
        >
            {children}
        </div>
    );
};
