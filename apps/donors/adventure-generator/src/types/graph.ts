
import { CompendiumCategory } from './compendium';

export interface GraphNode {
  id: string;
  label: string;
  category: CompendiumCategory;
  val: number; // Represents size/importance
}

export interface GraphLink {
  source: string;
  target: string;
  relationship?: string;
}

export interface GraphData {
    nodes: GraphNode[];
    links: GraphLink[];
}

export interface FileGraphNode {
  id: string;
  label: string;
  path: string;
  type: 'file' | 'directory' | string;
}

export interface FileGraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}

export interface FileGraphData {
  nodes: FileGraphNode[];
  edges: FileGraphEdge[];
}
