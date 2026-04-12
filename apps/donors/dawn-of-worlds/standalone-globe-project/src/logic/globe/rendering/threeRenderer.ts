/**
 * Three.js renderer for smooth spherical globe
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SphereMesh } from '../types';
import { HexOverlayRenderer } from './hexOverlay';
import { HexCell, generateHexGrid, HexGridConfig } from '../overlay/hexGrid';
import { CellMesher } from './cellMesher';
import { vec3 } from '../geometry/vec3';
import { SpatialHash, createSpatialHash } from './spatialHash';
import { GlobeRaycaster } from '../interaction/GlobeRaycaster';
import { CompassRenderer } from './CompassRenderer';

import { getNeighborsInRadius } from '../utils/hexUtils';
import { CameraController } from '../input/CameraController';
import { InputController } from '../input/InputController';


export enum DisplayMode {
    BIOME = 'BIOME',
    ELEVATION = 'ELEVATION',
    TEMPERATURE = 'TEMPERATURE',
    MOISTURE = 'MOISTURE',
    PLATE = 'PLATE',
    CIVILIZATION = 'CIVILIZATION'
}

export enum SelectionMode {
    SINGLE = 'SINGLE',
    REGION = 'REGION'
}

export interface GlobeRendererConfig {
    container: HTMLElement;
    radius: number;
    subdivisions: number;
    showHexOverlay?: boolean;
    onCellHover?: (cellId: string | null) => void;
    onCellSelect?: (cellId: string | null, regionIds?: string[]) => void;
}

export class ThreeGlobeRenderer {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private controls: OrbitControls;
    private sphereMesh: THREE.Mesh | null = null;
    private solidCellMesh: THREE.Mesh | null = null;
    private highlightMesh: THREE.Mesh | null = null;
    private selectionMesh: THREE.Mesh | null = null;
    private hexOverlay: HexOverlayRenderer;
    private compassRenderer: CompassRenderer | null = null;
    private animationId: number | null = null;

    // Interaction
    private raycaster: GlobeRaycaster;
    private mouse: THREE.Vector2;
    private cells: HexCell[] = [];
    private hoveredCellId: string | null = null;
    private _selectedCellId: string | null = null;
    private onCellHover: ((cellId: string | null) => void) | null = null;
    private onCellSelect: ((cellId: string | null, regionIds?: string[]) => void) | null = null;
    private displayMode: DisplayMode = DisplayMode.BIOME;
    private selectionMode: SelectionMode = SelectionMode.SINGLE;
    private selectionRadius: number = 1;
    private radius: number;
    private subdivisions: number;
    private gridConfig: HexGridConfig;

    // Spatial hash for efficient cell lookups
    private spatialHash: SpatialHash | null = null;

    // Camera controller for programmatic camera API
    private cameraController: CameraController | null = null;
    private inputController: InputController | null = null;
    private clock: THREE.Clock;

    private container: HTMLElement; // Store container for cleanup

    constructor(config: GlobeRendererConfig) {
        this.container = config.container;
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x050505);

        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            60,
            config.container.clientWidth / config.container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = config.radius * 2.5;

        // Store config
        this.radius = config.radius;
        this.subdivisions = config.subdivisions;
        this.gridConfig = {
            cellCount: (config as any).cellCount || 500,
            radius: config.radius,
            seed: (config as any).seed
        };

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(config.container.clientWidth, config.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        config.container.appendChild(this.renderer.domElement);

        // Create orbit controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = false; // Handled by InputController
        this.controls.minDistance = config.radius * 1.5;
        this.controls.maxDistance = config.radius * 5;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.5;

        // Add lighting
        this.setupLighting();

        // Initialize hex overlay
        this.hexOverlay = new HexOverlayRenderer(this.scene, {
            borderColor: 0x7f13ec,
            borderOpacity: 0.4
        });

        // Event callbacks
        this.onCellHover = config.onCellHover || null;
        this.onCellSelect = config.onCellSelect || null;

        // Initialize camera controller
        this.cameraController = new CameraController(this.controls, this.camera, {
            globeRadius: config.radius
        });

        // Initialize interaction
        this.raycaster = new GlobeRaycaster();
        this.mouse = new THREE.Vector2();

        // Initialize Input Controller
        this.inputController = new InputController();
        this.bindInputEvents();

        // Initialize clock
        this.clock = new THREE.Clock();

        // Initialize compass renderer
        this.compassRenderer = new CompassRenderer({
            container: config.container,
            size: 120
        });

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize(config.container));

        // Add interaction listener to container directly
        this.container.addEventListener('mousemove', this.onMouseMove);
        this.container.addEventListener('click', this.onClick);

        // Forward events to InputController
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
        this.container.addEventListener('mousedown', this.onMouseDown);
        this.container.addEventListener('mouseup', this.onMouseUp);
        this.container.addEventListener('wheel', this.onWheel);
    }

    // Bound Event Handlers for Cleanup
    private onResize = (): void => {
        this.handleResize(this.container);
    };

    private onKeyDown = (e: KeyboardEvent): void => {
        this.inputController?.handleKeyDown(e.code);
    };

    private onKeyUp = (e: KeyboardEvent): void => {
        this.inputController?.handleKeyUp(e.code);
    };

    private onMouseDown = (e: MouseEvent): void => {
        this.inputController?.handleMouseDown(e.button);
    };

    private onMouseUp = (e: MouseEvent): void => {
        this.inputController?.handleMouseUp(e.button);
    };

    private onWheel = (e: WheelEvent): void => {
        this.inputController?.handleWheel(e);
    };

    private bindInputEvents(): void {
        if (!this.inputController || !this.cameraController) return;

        const ic = this.inputController;
        const cc = this.cameraController;

        // Rotation
        ic.on('rotate-left', (dt) => {
            const speed = ic.getConfig().rotationSpeed * ic.getSpeedMultiplier();
            cc.rotateHorizontal(speed * dt);
        });
        ic.on('rotate-right', (dt) => {
            const speed = ic.getConfig().rotationSpeed * ic.getSpeedMultiplier();
            cc.rotateHorizontal(-speed * dt);
        });
        ic.on('rotate-up', (dt) => {
            const speed = ic.getConfig().rotationSpeed * ic.getSpeedMultiplier();
            cc.rotateVertical(-speed * dt);
        });
        ic.on('rotate-down', (dt) => {
            const speed = ic.getConfig().rotationSpeed * ic.getSpeedMultiplier();
            cc.rotateVertical(speed * dt);
        });

        // Zoom
        ic.on('zoom-in', (dt) => {
            const speed = ic.getConfig().zoomSpeed * ic.getSpeedMultiplier();
            cc.zoomIn(speed * dt);
        });
        ic.on('zoom-out', (dt) => {
            const speed = ic.getConfig().zoomSpeed * ic.getSpeedMultiplier();
            cc.zoomOut(speed * dt);
        });

        // Actions
        ic.on('reset-view', () => cc.resetView({ animated: true }));
        ic.on('toggle-auto-rotate', () => cc.toggleAutoRotate());

        // Selection actions
        ic.on('center-selected', () => {
            if (this._selectedCellId) {
                const cell = this.cells.find(c => c.id === this._selectedCellId);
                if (cell) cc.centerOn(cell, { animated: true });
            }
        });
    }

    private onMouseMove = (event: MouseEvent): void => {
        // Calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.checkIntersection();
    };

    public updateGridConfig(config: { subdivisions?: number; cellCount?: number }): void {
        const needsRebuild = (config.subdivisions !== undefined && config.subdivisions !== this.subdivisions) ||
            (config.cellCount !== undefined && config.cellCount !== this.gridConfig.cellCount);

        if (needsRebuild) {
            this.subdivisions = config.subdivisions ?? this.subdivisions;

            // Re-generate hex grid
            this.cells = generateHexGrid({
                cellCount: config.cellCount ?? this.gridConfig.cellCount,
                radius: this.radius,
                subdivisions: this.subdivisions,
                generatorType: this.gridConfig.generatorType,
                seed: this.gridConfig.seed
            });

            this.gridConfig.cellCount = config.cellCount ?? this.gridConfig.cellCount;
            this.gridConfig.subdivisions = this.subdivisions;

            // Rebuild spatial hash
            this.rebuildSpatialHash();

            // Re-create overlay (this will trigger a visual update)
            this.createSolidOverlay(this.cells);
        }
    }

    private onClick = (event: MouseEvent): void => {
        // Check if click is on compass first
        if (this.compassRenderer && this.compassRenderer.hitTest(event.clientX, event.clientY)) {
            // Compass was clicked - handled by GlobeRenderer.tsx
            return;
        }

        // Only select if we are hovering a cell
        if (this.hoveredCellId) {
            this.selectCell(this.hoveredCellId);
            if (this.onCellSelect) {
                this.onCellSelect(this.hoveredCellId);
            }
        } else {
            // Deselect if clicking empty space
            this.selectCell(null);
            if (this.onCellSelect) {
                this.onCellSelect(null);
            }
        }
    };

    private checkIntersection(): void {
        if (!this.sphereMesh || this.cells.length === 0) return;

        const closestCell = this.raycaster.getCellAt(this.mouse, this.camera, this.sphereMesh);

        if (closestCell && closestCell.id !== this.hoveredCellId) {
            this.hoveredCellId = closestCell.id;
            this.updateHighlight(closestCell);
            if (this.onCellHover) {
                this.onCellHover(closestCell.id);
            }
        } else if (!closestCell && this.hoveredCellId) {
            this.hoveredCellId = null;
            if (this.highlightMesh) this.highlightMesh.visible = false;
            if (this.onCellHover) {
                this.onCellHover(null);
            }
        }
    }



    private updateHighlight(cell: HexCell): void {
        if (!this.highlightMesh) {
            const material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide
            });
            this.highlightMesh = new THREE.Mesh(new THREE.BufferGeometry(), material);
            this.scene.add(this.highlightMesh);
        }

        // Generate geometry for highlighted cell
        // Similar to CellMesher logic but for single cell
        const positions: number[] = [];
        const geometry = this.highlightMesh.geometry;

        // Offset slightly more than solid mesh to appear on top
        const radius = Math.sqrt(cell.center.x ** 2 + cell.center.y ** 2 + cell.center.z ** 2); // Approximation
        const offsetScale = (radius * 1.004) / radius;

        const center = vec3.scale(cell.center, offsetScale);
        positions.push(center.x, center.y, center.z);

        cell.vertices.forEach(v => {
            const sv = vec3.scale(v, offsetScale);
            positions.push(sv.x, sv.y, sv.z);
        });

        const indices: number[] = [];
        for (let i = 0; i < cell.vertices.length; i++) {
            indices.push(0, i + 1, (i + 1) % cell.vertices.length + 1);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        this.highlightMesh.visible = true;
    }

    public selectCell(cellId: string | null): void {
        this._selectedCellId = cellId;

        if (!cellId) {
            if (this.selectionMesh) this.selectionMesh.visible = false;
            return;
        }

        let cellsToSelect: HexCell[] = [];

        if (this.selectionMode === SelectionMode.REGION) {
            const neighborIds = getNeighborsInRadius(cellId, this.selectionRadius, this.cells);
            cellsToSelect = this.cells.filter(c => neighborIds.includes(c.id));
        } else {
            const cell = this.cells.find(c => c.id === cellId);
            if (cell) cellsToSelect = [cell];
        }

        if (cellsToSelect.length > 0) {
            this.updateSelectionMesh(cellsToSelect);
            if (this.onCellSelect) {
                const regionIds = cellsToSelect.map(c => c.id);
                this.onCellSelect(cellId, regionIds);
            }
        } else {
            if (this.onCellSelect) {
                this.onCellSelect(cellId, []);
            }
        }
    }

    private updateSelectionMesh(cells: HexCell[]): void {
        if (!this.selectionMesh) {
            const material = new THREE.MeshBasicMaterial({
                color: 0xffaa00, // Gold/Orange for selection
                transparent: true,
                opacity: 0.5,
                side: THREE.DoubleSide
            });
            this.selectionMesh = new THREE.Mesh(new THREE.BufferGeometry(), material);
            this.scene.add(this.selectionMesh);
        }

        const positions: number[] = [];
        const radius = this.sphereMesh ? this.sphereMesh.geometry.boundingSphere?.radius || 1 : 1;
        const offsetRadius = radius * 1.004; // Slightly above highlight
        const scale = offsetRadius / radius;

        cells.forEach(cell => {
            // Create triangles from center to adjacent vertices (fan)
            const c = vec3.scale(cell.center, scale);

            for (let i = 0; i < cell.vertices.length; i++) {
                const next = (i + 1) % cell.vertices.length;
                const v1 = vec3.scale(cell.vertices[i], scale);
                const v2 = vec3.scale(cell.vertices[next], scale);

                positions.push(c.x, c.y, c.z);
                positions.push(v1.x, v1.y, v1.z);
                positions.push(v2.x, v2.y, v2.z);
            }
        });

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

        // Update mesh geometry
        if (this.selectionMesh.geometry) this.selectionMesh.geometry.dispose();
        this.selectionMesh.geometry = geometry;
        this.selectionMesh.visible = true;
    }

    public setSelectionConfig(mode: SelectionMode, radius: number): void {
        this.selectionMode = mode;
        this.selectionRadius = radius;
        // Re-select current if exists to update visuals
        if (this._selectedCellId) {
            this.selectCell(this._selectedCellId);
        }
    }

    private setupLighting(): void {
        // Ambient light for base illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        // Directional light for definition
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 3, 5);
        this.scene.add(directionalLight);

        // Hemisphere light for atmospheric effect
        const hemisphereLight = new THREE.HemisphereLight(0x7f13ec, 0x1a1122, 0.3);
        this.scene.add(hemisphereLight);
    }

    createSphere(sphereData: SphereMesh): void {
        // Remove existing sphere if any
        if (this.sphereMesh) {
            this.scene.remove(this.sphereMesh);
            this.sphereMesh.geometry.dispose();
            (this.sphereMesh.material as THREE.Material).dispose();
        }

        // Create Three.js geometry from our SphereMesh
        const geometry = new THREE.BufferGeometry();

        // Convert vertices to flat array
        const positions = new Float32Array(sphereData.vertices.length * 3);
        sphereData.vertices.forEach((v, i) => {
            positions[i * 3] = v.x;
            positions[i * 3 + 1] = v.y;
            positions[i * 3 + 2] = v.z;
        });

        // Convert faces to indices
        const indices: number[] = [];
        sphereData.faces.forEach(face => {
            indices.push(face[0], face[1], face[2]);
        });

        // Set attributes
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setIndex(indices);
        geometry.computeVertexNormals(); // Smooth shading

        // Create material
        const material = new THREE.MeshStandardMaterial({
            color: 0x1a1122,
            roughness: 0.7,
            metalness: 0.3,
            flatShading: false, // Smooth shading
            side: THREE.DoubleSide
        });

        // Create mesh
        this.sphereMesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.sphereMesh);
    }

    createHexOverlay(cells: HexCell[]): void {
        this.cells = cells;

        // Initialize spatial hash with the new cells
        const radius = this.sphereMesh ? this.sphereMesh.geometry.boundingSphere?.radius || 1 : 1;
        this.spatialHash = createSpatialHash(radius, cells.length);
        this.spatialHash.addCells(cells);

        this.raycaster.setCells(cells);
        this.raycaster.setSpatialHash(this.spatialHash);

        this.hexOverlay.createOverlay(cells);

        this.createSolidOverlay(cells);
    }

    createSolidOverlay(cells: HexCell[]): void {
        if (this.solidCellMesh) {
            this.scene.remove(this.solidCellMesh);
            this.solidCellMesh.geometry.dispose();
            (this.solidCellMesh.material as THREE.Material).dispose();
        }

        // Get radius from sphere mesh or config logic (assuming sphereMesh exists)
        const radius = this.sphereMesh ? this.sphereMesh.geometry.boundingSphere?.radius || 1 : 1;



        this.solidCellMesh = CellMesher.createSolidMesh(cells, radius, this.displayMode);
        this.scene.add(this.solidCellMesh);
    }

    public setDisplayMode(mode: DisplayMode): void {
        if (this.displayMode !== mode) {
            this.displayMode = mode;
            this.createSolidOverlay(this.cells);
        }
    }

    /**
     * Update a single cell in the spatial hash.
     * Useful for dynamic updates when a cell's position or properties change.
     * @param cell The cell to update
     */
    updateCell(cell: HexCell): void {
        if (this.spatialHash) {
            this.spatialHash.addCell(cell);
        }

        // Update the cell in the cells array
        const index = this.cells.findIndex(c => c.id === cell.id);
        if (index !== -1) {
            this.cells[index] = cell;
        }
    }

    /**
     * Remove a cell from the spatial hash.
     * @param cellId The ID of the cell to remove
     */
    removeCell(cellId: string): void {
        if (this.spatialHash) {
            this.spatialHash.removeCell(cellId);
        }

        // Remove from the cells array
        this.cells = this.cells.filter(c => c.id !== cellId);
    }

    /**
     * Rebuild the spatial hash from the current cells array.
     * Useful if the spatial hash becomes out of sync.
     */
    rebuildSpatialHash(): void {
        if (!this.sphereMesh) return;

        const radius = this.sphereMesh.geometry.boundingSphere?.radius || 1;
        this.spatialHash = createSpatialHash(radius, this.cells.length);
        this.spatialHash.addCells(this.cells);
    }

    start(): void {
        if (this.animationId !== null) return;
        this.animate();
    }

    stop(): void {
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    private animate = (): void => {
        this.animationId = requestAnimationFrame(this.animate);

        const deltaTime = this.clock.getDelta();

        if (this.inputController) {
            this.inputController.update(deltaTime * 1000); // InputController expects ms
        }

        if (this.cameraController) {
            this.cameraController.update(deltaTime * 1000); // CameraController expects ms
        }

        // Standard OrbitControls update
        // Note: CameraController calls update() internally when animating, 
        // but for damping we still need this if not driven by CameraController exclusively
        this.controls.update();

        // Render main scene (globe)
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);

        // Render compass overlay (without clearing)
        if (this.compassRenderer) {
            this.renderer.autoClear = false;
            this.renderer.clearDepth(); // Clear depth buffer so compass renders on top

            // Update compass orientation to match main camera
            this.compassRenderer.update(this.camera);

            this.compassRenderer.render(this.renderer);
            this.renderer.autoClear = true;
        }
    };

    private handleResize(container: HTMLElement): void {
        const width = container.clientWidth;
        const height = container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);

        // Resize compass
        if (this.compassRenderer) {
            this.compassRenderer.resize();
        }
    }

    dispose(): void {
        this.stop();

        window.removeEventListener('resize', this.onResize);

        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);

        // Remove container listeners from the stored container reference
        // This ensures they are removed even if the container is already detached from DOM
        if (this.container) {
            this.container.removeEventListener('mousemove', this.onMouseMove);
            this.container.removeEventListener('click', this.onClick);
            this.container.removeEventListener('mousedown', this.onMouseDown);
            this.container.removeEventListener('mouseup', this.onMouseUp);
            this.container.removeEventListener('wheel', this.onWheel);
        }

        if (this.sphereMesh) {
            this.sphereMesh.geometry.dispose();
            (this.sphereMesh.material as THREE.Material).dispose();
        }

        // Clear spatial hash
        if (this.spatialHash) {
            this.spatialHash.clear();
            this.spatialHash = null;
        }

        // Dispose compass renderer
        if (this.compassRenderer) {
            this.compassRenderer.dispose();
            this.compassRenderer = null;
        }

        this.hexOverlay.dispose();
        this.renderer.dispose();
        this.controls.dispose();

        // Remove canvas from DOM
        if (this.container && this.renderer.domElement && this.renderer.domElement.parentNode === this.container) {
            this.container.removeChild(this.renderer.domElement);
        }

        if (this.inputController) {
            this.inputController.dispose();
        }
    }

    // --- Accessors for external integration ---

    /**
     * Get the camera controller for programmatic camera manipulation
     */
    getCameraController(): CameraController | null {
        return this.cameraController;
    }

    /**
     * Get the OrbitControls instance
     */
    getControls(): OrbitControls {
        return this.controls;
    }

    /**
     * Get the camera instance
     */
    getCamera(): THREE.PerspectiveCamera {
        return this.camera;
    }

    /**
     * Get all cells
     */
    getCells(): HexCell[] {
        return this.cells;
    }

    /**
     * Get the selected cell ID
     */
    getSelectedCellId(): string | null {
        return this._selectedCellId;
    }

    /**
     * Update hex cells with data from world engine
     */
    updateCellBiomes(worldData: any[]): void {
        if (!this.spatialHash || worldData.length === 0) return;

        let updates = 0;

        worldData.forEach(data => {
            const nearest = this.spatialHash?.findNearestCell(data.position);
            if (nearest) {
                // Direct assignment - validation is handled upstream by Schemas
                const mappedBiome = data.biomeId || 'ocean';
                let changed = false;

                if (nearest.biome !== mappedBiome) {
                    nearest.biome = mappedBiome;
                    changed = true;
                }

                // Sync data for overlays
                if (data.height !== undefined) {
                    nearest.biomeData = {
                        height: data.height,
                        temperature: data.temperature || 0,
                        moisture: data.moisture || 0
                    };

                    if (data.plateId !== undefined) {
                        nearest.plateId = data.plateId;
                        nearest.plateColor = data.plateColor;
                    }

                    if (data.isRiver !== undefined) {
                        nearest.isRiver = data.isRiver;
                    }

                    if (data.settlementType !== undefined) {
                        nearest.settlementType = data.settlementType;
                    }

                    // Always treat data updates as potential visual changes
                    changed = true;
                }

                if (changed) updates++;
            }
        });

        if (updates > 0) {
            this.createSolidOverlay(this.cells);
        }
    }

    /**
     * Set the compass display mode
     */
    setCompassDisplayMode(mode: string): void {
        if (this.compassRenderer) {
            this.compassRenderer.setDisplayMode(mode as any);
        }
    }

    /**
     * Check if a click position hits the compass
     */
    compassHitTest(x: number, y: number): boolean {
        return this.compassRenderer ? this.compassRenderer.hitTest(x, y) : false;
    }
}
