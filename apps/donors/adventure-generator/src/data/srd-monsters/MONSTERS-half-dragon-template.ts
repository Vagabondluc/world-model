
// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_HALF_DRAGON_TEMPLATE: SavedMonster = {
  "id": "srd-half-dragon-template",
  "name": "Half-Dragon Template",
  "description": "The half-dragon gains resistance to a type of damage based on its color.",
  "profile": {
    "table": {
      "creatureType": "A beast",
      "size": "",
      "alignment": "humanoid, giant, or monstrosity can become a half-dragon. It keeps its statistics, except as follows.",
      "armorClass": "18 (plate)",
      "hitPoints": "65 (10d8+20)",
      "speed": "30 ft.",
      "senses": ". The half-dragon gains blindsight with a radius of 10 feet and darkvision with a radius of 60 feet.",
      "languages": ". The half-dragon speaks Draconic in addition to any other languages it knows.",
      "challengeRating": "**. To avoid recalculating the creature's challenge rating, apply the template only to a creature that meets the optional prerequisite in the Breath Weapon table below. Otherwise, recalculate the rating after you apply the template.",
      "keyAbilities": "Color , Damage Resistance ",
      "role": ""
    },
    "abilitiesAndTraits": "**Resistances.** The half-dragon gains resistance to a type of damage based on its color.\n\n**New Action: Breath Weapon.** The half-dragon has the breath weapon of its dragon half. The half- dragon's size determines how this action functions.",
    "actions": "**Multiattack.** The veteran makes two longsword attacks. If it has a shortsword drawn, it can also make a shortsword attack.\n\n**Longsword.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 7 (1d8+3) slashing damage, or 8 (1d10+3) slashing damage if used with two hands.\n\n**Shortsword.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 6 (1d6+3) piercing damage.\n\n**Heavy Crossbow.** *Ranged Weapon Attack:* +3 to hit, range 100/400 ft., one target. *Hit:* 6 (1d10+1) piercing damage.",
    "roleplayingAndTactics": ""
  },
  "statblock": "### Half-Dragon Template\n\n*A beast, humanoid, giant, or monstrosity can become a half-dragon. It keeps its statistics, except as follows.*\n\n___\n\n- **Armor Class** 18 (plate)\n\n- **Hit Points** 65 (10d8+20)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n|  |  |  |  |  |  |\n\n___\n\n- **Skills** Athletics +5, Perception +2\n\n- **Senses** . The half-dragon gains blindsight with a radius of 10 feet and darkvision with a radius of 60 feet.\n\n- **Languages** . The half-dragon speaks Draconic in addition to any other languages it knows.\n\n- **Challenge** **. To avoid recalculating the creature's challenge rating, apply the template only to a creature that meets the optional prerequisite in the Breath Weapon table below. Otherwise, recalculate the rating after you apply the template.\n\n___\n\n***Resistances.*** The half-dragon gains resistance to a type of damage based on its color.\n\n***New Action: Breath Weapon.*** The half-dragon has the breath weapon of its dragon half. The half- dragon's size determines how this action functions.\n\n### Actions\n***Multiattack.*** The veteran makes two longsword attacks. If it has a shortsword drawn, it can also make a shortsword attack.\n\n***Longsword.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 7 (1d8+3) slashing damage, or 8 (1d10+3) slashing damage if used with two hands.\n\n***Shortsword.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 6 (1d6+3) piercing damage.\n\n***Heavy Crossbow.*** *Ranged Weapon Attack:* +3 to hit, range 100/400 ft., one target. *Hit:* 6 (1d10+1) piercing damage."
};

export default SRD_MONSTER_HALF_DRAGON_TEMPLATE;