# MapStyleToggle Component Specification

## Purpose

The [`MapStyleToggle`](../../src/components/map/MapStyleToggle.tsx:7) component provides a floating toggle button that allows users to switch between SVG (schematic) and tile-based (illustrated) map rendering modes. It persists the user's preference in the game store and provides visual feedback for the current mode.

## Dependencies

### External Dependencies
- React (for component rendering)
- lucide-react (icons: `Layout`, `Image as ImageIcon`)

### Internal Dependencies
- [`@/stores/gameStore`](../../src/stores/gameStore.ts:10) - [`useGameStore()`](../../src/stores/gameStore.ts:10) for state management
- [`@/components/ui/Button`](../../src/components/ui/Button.tsx:1) - UI button component
- [`@/utils/cn`](../../src/utils/cn.ts:1) - Class name utility

### Child Components
- `Button` - Toggle button

## Props Interface

```typescript
// No props - component uses game store directly
```

## State Requirements

### Local State
- None (pure functional component)

### Store Dependencies (from [`useGameStore`](../../src/stores/gameStore.ts:10))

| Property | Type | Purpose |
|----------|------|---------|
| `appSettings` | [`AppSettings`](../../src/types.ts:69) | Application settings including map preferences |
| `saveSettings` | `(settings) => void` | Save settings to store |

## Rendering Logic

### Layout Structure

```
<div class="fixed bottom-24 right-4 z-[100] flex flex-col gap-2">
    <Button
        onClick={toggleMode}
        variant="secondary"
        size="sm"
        class="toggle-button"
        title="Switch to {nextMode} View"
    >
        {mode === 'svg' ? <ImageIcon /> : <Layout />}
    </Button>
</div>
```

### Positioning

- **Position**: Fixed, bottom-right corner
- **Bottom offset**: `bottom-24` (96px from bottom)
- **Right offset**: `right-4` (16px from right)
- **Z-index**: `z-[100]` (high z-index to stay above other UI elements)

### Button Styling

#### Base Classes
- `rounded-full`: Circular button shape
- `shadow-lg`: Large drop shadow
- `border-2`: 2px border
- `transition-all`: Smooth transitions for all properties
- `p-3`: 12px padding
- `aspect-square`: Square aspect ratio

#### Mode-Specific Styling

| Mode | Border | Background | Text |
|------|--------|------------|------|
| tile | `border-indigo-500` | `bg-indigo-50` | `text-indigo-600` |
| svg | `border-stone-200` | `bg-white` | `text-stone-600` |

### Icon Display

| Mode | Icon | Description |
|------|------|-------------|
| svg | `ImageIcon` | Shows atlas icon to switch to illustrated view |
| tile | `Layout` | Shows schematic icon to switch to SVG view |

### Tooltip

Dynamic title attribute:
- When in SVG mode: `"Switch to Illustrated View"`
- When in tile mode: `"Switch to Schematic View"`

## Event Handling

### User Interactions

| Interaction | Handler | Action |
|-------------|---------|--------|
| Click toggle button | `toggleMode()` | Switches between 'svg' and 'tile' modes |

### Callbacks

```typescript
const toggleMode = () => {
    saveSettings({
        ...appSettings,
        mapRender: {
            ...appSettings.mapRender,
            mode: mode === 'svg' ? 'tile' : 'svg'
        }
    });
};
```

## Accessibility

### ARIA Labels

- **Dynamic title attribute**: Provides screen reader text for button purpose
- **Consider adding**: `aria-label` for explicit accessibility
- **Consider adding**: `aria-pressed` to indicate toggle state

### Keyboard Navigation

- **Tab navigable**: Button is keyboard accessible
- **Enter/Space**: Activates toggle
- **Focus visible**: Button should show focus state

### Recommended ARIA Enhancements

```typescript
<Button
    aria-label="Toggle map view style"
    aria-pressed={mode === 'tile'}
    aria-current={mode === 'tile' ? 'true' : undefined}
    // ...
>
```

## Style Variant Selection

### Current Implementation

The component currently only toggles between render modes (SVG vs Tile). Theme selection is handled separately in the [`WorldCreationWizard`](./world_creation_wizard_spec.md:1).

### Available Themes

| Theme | Description | Asset Path |
|-------|-------------|------------|
| classic | Original fantasy tiles | `/assets/tilesets/classic/fantasyhextiles_v3.png` |
| vibrant | Thick outline, bold colors | `/assets/tilesets/vibrant/Terrain 1 - Thick - No Outline - 128x144.png` |
| pastel | Flat design, soft colors | `/assets/tilesets/pastel/Terrain 1 - Flat - No Outline - 128x144.png` |
| sketchy | Draft-style appearance | `/assets/tilesets/sketchy/fantasyhextiles_v3.png` |

### Theme Toggle Implementation

#### Theme Cycling Logic

```typescript
const themes: TileTheme[] = ['classic', 'vibrant', 'pastel', 'sketchy'];
const toggleTheme = () => {
    const currentIndex = themes.indexOf(currentTheme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    saveSettings({
        ...appSettings,
        mapRender: {
            ...appSettings.mapRender,
            theme: nextTheme
        }
    });
};
```

#### Theme Toggle Button

```typescript
interface ThemeToggleProps {
    currentTheme: TileTheme;
    onToggle: () => void;
    themes: TileTheme[];
}

const ThemeToggleButton = ({ currentTheme, onToggle, themes }: ThemeToggleProps) => (
    <Button
        onClick={onToggle}
        variant="secondary"
        size="sm"
        class="theme-toggle-button"
        aria-label={`Switch to next theme. Current: ${currentTheme}`}
        title={`Theme: ${currentTheme}`}
    >
        <PaletteIcon />
        <span class="theme-label">{currentTheme}</span>
    </Button>
);
```

#### Theme Toggle Styling

| Theme | Border | Background | Text | Icon |
|-------|--------|------------|------|------|
| classic | `border-amber-600` | `bg-amber-50` | `text-amber-700` | `Palette` |
| vibrant | `border-purple-600` | `bg-purple-50` | `text-purple-700` | `Palette` |
| pastel | `border-pink-600` | `bg-pink-50` | `text-pink-700` | `Palette` |
| sketchy | `border-slate-600` | `bg-slate-50` | `text-slate-700` | `Palette` |

#### Combined Toggle Layout

```typescript
<div class="fixed bottom-24 right-4 z-[100] flex flex-col gap-2">
    {/* Mode Toggle */}
    <Button
        onClick={toggleMode}
        variant="secondary"
        size="sm"
        class="toggle-button"
        title="Switch to {nextMode} View"
    >
        {mode === 'svg' ? <ImageIcon /> : <Layout />}
    </Button>
    
    {/* Theme Toggle (only visible in tile mode) */}
    {mode === 'tile' && (
        <Button
            onClick={toggleTheme}
            variant="secondary"
            size="sm"
            class="theme-toggle-button"
            title={`Theme: ${currentTheme}`}
        >
            <PaletteIcon />
        </Button>
    )}
</div>
```

#### Theme Transition Animation

```css
.theme-toggle-button {
    transition: all 0.3s ease;
}

.theme-toggle-button:hover {
    transform: scale(1.05);
}

.theme-toggle-button:active {
    transform: scale(0.95);
}

@keyframes theme-transition {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
}

.theme-transition {
    animation: theme-transition 0.3s ease;
}
```

#### Theme Change Event Handling

```typescript
const handleThemeChange = (newTheme: TileTheme) => {
    // Trigger transition animation
    document.body.classList.add('theme-transition');
    
    // Update theme
    saveSettings({
        ...appSettings,
        mapRender: {
            ...appSettings.mapRender,
            theme: newTheme
        }
    });
    
    // Remove animation class after transition
    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 300);
};
```

## Outline Options

### Current Implementation

Outline styles are determined by the selected theme's sprite sheet. Different outline variants exist as separate assets:

### Available Outline Styles (per theme)

| Style | Description | Asset Example |
|-------|-------------|---------------|
| No Outline | Clean tiles without borders | `Terrain 1 - Flat - No Outline - 128x144.png` |
| Black 1px | Thin black border | `Terrain 1 - Flat - Black Outline 1px - 128x128.png` |
| Black 2px | Medium black border | `Terrain 1 - Flat - Black Outline 2px - 128x128.png` |
| White 1px | Thin white border | `Terrain 1 - Flat - White Outline 1px - 128x128.png` |
| White 2px | Medium white border | `Terrain 1 - Flat - White Outline 2px - 128x128.png` |
| Texture 1px | Textured thin border | `Terrain 1 - Flat - Texture Outline 1px - 128x128.png` |
| Texture 2px | Textured medium border | `Terrain 1 - Flat - Texture Outline 2px - 128x128.png` |

### Outline Toggle Implementation

#### Outline Selection API

```typescript
interface OutlineStyle {
    id: string;
    name: string;
    description: string;
    assetPath: string;
    thickness: number;
    color: string;
}

interface OutlineToggleProps {
    currentOutline: OutlineStyle;
    outlines: OutlineStyle[];
    onOutlineChange: (outline: OutlineStyle) => void;
}
```

#### Available Outline Styles

```typescript
const OUTLINE_STYLES: OutlineStyle[] = [
    {
        id: 'no-outline',
        name: 'No Outline',
        description: 'Clean tiles without borders',
        assetPath: '/assets/tilesets/{theme}/Terrain 1 - Flat - No Outline - 128x144.png',
        thickness: 0,
        color: 'transparent'
    },
    {
        id: 'black-1px',
        name: 'Black Thin',
        description: 'Thin black border',
        assetPath: '/assets/tilesets/{theme}/Terrain 1 - Flat - Black Outline 1px - 128x128.png',
        thickness: 1,
        color: '#000000'
    },
    {
        id: 'black-2px',
        name: 'Black Medium',
        description: 'Medium black border',
        assetPath: '/assets/tilesets/{theme}/Terrain 1 - Flat - Black Outline 2px - 128x128.png',
        thickness: 2,
        color: '#000000'
    },
    {
        id: 'white-1px',
        name: 'White Thin',
        description: 'Thin white border',
        assetPath: '/assets/tilesets/{theme}/Terrain 1 - Flat - White Outline 1px - 128x128.png',
        thickness: 1,
        color: '#FFFFFF'
    },
    {
        id: 'white-2px',
        name: 'White Medium',
        description: 'Medium white border',
        assetPath: '/assets/tilesets/{theme}/Terrain 1 - Flat - White Outline 2px - 128x128.png',
        thickness: 2,
        color: '#FFFFFF'
    }
];
```

#### Outline Toggle Button

```typescript
const OutlineToggle = ({ currentOutline, outlines, onOutlineChange }: OutlineToggleProps) => (
    <Button
        onClick={() => {
            const currentIndex = outlines.findIndex(o => o.id === currentOutline.id);
            const nextOutline = outlines[(currentIndex + 1) % outlines.length];
            onOutlineChange(nextOutline);
        }}
        variant="secondary"
        size="sm"
        class="outline-toggle-button"
        title={`Outline: ${currentOutline.name}`}
    >
        <BorderIcon />
    </Button>
);
```

#### Outline Settings Structure

```typescript
interface MapRenderSettings {
    mode: 'svg' | 'tile';
    theme: TileTheme;
    outline?: OutlineStyle;
}

interface AppSettings {
    markdownFormat: 'regular' | 'homebrewery';
    mapRender: MapRenderSettings;
}
```

## User Preferences Persistence

### Storage Mechanism

- **Store**: [`useGameStore`](../../src/stores/gameStore.ts:10) (Zustand)
- **Storage**: Session storage via `zustand/middleware/persist`
- **Key**: `mappa-imperium-storage`
- **Path**: `appSettings.mapRender.mode`

### Persistence Flow

1. User clicks toggle button
2. `toggleMode()` handler updates store
3. `saveSettings()` persists to session storage
4. Components using `appSettings.mapRender.mode` re-render with new value
5. On page reload, settings are restored from session storage

### Settings Structure

```typescript
interface AppSettings {
    markdownFormat: 'regular' | 'homebrewery';
    mapRender?: {
        mode: 'svg' | 'tile';
        theme: 'classic' | 'vibrant' | 'pastel' | 'sketchy';
    };
}
```

## Performance

### Optimization Strategies

1. **Memoization**: Component is simple and doesn't require memoization
2. **Store subscription**: Only subscribes to `appSettings` and `saveSettings`
3. **Debouncing**: Not needed for simple toggle action
4. **Icon loading**: Icons from lucide-react are tree-shakeable

### Rendering Considerations

- Minimal re-renders (only when `appSettings` changes)
- No heavy computations
- Lightweight DOM footprint
- Fixed positioning prevents layout thrashing

## Future Enhancements

1. **Theme Toggle**:
   - Add theme selection button or dropdown
   - Cycle through available themes
   - Persist theme preference

2. **Outline Options**:
   - Add outline style selector
   - Support for custom outline colors
   - Toggle outline visibility

3. **Position Customization**:
   - Allow users to reposition the toggle
   - Save position preference
   - Support multiple toggle buttons for different settings

4. **Animation**:
   - Add smooth icon transition
   - Button press animation
   - Mode change animation

5. **Accessibility**:
   - Add `aria-pressed` state
   - Add `aria-label` for screen readers
   - Keyboard shortcut for quick toggle

6. **Multi-Toggle**:
   - Combine mode and theme toggles
   - Expandable menu for all map settings
   - Quick presets (e.g., "High Contrast", "Performance Mode")

7. **Visual Feedback**:
   - Show current mode name on hover
   - Add tooltip with preview of next mode
   - Animation when switching modes

8. **Mobile Support**:
    - Larger touch target for mobile
    - Swipe gesture support
    - Adaptive positioning

## Custom Theme Support

### Custom Theme Definition

```typescript
interface CustomTheme {
    id: string;
    name: string;
    description?: string;
    author?: string;
    version: string;
    createdAt: string;
    assetPath: string;
    previewImage?: string;
    colorPalette: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
    };
    biomeColors: Record<BiomeType, string>;
    outlineStyles: OutlineStyle[];
}
```

### Custom Theme Storage

```typescript
interface CustomThemeStorage {
    themes: CustomTheme[];
    activeTheme: TileTheme | string;
}

// Stored in localStorage
const CUSTOM_THEMES_KEY = 'mappa-imperium-custom-themes';
```

### Theme Registration API

```typescript
interface ThemeRegistry {
    registerTheme(theme: CustomTheme): void;
    unregisterTheme(themeId: string): void;
    getTheme(themeId: string): CustomTheme | undefined;
    getAllThemes(): (TileTheme | CustomTheme)[];
    activateTheme(themeId: string): void;
    exportTheme(themeId: string): string;
    importTheme(themeData: string): void;
}
```

### Theme Registration Implementation

```typescript
const useThemeRegistry = (): ThemeRegistry => {
    const [customThemes, setCustomThemes] = useState<CustomTheme[]>([]);
    
    const registerTheme = (theme: CustomTheme) => {
        setCustomThemes(prev => [...prev, theme]);
        localStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify([...customThemes, theme]));
    };
    
    const unregisterTheme = (themeId: string) => {
        const updated = customThemes.filter(t => t.id !== themeId);
        setCustomThemes(updated);
        localStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(updated));
    };
    
    const getTheme = (themeId: string): CustomTheme | undefined => {
        return customThemes.find(t => t.id === themeId);
    };
    
    const getAllThemes = (): (TileTheme | CustomTheme)[] => {
        const builtInThemes: TileTheme[] = ['classic', 'vibrant', 'pastel', 'sketchy'];
        return [...builtInThemes, ...customThemes];
    };
    
    const activateTheme = (themeId: string) => {
        saveSettings({
            ...appSettings,
            mapRender: {
                ...appSettings.mapRender,
                theme: themeId as TileTheme
            }
        });
    };
    
    const exportTheme = (themeId: string): string => {
        const theme = getTheme(themeId);
        if (!theme) throw new Error('Theme not found');
        return JSON.stringify(theme, null, 2);
    };
    
    const importTheme = (themeData: string) => {
        try {
            const theme: CustomTheme = JSON.parse(themeData);
            // Validate theme structure
            if (!theme.id || !theme.name || !theme.assetPath) {
                throw new Error('Invalid theme structure');
            }
            registerTheme(theme);
        } catch (err) {
            console.error('Failed to import theme:', err);
            throw err;
        }
    };
    
    return {
        registerTheme,
        unregisterTheme,
        getTheme,
        getAllThemes,
        activateTheme,
        exportTheme,
        importTheme
    };
};
```

### Custom Theme Editor

```typescript
interface ThemeEditorProps {
    theme: CustomTheme;
    onSave: (theme: CustomTheme) => void;
    onCancel: () => void;
}

const ThemeEditor = ({ theme, onSave, onCancel }: ThemeEditorProps) => (
    <div class="theme-editor">
        <h2>Edit Theme: {theme.name}</h2>
        
        {/* Theme Metadata */}
        <section>
            <label>Theme Name</label>
            <input type="text" value={theme.name} onChange={...} />
            
            <label>Description</label>
            <textarea value={theme.description} onChange={...} />
            
            <label>Author</label>
            <input type="text" value={theme.author} onChange={...} />
        </section>
        
        {/* Asset Path */}
        <section>
            <label>Sprite Sheet Path</label>
            <input type="text" value={theme.assetPath} onChange={...} />
            
            <label>Preview Image</label>
            <input type="text" value={theme.previewImage} onChange={...} />
        </section>
        
        {/* Color Palette */}
        <section>
            <h3>Color Palette</h3>
            {Object.entries(theme.colorPalette).map(([key, value]) => (
                <div key={key}>
                    <label>{key}</label>
                    <input type="color" value={value} onChange={...} />
                </div>
            ))}
        </section>
        
        {/* Biome Colors */}
        <section>
            <h3>Biome Colors</h3>
            {Object.entries(theme.biomeColors).map(([biome, color]) => (
                <div key={biome}>
                    <label>{biome}</label>
                    <input type="color" value={color} onChange={...} />
                </div>
            ))}
        </section>
        
        {/* Actions */}
        <div class="theme-editor-actions">
            <Button onClick={onCancel}>Cancel</Button>
            <Button onClick={() => onSave(theme)}>Save Theme</Button>
        </div>
    </div>
);
```

### Theme Sharing

```typescript
interface ThemeSharingProps {
    theme: CustomTheme;
    onShare: (method: 'link' | 'file' | 'clipboard') => void;
}

const ThemeSharing = ({ theme, onShare }: ThemeSharingProps) => (
    <div class="theme-sharing">
        <h3>Share Theme</h3>
        
        <Button onClick={() => onShare('link')}>
            <ShareIcon />
            Generate Share Link
        </Button>
        
        <Button onClick={() => onShare('file')}>
            <DownloadIcon />
            Download Theme File
        </Button>
        
        <Button onClick={() => onShare('clipboard')}>
            <CopyIcon />
            Copy to Clipboard
        </Button>
    </div>
);
```

### Custom Theme Validation

```typescript
const validateCustomTheme = (theme: any): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!theme.id || typeof theme.id !== 'string') {
        errors.push('Theme ID is required and must be a string');
    }
    
    if (!theme.name || typeof theme.name !== 'string') {
        errors.push('Theme name is required and must be a string');
    }
    
    if (!theme.assetPath || typeof theme.assetPath !== 'string') {
        errors.push('Asset path is required and must be a string');
    }
    
    if (!theme.colorPalette || typeof theme.colorPalette !== 'object') {
        errors.push('Color palette is required');
    } else {
        const requiredColors = ['primary', 'secondary', 'accent', 'background', 'text'];
        requiredColors.forEach(color => {
            if (!theme.colorPalette[color]) {
                errors.push(`Missing required color: ${color}`);
            }
        });
    }
    
    if (!theme.biomeColors || typeof theme.biomeColors !== 'object') {
        errors.push('Biome colors are required');
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
};
```

### Theme Persistence

```typescript
// Load custom themes on mount
useEffect(() => {
    const stored = localStorage.getItem(CUSTOM_THEMES_KEY);
    if (stored) {
        try {
            const themes: CustomTheme[] = JSON.parse(stored);
            setCustomThemes(themes);
        } catch (err) {
            console.error('Failed to load custom themes:', err);
        }
    }
}, []);

// Save custom themes when they change
useEffect(() => {
    localStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(customThemes));
}, [customThemes]);
```

### Theme Selection Dropdown

```typescript
const ThemeSelector = () => {
    const { getAllThemes, activateTheme } = useThemeRegistry();
    const allThemes = getAllThemes();
    const currentTheme = appSettings.mapRender?.theme || 'classic';
    
    return (
        <select
            value={currentTheme}
            onChange={(e) => activateTheme(e.target.value)}
            aria-label="Select map theme"
        >
            <optgroup label="Built-in Themes">
                {['classic', 'vibrant', 'pastel', 'sketchy'].map(theme => (
                    <option key={theme} value={theme}>
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </option>
                ))}
            </optgroup>
            <optgroup label="Custom Themes">
                {customThemes.map(theme => (
                    <option key={theme.id} value={theme.id}>
                        {theme.name}
                    </option>
                ))}
            </optgroup>
        </select>
    );
};

## Related Documents

- [INDEX.md](./INDEX.md:1) - Documentation index and cross-reference matrix
- [app_layout_spec.md](./app_layout_spec.md:1) - Parent layout component that uses MapStyleToggle
- [world_creation_wizard_spec.md](./world_creation_wizard_spec.md:1) - World creation wizard that also handles theme selection
- [wireframes/main_map_interface_wireframe.md](./wireframes/main_map_interface_wireframe.md:1) - Wireframe mockup for main map interface
```
