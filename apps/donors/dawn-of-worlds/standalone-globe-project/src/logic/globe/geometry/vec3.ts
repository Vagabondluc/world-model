/**
 * Vector math utilities for 3D globe geometry
 */

import { Vec3 } from '../types';

export const vec3 = {
    /**
     * Create a new Vec3
     */
    create(x: number, y: number, z: number): Vec3 {
        return { x, y, z };
    },

    /**
     * Add two vectors
     */
    add(a: Vec3, b: Vec3): Vec3 {
        return {
            x: a.x + b.x,
            y: a.y + b.y,
            z: a.z + b.z
        };
    },

    /**
     * Subtract vector b from a
     */
    subtract(a: Vec3, b: Vec3): Vec3 {
        return {
            x: a.x - b.x,
            y: a.y - b.y,
            z: a.z - b.z
        };
    },

    /**
     * Scale vector by scalar
     */
    scale(v: Vec3, s: number): Vec3 {
        return {
            x: v.x * s,
            y: v.y * s,
            z: v.z * s
        };
    },

    /**
     * Calculate dot product
     */
    dot(a: Vec3, b: Vec3): number {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    },

    /**
     * Calculate cross product
     */
    cross(a: Vec3, b: Vec3): Vec3 {
        return {
            x: a.y * b.z - a.z * b.y,
            y: a.z * b.x - a.x * b.z,
            z: a.x * b.y - a.y * b.x
        };
    },

    /**
     * Calculate vector length
     */
    length(v: Vec3): number {
        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    },

    /**
     * Normalize vector to unit length
     */
    normalize(v: Vec3): Vec3 {
        const len = vec3.length(v);
        if (len === 0) return { x: 0, y: 0, z: 0 };
        return vec3.scale(v, 1 / len);
    },

    /**
     * Calculate distance between two points
     */
    distance(a: Vec3, b: Vec3): number {
        return vec3.length(vec3.subtract(a, b));
    },

    /**
     * Linear interpolation between two vectors
     */
    lerp(a: Vec3, b: Vec3, t: number): Vec3 {
        return {
            x: a.x + (b.x - a.x) * t,
            y: a.y + (b.y - a.y) * t,
            z: a.z + (b.z - a.z) * t
        };
    },

    /**
     * Check if two vectors are approximately equal
     */
    equals(a: Vec3, b: Vec3, epsilon = 0.000001): boolean {
        return (
            Math.abs(a.x - b.x) < epsilon &&
            Math.abs(a.y - b.y) < epsilon &&
            Math.abs(a.z - b.z) < epsilon
        );
    }
};
