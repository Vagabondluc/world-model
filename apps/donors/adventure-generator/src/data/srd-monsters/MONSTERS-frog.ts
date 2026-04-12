
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_FROG: SavedMonster = {
  "id": "srd-frog",
  "name": "Frog",
  "description": "A harmless amphibian found in swamps, ponds, and damp caves.",
  "profile": {
    "table": {
      "creatureType": "Tiny beast",
      "size": "Tiny",
      "alignment": "unaligned",
      "armorClass": "11",
      "hitPoints": "1 (1d4-1)",
      "speed": "20 ft., swim 20 ft.",
      "senses": "darkvision 30 ft., passive Perception 11",
      "languages": "-",
      "challengeRating": "0 (0 XP)",
      "keyAbilities": "STR -5, DEX +1, CON -1, INT -5, WIS -1, CHA -4",
      "role": "Minion"
    },
    "abilitiesAndTraits": "**Amphibious.** The frog can breathe air and water.\n\n**Standing Leap.** The frog's long jump is up to 10 feet and its high jump is up to 5 feet, with or without a running start.",
    "actions": "**Bite.** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 1 piercing damage.",
    "roleplayingAndTactics": "Frogs are non-combatants. They will flee into the water or hop away using their Standing Leap at the first sign of danger."
  },
  "statblock": "### Frog\n\n*Tiny beast, unaligned*\n\n___\n\n- **Armor Class** 11\n\n- **Hit Points** 1 (1d4-1)\n\n- **Speed** 20 ft., swim 20 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 1 (-5) | 13 (+1) | 8 (-1) | 1 (-5) | 8 (-1) | 3 (-4) |\n\n___\n\n- **Skills** Perception +1, Stealth +3\n\n- **Senses** darkvision 30 ft., passive Perception 11\n\n- **Languages** -\n\n- **Challenge** 0 (0 XP)\n\n___\n\n***Amphibious.*** The frog can breathe air and water.\n\n***Standing Leap.*** The frog's long jump is up to 10 feet and its high jump is up to 5 feet, with or without a running start.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 1 piercing damage."
};

export default SRD_MONSTER_FROG;
