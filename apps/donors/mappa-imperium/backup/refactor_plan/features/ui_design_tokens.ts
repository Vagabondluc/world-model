// src/design/tokens.ts - Modern design token system
export const designTokens = {
  // Color System - Enhanced for collaboration
  colors: {
    primary: {
      50: '#fefce8',   // amber-50
      100: '#fef3c7',  // amber-100  
      500: '#f59e0b',  // amber-500
      700: '#b45309',  // amber-700 (current primary)
      900: '#78350f',  // amber-900
    },
    players: {
      1: { primary: '#dc2626', light: '#fecaca', dark: '#991b1b' }, // red
      2: { primary: '#2563eb', light: '#bfdbfe', dark: '#1e40af' }, // blue  
      3: { primary: '#16a34a', light: '#bbf7d0', dark: '#15803d' }, // green
      4: { primary: '#ca8a04', light: '#fde68a', dark: '#a16207' }, // yellow
      5: { primary: '#c026d3', light: '#f3e8ff', dark: '#a21caf' }, // magenta
      6: { primary: '#0891b2', light: '#bae6fd', dark: '#0e7490' }, // cyan
      7: { primary: '#ea580c', light: '#fed7aa', dark: '#c2410c' }, // orange
      8: { primary: '#7c3aed', light: '#ddd6fe', dark: '#5b21b6' }, // purple
    },
    semantic: {
      success: '#16a34a',
      warning: '#f59e0b', 
      error: '#dc2626',
      info: '#2563eb',
      neutral: '#6b7280',
    },
    ui: {
      background: '#f9fafb',     // gray-50
      surface: '#ffffff',        // white
      border: '#e5e7eb',         // gray-200
      text: {
        primary: '#111827',      // gray-900
        secondary: '#6b7280',    // gray-500
        muted: '#9ca3af',        // gray-400
      }
    }
  },

  // Spacing System - 8px grid
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px  
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
  },

  // Typography Scale
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      serif: ['Crimson Text', 'Georgia', 'serif'], // For flavor text
      mono: ['JetBrains Mono', 'Monaco', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    }
  },

  // Shadows & Effects
  effects: {
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    },
    transitions: {
      fast: '150ms ease-out',
      medium: '300ms ease-in-out', 
      slow: '500ms ease-in-out',
    }
  },

  // Breakpoints for responsive design
  breakpoints: {
    sm: '640px',
    md: '768px', 
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Component-specific tokens
  components: {
    button: {
      height: {
        sm: '2rem',   // 32px
        md: '2.5rem', // 40px  
        lg: '3rem',   // 48px
      },
      radius: '0.5rem', // 8px
    },
    card: {
      radius: '0.75rem',  // 12px
      padding: '1.5rem',  // 24px
    },
    input: {
      height: '2.5rem',   // 40px
      radius: '0.375rem', // 6px
    }
  }
};

// Component style variants using tokens
export const componentVariants = {
  button: {
    primary: {
      background: designTokens.colors.primary[700],
      color: 'white',
      hover: designTokens.colors.primary[900],
    },
    secondary: {
      background: designTokens.colors.ui.surface,
      color: designTokens.colors.ui.text.primary,
      border: designTokens.colors.ui.border,
      hover: designTokens.colors.ui.background,
    },
    player: (playerId: number) => ({
      background: designTokens.colors.players[playerId]?.primary || designTokens.colors.primary[700],
      color: 'white',
      hover: designTokens.colors.players[playerId]?.dark || designTokens.colors.primary[900],
    })
  },
  
  card: {
    default: {
      background: designTokens.colors.ui.surface,
      border: designTokens.colors.ui.border,
      shadow: designTokens.effects.shadows.md,
    },
    interactive: {
      background: designTokens.colors.ui.surface,
      border: designTokens.colors.ui.border,
      shadow: designTokens.effects.shadows.md,
      hover: {
        shadow: designTokens.effects.shadows.lg,
        transform: 'translateY(-2px)',
      }
    },
    player: (playerId: number) => ({
      background: designTokens.colors.ui.surface,
      borderLeft: `4px solid ${designTokens.colors.players[playerId]?.primary}`,
      shadow: designTokens.effects.shadows.md,
    })
  }
};

export default designTokens;