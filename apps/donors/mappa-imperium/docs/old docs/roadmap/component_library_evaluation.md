
# Refined Headless Component Library Migration Plan

## Current State Assessment ✅

**Strengths of Your Current Architecture:**
- ✅ **Deployment Stable**: No more 404 errors, everything works reliably
- ✅ **Component Classes Centralized**: All styles live in `index.html` with semantic classes
- ✅ **Clean TSX Components**: Components use semantic classes like `btn btn-primary` instead of utility strings
- ✅ **Modular Structure**: Components are already well-organized in logical folders
- ✅ **Type Safety**: Strong TypeScript foundation with comprehensive interfaces

**Current Pain Points to Address:**
- 🔄 **Styling Still Coupled**: Components hardcode className combinations
- 🔄 **Theme Flexibility**: Changing visual theme requires editing `index.html`
- 🔄 **Portability**: Can't easily extract/share components across projects
- 🔄 **Scalability**: Adding new variants requires CSS class proliferation

---

## Strategic Migration Approach

### Phase 1: Foundation Setup (Week 1)
**Goal**: Create the headless infrastructure without disrupting current functionality

#### 1.1 Create Theme System
```typescript
// src/theme/types.ts
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
  };
  spacing: {
    xs: string; sm: string; md: string; lg: string; xl: string;
  };
  radii: {
    sm: string; md: string; lg: string;
  };
  shadows: {
    sm: string; md: string; lg: string; xl: string;
  };
}

// src/theme/defaultTheme.ts
export const mappaTheme: Theme = {
  colors: {
    primary: '#92400e', // amber-700
    secondary: '#6b7280', // gray-500
    success: '#059669', // emerald-600
    warning: '#d97706', // amber-600
    error: '#dc2626', // red-600
  },
  // ... extracted from your current CSS classes
};
```

#### 1.2 Create Theme Provider
```typescript
// src/theme/ThemeProvider.tsx
import React, { createContext, useContext } from 'react';
import { Theme, mappaTheme } from './defaultTheme';

const ThemeContext = createContext<{ theme: Theme }>({ theme: mappaTheme });

export const ThemeProvider = ({ 
  children, 
  theme = mappaTheme 
}: { 
  children: React.ReactNode; 
  theme?: Theme;
}) => (
  <ThemeContext.Provider value={{ theme }}>
    {children}
  </ThemeContext.Provider>
);

export const useTheme = () => useContext(ThemeContext);
```

#### 1.3 Create CSS-in-JS Utility
```typescript
// src/theme/createStyles.ts
import { Theme } from './types';

export const createStyles = (theme: Theme) => ({
  button: {
    base: {
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      borderRadius: theme.radii.md,
      fontWeight: '600',
      transition: 'all 0.2s ease-in-out',
      cursor: 'pointer',
      border: 'none',
    },
    variants: {
      primary: {
        backgroundColor: theme.colors.primary,
        color: 'white',
      },
      secondary: {
        backgroundColor: theme.colors.secondary,
        color: 'white',
      },
    },
  },
  // ... other component styles
});
```

### Phase 2: Pilot Components (Week 2)
**Goal**: Prove the architecture with 2-3 simple components

#### 2.1 Create Headless Button Hook
```typescript
// src/hooks/useButton.ts
import { useMemo } from 'react';

export interface UseButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  isDisabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
}

export const useButton = (props: UseButtonProps) => {
  const {
    variant = 'primary',
    size = 'md',
    isDisabled = false,
    isLoading = false,
    onClick,
  } = props;

  const buttonProps = useMemo(() => ({
    onClick: isDisabled || isLoading ? undefined : onClick,
    disabled: isDisabled || isLoading,
    'aria-disabled': isDisabled || isLoading,
    'data-variant': variant,
    'data-size': size,
  }), [variant, size, isDisabled, isLoading, onClick]);

  return {
    buttonProps,
    state: {
      variant,
      size,
      isDisabled,
      isLoading,
    },
  };
};
```

#### 2.2 Create Themed Button Component
```typescript
// src/components/ui/Button.tsx
import React from 'react';
import { useButton, UseButtonProps } from '../../hooks/useButton';
import { useTheme } from '../../theme/ThemeProvider';
import { createStyles } from '../../theme/createStyles';

interface ButtonProps extends UseButtonProps {
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '',
  ...props 
}) => {
  const { buttonProps, state } = useButton(props);
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const buttonStyle = {
    ...styles.button.base,
    ...styles.button.variants[state.variant],
    opacity: state.isDisabled ? 0.6 : 1,
  };

  return (
    <button
      {...buttonProps}
      style={buttonStyle}
      className={className}
    >
      {state.isLoading ? 'Loading...' : children}
    </button>
  );
};
```

#### 2.3 Gradual Replacement Strategy
```typescript
// Migration example: EraButton.tsx
// OLD (current):
<button className="btn-era btn-era-completed">Era I</button>

// NEW (headless):
<Button variant="primary" size="md">Era I</Button>
```

### Phase 2.5: Refactoring Analysis & Candidate Identification
**Goal**: To identify specific, high-value components in the existing codebase that are prime candidates for refactoring into the new headless/themed architecture. This provides a concrete backlog for the migration effort.

#### **Category 1: UI Primitives (Core Building Blocks)**

*   **Candidate**: Buttons (`.btn-*` classes)
    *   **Location**: Used throughout the app (`GameSetup`, `NavigationHeader`, etc.).
    *   **Analysis**: The migration plan already correctly identifies this as the top priority. The goal is to replace all `<button className="btn btn-primary">` instances with `<Button variant="primary">`.
*   **Candidate**: Form Inputs (`ValidatedInput`, `ValidatedTextarea`, `RichTextEditor`, `UUIDPicker`)
    *   **Location**: `src/components/shared/forms/` and used in all `era-interfaces`.
    *   **Analysis**: These are already well-encapsulated. The task is to refactor them to use the `useTheme` hook for styling (border colors, focus rings, etc.) instead of hardcoded CSS classes. They will form the basis of the new `ui/` directory.
*   **Candidate**: Modals (`EditElementModal`, `ConfirmationModal`, `SettingsModal`)
    *   **Location**: `src/components/shared/`
    *   **Analysis**: The modal "chrome" (overlay, content container, header, footer) is repeated. This can be extracted into a reusable, headless `<Modal>` component that accepts `children` and manages the open/close state. A `useModal` hook could be created to encapsulate the logic.
*   **Candidate**: Dropdowns (Player Status, Export Menu, Element Actions)
    *   **Location**: `NavigationHeader.tsx`, `ElementCardDisplay.tsx`
    *   **Analysis**: The logic for toggling visibility, positioning, and closing on outside click (`useOnClickOutside`) is a repeated pattern. This can be abstracted into a `useDropdown` hook and a set of composable components like `<DropdownMenu>`, `<DropdownMenu.Trigger>`, and `<DropdownMenu.Item>`.

#### **Category 2: Composite Components (Card System)**

*   **Candidate**: Element Cards (`ResourceCard`, `DeityCard`, `FactionCard`, `ElementCardDisplay`)
    *   **Location**: `src/components/era-interfaces/` and `src/components/world-manager/`
    *   **Analysis**: These components share a significant amount of layout and structural code (container, icon, title, menu). This is a prime candidate for composition.
    *   **Proposed Refactor**: Create a generic `<Card>` component with sub-components: `<Card.Root>`, `<Card.Header>`, `<Card.Icon>`, `<Card.Title>`, `<Card.Menu>`, `<Card.Body>`. The specific card components (`ResourceCard`, etc.) would then be refactored to compose these primitives, passing in only the unique content for their type.

#### **Category 3: Complex Views & Layouts**

*   **Candidate**: `ElementManager.tsx`
    *   **Location**: `src/components/world-manager/`
    *   **Analysis**: This is a high-level "page" component that orchestrates many smaller parts. The `.filter-bar` and `.toggle-group` are reusable layout patterns within it.
    *   **Proposed Refactor**: Extract the filter bar into a `<FilterBar>` component and the view mode toggle into a `<ToggleGroup>` component. These would then become part of the new `ui/` library.
*   **Candidate**: `EraLayoutContainer.tsx`
    *   **Location**: `src/components/era-interfaces/common/`
    *   **Analysis**: This component is already a great example of a layout abstraction. The refactoring effort here would be to ensure its internal elements (like the tabs and `StepProgressBar`) are themselves built from the new primitive components (`<Tab>`, `<ProgressBar>`).

### Phase 3: Component Inventory & Migration (Week 3-4)
**Goal**: Systematically migrate existing components

#### 3.1 Migration Priority Order
1. **Buttons** (EraButton, NavigationHeader buttons) - Simple, high-impact
2. **Cards** (Element cards, info cards) - Medium complexity
3. **Modals** (ConfirmationModal, EditElementModal) - Medium complexity
4. **Forms** (Input components, selects) - High complexity
5. **Layout** (Containers, grids) - High complexity, low urgency

#### 3.2 Backward Compatibility Bridge
```typescript
// src/components/legacy/LegacyButton.tsx
// Temporary wrapper to maintain current className API
export const LegacyButton = ({ className, ...props }) => {
  // Map old classNames to new variants
  const variant = className.includes('btn-primary') ? 'primary' : 'secondary';
  return <Button variant={variant} {...props} />;
};
```

### Phase 4: Advanced Features (Week 5-6)
**Goal**: Leverage the new architecture for enhanced capabilities

#### 4.1 Theme Switching
```typescript
// src/hooks/useThemeToggle.ts
export const useThemeToggle = () => {
  const [currentTheme, setCurrentTheme] = useState('mappa');
  
  const themes = {
    mappa: mappaTheme,
    dark: darkMappaTheme,
    light: lightMappaTheme,
  };
  
  return {
    theme: themes[currentTheme],
    switchTheme: setCurrentTheme,
    availableThemes: Object.keys(themes),
  };
};
```

#### 4.2 Component Variants System
```typescript
// Easy addition of new button variants without CSS changes
const extendedTheme = {
  ...mappaTheme,
  colors: {
    ...mappaTheme.colors,
    era1: '#8b4513', // Custom era colors
    era2: '#2563eb',
    era3: '#059669',
  },
};
```

#### 4.3 Export Component Library
```typescript
// src/index.ts - Future npm package entry point
export { Button } from './components/ui/Button';
export { Modal } from './components/ui/Modal';
export { Card } from './components/ui/Card';
export { ThemeProvider, useTheme } from './theme/ThemeProvider';
export { mappaTheme } from './theme/defaultTheme';
export type { Theme } from './theme/types';
```

---

## Implementation Guidelines

### Parallel Development Strategy
- **Keep Current System Running**: Don't break existing functionality
- **Side-by-Side Development**: Build new components alongside old ones
- **Gradual Cutover**: Replace components one-by-one after testing
- **Rollback Plan**: Keep old components until migration is 100% complete

### Quality Checkpoints
1. **After Phase 1**: Theme system works, can be toggled
2. **After Phase 2**: 3 pilot components work identically to originals
3. **After Phase 3**: All major components migrated, no visual regressions
4. **After Phase 4**: Advanced features working, ready for library extraction

### Success Metrics
- ✅ **Zero Visual Regressions**: All components look and behave identically
- ✅ **Theme Switching Works**: Can change colors/spacing without code changes
- ✅ **Bundle Size Maintained**: No significant performance degradation
- ✅ **Developer Experience**: Easier to create new component variants
- ✅ **Portability Ready**: Components can be extracted to separate package

---

## Immediate Next Steps

1. **Create `src/theme/` folder** with types and default theme
2. **Wrap App with ThemeProvider** in your main component
3. **Pick 1 simple component** (suggest EraButton) for proof-of-concept
4. **Create the useButton hook** and themed Button component
5. **Replace 1 instance** of EraButton and verify it works identically

This approach builds on your current strengths while incrementally moving toward the headless architecture, ensuring you never break your working deployment.
