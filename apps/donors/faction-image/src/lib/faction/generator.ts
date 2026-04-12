// Procedural symbol generator for factions and gods
// Non-AI based, uses seeded randomness to create consistent visual symbols

import type {
  FactionConfig,
  SymbolGeneratorOptions,
  GeneratedSymbol,
  FactionDomain,
  SymbolStyle,
} from './types';
import { DOMAIN_COLORS } from './types';

// Seeded random number generator
class SeededRandom {
  private seed: number;

  constructor(seedStr: string) {
    this.seed = this.hashCode(seedStr);
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(max: number): number {
    return Math.floor(this.next() * max);
  }

  nextInRange(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  choice<T>(arr: T[]): T {
    return arr[this.nextInt(arr.length)];
  }
}

export class FactionSymbolGenerator {
  private rng: SeededRandom;
  private width: number;
  private height: number;
  private domain: FactionDomain;
  private style: SymbolStyle;
  private colors: ReturnType<typeof DOMAIN_COLORS[FactionDomain]>;

  constructor(options: SymbolGeneratorOptions) {
    this.rng = new SeededRandom(options.seed);
    this.width = options.width || 256;
    this.height = options.height || 256;
    this.domain = options.domain;
    this.style = options.style;
    this.colors = DOMAIN_COLORS[options.domain];
  }

  generate(): GeneratedSymbol {
    const svg = this.createSVG();
    const dataUrl = this.svgToDataUrl(svg);

    return {
      svg,
      dataUrl,
      seed: this.rng.toString(),
      domain: this.domain,
      style: this.style,
    };
  }

  private createSVG(): string {
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    let content = '';

    // Background
    content += `<rect width="${this.width}" height="${this.height}" fill="${this.colors.primary}"/>`;

    // Generate symbol based on style
    switch (this.style) {
      case 'shield':
        content += this.generateShield(centerX, centerY);
        break;
      case 'circle':
        content += this.generateCircle(centerX, centerY);
        break;
      case 'star':
        content += this.generateStar(centerX, centerY);
        break;
      case 'crown':
        content += this.generateCrown(centerX, centerY);
        break;
      case 'rune':
        content += this.generateRune(centerX, centerY);
        break;
      case 'mandala':
        content += this.generateMandala(centerX, centerY);
        break;
      case 'geometric':
        content += this.generateGeometric(centerX, centerY);
        break;
      case 'beast':
        content += this.generateBeast(centerX, centerY);
        break;
    }

    return `<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}" xmlns="http://www.w3.org/2000/svg">${content}</svg>`;
  }

  private generateShield(cx: number, cy: number): string {
    const size = Math.min(this.width, this.height) * 0.35;
    let svg = '';

    // Shield shape
    svg += `<path d="M ${cx - size} ${cy - size} L ${cx + size} ${cy - size} L ${cx + size} ${cy} Q ${cx} ${cy + size} ${cx - size} ${cy}" fill="${this.colors.secondary}" stroke="${this.colors.accent}" stroke-width="3"/>`;

    // Inner patterns based on domain
    const patterns = this.generatePatterns(cx, cy, size * 0.6);
    svg += patterns;

    return svg;
  }

  private generateCircle(cx: number, cy: number): string {
    const maxRadius = Math.min(this.width, this.height) * 0.35;
    let svg = '';

    const rings = this.rng.nextInt(3) + 2;
    for (let i = rings; i > 0; i--) {
      const radius = (maxRadius / rings) * i;
      const fill = i % 2 === 0 ? this.colors.secondary : this.colors.accent;
      svg += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${fill}" stroke-width="4"/>`;
    }

    // Center circle
    const centerRadius = maxRadius * 0.2;
    svg += `<circle cx="${cx}" cy="${cy}" r="${centerRadius}" fill="${this.colors.accent}"/>`;

    // Add small dots around edge
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x = cx + maxRadius * Math.cos(angle);
      const y = cy + maxRadius * Math.sin(angle);
      svg += `<circle cx="${x}" cy="${y}" r="4" fill="${this.colors.secondary}"/>`;
    }

    return svg;
  }

  private generateStar(cx: number, cy: number): string {
    const points = this.rng.nextInt(2) + 5; // 5 or 6 points
    const outerRadius = Math.min(this.width, this.height) * 0.3;
    const innerRadius = outerRadius * 0.4;

    let pathData = '';
    for (let i = 0; i < points * 2; i++) {
      const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      pathData += `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }
    pathData += ' Z';

    let svg = `<path d="${pathData}" fill="${this.colors.secondary}" stroke="${this.colors.accent}" stroke-width="2"/>`;

    // Add decorative circles at points
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2 - Math.PI / 2;
      const x = cx + outerRadius * Math.cos(angle);
      const y = cy + outerRadius * Math.sin(angle);
      svg += `<circle cx="${x}" cy="${y}" r="6" fill="${this.colors.accent}"/>`;
    }

    return svg;
  }

  private generateCrown(cx: number, cy: number): string {
    const size = Math.min(this.width, this.height) * 0.3;
    const points = 5;
    let svg = '';

    // Crown base band
    svg += `<rect x="${cx - size}" y="${cy}" width="${size * 2}" height="${size * 0.4}" fill="${this.colors.secondary}" stroke="${this.colors.accent}" stroke-width="2"/>`;

    // Crown points/peaks
    for (let i = 0; i < points; i++) {
      const x = cx - size + (size * 2 / (points - 1)) * i;
      const peakY = cy - size * (0.6 + this.rng.next() * 0.2);
      svg += `<path d="M ${x - size * 0.15} ${cy} L ${x} ${peakY} L ${x + size * 0.15} ${cy}" fill="${this.colors.accent}" stroke="${this.colors.secondary}" stroke-width="1"/>`;

      // Jewels at peaks
      svg += `<circle cx="${x}" cy="${peakY}" r="5" fill="#ffd700" stroke="${this.colors.secondary}" stroke-width="1"/>`;
    }

    // Base cross
    svg += `<line x1="${cx}" y1="${cy + size * 0.4}" x2="${cx}" y2="${cy + size * 0.6}" stroke="${this.colors.accent}" stroke-width="3"/>`;
    svg += `<line x1="${cx - size * 0.2}" y1="${cy + size * 0.5}" x2="${cx + size * 0.2}" y2="${cy + size * 0.5}" stroke="${this.colors.accent}" stroke-width="3"/>`;

    return svg;
  }

  private generateRune(cx: number, cy: number): string {
    const size = Math.min(this.width, this.height) * 0.25;
    const strokes = this.rng.nextInt(3) + 3;
    let svg = '';

    // Background circle
    svg += `<circle cx="${cx}" cy="${cy}" r="${size * 1.2}" fill="${this.colors.secondary}" stroke="${this.colors.accent}" stroke-width="3"/>`;

    // Generate random rune strokes
    for (let i = 0; i < strokes; i++) {
      const angle = (i / strokes) * Math.PI;
      const x1 = cx + size * Math.cos(angle + Math.PI / 2);
      const y1 = cy + size * Math.sin(angle + Math.PI / 2);
      const x2 = cx + size * Math.cos(angle - Math.PI / 2);
      const y2 = cy + size * Math.sin(angle - Math.PI / 2);

      svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${this.colors.accent}" stroke-width="3" stroke-linecap="round"/>`;
    }

    return svg;
  }

  private generateMandala(cx: number, cy: number): string {
    const maxRadius = Math.min(this.width, this.height) * 0.35;
    let svg = '';

    const rings = 4;
    const petals = 8;

    // Draw rings and petals
    for (let ring = rings; ring > 0; ring--) {
      const radius = (maxRadius / rings) * ring;
      const fill = ring % 2 === 0 ? this.colors.secondary : this.colors.accent;

      for (let petal = 0; petal < petals; petal++) {
        const angle = (petal / petals) * Math.PI * 2;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        const petalSize = (radius / rings) * 0.8;
        svg += `<circle cx="${x}" cy="${y}" r="${petalSize}" fill="${fill}" opacity="0.8"/>`;
      }
    }

    // Center mandala circle
    svg += `<circle cx="${cx}" cy="${cy}" r="${maxRadius * 0.1}" fill="${this.colors.accent}"/>`;

    // Outer ring
    svg += `<circle cx="${cx}" cy="${cy}" r="${maxRadius}" fill="none" stroke="${this.colors.accent}" stroke-width="3"/>`;

    return svg;
  }

  private generateGeometric(cx: number, cy: number): string {
    const size = Math.min(this.width, this.height) * 0.3;
    let svg = '';

    const shapes = this.rng.nextInt(2) + 2;
    const rotation = this.rng.next() * 360;

    // Generate nested geometric shapes
    for (let i = 0; i < shapes; i++) {
      const currentSize = size * (1 - (i / shapes) * 0.5);
      const sides = this.rng.nextInt(2) + 3; // Triangle, square, pentagon

      let pathData = '';
      for (let j = 0; j < sides; j++) {
        const angle = (j / sides) * Math.PI * 2 + (rotation * Math.PI / 180);
        const x = cx + currentSize * Math.cos(angle);
        const y = cy + currentSize * Math.sin(angle);
        pathData += `${j === 0 ? 'M' : 'L'} ${x} ${y}`;
      }
      pathData += ' Z';

      const fill = i % 2 === 0 ? this.colors.secondary : this.colors.accent;
      svg += `<path d="${pathData}" fill="none" stroke="${fill}" stroke-width="2"/>`;
    }

    return svg;
  }

  private generateBeast(cx: number, cy: number): string {
    const size = Math.min(this.width, this.height) * 0.25;
    let svg = '';

    // Head
    svg += `<circle cx="${cx}" cy="${cy - size * 0.2}" r="${size * 0.4}" fill="${this.colors.secondary}" stroke="${this.colors.accent}" stroke-width="2"/>`;

    // Eyes
    const eyeSize = size * 0.08;
    svg += `<circle cx="${cx - size * 0.15}" cy="${cy - size * 0.35}" r="${eyeSize}" fill="${this.colors.accent}"/>`;
    svg += `<circle cx="${cx + size * 0.15}" cy="${cy - size * 0.35}" r="${eyeSize}" fill="${this.colors.accent}"/>`;

    // Snout/mouth
    svg += `<path d="M ${cx} ${cy - size * 0.1} L ${cx - size * 0.15} ${cy + size * 0.1} L ${cx + size * 0.15} ${cy + size * 0.1} Z" fill="${this.colors.accent}" stroke="${this.colors.secondary}" stroke-width="1"/>`;

    // Ears/horns
    const hornX1 = cx - size * 0.25;
    const hornX2 = cx + size * 0.25;
    const hornY = cy - size * 0.5;
    svg += `<path d="M ${hornX1} ${cy - size * 0.2} L ${hornX1} ${hornY} L ${hornX1 + size * 0.1} ${cy - size * 0.15}" fill="none" stroke="${this.colors.accent}" stroke-width="2" stroke-linecap="round"/>`;
    svg += `<path d="M ${hornX2} ${cy - size * 0.2} L ${hornX2} ${hornY} L ${hornX2 - size * 0.1} ${cy - size * 0.15}" fill="none" stroke="${this.colors.accent}" stroke-width="2" stroke-linecap="round"/>`;

    // Body
    svg += `<ellipse cx="${cx}" cy="${cy + size * 0.2}" rx="${size * 0.35}" ry="${size * 0.5}" fill="${this.colors.secondary}" stroke="${this.colors.accent}" stroke-width="2" opacity="0.8"/>`;

    return svg;
  }

  private generatePatterns(cx: number, cy: number, size: number): string {
    let svg = '';
    const patternType = this.rng.nextInt(4);

    switch (patternType) {
      case 0: // Diagonal stripes
        for (let i = -size; i < size; i += 8) {
          svg += `<line x1="${cx + i}" y1="${cy - size}" x2="${cx + i}" y2="${cy + size}" stroke="${this.colors.accent}" stroke-width="3" opacity="0.5"/>`;
        }
        break;
      case 1: // Dots
        for (let i = 0; i < 9; i++) {
          const x = cx - size + (size / 4) * (i % 3);
          const y = cy - size + (size / 4) * Math.floor(i / 3);
          svg += `<circle cx="${x}" cy="${y}" r="3" fill="${this.colors.accent}"/>`;
        }
        break;
      case 2: // Cross
        svg += `<line x1="${cx - size}" y1="${cy}" x2="${cx + size}" y2="${cy}" stroke="${this.colors.accent}" stroke-width="2"/>`;
        svg += `<line x1="${cx}" y1="${cy - size}" x2="${cx}" y2="${cy + size}" stroke="${this.colors.accent}" stroke-width="2"/>`;
        break;
      case 3: // Concentric circles
        for (let i = 0; i < 3; i++) {
          const r = (size / 3) * (i + 1);
          svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${this.colors.accent}" stroke-width="1" opacity="0.6"/>`;
        }
        break;
    }

    return svg;
  }

  private svgToDataUrl(svg: string): string {
    const encoded = encodeURIComponent(svg);
    return `data:image/svg+xml,${encoded}`;
  }
}

// Generate multiple symbol variants for preview/selection
export function generateSymbolVariants(
  name: string,
  domain: FactionDomain,
  count: number = 6
): GeneratedSymbol[] {
  const styles: SymbolStyle[] = [
    'shield',
    'circle',
    'star',
    'crown',
    'rune',
    'mandala',
    'geometric',
    'beast',
  ];

  const variants: GeneratedSymbol[] = [];
  for (let i = 0; i < Math.min(count, styles.length); i++) {
    const generator = new FactionSymbolGenerator({
      seed: `${name}-${domain}-${i}`,
      domain,
      style: styles[i],
      width: 256,
      height: 256,
    });
    variants.push(generator.generate());
  }

  return variants;
}
