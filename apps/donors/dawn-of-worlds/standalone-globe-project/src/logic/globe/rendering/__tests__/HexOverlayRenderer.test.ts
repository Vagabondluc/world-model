import { HexOverlayRenderer } from '../hexOverlay';
import { HexCell, BiomeType } from '../../overlay/hexGrid';
import * as THREE from 'three';

describe('HexOverlayRenderer', () => {
    let scene: THREE.Scene;
    let renderer: HexOverlayRenderer;

    beforeEach(() => {
        scene = new THREE.Scene();
        renderer = new HexOverlayRenderer(scene);
    });

    afterEach(() => {
        renderer.dispose();
    });

    const createMockCell = (id: string, v1: any, v2: any, v3: any): HexCell => ({
        id,
        center: { x: 0, y: 0, z: 0 },
        vertices: [v1, v2, v3],
        neighbors: [],
        isPentagon: false,
        biome: BiomeType.OCEAN,
        biomeData: undefined
    });

    describe('createOverlay', () => {
        it('should add line segments to the scene', () => {
            const v1 = { x: 1, y: 0, z: 0 };
            const v2 = { x: 0, y: 1, z: 0 };
            const v3 = { x: 0, y: 0, z: 1 };
            const cells = [createMockCell('c1', v1, v2, v3)];

            renderer.createOverlay(cells);

            const lineSegments = scene.children.find(c => c instanceof THREE.LineSegments) as THREE.LineSegments;
            expect(lineSegments).toBeDefined();
            expect(lineSegments.geometry).toBeInstanceOf(THREE.BufferGeometry);
        });

        it('should subdivide edges for curvature', () => {
            // V1 and V2 are 90 degrees apart on unit sphere
            const v1 = { x: 1, y: 0, z: 0 };
            const v2 = { x: 0, y: 1, z: 0 };
            const v3 = { x: 0, y: 0, z: 1 }; // Dummy third vertex
            const cells = [createMockCell('c1', v1, v2, v3)];

            renderer.createOverlay(cells);

            const lineSegments = scene.children.find(c => c instanceof THREE.LineSegments) as THREE.LineSegments;
            const positionAttr = lineSegments.geometry.getAttribute('position');

            // If straight lines: 3 edges * 2 vertices = 6 vertices
            // If curved: 3 edges * 4 segments * 2 vertices = 24 vertices
            expect(positionAttr.count).toBeGreaterThan(6);

            // Verify some intermediate point is not on the straight line
            // Picking a point in the middle of the buffer (likely part of the first edge)
            // Logic: 4 segments -> indices 0-1, 2-3, 4-5, 6-7. 
            // 0 is start, 7 is end. 
            // 3 should be correct (end of second segment).

            const mx = positionAttr.getX(3);
            const my = positionAttr.getY(3);
            const mz = positionAttr.getZ(3);

            const midPoint = new THREE.Vector3(mx, my, mz);
            const dist = midPoint.length();

            // Should be on sphere surface (length ~1)
            // If it was straight line between (1,0,0) and (0,1,0), midpoint length would be sqrt(0.5^2 + 0.5^2) = ~0.707
            expect(dist).toBeCloseTo(1, 4);
            expect(dist).toBeGreaterThan(0.8);
        });
    });
});
