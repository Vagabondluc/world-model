# AI Prompt Specification: 1.4 Resources & Unique Sites

This document outlines the exact prompt structure sent to the AI for generating fantasy resources and unique sites in Era I, step 1.4.

## 1. Base Prompt Construction

The core of the prompt is dynamically generated based on the player's world state.

### Template
```
For a fantasy world region that is a "{LANDMASS_TYPE}" with features like {GEOGRAPHY_SUMMARY}, create a unique {MUNDANE_QUALIFIER}resource or special site.

Please respond with a JSON object.
```

### Dynamic Fields
- `{LANDMASS_TYPE}`: The landmass structure selected by the player (e.g., "1 Large Continent", "Archipelago with at least 4 islands"). Defaults to "diverse area" if not set.
- `{GEOGRAPHY_SUMMARY}`: A comma-separated list of the 8 geography features placed by the player (e.g., "Mountains, Forest, River"). Defaults to "various terrains" if none are set.
- `{MUNDANE_QUALIFIER}`: If the "Mundane Resource" option is checked, this will be "but MUNDANE (non-magical and not supernatural) ". Otherwise, it's an empty string.

## 2. User Input Injection

If the user provides text in the "Your Ideas" input field, it is appended to the base prompt. Any element UUIDs in the user's text are replaced with their full description before being injected.

### Template
```
Additionally, please incorporate the following ideas from the user: "{USER_INPUT}"
```
- `{USER_INPUT}`: The user's text from the input field, with UUIDs expanded into full element context (e.g., `[Referenced Element: The Omni-Crystal (Resource) - Details: ...]`).

## 3. JSON Output Configuration

The request is configured to require a JSON response from the AI. The schema for this JSON object is built dynamically based on the user's checkbox selections.

### Base Schema
The AI is always instructed to provide the following fields:
- `name`: (String) A unique, fantasy-style name.
- `symbol`: (String) A single emoji character.
- `type`: (String) The resource type (e.g., 'mineral', 'flora', 'magical').
- `coreDescription`: (String) A paragraph describing the resource's uniqueness.

### Optional Schema Fields
Based on checkboxes, the following properties may be added to the required JSON schema:
- `causesAndConsequences`: (String) A paragraph on origins and effects.
- `fantasticElements`: (String) A paragraph on magical properties (not included if "Mundane" is checked).
- `futureStoryPotential`: (String) Notes on potential story hooks.

## Example Final Prompt

If a player has a "1 Large + 1 Small isle" landmass with Mountains and a River, checks "Include Story Potential", and provides "something related to fire" as input, the final text sent to the AI might look like this:

```
For a fantasy world region that is a "1 Large + 1 Small isle" with features like Mountains, River, create a unique resource or special site.

Please respond with a JSON object.

Additionally, please incorporate the following ideas from the user: "something related to fire"
```
The AI would also be constrained by a JSON schema requiring `name`, `symbol`, `type`, `coreDescription`, and `futureStoryPotential`.
