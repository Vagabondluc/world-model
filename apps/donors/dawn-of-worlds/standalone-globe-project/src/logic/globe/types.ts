/**
 * Core type definitions for globe geometry system
 */

export interface Vec3 {
    x: number;
    y: number;
    z: number;
}

export interface SphereMesh {
    vertices: Vec3[];
    faces: number[][];
    normals: Vec3[];
    radius: number;
}

export interface IcosphereConfig {
    radius: number;
    subdivisions: number;
}

export interface SpherePosition {
    position: Vec3;
    normal: Vec3;
    latitude: number;
    longitude: number;
}
