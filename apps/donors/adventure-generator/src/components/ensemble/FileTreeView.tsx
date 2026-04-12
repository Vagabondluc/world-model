import React, { FC, useState } from 'react';
import { css } from '@emotion/css';
import { FileNode } from '../../stores/ensembleStore';
import { EnsembleService } from '../../services/ensembleService';

const styles = {
    node: css`
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;
        transition: background 0.2s;
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.95rem;

        &:hover {
            background-color: rgba(0, 0, 0, 0.05);
        }

        &.selected {
            background-color: var(--medium-brown);
            color: white;
        }
    `,
    folderContent: css`
        padding-left: 16px;
        border-left: 1px solid var(--border-light);
        margin-left: 8px;
    `,
    icon: css`
        width: 16px;
        text-align: center;
    `
};

interface FileTreeItemProps {
    node: FileNode;
    selectedPath: string | null;
    onSelect: (path: string) => void;
}

const FileTreeItem: FC<FileTreeItemProps> = ({ node, selectedPath, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isSelected = selectedPath === node.path;

    const handleClick = () => {
        if (node.type === 'directory') {
            setIsOpen(!isOpen);
        } else {
            onSelect(node.path);
        }
    };

    return (
        <div>
            <div
                className={cx(styles.node, isSelected && 'selected')}
                onClick={handleClick}
            >
                <span className={styles.icon}>
                    {node.type === 'directory' ? (isOpen ? '📂' : '📁') : '📄'}
                </span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {node.name}
                </span>
            </div>
            {node.type === 'directory' && isOpen && node.children && (
                <div className={styles.folderContent}>
                    {node.children.map(child => (
                        <FileTreeItem
                            key={child.id}
                            node={child}
                            selectedPath={selectedPath}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export const FileTreeView: FC<{ tree: FileNode[]; selectedPath: string | null; onSelect: (path: string) => void }> = ({ tree, selectedPath, onSelect }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {tree.map(node => (
                <FileTreeItem
                    key={node.id}
                    node={node}
                    selectedPath={selectedPath}
                    onSelect={onSelect}
                />
            ))}
        </div>
    );
};

type ClassValue = string | false | null | undefined;

function cx(...args: ClassValue[]) {
    return args.filter(Boolean).join(' ');
}
