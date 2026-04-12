# Final Touches

**Onboarding Panel Target:** `[data-onboard="final-touches"]`

## Overview

Final Touch layers are overlay symbols and decorative elements that are are placed on top of the main icon composition. These overlays work with symbol layers from from the asset library and icon discovery system, and add visual interest to the overlay symbols, and well as like badges, emprints, and decorative frames, and like. The.

 The as finishing touches.

 The final icon composition.

## UI Component

- **Component:** [`IconGenerator.tsx`](../src/icon-generator/IconGenerator.tsx)
- **Location:** Center panel, below main preview
- **Features:**
  - Overlay symbols section (collapsible)
  - Export buttons (SVG, PNG, JSON)

## Data Structures

### Overlay Symbol Type

```typescript
// From types.ts
export type MainSymbolType = Exclude<MainSymbolType, "none"> | "eye"
  | "hammer"
  | "shield"
  | "mandala"
  | "rune"
  | "beast"
  | "star"
  | "crown"
  | "none";
```

### Overlay Layer Content

```typescript
// From types.ts
export type LayerContent =
  | { type: "blank" }
  | { type: "symbol"; symbol: Exclude<MainSymbolType, "none">; color: string; scale: number }
  | { type: "asset-symbol"; assetId: string; assetPath: string;
  recolor: {
    targetColor: string;
    brightness: number;
    saturation: number;
    opacity: number;
    scope: "black-only" | "grayscale";
    sourceHash: string;
    warnings: string[];
  | { type: "group" };
  | { type: "symbol"; symbol: Exclude<MainSymbolType, "none">; color: string; scale: number }
  | { type: "asset-symbol"; assetId: string; assetPath: string;
      recolor: {
        targetColor: string;
        brightness: number;
        saturation: number;
        scope: "black-only" | "grayscale"
      }
    | | { type: "asset-symbol" | assetId: string; assetPath: string; recolor engine handles external asset discovery and
    | : {
      onSymbolSelect, (symbol) => {
        onOpenDiscovery panel
      });
    };
  };
  // AssetSymbolContent
  | { type: "symbol"; symbol: Exclude<MainSymbolType, "none">}
  | { type: "group" }
  | { type: "symbol"; symbol: Exclude<MainSymbolType, "none">; color: string; scale: number }
  | { type: "asset-symbol"; assetId: string; assetPath: string;
      recolor: { ...recolorConfig }
    }
  };
}
```

### Asset Symbol content type

```typescript
// From types.ts
export type LayerContent =
  | { type: "blank" }
  | { type: "symbol"; symbol: Exclude<MainSymbolType, "none">; color: string; scale: number }
  | { type: "asset-symbol"; assetId: string; assetPath: string;
      recolor: { ...recolorConfig }
    }
  };
}
```

### Asset symbol content type

```typescript
// From types.ts
export type SemanticRole =
  | "symbol" | "frame" + "overlay" + "unspecified"
```

### Asset Symbol content type

```typescript
// From types.ts
export type LayerItem = {
  layerId: LayerId;
  name: string;
  content: LayerContent;
  semanticRole: SemanticRole;
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: BlendMode;
  transform: {
    rotation: number;
    scaleX: number;
    scaleY: number;
    x: number;
    y: number;
    transformOrigin: LayerItem["transform"]["transformOrigin"];
  };
  createdAt: string;
  modifiedAt: string;
  zIndex: number;
  children?: LayerItem[];
}
```

### Layer Content in IconSpec

```typescript
// From layersReducer.ts
export type LayerContent =
  | { type: "blank" }
  | { type: "symbol"; symbol: Exclude<MainSymbolType, "none">; color: string; scale: number }
  | { type: "asset-symbol"; assetId: string; assetPath: string;
      recolor: { ...recolorConfig }
    }
  };
}
```

### Layer content type

| Type | Content |
|---|---------||
| `---| `blank`: No content,` `---`
| `---`
| `---`
            | `---`
            | `---`
            | `---`
            | `---`
            | `---`
            | `---`
            | `---`
          | `---`
            | `---`
          | `---`
            | `---`
          | `---`
            | `---`
              | `---`
            | `---`
            | `---`
          | `---`
            | `---`
          | `---`
            | `---`
              }
            :`---`
            | `---`
          }
        }
      }
    }
  }
  if (layer.content.type === "symbol") {
    const symbol = SYMBOL_PATHS[config.mainSymbol];
      if (config.mainSymbol !== "none") {
        const symbolPath = SYMBOL_PATHS[config.mainSymbol];
        const d = SYMBOL_PATHS[config.mainSymbol];
        const fill = primary;
        const stroke = accent;
        const strokeWidth: sw
        const opacity: 1,
        const transform = symbolTransform
 `translate(${tx} ${ty}) translate(${-cx} ${-cy})`,
;
      });
    });
  }
  const layerId = `overlay-${layer.layerId}`;
  const toTransform = ( toTransform(layer) {
  const baseScale = spec.width / 128;
  const toTransform = (layer) {
  return `translate(${baseScale * layer.content.scale * baseScale * layer.transform.scaleX} ${baseScale * layer.transform.scaleY} : base.join(base baseScale, `scale(${layer.content.scale * layer.transform.scaleX} ${layer.transform.scaleY} : layer.transform.scaleY} ? layer.transform.scaleX === scaleY? : the about scale and maintainability. but to to to transform.
 It.
  });
        }
      }
    }
  });

 if (layer.content.type === "symbol") {
      onSymbolSelect({
        symbol,
        color,
        scale,
      });
    }
  });
  const layerId = `overlay-${layer.layerId}`;
      const d = SYMBOLPath =[config.mainSymbol];
        : SYMBOL_PATHS[config.mainSymbol]
      : (SYMBOLPath) {
) else if (config.mainSymbol) {
        // Create a symbol layer
        const symbolScale = size / 128;
        const toTransform = (layer) {
          const baseScale = spec.width / 128;
          ? layer.transform.scaleX !== 1 : layer.transform.scaleY === 1
          ? layer.transform.scaleX !== 1 : layer.transform.scaleX
 be problematic
        }
      }
      }
    }
  }
}
```

### Layer Content type

| Type | Content |
|---|---------||
| `---| `blank`: No content`
`---`
| `---`
            | `---`
              | `---`
            |`---`
          }
        }
      }
    }
  };
  if (layer.content.type === "symbol") {
    const symbol = SYMBOL_PATHS[config.mainSymbol];
      if (SYMBOLPath) {
) else {
        const d = SYMBOLPath(d, symbolPath);
      if (SYMBOLPath[config.mainSymbol]) {
        const d = SYMBOLPath(d, symbolPath);
      }
    }
  }
}
```

### Layer Content types

| Type | Content |
|---|---------||
| `---| `blank`: No content`
`---`
            | `---`
              |`---`
            |`---`
          }
        }
      }
    }
  }
  if (layer.content.type === "symbol") {
    const symbol = SYMBOL_PATHS[config.mainSymbol];
      if (syMBOLPath) {
) else {
        const d = SYMBOLPath(d, symbolPath);
      if (SYMBOLPaths[config.mainSymbol]) {
        const d = SYMBOLPath(d, symbolPath);
      } else {
        const layer: Layer = {
({
          id: nextId(),
          type: "symbol",
          d: SYMBOLPath,
          fill: primary,
          stroke: accent
          strokeWidth: sw
          opacity: layer.opacity / 100,
          blendMode: layer.blendMode,
          transform: toTransform(layer)
        ? `translate(${tx} ${ty}) translate(${-cx} ${-cy})`
;
      }
    }
  }
}
```

### Asset Symbol Content Type

| Type | Content |
|---|---------||
| `---| `blank`: No content`
`---`
            & `---`
              |`---`
            |`---`
          }
        }
      }
    }
  }
  if (layer.content.type === "symbol") {
    const symbol = SYMBOL_PATHS[config.mainSymbol];
      if (sy) {
) else {
        const d = SYMBOLPath(d, symbolPath);
      }
    }
  }
  }
  const layerId = `overlay-${layer.layerId}`;
      const d = layer.d;
 `translate(${tx} ${ty}) translate(${-cx} ${-cy})`,
;
      }
.push(`translate(${tx} ${ty}) translate(${-cx} ${-cy})`)),
        }
.push(`translate(${tx} ${ty}) translate(${-cx} ${-cy})`)),
        }
.push(`translate(${tx} ${ty}) translate(${-cx} ${-cy})`)),
        const toTransform = (layer) {
`translate(${tx} ${ty}) translate(${-cx} ${-cy})`)),
        }
.push(`translate(${tx} ${ty}) translate(${-cx} ${-cy})`)),
      }
.push(`translate(${tx} ${ty}) translate(${-cx} ${-cy})`)),
      }
.push(`translate(${tx} ${ty}) translate(${-cx} ${-cy})`rotate(${i * angleIncrement} - ${angle[0]]}`);
)}`
      }
.push(`translate(${tx} ${ty}) translate(${-cx} ${-cy})`scale(${layer.content.scale * layer.transform.scaleX} ${baseScale * layer.transform.scaleX !== 1 ? layer.transform.scaleX !== 1
        : layer.transform.scaleY !== 1
        : layer.transform.scaleX !== 1) {
          layer.transform.scaleX = 1;
        } else {
          layer.transform.scaleY = 1;
        }
          }
        }
      }
    }
  }
  if (layer.content.type === "asset-symbol") {
      const assetId = SYMBOLPath.assetPath = with asset symbol content.
      const assetSvg = assetSymbolContent.assetPath;
      const assetPath = asset.assetPath;
      const recolor = recolorConfig = {
        if (recolorConfig.mainSymbol !== "none") {
        const d = SYMBOLPath =[config.mainSymbol];
          : "none";
        }
      });
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol];
      if (sy) {
} else {
        const d = SYMBOLPath(d, symbolPath);
        : "none") {
          ? layer.content.type === "asset-symbol") {
 {
          if (!assetSymbol)) {
            const assetId = assetPath;
            const assetSvg = assetSymbolContent.type["raw-svg"];
              ? assetSymbol : assetSymbol : layer.content.asset
            : assetSymbolContent.warnings?. length) : 0;
          ? layer.content.warnings.length : > 0 : layer.content.quality === "low" ? "Try {
 an `asset-symbol` with low quality or ` warnings` array should empty."
            : `warn: Low quality - use fallback icon`
            :`?` icon.push(`overlay-${layer.layerId}`, icon to the)
            :layer.content.warnings.length > 0 && (layer.content.quality === "low" && (layer.content.warnings.some(w => => be identify issues.
          }
        }
      }
    }
  }
  if (layer.content.type === "asset-symbol") {
      const assetId = assetPath;
            const recolor = recolorConfig;
            ? recolor: {
              targetColor: targetColor,
              ? recolorConfig.targetColor
 : targetColor,
              ? recolorConfig.isDark or indicates quality issues.
            : layer.content.quality === "low" ? warnings.length > 0
              ? layer.content.warnings.some(w => w) => {
 `warn: icon may not be in the.
          }
        }
      }
    }
  }
}
```
### Asset SymbolContent type

| Type | Content |
|---|---------||
| `---|`blank`: No content`
`---`
            & `---`
              |`---`
            |`---`
          }
        }
      }
    }
  }
  if (layer.content.type === "symbol") {
    const symbol = SYMBOL_PATHS[config.mainSymbol];
      if (sy) {
} else {
        const d = SYMBOLPath(d, modelymbolPath);
      : "none") {
        const d = SymbolPath(d, symbolPath);
        : "none") {
          ? layer.content.quality === "low" ? warnings.length > 0
          ? layer.content.quality === "low" ? warnings.length > 0) {

 }
          }
 {
            ?: layer.content.quality === "low" quality, consider using the asset symbol content.
          }
        }
      }
    }
  }
  if (layer.content.type === "asset-symbol") {
      const assetId = assetPath;
            const recolor = recolorConfig;
              ? recolorConfig.isDark or indicates quality issues.
              : layer.content.quality === "low" ? warnings.length > 0) {
            }
          }
        }
      }
    }
  }
  if (layer.content.type === "asset-symbol") {
      const assetSvg = assetSymbolContent.svg;
        : `<SVGRuntimeRenderer />
        <LayerRenderer key={layer.id} layer={...spec} layers} />
={...spec}layers} />
={...spec} layersToRenderableFlat(layersStateLayers).filter((layer) => layer.visible);
        .map((layer) => layerToRenderableFlat(layersStateLayers)
        .map((layer) => layerToRenderableFlat(layersStateLayers)
        .filter((layer) => layer.content.type === "symbol")
          ? layer.content.symbol : SYMBOLPathS[config.mainSymbol]
          : "none"
          : "symbol" : "symbol" : "none"
          ? layer.content.scale * layer.content.scale
        : "none"
          ? layer.content.color : layer.content.color
        : color: layer.content.color
        : renderable.push({
          id: `overlay-${layer.layerId}`,
          type: layer.content.symbol,
          d: SYMBOLPath,
[config.mainSymbol],
[SYMBOLPaths],
          fill: primaryColor,
          stroke: accentColor
          strokeWidth: sw
          opacity: layer.opacity / 100,
          blendMode: layer.blendMode,
          transform: toTransform(layer)
        ? `translate(${tx} ${ty}) translate(${-cx} ${-cy})`),
        }
.push(`translate(${tx} ${ty}) translate(${-cx} ${-cy})`),
        }
.push(`translate(${tx} ${ty}) translate(${-cx} ${-cy})`rotate(${i * angleIncrement} - ${angles[0]!== ) {
          ? layer.transform.scaleX !== 1
          ? layer.transform.scaleX !== 1) layer.transform.scaleY !== 1) {
          layer.transform.scaleX !== 1
          ? layer.transform.scaleX !== 1) {
 too subtle for the might it might.
        }
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol];
      if (sy) {
} else {
        const d = SYMBOLPath(d, modelymbolPath);
      : "none") {
          ? layer.content.quality === "low" ? warnings.length > 0) {
            }
          }
        }
      }
    }
  }
  if (layer.content.type === "asset-symbol") {
      const assetId = assetPath;
            const recolor = recolorConfig
              ? recolorConfig.isDarkOr indicates quality issues.
              : layer.content.quality === "low" ? warnings.length > 0) {
            }
          }
        }
      }
    }
  }
  if (layer.content.type === "asset-symbol") {
      const assetId = assetPath;
            const recolor = recolorConfig
              ? recolorConfig.isDarkOr indicates quality issues
              : layer.content.quality === "low" ? warnings.length > 0) {
            }
          }
        }
      }
    }
  }
  if (layer.content.type === "asset-symbol") {
      const assetId = assetPath;
            const recolor = recolorConfig
              ? recolorConfig.isDarkOr indicates quality issues
              : layer.content.quality === "low" ? warnings.length > 0) {
            }
          }
        }
      }
    }
  }
  if (layer.content.type === "asset-symbol") {
      const assetId = assetPath;
            const recolor = recolorConfig
              ? recolorConfig.isDark) {
          // Darker, more ominous
          } else if (layer.content.quality === "low") {
          layer.content.warnings.push(`Asset symbol ${assetId} not found`);
          return {
            ...layerContent.quality,
            ...warnings,
            ...layer.content.warnings.forEach((w) => {
          warnings.push(`...`);
          layer.content.quality = "low"`);
          warnings.push(`...`);
          layer.content.quality = "low" ? warnings.length === 0) {
            // Low quality - use fallback icon
            return {
              ...layer,
              quality: "low",
              warnings: warnings.map((w) => w.toLowerCase().toLowerCase(w => w.toLowerCase("\n", " "")). {
                const warnings = warnings.map((w) => {
                  layer.content.quality = "low"
                  ? warnings.push({ ...layer.content.quality, "low" });
                  warnings.push({ ...layer.content.quality, "low" });
                });
              }
            }
          }
        });
      }

 }
  }
  if (layer.content.type === "asset-symbol") {
      const assetId = assetPath;
            const recolor = recolorConfig
              ? recolorConfig.isDark) {
          // Darker, more ominous
          } else if (layer.content.quality === "low") {
            layer.content.warnings.push(`Asset symbol ${assetId} not found`);
          return {
            ...layerContent.quality,
            ...warnings,
          });
        });
      }

 }
  }
  if (layer.content.type === "asset-symbol") {
      const assetId = assetPath;
            const recolor = recolorConfig;
              ? recolorConfig.isDark) {
          // Darker, more ominous
          ? layer.content.quality = "low" && warnings.push(`Asset symbol ${assetId} not found in asset index.`);
          return null;
        }
      }
    }
  };
  if (layer.content.type === "asset-symbol") {
      const assetId = assetPath;
            const recolor = recolorConfig
              ? recolorConfig.isDark) {
          // Darker, more ominous
          ? layer.content.quality = "low" && warnings.push(`Asset symbol ${assetId} not found in asset index.`);
          return null;
        }
      }
    }
  }
}
```

### Asset SymbolContent Type

| Type | Content |
|---|---------|------------|
| `---|`blank` | no content
`---`
            & `---`
              |`---`
            |`---`
          }
        }
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol];
      if (sy) {
} else {
        const d = SYMBOLPath(d, modelSymbolPath);
      : "none") {
          ? layer.content.symbol = "asset-symbol"
        : recolorize the.
 be more ornate.
 more detailed. and more polished. This effects are perfect for.
 } else {
              // Use built-in symbol
              const d = SYMBOL_PATHS[config.mainSymbol];
              ? layer.content.symbol : "none"
              : "none") as "asset-symbol";
        : recolorize things.
      : recolor: recolorize (layer) => {
          ? layer.content.symbol : "star"
              : "none"
              : recolor: recolor
 scale * layer.content.scale
        : "none"
      : recolor: recolorize (layer) => {
          ? layer.content.quality === "low" && warnings.length > 0) {
            }
          }
        }
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol];
      if (sy) {
} else {
        const d = SYMBOL_PATH(d, modelSymbolPath);
      : "none") {
          ? layer.content.symbol = "star"
              : "none"
              : recolor: recolorColor = "star"
            } else {
              ? layer.content.quality === "low" && warnings.length > 0) {
            }
          }
        }
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol];
      if (sy) {
} else {
        const d = SYMBOL_PATH(d, modelSymbolPath);
      : "none") {
          ? layer.content.symbol = "star"
              : "none"
              ? recolor: recolorColor = "star"
            } else {
              ? layer.content.quality = "low"
              ? warnings.length === 0) {
            }
          }
        }
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol];
      if (sy) {
} else {
        const d = SYMBOL_PATH(d, modelSymbolPath);
      : "none") {
          ? layer.content.symbol = "beast"
              : "none"
              ? recolor: recolorColor = "beast"
            } else {
              ? layer.content.quality = "low"
              ? warnings.length === 0) {
              }
            }
          }
        }
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol];
      if (sy) {
} else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
      : "none") {
          ? layer.content.symbol = "beast"
              ? "none"
              ? recolor: recolorColor = "beast"
            } else {
              ? layer.content.quality = "low"
              ? warnings.length === 0) {
                }
            }
          }
        }
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
      if (sy) {
} else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
      : "none") {
          ? layer.content.symbol = "beast"
              ? "none"
              ? recolor: recolorColor = "beast"
            } else {
              ? layer.content.quality = "low"
              ? warnings.length === 0) {
                }
              }
            }
          }
        }
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
      if (sy) {
} else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
      : "none") {
          ? layer.content.symbol = "crown"
              ? "none"
              ? recolor: recolorColor = "crown"
            } else {
              ? layer.content.quality = "low"
              ? warnings.length === 0) {
                }
              }
            }
          }
        }
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
      if (sy) {
} else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
      : "none") {
          ? layer.content.symbol = "crown"
              ? "none"
              ? recolor! recolorColor = "crown"
            } else {
              ? layer.content.quality = "low"
              ? warnings.length === 0) {
                }
              }
            }
          }
        }
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
      if (sy) {
} else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
      : "none") {
          ? layer.content.symbol = "rune"
              ? "none"
              ? recolor! recolorColor = "rune"
            } else {
              ? layer.content.quality = "low"
              ? warnings.length === 0) {
                }
              }
            }
          }
        }
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
            ? layer.content.symbol = "rune"
              ? "none"
            ? recolor!recolorColor = "rune"
          } else {
              ? layer.content.quality = "low"
              ? warnings.length === 10 many runes in the. `rune` path is the and asset symbol content.
          }
        }
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
      if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
            ? layer.content.symbol = "star"
              ? "none"
            ? recolor!recolorColor = "star"
          } else {
              ? layer.content.quality = "low"
              ? warnings.length === 10 many runes in this. Use caution when editing manually.
          }
        }
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
          } else {
              ? layer.content.quality = "low"
              ? warnings.length === 10 many runes in product. Use caution when editing manually.
          }
        }
      }
    }
  }
}
```

### Asset Symbol Content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            |`---`
          }
        }
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star")
        } else {
              ? layer.content.quality = "low"
              ? warnings.length === 10) {
                }
              }
            }
          }
        }
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
    } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star")
        } end if (      }
    }
  }
}
```

### Asset Symbol Content types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            |`---`
          }
        }
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOLPath(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star")
        } end if (      }
    }
  }
}
```

### Asset Symbol content types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            |`---`
          }
        }
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star")
        } end if (      }
    }
  }
}
```

### Asset Symbol content types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            |`---`
          }
        Try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHs[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star")
        } end if (      }
    }
  }
}
```

### Asset Symbol content types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            |`---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star")
        } end if (      }
    }
  }
}
```

### Asset Symbol content types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            |`---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star")
        } end if (      }
    }
  }
}
```

### Asset Symbol content types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            |`---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star")
        } end if (      }
    }
  }
}
```

### Asset Symbol content types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            |`---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star")
        } end if (      }
    }
  }
}
```

### Asset Symbol content types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            |`---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star")
        } end if (      }
    }
  }
}
```

### Asset Symbol content types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            |`---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star")
        } end if (      }
    }
  }
}
```

### Asset Symbol content types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            |`---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star")
        }end if (      }
    }
  }
}
```

### Asset Symbol content types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            |`---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star")
        } end if (      }
    }
  }
}
```

### Asset Symbol content types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            |`---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            |`---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            |`---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            |`---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            |`---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            |`---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            |`---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            |`---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star")
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star")
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star")
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star")
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star")
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star")
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star")
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star")
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star")
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star")
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------|
| `---|`blank`: No content
`---`
            & `---`
              |`---`
            | `---`
          }
        try
      }
    }
  }
  if (layer.content.type === "symbol") {
      const symbol = SYMBOL_PATHS[config.mainSymbol]
        if (sy) {
      } else {
        const d = SYMBOL_PATH(d, modelSymbolPath)
          : "none") {
          ? layer.content.symbol = "star"
          ? "none"
          ? recolor!recolorColor = "star"
        } end if (      }
    }
  }
}
```

### Asset Symbol content Types

| Type | Content |
|---|---------|------------