import React, { FC, useState } from 'react';
import { css } from '@emotion/css';
import { theme } from '../../../styles/theme';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface TimelineNode {
    stage: 'warning' | 'action' | 'impact';
    label: string;
    text: string;
    optional?: boolean;
}

interface TrapTimelineProps {
    nodes?: TimelineNode[];
    onUpdateNode?: (stage: string, text: string) => void;
}

const styles = {
    container: css`
        margin-top: 1.5rem;
    `,
    header: css`
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-family: ${theme.fonts.header};
        font-size: 0.9rem;
        font-weight: bold;
        color: ${theme.colors.textMuted};
        text-transform: uppercase;
        margin-bottom: 1rem;
    `,
    timeline: css`
        display: flex;
        flex-direction: column;
        gap: 1rem;
    `,
    node: css`
        position: relative;
        padding-left: 2rem;
    `,
    nodeCard: css`
        background: white;
        border: 2px solid #e5e1d8;
        border-radius: 6px;
        padding: 1rem;
        transition: all 0.2s;
        
        &:hover {
            border-color: ${theme.colors.accent};
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
    `,
    nodeCardWarning: css`
        border-left: 4px solid #d97706;
    `,
    nodeCardAction: css`
        border-left: 4px solid #2563eb;
    `,
    nodeCardImpact: css`
        border-left: 4px solid #c44536;
    `,
    nodeHeader: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        cursor: pointer;
    `,
    nodeLabel: css`
        font-weight: 600;
        font-size: 0.875rem;
        color: ${theme.colors.text};
    `,
    nodeText: css`
        font-size: 0.95rem;
        line-height: 1.5;
        color: ${theme.colors.text};
        padding: 0.5rem;
        border: 1px solid transparent;
        border-radius: 4px;
        transition: all 0.2s;
        cursor: text;
        
        &:hover {
            background: #fafaf9;
            border-color: #e5e1d8;
        }
        
        &:focus {
            outline: none;
            border-color: ${theme.colors.accent};
            background: white;
        }
    `,
    arrow: css`
        position: absolute;
        left: 0.75rem;
        top: 100%;
        width: 2px;
        height: 1rem;
        background: linear-gradient(to bottom, #d1d5db, transparent);
        z-index: -1;
    `,
    icon: css`
        position: absolute;
        left: 0.375rem;
        top: 1rem;
        width: 1.25rem;
        height: 1.25rem;
        background: white;
        border: 2px solid #e5e1d8;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.625rem;
    `,
    iconWarning: css`
        border-color: #d97706;
        color: #d97706;
    `,
    iconAction: css`
        border-color: #2563eb;
        color: #2563eb;
    `,
    iconImpact: css`
        border-color: #c44536;
        color: #c44536;
    `
};

const defaultNodes: TimelineNode[] = [
    {
        stage: 'warning',
        label: 'Warning',
        text: 'Dust falls. A soft click echoes.'
    },
    {
        stage: 'action',
        label: 'Action',
        text: 'The ceiling slab begins to descend.'
    },
    {
        stage: 'impact',
        label: 'Impact',
        text: 'The corridor is sealed. Anyone beneath takes 1d10 bludgeoning.'
    }
];

export const TrapTimeline: FC<TrapTimelineProps> = ({
    nodes = defaultNodes,
    onUpdateNode
}) => {
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

    const toggleCollapse = (stage: string) => {
        setCollapsed(prev => ({ ...prev, [stage]: !prev[stage] }));
    };

    const getStageColor = (stage: string) => {
        switch (stage) {
            case 'warning': return styles.nodeCardWarning;
            case 'action': return styles.nodeCardAction;
            case 'impact': return styles.nodeCardImpact;
            default: return '';
        }
    };

    const getIconColor = (stage: string) => {
        switch (stage) {
            case 'warning': return styles.iconWarning;
            case 'action': return styles.iconAction;
            case 'impact': return styles.iconImpact;
            default: return '';
        }
    };

    const getStageIcon = (stage: string) => {
        switch (stage) {
            case 'warning': return '⚠';
            case 'action': return '⚡';
            case 'impact': return '💥';
            default: return '•';
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span>⏳</span>
                <span>Trap Timeline</span>
            </div>

            <div className={styles.timeline}>
                {nodes.map((node, index) => (
                    <div key={node.stage} className={styles.node}>
                        {/* Timeline icon */}
                        <div className={`${styles.icon} ${getIconColor(node.stage)}`}>
                            {getStageIcon(node.stage)}
                        </div>

                        {/* Node card */}
                        <div className={`${styles.nodeCard} ${getStageColor(node.stage)}`}>
                            <div
                                className={styles.nodeHeader}
                                onClick={() => toggleCollapse(node.stage)}
                            >
                                <span className={styles.nodeLabel}>
                                    {node.label}
                                </span>
                                {collapsed[node.stage] ?
                                    <ChevronRight size={16} /> :
                                    <ChevronDown size={16} />
                                }
                            </div>

                            {!collapsed[node.stage] && (
                                <div
                                    className={styles.nodeText}
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => onUpdateNode?.(node.stage, e.currentTarget.textContent || '')}
                                >
                                    {node.text}
                                </div>
                            )}
                        </div>

                        {/* Arrow connector to next node */}
                        {index < nodes.length - 1 && <div className={styles.arrow} />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrapTimeline;
