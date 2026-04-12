import React, { useMemo } from 'react';
import { useUIStore } from '../../store/uiStore';

export interface CellData {
    id: string;
    biome?: string;
    [key: string]: any;
}

export interface CellInfoPanelProps {
    cellData?: CellData; // Still passed from App because we don't have worldData in uiStore yet
    // onClose removed, handled internally via store
}

export const CellInfoPanel: React.FC<CellInfoPanelProps> = ({ cellData }) => {
    const selectedCellId = useUIStore(state => state.selection.selectedCellId);
    const selectCell = useUIStore(state => state.selectCell);
    const setSelectionMode = useUIStore(state => state.setSelectionMode);

    const handleClose = () => {
        selectCell(undefined);
    };

    if (!selectedCellId) return null;

    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            backgroundColor: 'rgba(20, 20, 30, 0.85)',
            backdropFilter: 'blur(10px)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fff',
            width: '280px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
            zIndex: 100
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>Cell Info</h3>
                <button
                    onClick={handleClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.6)',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        padding: '0 5px'
                    }}
                >
                    ✕
                </button>
            </div>

            <div style={{ display: 'grid', gap: '8px' }}>
                <InfoRow label="ID" value={selectedCellId} />
                <InfoRow label="Biome" value={cellData?.biome || 'Unknown'} />
                {cellData?.position && (
                    <InfoRow
                        label="Position"
                        value={`${cellData.position.x.toFixed(2)}, ${cellData.position.y.toFixed(2)}, ${cellData.position.z.toFixed(2)}`}
                    />
                )}
            </div>
        </div>
    );
};

const InfoRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '4px' }}>
        <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>{label}</span>
        <span style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{value}</span>
    </div>
);

export default CellInfoPanel;
