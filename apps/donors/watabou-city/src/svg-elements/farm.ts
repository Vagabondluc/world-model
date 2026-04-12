// @ts-nocheck
import { Point } from '../domain/types';
import { PRNG } from '../domain/seed/prng';
import { MAP_STYLE } from '../adapters/render/style';

export interface FarmOptions {
  scale: number;
  offsetX?: number;
  offsetY?: number;
  hatchAngle?: number;
  hatchSpacing?: number;
}

let _clipId = 0;

/**
 * Renders a medieval farm field SVG fragment.
 *
 * Hay/wheat field palette from MAP_STYLE. 45° furrow hatching
 * clipped to the polygon shape via <clipPath>.
 */
export function renderFarm(polygon: Point[], rng: PRNG, opts: FarmOptions): string {
  if (polygon.length < 3) return '';

  const { scale, offsetX = 0, offsetY = 0, hatchAngle = 42, hatchSpacing = 8 } = opts;
  const px = (p: Point) => `${(offsetX + p.x * scale).toFixed(1)},${(offsetY + p.y * scale).toFixed(1)}`;
  const pts = polygon.map(px).join(' ');
  const clipId = `fc-${_clipId++}`;

  const xs = polygon.map(p => offsetX + p.x * scale);
  const ys = polygon.map(p => offsetY + p.y * scale);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  // Slight tonal variation per field using RNG (±8 lightness shift in hex)
  const shift = Math.floor((rng.nextFloat() - 0.5) * 16);
  const base = parseInt(MAP_STYLE.farmFill.slice(1), 16);
  const r = Math.max(0, Math.min(255, ((base >> 16) & 0xff) + shift));
  const g = Math.max(0, Math.min(255, ((base >> 8) & 0xff) + shift));
  const b = Math.max(0, Math.min(255, (base & 0xff) + shift));
  const fill = `rgb(${r},${g},${b})`;

  const angleRad = (hatchAngle * Math.PI) / 180;
  const cos = Math.cos(angleRad), sin = Math.sin(angleRad);
  const span = (maxX - minX) + (maxY - minY);

  const hatchLines: string[] = [];
  for (let offset = -span; offset <= span; offset += hatchSpacing) {
    const x1 = cx + offset * cos - span * sin;
    const y1 = cy + offset * sin + span * cos;
    const x2 = cx + offset * cos + span * sin;
    const y2 = cy + offset * sin - span * cos;
    hatchLines.push(
      `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${MAP_STYLE.farmHatch}" stroke-width="0.7" opacity="0.5" />`
    );
  }

  return `<g class="farm">
  <defs><clipPath id="${clipId}"><polygon points="${pts}" /></clipPath></defs>
  <polygon points="${pts}" fill="${fill}" stroke="${MAP_STYLE.farmHatch}" stroke-width="0.6" />
  <g clip-path="url(#${clipId})">${hatchLines.join('')}</g>
</g>`;
}
