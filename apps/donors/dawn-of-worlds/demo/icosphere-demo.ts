/**
 * Simple console demo for icosphere generation
 * Can be run directly in browser console
 */

import { generateIcosphere, getMeshStats } from './logic/globe';

// Generate a sphere with subdivision level 2
const sphere = generateIcosphere({
    radius: 1.0,
    subdivisions: 2
});

const stats = getMeshStats(sphere);

console.log('🌍 Generated Icosphere:');
console.log(`   Vertices: ${stats.vertexCount}`);
console.log(`   Faces: ${stats.faceCount}`);
console.log(`   Radius: ${stats.radius}`);

// Sample first few vertices
console.log('\nFirst 5 vertices:');
sphere.vertices.slice(0, 5).forEach((v, i) => {
    const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    console.log(`  ${i}: (${v.x.toFixed(3)}, ${v.y.toFixed(3)}, ${v.z.toFixed(3)}) len=${len.toFixed(3)}`);
});

export { sphere, stats };
