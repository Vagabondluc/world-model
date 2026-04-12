
import React, { FC } from 'react';
import { css } from '@emotion/css';
import { ADVENTURE_TABLE } from '../../../data/legacyTables';
import { Modal } from '../../common/Modal';

interface ArcaneTableModalProps {
    onClose: () => void;
}

const styles = {
    table: css`
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
        
        th, td {
            text-align: left;
            padding: var(--space-s);
            border-bottom: 1px solid var(--border-light);
        }
        th {
            position: sticky;
            top: 0;
            background-color: var(--parchment-bg);
            font-family: var(--header-font);
            border-bottom: 2px solid var(--medium-brown);
        }
    `
}

export const ArcaneTableModal: FC<ArcaneTableModalProps> = ({ onClose }) => {
    return (
        <Modal isOpen={true} onClose={onClose} title="Arcane Reference Table (d100)" size="large">
            <div className="scrollable" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th style={{width: '80px'}}>Roll</th>
                            <th>Action</th>
                            <th>McGuffin</th>
                            <th>Subject</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ADVENTURE_TABLE.map((row, index) => {
                            const start = (index * 2) + 1;
                            const end = start + 1;
                            const range = start === 99 ? "99-00" : `${start.toString().padStart(2, '0')}-${end.toString().padStart(2, '0')}`;
                            return (
                                <tr key={index}>
                                    <td><strong>{range}</strong></td>
                                    <td>{row.action}</td>
                                    <td>{row.mcGuffin}</td>
                                    <td>{row.subject}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Modal>
    );
};
