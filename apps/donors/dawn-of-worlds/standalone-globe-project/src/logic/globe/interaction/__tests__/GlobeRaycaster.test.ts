import { GlobeRaycaster } from '../GlobeRaycaster';
import { HexCell, BiomeType } from '../../overlay/hexGrid';
import * as THREE from 'three';

describe('GlobeRaycaster', () => {
    let raycaster: GlobeRaycaster;
    let camera: THREE.PerspectiveCamera;
    let sphereMesh: THREE.Mesh;
    let cells: HexCell[];

    beforeEach(() => {
        raycaster = new GlobeRaycaster();
        camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
        camera.position.z = 5;

        // Create a simple sphere
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshBasicMaterial();
        sphereMesh = new THREE.Mesh(geometry, material);

        // Mock cells
        cells = [
            {
                id: 'center',
                center: { x: 0, y: 0, z: 1 }, // Front of sphere
                vertices: [],
                neighbors: [],
                isPentagon: false,
                biome: BiomeType.OCEAN,
                biomeData: undefined
            },
            {
                id: 'top',
                center: { x: 0, y: 1, z: 0 }, // Top
                vertices: [],
                neighbors: [],
                isPentagon: false,
                biome: BiomeType.OCEAN,
                biomeData: undefined
            }
        ];

        raycaster.setCells(cells);
    });

    it('should identify cell at screen center', () => {
        // Raycast to center (0,0) -> should hit (0,0,1)
        const mouse = new THREE.Vector2(0, 0);

        // Update matrices to ensure correct world transformations
        sphereMesh.updateMatrixWorld();
        camera.updateMatrixWorld();

        const cell = raycaster.getCellAt(mouse, camera, sphereMesh);

        expect(cell).toBeDefined();
        expect(cell?.id).toBe('center');
    });

    it('should return null if ray misses sphere', () => {
        // Raycast far corner
        const mouse = new THREE.Vector2(0.9, 0.9);

        const cell = raycaster.getCellAt(mouse, camera, sphereMesh);

        expect(cell).toBeNull();
    });
});
