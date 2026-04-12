

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_HILL_GIANT: SavedMonster = {
  "id": "srd-hill-giant",
  "name": "Hill Giant",
  "description": "Dim-witted, gluttonous, and cruel, hill giants are brutish bullies of the giant world. They live in crude camps in the foothills, emerging to raid settlements for food and whatever shiny trinkets they can steal.",
  "profile": {
    "table": {
      "creatureType": "Huge giant",
      "size": "Huge",
      "alignment": "chaotic evil",
      "armorClass": "13 (natural armor)",
      "hitPoints": "105 (10d12+40)",
      "speed": "40 ft.",
      "senses": "passive Perception 12",
      "languages": "Giant",
      "challengeRating": "5 (1,800 XP)",
      "keyAbilities": "STR +5, DEX -1, CON +4, INT -3, WIS -1, CHA -2",
      "role": "Brute"
    },
    "savingThrows": {
      "con": 7
    },
    "abilitiesAndTraits": "",
    "actions": "**Multiattack.** The giant makes two greatclub attacks.\n\n**Greatclub.** *Melee Weapon Attack:* +8 to hit, reach 10 ft., one target. *Hit:* 18 (3d8+5) bludgeoning damage.\n\n**Rock.** *Ranged Weapon Attack:* +8 to hit, range 60/240 ft., one target. *Hit:* 21 (3d10 + 5) bludgeoning damage.",
    "roleplayingAndTactics": "Hill giants are straightforward combatants. They charge at the nearest enemy, swinging their greatclubs wildly. They enjoy throwing rocks at smaller foes from a distance. Their low intelligence makes them susceptible to trickery, but their sheer strength and durability make them dangerous opponents."
  },
  "statblock": "### Hill Giant\n\n*Huge giant, chaotic evil*\n\n___\n\n- **Armor Class** 13 (natural armor)\n\n- **Hit Points** 105 (10d12+40)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 21 (+5) | 8 (-1) | 19 (+4) | 5 (-3) | 9 (-1) | 6 (-2) |\n\n___\n\n- **Saving Throws** Con +7\n- **Skills** Perception +2\n\n- **Senses** passive Perception 12\n\n- **Languages** Giant\n\n- **Challenge** 5 (1,800 XP)\n\n___\n\n### Actions\n***Multiattack.*** The giant makes two greatclub attacks.\n\n***Greatclub.*** *Melee Weapon Attack:* +8 to hit, reach 10 ft., one target. *Hit:* 18 (3d8+5) bludgeoning damage.\n\n***Rock.*** *Ranged Weapon Attack:* +8 to hit, range 60/240 ft., one target. *Hit:* 21 (3d10 + 5) bludgeoning damage."
};

export default SRD_MONSTER_HILL_GIANT;