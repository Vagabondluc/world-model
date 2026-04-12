export type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  task: string;
  target: string;
};

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "seed",
    title: "Start Here: Seed",
    description: "Seed is the recipe number for icon randomness. Same seed = same results.",
    task: "Click the dice once, then click Generate Icon.",
    target: '[data-onboard="seed"]',
  },
  {
    id: "domain",
    title: "Domain",
    description: "Domain sets the icon vibe and default colors.",
    task: "Open Domain and pick one option (for example: Arcane or Nature).",
    target: '[data-onboard="domain"]',
  },
  {
    id: "complexity",
    title: "Complexity",
    description: "Complexity controls how simple or detailed the icon looks.",
    task: "Move the slider once and watch the selected preview update.",
    target: '[data-onboard="complexity"]',
  },
  {
    id: "symmetry",
    title: "Symmetry",
    description: "Symmetry controls mirror and rotational structure.",
    task: "Pick a different symmetry family once (Mirror, Rotation, or Radial).",
    target: '[data-onboard="symmetry"]',
  },
  {
    id: "symbol-setup",
    title: "Symbol Setup",
    description: "Main Symbol and Background Shape control core emblem identity.",
    task: "Try one Main Symbol and one Background Shape.",
    target: '[data-onboard="symbol-setup"]',
  },
  {
    id: "style-sliders",
    title: "Style Sliders",
    description: "Layer Count and Stroke Width adjust structural density.",
    task: "Adjust both sliders once.",
    target: '[data-onboard="style-sliders"]',
  },
  {
    id: "preset",
    title: "Color Presets",
    description: "Presets are ready-made color groups.",
    task: "Pick a preset, then toggle Apply Preset To All to compare behavior.",
    target: '[data-onboard="color-preset"]',
  },
  {
    id: "channels",
    title: "Manual Colors",
    description: "These are direct color pickers for each channel.",
    task: "Change Accent color to see immediate preview feedback.",
    target: '[data-onboard="color-channels"]',
  },
  {
    id: "size-text",
    title: "Size And Text",
    description: "Control icon output size and optional text mark.",
    task: "Change size once and toggle Include Text.",
    target: '[data-onboard="size-text"]',
  },
  {
    id: "generate",
    title: "Generate Actions",
    description: "Generate creates a new seed. Regenerate Same re-runs current seed. Lock keeps seed on Generate.",
    task: "Click Generate Icon once now. This creates variants for the next steps.",
    target: '[data-onboard="generate-actions"]',
  },
  {
    id: "variants",
    title: "Variant Grid",
    description: "Each tile is a generated option.",
    task: "Click a different variant tile to make it the active preview.",
    target: '[data-onboard="variant-grid"]',
  },
  {
    id: "layers-sidebar",
    title: "Layers Sidebar",
    description: "This is the canonical layer state owner.",
    task: "Select one layer row to activate layer editing.",
    target: '[data-onboard="layers-sidebar"]',
  },
  {
    id: "layer-list",
    title: "Layer List",
    description: "Rows support selection, lock/visibility, rename, and reordering.",
    task: "Try selecting or dragging one row.",
    target: '[data-onboard="layer-list"]',
  },
  {
    id: "layer-properties",
    title: "Layer Properties",
    description: "Edit selected layer name, visibility, opacity, blend, and per-layer settings.",
    task: "Change one property and confirm live preview update.",
    target: '[data-onboard="layer-properties"]',
  },
  {
    id: "layer-transform",
    title: "Transform",
    description: "Rotate, scale, move, and set transform origin for the selected non-group layer.",
    task: "Adjust X or Rotation once.",
    target: '[data-onboard="layer-transform"]',
  },
  {
    id: "batch-ops",
    title: "Batch Operations",
    description: "Batch tools are selection-aware and become fully active with multi-select.",
    task: "Select multiple layers then try one batch action.",
    target: '[data-onboard="batch-ops"]',
  },
  {
    id: "templates",
    title: "Templates",
    description: "Quickly apply preset layer stacks.",
    task: "Try one template button.",
    target: '[data-onboard="templates"]',
  },
  {
    id: "settings-gear",
    title: "Settings Shortcut",
    description: "Open developer/debug settings from the gear or Shift+D.",
    task: "Open settings with the gear button.",
    target: '[data-onboard="settings-gear"]',
  },
  {
    id: "settings-modal",
    title: "Settings Modal",
    description: "Toggle debug hooks and reset defaults from one place.",
    task: "Toggle one setting and close the modal.",
    target: '[data-onboard="settings-modal"]',
  },
  {
    id: "composition",
    title: "Composition",
    description: "Composition adds rings, halo, dust, and filter effects.",
    task: "Toggle Halo Wash on, then adjust Filter Intensity.",
    target: '[data-onboard="composition"]',
  },
  {
    id: "touches",
    title: "Final Touches",
    description: "Final Touches adds reversible overlay symbols.",
    task: "Pick an overlay symbol, click Add Overlay, then try Undo.",
    target: '[data-onboard="final-touches"]',
  },
  {
    id: "export",
    title: "Export",
    description: "Export saves the currently selected variant.",
    task: "Open Export menu and run one export action to finish the flow.",
    target: '[data-onboard="export-actions"]',
  },
];
