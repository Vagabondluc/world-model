
import { injectGlobal } from '@emotion/css';
import { PALETTES, STATIC_VARS, cssVarNames, generateThemeVars, LAYER_PALETTES } from './theme';
import { BIOME_CONFIG } from '../data/biomeData';

const medievalSharpUrl = new URL('../assets/fonts/MedievalSharp-Regular.ttf', import.meta.url).toString();
const loraRegularUrl = new URL('../assets/fonts/Lora-Regular.ttf', import.meta.url).toString();
const loraItalicUrl = new URL('../assets/fonts/Lora-Italic.ttf', import.meta.url).toString();
const notoSansRegularUrl = new URL('../assets/fonts/NotoSans-Regular.ttf', import.meta.url).toString();
const notoSansBoldUrl = new URL('../assets/fonts/NotoSans-Bold.ttf', import.meta.url).toString();
const sortsMillGoudyRegularUrl = new URL('../assets/fonts/SortsMillGoudy-Regular.ttf', import.meta.url).toString();

injectGlobal`
  @font-face {
    font-family: 'MedievalSharp';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url('${medievalSharpUrl}') format('truetype');
  }

  @font-face {
    font-family: 'Lora';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url('${loraRegularUrl}') format('truetype');
  }

  @font-face {
    font-family: 'Lora';
    font-style: italic;
    font-weight: 400;
    font-display: swap;
    src: url('${loraItalicUrl}') format('truetype');
  }

  @font-face {
    font-family: 'Noto Sans';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url('${notoSansRegularUrl}') format('truetype');
  }

  @font-face {
    font-family: 'Noto Sans';
    font-style: normal;
    font-weight: 700;
    font-display: swap;
    src: url('${notoSansBoldUrl}') format('truetype');
  }

  @font-face {
    font-family: 'Sorts Mill Goudy';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url('${sortsMillGoudyRegularUrl}') format('truetype');
  }

  :root {
    /* --- Biome Accents --- */
    ${Object.entries(BIOME_CONFIG).map(([key, config]) => `--biome-${key}: ${config.color};`).join('\n    ')}

    /* --- Dynamic Theme Variables (Default) --- */
    ${generateThemeVars(PALETTES.default)}

    /* --- Static Variables --- */
    ${cssVarNames.colors.entityDungeon}: ${STATIC_VARS.entityColors.dungeon};
    ${cssVarNames.colors.entityBattlemap}: ${STATIC_VARS.entityColors.battlemap};
    ${cssVarNames.colors.entitySettlement}: ${STATIC_VARS.entityColors.settlement};
    ${cssVarNames.colors.entitySpecial}: ${STATIC_VARS.entityColors.special};
    ${cssVarNames.colors.npcMinor}: ${STATIC_VARS.entityColors.npcMinor};
    ${cssVarNames.colors.npcMajor}: ${STATIC_VARS.entityColors.npcMajor};
    ${cssVarNames.colors.npcAntagonist}: ${STATIC_VARS.entityColors.npcAntagonist};
    ${cssVarNames.colors.npcCreature}: ${STATIC_VARS.entityColors.npcCreature};

    /* Faction Colors */
    --faction-government-authority: ${STATIC_VARS.factions.government};
    --faction-religious-organizations: ${STATIC_VARS.factions.religious};
    --faction-criminal-enterprises: ${STATIC_VARS.factions.criminal};
    --faction-economic-trade: ${STATIC_VARS.factions.economic};
    --faction-arcane-scholarly: ${STATIC_VARS.factions.arcane};
    --faction-adventuring-mercenary: ${STATIC_VARS.factions.mercenary};
    --faction-racial-cultural: ${STATIC_VARS.factions.racial};
    --faction-ideological-revolutionary: ${STATIC_VARS.factions.revolutionary};
    --faction-secret-shadow: ${STATIC_VARS.factions.shadow};
    --faction-planar-extraplanar: ${STATIC_VARS.factions.planar};
    --faction-environmental-territorial: ${STATIC_VARS.factions.environmental};

    /* Typography */
    ${cssVarNames.fonts.header}: ${STATIC_VARS.fonts.header};
    ${cssVarNames.fonts.body}: ${STATIC_VARS.fonts.body};
    ${cssVarNames.fonts.statTitle}: ${STATIC_VARS.fonts.statTitle};
    ${cssVarNames.fonts.statBody}: ${STATIC_VARS.fonts.statBody};

    /* Spacing */
    ${cssVarNames.spacing.xs}: ${STATIC_VARS.spacing.xs};
    ${cssVarNames.spacing.s}: ${STATIC_VARS.spacing.s};
    ${cssVarNames.spacing.m}: ${STATIC_VARS.spacing.m};
    ${cssVarNames.spacing.l}: ${STATIC_VARS.spacing.l};
    ${cssVarNames.spacing.xl}: ${STATIC_VARS.spacing.xl};
    ${cssVarNames.spacing.xxl}: ${STATIC_VARS.spacing.xxl};
    
    /* Borders */
    ${cssVarNames.borders.radius}: ${STATIC_VARS.radius};
  }

  /* --- Theme Overrides --- */
  body[data-theme='dark'] {
    ${generateThemeVars(PALETTES.dark)}
  }

  body[data-theme='high-contrast'] {
    ${generateThemeVars(PALETTES.highContrast)}
  }

  body[data-layer-type='underdark'] {
    ${generateThemeVars(LAYER_PALETTES.underdark)}
  }

  body[data-layer-type='feywild'] {
    ${generateThemeVars(LAYER_PALETTES.feywild)}
  }

  body[data-layer-type='shadowfell'] {
    ${generateThemeVars(LAYER_PALETTES.shadowfell)}
  }

  body[data-layer-type='elemental'] {
    ${generateThemeVars(LAYER_PALETTES.elemental)}
  }

  @media (prefers-contrast: high) {
      :root {
        ${generateThemeVars(PALETTES.highContrast)}
      }
  }

  /* --- Reset & Base --- */
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body {
      height: 100%;
      margin: 0;
      padding: 0;
  }

  img, video, svg, canvas {
      max-width: 100%;
      height: auto;
      vertical-align: middle;
  }

  body {
    background-color: var(${cssVarNames.colors.background});
    transition: background-color 0.3s;
    overflow-x: hidden; 
  }

  #root {
    width: 100%;
    height: 100%;
    isolation: isolate; 
    background-color: var(${cssVarNames.colors.background});
    transition: background-color 0.3s;
  }

  #root::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: var(${cssVarNames.colors.backgroundImage});
    opacity: 0.3;
    z-index: -1;
    pointer-events: none;
  }

  /* --- App Layout --- */
  #app-container {
    display: grid;
    grid-template-columns: auto 1fr;
    height: 100vh;
    overflow: hidden;
  }

  .app-main {
    min-width: 0; 
    overflow-y: auto;
    padding: var(${cssVarNames.spacing.l});
    display: flex;
    flex-direction: column;
    position: relative; 
  }

  /* --- Responsive Design --- */
  @media (max-width: 900px) {
      html, body {
          height: auto;
          overflow-y: auto; 
      }

      #app-container {
          display: block; 
          height: auto;
          overflow: visible;
      }

      .app-main {
          padding: var(${cssVarNames.spacing.m});
          height: auto;
          overflow-y: visible;
      }
  }

  /* Biome Attribute Mapping */
  ${Object.keys(BIOME_CONFIG).map(biome => `[data-biome='${biome}'] { --biome-accent: var(--biome-${biome}); }`).join('\n  ')}

  /* Layer Theme Attribute Mapping (T-710) */
  [data-theme='surface'] {
    --parchment-bg: #f5e8c3;
    --dnd-red: #922610;
  }

  [data-theme='underdark'] {
    --parchment-bg: #1a1a2e;
    --dnd-red: #9d00ff;
  }

  [data-theme='feywild'] {
    --parchment-bg: #e0f7fa;
    --dnd-red: #e91e63;
  }

  [data-theme='shadowfell'] {
    --parchment-bg: #2c2c2c;
    --dnd-red: #4a148c;
  }

  [data-theme='elemental'] {
    --parchment-bg: #fff3e0;
    --dnd-red: #ff9800;
  }

  /* Stitch UI Polish */
  .layer-transition-active {
    animation: stitch-refresh 0.6s ease-in-out;
  }

  @keyframes stitch-refresh {
    0% { filter: blur(0); opacity: 1; }
    30% { filter: blur(4px); opacity: 0.8; }
    70% { filter: blur(4px); opacity: 0.8; }
    100% { filter: blur(0); opacity: 1; }
  }

  .backdrop-blur {
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    background: rgba(255, 255, 255, 0.05);
  }
`;
