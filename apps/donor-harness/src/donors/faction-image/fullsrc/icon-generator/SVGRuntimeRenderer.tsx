import React from "react";
import type { FilterDef, IconSpec, Layer, BlendMode } from "./types";

export function SVGRuntimeRenderer({
  spec,
  className,
}: {
  spec: IconSpec;
  className?: string;
}) {
  const fallbackBlendModes = Array.from(new Set(spec.layers.map((layer) => layer.blendMode).filter((m): m is BlendMode => m != null && m !== "normal")));
  return (
    <svg
      viewBox={spec.viewBox}
      width={spec.width}
      height={spec.height}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby={`${spec.id}-title`}
    >
      {spec.title && <title id={`${spec.id}-title`}>{spec.title}</title>}
      {spec.desc && <desc id={`${spec.id}-desc`}>{spec.desc}</desc>}
      {spec.filters?.length || fallbackBlendModes.length ? (
        <defs>
          {(spec.filters ?? []).map((filter) => (
            <FilterDefinition key={filter.id} filter={filter} />
          ))}
          {fallbackBlendModes.map((mode) => (
            <filter key={`blend-fallback-${mode}`} id={`blend-fallback-${mode}`}>
              <feBlend in="SourceGraphic" in2="BackgroundImage" mode={mode} />
            </filter>
          ))}
        </defs>
      ) : null}
      {spec.layers.map((layer) => (
        <LayerRenderer key={layer.id} layer={layer} />
      ))}
    </svg>
  );
}

function FilterDefinition({ filter }: { filter: FilterDef }) {
  const intensity = Math.max(0, Math.min(filter.intensity, 1));
  if (filter.preset === "glow") {
    const blur = 1 + intensity * 3;
    return (
      <filter id={filter.id} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation={blur} result="blurred" />
        <feMerge>
          <feMergeNode in="blurred" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    );
  }
  if (filter.preset === "etch") {
    const amount = 0.35 + intensity * 0.5;
    return (
      <filter id={filter.id}>
        <feColorMatrix
          type="matrix"
          values={`
            ${amount} 0 0 0 0
            0 ${amount} 0 0 0
            0 0 ${amount} 0 0
            0 0 0 1 0
          `}
        />
      </filter>
    );
  }
  return (
    <filter id={filter.id}>
      <feGaussianBlur stdDeviation={0.5 + intensity * 1.5} />
    </filter>
  );
}

function LayerRenderer({ layer }: { layer: Layer }) {
  if (layer.type === "raw-svg") {
    return (
      <g
        opacity={layer.opacity ?? 1}
        transform={layer.transform}
        filter={layer.filterId ? `url(#${layer.filterId})` : (layer.blendMode && layer.blendMode !== "normal" ? `url(#blend-fallback-${layer.blendMode})` : undefined)}
        style={layer.blendMode ? { mixBlendMode: layer.blendMode } : undefined}
        dangerouslySetInnerHTML={{ __html: layer.rawSvg || "" }}
      />
    );
  }
  const common: React.SVGAttributes<SVGElement> = {
    fill: layer.fill || "none",
    stroke: layer.stroke || "none",
    strokeWidth: layer.strokeWidth ?? 0,
    opacity: layer.opacity ?? 1,
    transform: layer.transform,
    filter: layer.filterId ? `url(#${layer.filterId})` : (layer.blendMode && layer.blendMode !== "normal" ? `url(#blend-fallback-${layer.blendMode})` : undefined),
    style: layer.blendMode ? { mixBlendMode: layer.blendMode } : undefined,
  };

  switch (layer.type) {
    case "circle":
      return <circle cx={layer.cx ?? 64} cy={layer.cy ?? 64} r={layer.r ?? 32} {...common} />;
    case "ring":
      return (
        <circle
          cx={layer.cx ?? 64}
          cy={layer.cy ?? 64}
          r={layer.r ?? 40}
          fill="none"
          stroke={layer.stroke}
          strokeWidth={layer.strokeWidth}
          opacity={layer.opacity}
          transform={layer.transform}
        />
      );
    case "square":
      return (
        <rect
          x={layer.x ?? 32}
          y={layer.y ?? 32}
          width={layer.width ?? 64}
          height={layer.height ?? 64}
          {...common}
        />
      );
    case "triangle":
    case "diamond":
    case "pentagon":
      return <polygon points={layer.points || ""} {...common} />;
    case "eye":
    case "moon":
    case "serpent":
    case "hand":
    case "cross":
    case "arc":
    case "dots":
    case "hammer":
    case "mandala":
    case "rune":
    case "beast":
    case "star":
    case "crown":
      return <path d={layer.d || ""} {...common} />;
    case "sun":
      return (
        <g {...common}>
          <circle cx={layer.cx ?? 64} cy={layer.cy ?? 64} r={layer.r ?? 16} />
          <path d={layer.d || ""} fill="none" stroke={common.stroke} strokeWidth={common.strokeWidth} />
        </g>
      );
    case "rays":
      return <path d={layer.d || ""} {...common} />;
    case "text":
      return (
        <text
          x={layer.cx ?? 64}
          y={layer.cy ?? 64}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={layer.fontSize ?? 24}
          fontFamily="serif"
          {...common}
        >
        {layer.text}
        </text>
      );
    case "symbol":
    case "shield":
      return <path d={layer.d || ""} {...common} />;
    default:
      return null;
  }
}
