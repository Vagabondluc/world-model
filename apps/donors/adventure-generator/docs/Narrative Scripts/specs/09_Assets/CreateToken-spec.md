# Specification: Battlemap Token Generator (CreateToken)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Battlemap Token Generator creates 2D VTT assets. It enforces "Top-down aerial view" perspective and transparent backgrounds.

## 2. Component Architecture
### 2.1 Core Panels
- **Subject Studio**:
    - Text Description (Visuals).
- **Style Controller**:
    - View (Top-Down), Style (2D Game Art / Fantasy).
- **Synthesis Engine**:
    - Real-time prompt preview (visible text injection).
- **Asset Hub**:
    - Image Result, Background Remover tool.

## 3. Interaction Logic
- **Perspective Hard-Coding**:
    - Prepends "Illustration of a top-down aerial view..." to every prompt.
- **Preset Switching**:
    - "Token Style v1" vs "v2" alters secondary style keywords.
- **Background Removal**:
    - Post-processing step to alpha-mask the image.

## 4. Visual Design
- **Aesthetic**: Asset-Centric / VTT Grid background.
- **Layout**: Image dominant.

## 5. Data Model
```typescript
interface TokenGen {
  description: string;
  style: 'Fantasy' | 'Sci-Fi';
  perspective: 'Top-Down' | 'Isometric';
  finalPrompt: string;
  imageStatus: 'Idle' | 'Generating' | 'Complete';
}
```
