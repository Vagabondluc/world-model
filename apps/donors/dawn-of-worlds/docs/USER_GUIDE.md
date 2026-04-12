# Dawn of Worlds: World Builder - User Guide

Welcome to the **Dawn of Worlds: World Builder**, a collaborative world-building engine based on the classic tabletop RPG system. This tool allows you to shape a world from its primordial beginnings to a civilized age of nations and conflict.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Interface Overview](#interface-overview)
3. [Playing the Game](#playing-the-game)
4. [The Three Ages](#the-three-ages)
5. [Saving & Exporting](#saving--exporting)

---

## Getting Started

### Launching the Application
Since this is a browser-based tool, you can simply open the `index.html` file in a modern web browser (Chrome, Firefox, Edge). 

*Note: For the best experience, running a local static server is recommended (see `GETTING_STARTED.md` for technical details), but the game is fully functional directly in the browser.*

### Creating a New World
1. On the landing page, click **"Start New Game"**.
2. You will be assigned the role of **The Architect**.
3. A new procedural world will be generated for you to shape.

---

## Interface Overview

### 1. The World Map (Center)
The main view is the hexagonal world map.
- **Navigation**: Click and drag to pan. Scroll to zoom.
- **Selection**: Click on any hex to select it. The **Hex Inspector** (top right) will show details about terrain, races, and active effects.

### 2. Action Palette (Left)
This panel lists all available **Powers** you can use to shape the world.
- **Power Cost**: Each action costs Power Points (PP).
- **Categories**: Powers are grouped by type (Terrain, Life, Civilization, etc.).
- **Availability**: Some powers only unlock in later Ages.

### 3. Council Dashboard (Bottom Left)
Click the "Council" button to open your dashboard.
- **World Vitals**: Track global stats like Total Population, Civilization Level, and Magic Saturation.
- **Architect Ledger**: A log of your actions and remaining Power.
- **Divine Laws**: Active global effects or restrictions.

### 4. Timeline (Bottom)
The **Timeline** tracks the history of your world.
- **Eras**: Shows progression through the Ages.
- **Events**: Hover over ticks to see what happened (e.g., "Elves founded the city of Silvermoon").
- **Filter**: Click "Filter" to view specific event types (Wars, Natural Disasters, etc.).

### 5. Turn Controls (Top Right)
- **Power Display**: Shows your current Power Points.
- **End Turn**: Commits your actions and advances the timeline.

---

## Playing the Game

The game is played in **Turns**. In each turn, you:

### 1. Gather Power
At the start of your turn, you roll 2d6 to determine your **Power Points (PP)** for the turn. 
*   *Tip: Unused Power is saved for future turns!*

### 2. Shape the World
Select an action from the **Action Palette**, then click on the map to target it.
- **Shape Land**: Raise mountains, carve rivers, or create forests.
- **Create Life**: Place races like Elves, Dwarves, or Humans.
- **Form Civilizations**: Command races to build cities (requires an Avatar).
- **Commands**: Order armies to march, corrupt lands, or purify corruption.

### 3. The Chronicler
Everything you do is recorded. The **Chronicler** system automatically writes the history of your world based on your actions. You can view this history in the **Timeline** or export it later.

---

## The Three Ages

The game progresses through three distinct eras, each unlocking new powers:

### Age I: The Age of Creation
*Focus: Geography & Primal Life*
- **Goal**: Shape the continents and climate. Create the first beasts and monsters.
- **Key Powers**: `Shape Land`, `Create Avatar`, `Create Race` (Monstrous).
- **Restrictions**: Civilizations and cities cannot be built yet.

### Age II: The Age of Expansion
*Focus: Civilization & Settlements*
- **Goal**: Establish the first nations. Races begin to settle and claim land.
- **Key Powers**: `Create City`, `Command Race`, `Advance Civilization`.
- **New Feature**: "Golden Ages" and technological discoveries begin.

### Age III: The Age of Conflict
*Focus: War, Politics & Destiny*
- **Goal**: Nations vie for dominance. Wars, alliances, and catastrophes shape the final map.
- **Key Powers**: `Command Army`, `Corrupt`, `Purify`, `Catastrophe`.
- **Endgame**: The game ends when the world reaches a stable state or a specific turn limit.

---

## Saving & Exporting

### Export Gameplay
You can save your current session at any time:
1. Open the **Council Dashboard**.
2. Click **"Export World State"**.
3. This downloads a `.json` file containing the entire history and map state.

### Export Chronicles
Want a text version of your world's history?
1. Open the **Timeline** view.
2. Click **"Export History"**.
3. This generates a readable Markdown/Text file of all events, perfect for use as a campaign setting for D&D or Pathfinder.
