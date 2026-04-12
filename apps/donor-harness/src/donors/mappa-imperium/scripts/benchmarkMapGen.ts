
import { generatePerlinMap, PerlinGenerationSettings } from '../services/generators/perlinGenerator';

const runBenchmark = () => {
    console.log("Starting Map Generation Benchmark...");

    const sizes = [
        { name: 'Small (R=5)', radius: 5 },
        { name: 'Medium (R=10)', radius: 10 },
        { name: 'Large (R=20)', radius: 20 },
        { name: 'Epic (R=40)', radius: 40 }
    ];

    const iterations = 10;

    sizes.forEach(size => {
        const settings: PerlinGenerationSettings = {
            radius: size.radius,
            scale: 2,
            waterLevel: 0.5,
            moistureOffset: 0,
            seed: "benchmark",
            numRegions: Math.max(3, Math.floor(size.radius)),
            theme: "classic",
            locationDensity: 0.5,
            settlementDensity: 0.5
        };

        const start = performance.now();
        for (let i = 0; i < iterations; i++) {
            generatePerlinMap(settings);
        }
        const end = performance.now();
        const avg = (end - start) / iterations;

        console.log(`${size.name}: Avg ${avg.toFixed(2)}ms per generation`);
    });

    console.log("Benchmark Complete.");
};

runBenchmark();
