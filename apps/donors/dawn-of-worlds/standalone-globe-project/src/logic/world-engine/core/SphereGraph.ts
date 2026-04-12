
import { SphereMesh } from "../../globe/types";

export class SphereGraph {
    public adjacencies: Map<number, number[]> = new Map();

    constructor(public mesh: SphereMesh) {
        this.buildAdjacencies();
    }

    private buildAdjacencies(): void {
        const { faces } = this.mesh;

        for (const face of faces) {
            const [a, b, c] = face;
            this.addConnection(a, b);
            this.addConnection(b, c);
            this.addConnection(c, a);
        }
    }

    private addConnection(u: number, v: number): void {
        if (!this.adjacencies.has(u)) this.adjacencies.set(u, []);
        if (!this.adjacencies.has(v)) this.adjacencies.set(v, []);

        // Note: For a sphere mesh, we don't expect many duplicate edges,
        // so linear scan of small array (max 6 items) is fine.
        const uNeighbors = this.adjacencies.get(u)!;
        if (!uNeighbors.includes(v)) uNeighbors.push(v);

        const vNeighbors = this.adjacencies.get(v)!;
        if (!vNeighbors.includes(u)) vNeighbors.push(u);
    }

    public getNeighbors(cellId: number): number[] {
        return this.adjacencies.get(cellId) || [];
    }

    public getCellCount(): number {
        return this.mesh.vertices.length;
    }
}
