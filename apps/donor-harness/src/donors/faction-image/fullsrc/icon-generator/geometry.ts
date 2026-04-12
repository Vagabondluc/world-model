const TAU = Math.PI * 2;

export function polygonPoints(
  sides: number,
  radius: number,
  cx: number,
  cy: number,
  rotation = -Math.PI / 2
): string {
  const pts: string[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = rotation + (TAU * i) / sides;
    pts.push(`${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`);
  }
  return pts.join(" ");
}

export function sunRaysPath(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  count: number
): string {
  let d = "";
  for (let i = 0; i < count; i++) {
    const angle = (TAU * i) / count - Math.PI / 2;
    const x1 = cx + rInner * Math.cos(angle);
    const y1 = cy + rInner * Math.sin(angle);
    const x2 = cx + rOuter * Math.cos(angle);
    const y2 = cy + rOuter * Math.sin(angle);
    d += `M${x1},${y1}L${x2},${y2}`;
  }
  return d;
}

export function eyePath(cx: number, cy: number, rx: number, ry: number): string {
  return `M${cx - rx},${cy} Q${cx},${cy - ry} ${cx + rx},${cy} Q${cx},${cy + ry} ${cx - rx},${cy}Z`;
}

export function crescentPath(cx: number, cy: number, r: number, offset = 0.3): string {
  const or = r * (1 - offset);
  return [
    `M${cx},${cy - r}`,
    `A${r},${r} 0 1 1 ${cx},${cy + r}`,
    `A${or},${or} 0 1 0 ${cx},${cy - r}`,
    "Z",
  ].join(" ");
}

export function serpentPath(cx: number, cy: number, size: number): string {
  const s = size * 0.4;
  return [
    `M${cx - s},${cy + s}`,
    `C${cx - s},${cy} ${cx},${cy - s} ${cx},${cy - s * 0.5}`,
    `S${cx + s},${cy} ${cx + s * 0.5},${cy + s * 0.3}`,
    `L${cx + s * 0.7},${cy + s * 0.1}`,
  ].join(" ");
}

export function handPath(cx: number, cy: number, size: number): string {
  const s = size * 0.35;
  return [
    `M${cx},${cy + s}`,
    `L${cx - s * 0.6},${cy + s * 0.3}`,
    `L${cx - s * 0.5},${cy - s * 0.2}`,
    `L${cx - s * 0.2},${cy - s * 0.8}`,
    `L${cx},${cy - s * 0.5}`,
    `L${cx + s * 0.2},${cy - s * 0.8}`,
    `L${cx + s * 0.5},${cy - s * 0.2}`,
    `L${cx + s * 0.6},${cy + s * 0.3}`,
    "Z",
  ].join(" ");
}

export function crossPath(cx: number, cy: number, size: number, thickness = 0.2): string {
  const h = size * 0.45;
  const t = size * thickness;
  return [
    `M${cx - t},${cy - h}`,
    `L${cx + t},${cy - h}`,
    `L${cx + t},${cy - t}`,
    `L${cx + h},${cy - t}`,
    `L${cx + h},${cy + t}`,
    `L${cx + t},${cy + t}`,
    `L${cx + t},${cy + h}`,
    `L${cx - t},${cy + h}`,
    `L${cx - t},${cy + t}`,
    `L${cx - h},${cy + t}`,
    `L${cx - h},${cy - t}`,
    `L${cx - t},${cy - t}`,
    "Z",
  ].join(" ");
}

export function dotsPositions(
  cx: number,
  cy: number,
  radius: number,
  count: number
): Array<{ x: number; y: number }> {
  const pts: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < count; i++) {
    const angle = (TAU * i) / count - Math.PI / 2;
    pts.push({
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    });
  }
  return pts;
}
