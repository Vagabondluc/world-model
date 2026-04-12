import React, { FC, useMemo, useEffect } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    useNodesState,
    useEdgesState,
    Node,
    Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useEnsembleStore } from '../../stores/ensembleStore';
import { EnsembleService } from '../../services/ensembleService';

export const BlueprintCanvas: FC = () => {
    const { graphData } = useEnsembleStore();
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    useEffect(() => {
        // Map store graph data to React Flow format
        const initialNodes: Node[] = graphData.nodes.map((n, i) => {
            let background = 'var(--parchment-bg)';
            let border = '1px solid var(--medium-brown)';

            if (n.type === 'quick-delve') {
                background = '#e3f2fd'; // Light blue for dungeon masters
                border = '2px solid #2196f3';
            } else if (n.type === 'narrative-encounter') {
                background = '#fee'; // Light red for encounters
                border = '2px solid var(--dnd-red)';
            } else if (n.type === 'dungeon-room') {
                background = '#fff';
                border = '1px solid var(--medium-brown)';
            }

            return {
                id: n.id,
                type: 'default',
                data: { label: n.label },
                position: { x: (i % 5) * 250, y: Math.floor(i / 5) * 150 },
                style: {
                    background,
                    color: 'var(--dark-brown)',
                    border,
                    fontFamily: 'var(--header-font)',
                    borderRadius: '8px',
                    padding: '10px',
                    width: 180,
                    textAlign: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }
            };
        });

        const initialEdges: Edge[] = graphData.edges.map(e => ({
            id: e.id,
            source: e.source,
            target: e.target,
            label: e.label,
            animated: e.label === 'mention',
            labelStyle: { fill: 'var(--dark-brown)', fontSize: '0.7rem', fontWeight: 'bold' },
            style: {
                stroke: e.label === 'contains' ? '#2196f3' : 'var(--dnd-red)',
                strokeWidth: e.label === 'contains' ? 2 : 1
            }
        }));

        setNodes(initialNodes);
        setEdges(initialEdges);
    }, [graphData]);

    const onNodeClick = (_event: React.MouseEvent, node: Node) => {
        EnsembleService.loadFileIntoStore(node.id);
    };

    return (
        <div style={{ width: '100%', height: '100%', background: '#f5f5f5' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                fitView
            >
                <Background color="#ccc" gap={20} />
                <Controls />
            </ReactFlow>
        </div>
    );
};
