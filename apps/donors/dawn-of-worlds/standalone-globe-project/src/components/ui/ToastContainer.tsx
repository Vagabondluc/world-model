
import React from 'react';
import { useToast, Toast } from '../../hooks/useToast';

const ToastItem: React.FC<{ toast: Toast, onClose: () => void }> = ({ toast, onClose }) => {
    const bgColors = {
        info: 'rgba(30, 144, 255, 0.9)',
        success: 'rgba(46, 139, 87, 0.9)',
        warning: 'rgba(255, 165, 0, 0.9)',
        error: 'rgba(220, 20, 60, 0.9)'
    };

    return (
        <div style={{
            background: bgColors[toast.type],
            color: 'white',
            padding: '10px 15px',
            marginBottom: '10px',
            borderRadius: '4px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            minWidth: '250px',
            fontFamily: 'sans-serif',
            fontSize: '14px',
            animation: 'slideIn 0.3s ease-out'
        }}>
            <span>{toast.message}</span>
            <button
                onClick={onClose}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    marginLeft: '10px',
                    cursor: 'pointer',
                    fontSize: '16px'
                }}
            >
                &times;
            </button>
        </div>
    );
};

export const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end'
        }}>
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
};
