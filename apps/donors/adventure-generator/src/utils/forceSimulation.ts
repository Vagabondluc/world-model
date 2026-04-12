
import { GraphData, GraphNode } from '../types/graph';

export type SimNode = GraphNode & { x: number; y: number; vx: number; vy: number; };
export type SimLink = { source: SimNode; target: SimNode };

const SIM_CONFIG = {
    repulsion: -300,
    linkDistance: 80,
    linkStrength: 0.1,
    centerForce: 0.01,
    damping: 0.95,
};

export class ForceSimulation {
    public nodes: SimNode[];
    public links: SimLink[];

    constructor(data: GraphData, width: number, height: number) {
        this.nodes = data.nodes.map(node => ({
            ...node,
            x: Math.random() * width - width / 2,
            y: Math.random() * height - height / 2,
            vx: 0,
            vy: 0,
        }));

        const nodeMap = new Map(this.nodes.map(n => [n.id, n]));
        this.links = data.links
            .map(link => ({
                source: nodeMap.get(link.source),
                target: nodeMap.get(link.target),
            }))
            .filter(l => l.source && l.target) as SimLink[];
    }

    public tick(dragNode: SimNode | null) {
        const count = this.nodes.length;

        // Apply forces
        for (let i = 0; i < count; i++) {
            const nodeA = this.nodes[i];
            // Skip force calculation for dragged node if it's fixed
            if (dragNode && nodeA.id === dragNode.id) continue;

            // Center force
            nodeA.vx -= nodeA.x * SIM_CONFIG.centerForce;
            nodeA.vy -= nodeA.y * SIM_CONFIG.centerForce;

            for (let j = i + 1; j < count; j++) {
                const nodeB = this.nodes[j];
                const dx = nodeB.x - nodeA.x;
                const dy = nodeB.y - nodeA.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance === 0) distance = 0.1;

                const force = SIM_CONFIG.repulsion / (distance * distance);
                const fx = (dx / distance) * force;
                const fy = (dy / distance) * force;

                nodeA.vx += fx;
                nodeA.vy += fy;
                nodeB.vx -= fx;
                nodeB.vy -= fy;
            }
        }

        // Link forces
        for (const link of this.links) {
            const dx = link.target.x - link.source.x;
            const dy = link.target.y - link.source.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const force = (distance - SIM_CONFIG.linkDistance) * SIM_CONFIG.linkStrength;
            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;

            if (!dragNode || link.source.id !== dragNode.id) {
                link.source.vx += fx;
                link.source.vy += fy;
            }
            if (!dragNode || link.target.id !== dragNode.id) {
                link.target.vx -= fx;
                link.target.vy -= fy;
            }
        }

        // Update positions
        for (let i = 0; i < count; i++) {
            const node = this.nodes[i];
            if (dragNode && node.id === dragNode.id) continue;

            node.vx *= SIM_CONFIG.damping;
            node.vy *= SIM_CONFIG.damping;
            node.x += node.vx;
            node.y += node.vy;
        }
    }

    public updateNodePosition(id: string, x: number, y: number) {
        const node = this.nodes.find(n => n.id === id);
        if (node) {
            node.x = x;
            node.y = y;
            node.vx = 0;
            node.vy = 0;
        }
    }
    
    public getNodeAt(x: number, y: number): SimNode | undefined {
        return this.nodes.find(node => {
            const dx = x - node.x;
            const dy = y - node.y;
            const radius = node.val * 5 + 5;
            return dx * dx + dy * dy < radius * radius;
        });
    }
}
