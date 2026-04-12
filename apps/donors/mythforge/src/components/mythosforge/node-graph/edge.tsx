'use client';

import { getBezierPath, EdgeLabelRenderer, type EdgeProps } from '@xyflow/react';

// Edge color map by relationship type
const EDGE_COLORS: Record<string, string> = {
  contains: '#C5A861',
  located_in: '#10B981',
  allied_with: '#3B82F6',
  enemy_of: '#EF4444',
  ruler_of: '#F59E0B',
  member_of: '#06B6D4',
  created_by: '#A855F7',
  owns: '#F59E0B',
  knows_about: '#14B8A6',
  part_of: '#64748B',
  parent_of: '#F43F5E',
  student_of: '#6366F1',
  guardian_of: '#0EA5E9',
  derived_from: '#8B5CF6',
  related_to: '#C5A861',
};

export function getEdgeColor(relType: string): string {
  return EDGE_COLORS[relType] || EDGE_COLORS['related_to'];
}

export function getEdgeStyle(relType: string): React.CSSProperties & Record<string, unknown> {
  const color = getEdgeColor(relType);
  const isEnemy = relType === 'enemy_of';
  return {
    stroke: color,
    strokeWidth: 2,
    strokeDasharray: isEnemy ? '8 4' : undefined,
    animation: isEnemy ? 'dash 1s linear infinite' : undefined,
  };
}

export function RelationshipEdge({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition, style = {}, markerEnd, data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition,
  });
  const relType = (data?.label as string) || 'linked';

  return (
    <>
      <path id={id} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div className="nodrag nopan pointer-events-none" style={{
          position: 'absolute',
          transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          fontSize: 10, fontWeight: 500,
        }}>
          <span className="bg-void-800/90 border border-white/[0.06] rounded-full px-2 py-0.5 text-ash-500 backdrop-blur-sm whitespace-nowrap">
            {relType}
          </span>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export const edgeTypes = { relationship: RelationshipEdge };
