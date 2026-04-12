/**
 * UI Semantic Tokens
 * Central design system variables for colors, spacing, and motion.
 * Based on SPEC-009 and UI_POLISH.md
 */

export const ui = {
  color: {
    bg: {
      base: "bg-slate-950",
      panel: "bg-slate-900",
      raised: "bg-slate-800",
      input: "bg-[#261933]",
    },
    text: {
      primary: "text-slate-100",
      secondary: "text-slate-400",
      muted: "text-[#ad92c9]",
      dim: "text-[#6b5a80]",
    },
    accent: {
      focus: "ring-[#7f13ec]",
      action: "text-[#7f13ec]",
      confirm: "text-emerald-400",
      danger: "text-red-400",
      warn: "text-amber-400",
    },
    state: {
      disabled: "opacity-40",
      selected: "bg-[#7f13ec]/40",
      hover: "hover:bg-slate-800",
    },
  },

  radius: {
    panel: "rounded-xl",
    button: "rounded-lg",
    chip: "rounded-full",
    hex: "clip-hex", // reference to custom css clip-path
  },

  spacing: {
    panel: "p-3",
    section: "space-y-2",
    item: "px-3 py-2",
  },

  motion: {
    fast: "duration-100",
    normal: "duration-200",
    slow: "duration-300",
    ease: "ease-out",
  },
};
