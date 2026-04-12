
# SPEC-007-02: Screen - The Cosmic Void (Landing)

**Route:** `/` (if no active game state in memory)
**Theme:** "Primordial Potential". Dark, deep, breathing.

## 1. Visual Specification

### 1.1 Background
*   **Color:** `#050505` (Near Black).
*   **Pattern:** A massive, slowly rotating CSS-only Hex Grid in the background.
    *   *Opacity:* 3-5% (Barely visible).
    *   *Animation:* `rotate(360deg)` over 120 seconds. Infinite linear loop.
    *   *Perspective:* `perspective(1000px) rotateX(20deg)` to give depth.

### 1.2 Typography (Hero)
*   **Font:** `Space Grotesk`.
*   **Weight:** 900 (Black).
*   **Kerning:** `tracking-tighter`.
*   **Scale:** 7xl (Mobile) to 9xl (Desktop).
*   **Effect:** A CSS gradient text fill moving from White -> Transparent -> Primary Color.
    *   *Layering:* Duplicate the text layer with a `blur-xl` filter behind it to create a "glow" effect.

## 2. Interaction Design

### 2.1 Primary Menu
A central column of actions.

1.  **[ FORGE NEW WORLD ]**
    *   *Style:* Transparent background, thin white border.
    *   *Hover:* Fills with `primary/10`, border glows.
    *   *Action:* Transitions App State to `WIZARD`.
    *   *Sound:* Heavy mechanical "thud" on click.

2.  **[ RESUME ODYSSEY ]**
    *   *State:* Disabled if no `localStorage` key found.
    *   *Style:* If active, subtle green border glow.
    *   *Content:* "Resume: {WorldName}" (e.g., "Resume: Aethelgard").
    *   *Action:* Loads state, Transitions App State to `GAME`.

3.  **[ SYSTEM ARCHIVES ]**
    *   *Status:* Disabled/Ghosted (Scope: Future).
    *   *Tooltip:* "Access to previous world logs coming in v1.0".

### 2.2 Footer Status
*   **Location:** Bottom center.
*   **Content:**
    *   System Version (e.g., "v0.5.1").
    *   Storage Status Indicator.
        *   *Green Dot:* LocalStorage available.
        *   *Red Dot:* LocalStorage quota exceeded / disabled.

## 3. Animation Sequences

### 3.1 Mount Sequence (0ms - 1000ms)
1.  **Background** fades in (Opacity 0 -> 1).
2.  **Hero Text** slides up 20px and fades in.
3.  **Menu Buttons** stagger in (100ms delay between each).

### 3.2 Exit Sequence
When "Forge New World" is clicked:
1.  Hero Text scales up (Zoom effect) and fades out.
2.  Menu slides down and fades out.
3.  Background remains to transition seamlessly into the Wizard background.
