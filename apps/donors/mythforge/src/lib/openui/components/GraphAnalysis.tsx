import React from 'react';

export interface GraphAnalysisProps {
  summary?: string;
  orphanCount?: number;
  orphanTitles?: string[];
  clusterTitles?: string[];
}

export default function GraphAnalysis({ summary, orphanCount, orphanTitles = [], clusterTitles = [] }: GraphAnalysisProps) {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 6, padding: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>Graph Analysis</div>
      {summary && <div>{summary}</div>}
      {typeof orphanCount === 'number' && <div style={{ marginTop: 4, fontSize: 12, color: '#666' }}>Orphans: {orphanCount}</div>}
      {orphanTitles.length > 0 && <div style={{ marginTop: 4, fontSize: 12 }}>Orphan titles: {orphanTitles.join(', ')}</div>}
      {clusterTitles.length > 0 && <div style={{ marginTop: 4, fontSize: 12 }}>Clusters: {clusterTitles.join(', ')}</div>}
    </div>
  );
}
