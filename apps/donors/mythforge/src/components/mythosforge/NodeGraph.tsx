'use client';

import { useMemo, useCallback, useEffect } from 'react';
import {
  ReactFlow, Background, BackgroundVariant, Controls, MiniMap,
  useNodesState, useEdgesState,
  type Node, type Edge, type NodeChange,
} from '@xyflow/react';
import { RotateCcw } from 'lucide-react';
import type { Entity, Relationship } from '@/lib/types';
import type { PathStep } from '@/components/mythosforge/PathFinder';
import { useWorldStore } from '@/store/useWorldStore';
import { edgeTypes, getEdgeStyle } from './node-graph/edge';
import { computeNodePositions } from './node-graph/layout';

function buildNodeLabel(entity: Entity, isHighlighted = false) {
  return (
    <div className={`bg-surface-700 border rounded-lg p-3 min-w-[180px] ${
      isHighlighted ? 'border-accent-gold shadow-[0_0_12px_rgba(197,168,97,0.3)]' : 'border-surface-600'
    }`}>
      <div className={`${isHighlighted ? 'text-accent-gold' : 'text-bone-100'} font-semibold text-sm`}>
        {entity.title}
      </div>
      <div className="text-ash-500 text-xs mt-1">{entity.category}</div>
    </div>
  );
}

interface NodeGraphProps {
  entities: Entity[];
  relationships: Relationship[];
  highlightedPath?: PathStep[] | null;
}

export function NodeGraph({ entities, relationships, highlightedPath }: NodeGraphProps) {
  const { setActiveEntity, deleteRelationship, nodePositions, setNodePosition, clearNodePositions } = useWorldStore();

  const highlightedRelIds = useMemo(() => {
    if (!highlightedPath) return new Set<string>();
    return new Set(highlightedPath.map((s) => s.relationshipId));
  }, [highlightedPath]);

  const highlightedNodeIds = useMemo(() => {
    if (!highlightedPath) return new Set<string>();
    return new Set(highlightedPath.map((s) => s.entityId));
  }, [highlightedPath]);

  const computedPositions = useMemo(
    () => computeNodePositions(entities, relationships),
    [entities, relationships],
  );

  const initialNodes: Node[] = useMemo(() => {
    return entities.map((entity) => {
      const stored = nodePositions[entity.id];
      const pos = stored || computedPositions.get(entity.id) || { x: 0, y: 0 };
      const isHighlighted = highlightedNodeIds.has(entity.id);
      return {
        id: entity.id,
        type: 'default',
        position: pos,
        data: { label: buildNodeLabel(entity, isHighlighted) },
      };
    });
  }, [entities, computedPositions, nodePositions, highlightedNodeIds]);

  const initialEdges: Edge[] = useMemo(() => {
    return relationships.map((rel) => {
      const isHighlighted = highlightedRelIds.has(rel.id);
      return {
        id: rel.id,
        source: rel.parent_id,
        target: rel.child_id,
        type: 'relationship',
        deletable: true,
        style: isHighlighted
          ? { stroke: '#C5A861', strokeWidth: 4, filter: 'drop-shadow(0 0 6px rgba(197, 168, 97, 0.6))' }
          : getEdgeStyle(rel.relationship_type),
        data: { label: rel.relationship_type },
      };
    });
  }, [relationships, highlightedRelIds]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync internal ReactFlow state when entities/relationships change externally
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setNodes(initialNodes); }, [initialNodes]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setEdges(initialEdges); }, [initialEdges]);

  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes);
    for (const change of changes) {
      if (change.type === 'position' && change.position && !change.dragging && change.id) {
        setNodePosition(change.id, change.position);
      }
    }
  }, [onNodesChange, setNodePosition]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setActiveEntity(node.id);
  }, [setActiveEntity]);

  const onEdgesDelete = useCallback((deletedEdges: Edge[]) => {
    deletedEdges.forEach((edge) => deleteRelationship(edge.id));
  }, [deleteRelationship]);

  const handleResetLayout = useCallback(() => { clearNodePositions(); }, [clearNodePositions]);

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        edgeTypes={edgeTypes}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgesDelete={onEdgesDelete}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        className="bg-void-900"
        deleteKeyCode={['Backspace', 'Delete']}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#32323A" />
        <Controls />
        <MiniMap />
      </ReactFlow>
      <button
        onClick={handleResetLayout}
        className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 text-xs
                   bg-surface-700/80 hover:bg-surface-600 text-bone-300 hover:text-bone-100
                   border border-surface-600 rounded-md backdrop-blur-sm transition-colors cursor-pointer"
        title="Reset layout to default positions"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Reset Layout
      </button>
    </div>
  );
}
