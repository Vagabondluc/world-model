/**
 * Noise Generator for Spherical Terrains
 * Wraps OpenSimplexNoise to provide 3D noise on a sphere surface.
 */

import { makeNoise3D } from 'open-simplex-noise';
import { Vec3 } from '../types';

export interface NoiseConfig {
    scale: number;
    octaves: number;
    persistence: number;
    lacunarity: number;
    seed: number;
}

export class SphereNoiseGenerator {
    private noise3D: (x: number, y: number, z: number) => number;

    constructor(seed: number = Date.now()) {
        this.noise3D = makeNoise3D(seed);
    }

    /**
     * Get noise value at a point on the unit sphere
     * @returns Value between 0 and 1
     */
    getNoise(point: Vec3, config: NoiseConfig): number {
        let amplitude = 1;
        let frequency = config.scale;
        let noiseValue = 0;
        let maxValue = 0;

        for (let i = 0; i < config.octaves; i++) {
            const x = point.x * frequency;
            const y = point.y * frequency;
            const z = point.z * frequency;

            // noise3D returns -1 to 1
            noiseValue += this.noise3D(x, y, z) * amplitude;

            maxValue += amplitude;
            amplitude *= config.persistence;
            frequency *= config.lacunarity;
        }

        // Normalize to 0-1 range
        return (noiseValue / maxValue + 1) / 2;
    }
}
