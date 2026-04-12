import { SphereNoiseGenerator } from '../noiseGenerator';

describe('SphereNoiseGenerator', () => {
  let generator: SphereNoiseGenerator;

  beforeEach(() => {
    generator = new SphereNoiseGenerator(12345);
  });

  describe('Noise Generation', () => {
    it('should generate noise values in 0-1 range', () => {
      const config = {
        scale: 1.0,
        octaves: 1,
        persistence: 0.5,
        lacunarity: 2.0,
        seed: 12345
      };

      for (let i = 0; i < 100; i++) {
        const point = { x: Math.random(), y: Math.random(), z: Math.random() };
        const noise = generator.getNoise(point, config);
        expect(noise).toBeGreaterThanOrEqual(0);
        expect(noise).toBeLessThanOrEqual(1);
      }
    });

    it('should generate different noise values for different points', () => {
      const config = {
        scale: 1.0,
        octaves: 1,
        persistence: 0.5,
        lacunarity: 2.0,
        seed: 12345
      };

      const point1 = { x: 0, y: 0, z: 0 };
      const point2 = { x: 1, y: 1, z: 1 };

      const noise1 = generator.getNoise(point1, config);
      const noise2 = generator.getNoise(point2, config);

      expect(noise1).not.toBe(noise2);
    });

    it('should generate same noise value for same point', () => {
      const config = {
        scale: 1.0,
        octaves: 1,
        persistence: 0.5,
        lacunarity: 2.0,
        seed: 12345
      };

      const point = { x: 0.5, y: 0.5, z: 0.5 };

      const noise1 = generator.getNoise(point, config);
      const noise2 = generator.getNoise(point, config);

      expect(noise1).toBe(noise2);
    });
  });

  describe('Seed Consistency', () => {
    it('should produce identical results with same seed', () => {
      const config = {
        scale: 1.0,
        octaves: 1,
        persistence: 0.5,
        lacunarity: 2.0,
        seed: 12345
      };

      const generator1 = new SphereNoiseGenerator(12345);
      const generator2 = new SphereNoiseGenerator(12345);

      const point = { x: 0.5, y: 0.5, z: 0.5 };

      const noise1 = generator1.getNoise(point, config);
      const noise2 = generator2.getNoise(point, config);

      expect(noise1).toBe(noise2);
    });

    it('should produce different results with different seeds', () => {
      const config = {
        scale: 1.0,
        octaves: 1,
        persistence: 0.5,
        lacunarity: 2.0,
        seed: 12345
      };

      const generator1 = new SphereNoiseGenerator(12345);
      const generator2 = new SphereNoiseGenerator(54321);

      const point = { x: 0.5, y: 0.5, z: 0.5 };

      const noise1 = generator1.getNoise(point, config);
      const noise2 = generator2.getNoise(point, config);

      expect(noise1).not.toBe(noise2);
    });
  });

  describe('Octaves', () => {
    it('should handle single octave', () => {
      const config = {
        scale: 1.0,
        octaves: 1,
        persistence: 0.5,
        lacunarity: 2.0,
        seed: 12345
      };

      const point = { x: 0.5, y: 0.5, z: 0.5 };
      expect(() => generator.getNoise(point, config)).not.toThrow();
    });

    it('should handle multiple octaves', () => {
      const config = {
        scale: 1.0,
        octaves: 4,
        persistence: 0.5,
        lacunarity: 2.0,
        seed: 12345
      };

      const point = { x: 0.5, y: 0.5, z: 0.5 };
      expect(() => generator.getNoise(point, config)).not.toThrow();
    });

    it('should produce different results with different octaves', () => {
      const point = { x: 0.5, y: 0.5, z: 0.5 };

      const config1 = {
        scale: 1.0,
        octaves: 1,
        persistence: 0.5,
        lacunarity: 2.0,
        seed: 12345
      };

      const config2 = {
        scale: 1.0,
        octaves: 4,
        persistence: 0.5,
        lacunarity: 2.0,
        seed: 12345
      };

      const noise1 = generator.getNoise(point, config1);
      const noise2 = generator.getNoise(point, config2);

      expect(noise1).not.toBe(noise2);
    });
  });

  describe('Scale', () => {
    it('should handle different scales', () => {
      const point = { x: 0.5, y: 0.5, z: 0.5 };

      const config1 = {
        scale: 0.5,
        octaves: 1,
        persistence: 0.5,
        lacunarity: 2.0,
        seed: 12345
      };

      const config2 = {
        scale: 2.0,
        octaves: 1,
        persistence: 0.5,
        lacunarity: 2.0,
        seed: 12345
      };

      expect(() => generator.getNoise(point, config1)).not.toThrow();
      expect(() => generator.getNoise(point, config2)).not.toThrow();
    });

    it('should produce different results with different scales', () => {
      const point = { x: 0.5, y: 0.5, z: 0.5 };

      const config1 = {
        scale: 0.5,
        octaves: 1,
        persistence: 0.5,
        lacunarity: 2.0,
        seed: 12345
      };

      const config2 = {
        scale: 2.0,
        octaves: 1,
        persistence: 0.5,
        lacunarity: 2.0,
        seed: 12345
      };

      const noise1 = generator.getNoise(point, config1);
      const noise2 = generator.getNoise(point, config2);

      expect(noise1).not.toBe(noise2);
    });
  });

  describe('Persistence and Lacunarity', () => {
    it('should handle persistence parameter', () => {
      const config = {
        scale: 1.0,
        octaves: 4,
        persistence: 0.7,
        lacunarity: 2.0,
        seed: 12345
      };

      const point = { x: 0.5, y: 0.5, z: 0.5 };
      expect(() => generator.getNoise(point, config)).not.toThrow();
    });

    it('should handle lacunarity parameter', () => {
      const config = {
        scale: 1.0,
        octaves: 4,
        persistence: 0.5,
        lacunarity: 3.0,
        seed: 12345
      };

      const point = { x: 0.5, y: 0.5, z: 0.5 };
      expect(() => generator.getNoise(point, config)).not.toThrow();
    });

    it('should produce different results with different persistence', () => {
      const point = { x: 0.5, y: 0.5, z: 0.5 };

      const config1 = {
        scale: 1.0,
        octaves: 4,
        persistence: 0.3,
        lacunarity: 2.0,
        seed: 12345
      };

      const config2 = {
        scale: 1.0,
        octaves: 4,
        persistence: 0.7,
        lacunarity: 2.0,
        seed: 12345
      };

      const noise1 = generator.getNoise(point, config1);
      const noise2 = generator.getNoise(point, config2);

      expect(noise1).not.toBe(noise2);
    });
  });
});
