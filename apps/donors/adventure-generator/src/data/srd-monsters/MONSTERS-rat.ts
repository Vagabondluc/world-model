
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_RAT: SavedMonster = {
  "id": "srd-rat",
  "name": "Rat",
  "description": "A common rodent found in sewers, dungeons, and cellars. While individually weak, they can be a dangerous nuisance in large numbers.",
  "profile": {
    "table": {
      "creatureType": "Tiny beast",
      "size": "Tiny",
      "alignment": "unaligned",
      "armorClass": "10",
      "hitPoints": "1 (1d4-1)",
      "speed": "20 ft.",
      "senses": "darkvision 30 ft., passive Perception 10",
      "languages": "-",
      "challengeRating": "0 (10 XP)",
      "keyAbilities": "STR -4, DEX +0, CON -1, INT -4, WIS +0, CHA -3",
      "role": "Minion"
    },
    "abilitiesAndTraits": "**Keen Smell.** The rat has advantage on Wisdom (Perception) checks that rely on smell.",
    "actions": "**Bite.** *Melee Weapon Attack:* +0 to hit, reach 5 ft., one target. *Hit:* 1 piercing damage.",
    "roleplayingAndTactics": "Rats are timid scavengers that will flee from any creature they can't overwhelm with sheer numbers. A swarm of rats can be surprisingly dangerous."
  },
  "statblock": "### Rat\n\n*Tiny beast, unaligned*\n\n___\n\n- **Armor Class** 10\n\n- **Hit Points** 1 (1d4-1)\n\n- **Speed** 20 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 2 (-4) | 11 (+0) | 9 (-1) | 2 (-4) | 10 (+0) | 4 (-3) |\n\n___\n\n- **Senses** darkvision 30 ft., passive Perception 10\n\n- **Languages** -\n\n- **Challenge** 0 (10 XP)\n\n___\n\n***Keen Smell.*** The rat has advantage on Wisdom (Perception) checks that rely on smell.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +0 to hit, reach 5 ft., one target. *Hit:* 1 piercing damage."
};

export default SRD_MONSTER_RAT;
