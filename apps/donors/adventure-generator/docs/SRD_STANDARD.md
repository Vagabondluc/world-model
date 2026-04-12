# SRD Data Standard

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04

This document defines the standard file formats for importing content into the D&D Adventure Generator via the SRD Importer.

## 1. Monsters (`.yaml`)

Monster files should be YAML files where each file represents one or more monsters. The root can be a single object or a list of objects.

### Schema
The structure matches the internal `CreatureDetailsSchema`.

```yaml
id: "goblin-scout" # Optional, if omitted will be generated from filename + name
name: "Goblin Scout"
type: "humanoid" # NpcTypeEnum
statblock: |
  **Armor Class** 15 (natural armor)
  **Hit Points** 7 (2d6)
  **Speed** 30 ft.
  ...
details:
  table:
    creatureType: "Humanoid (Goblinoid)"
    size: "Small"
    alignment: "Neutral Evil"
    armorClass: "15"
    hitPoints: "7 (2d6)"
    speed: "30 ft."
    challengeRating: "1/4"
    role: "Scout"
  abilitiesAndTraits: |
    **Nimble Escape.** The goblin can take the Disengage or Hide action as a bonus action on each of its turns.
  actions: |
    **Scimitar.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 5 (1d6 + 2) slashing damage.
```

## 2. Lore (`.md`)

Lore entries are Markdown files with YAML frontmatter for metadata.

### Schema
Matches `LoreEntrySchema`.

```markdown
---
id: "history-of-names"
title: "The History of Names"
type: "history"
tags: ["culture", "names", "elves"]
isPublicKnowledge: true
sources: ["Player's Handbook", "Local Legend"]
---

# The History of Names

In the ancient times, names were...
(The body of the markdown file becomes the `content` field)
```

## 3. Collections (`.json`)

For batch importing many small items (like spells or simple items), JSON is preferred.

```json
[
  {
    "id": "healing-potion",
    "category": "item",
    "title": "Potion of Healing",
    "summary": "Restores 2d4+2 HP",
    "fullContent": "A character who drinks the magical red fluid in this vial regains 2d4 + 2 hit points.",
    "tags": ["consumable", "potion", "healing"],
    "visibility": "public"
  }
]
```
