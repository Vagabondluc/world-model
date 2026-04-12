
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_QUIPPER: SavedMonster = {
  "id": "srd-quipper",
  "name": "Quipper",
  "description": "Quippers are carnivorous fish with sharp teeth, found in both fresh and salt water. They are the piranhas of the fantasy world, swarming prey in a feeding frenzy.",
  "profile": {
    "table": {
      "creatureType": "Tiny beast",
      "size": "Tiny",
      "alignment": "unaligned",
      "armorClass": "13",
      "hitPoints": "1 (1d4-1)",
      "speed": "0 ft., swim 40 ft.",
      "senses": "darkvision 60 ft., passive Perception 8",
      "languages": "-",
      "challengeRating": "0 (10 XP)",
      "keyAbilities": "STR -4, DEX +3, CON -1, INT -5, WIS -2, CHA -4",
      "role": "Minion"
    },
    "abilitiesAndTraits": "**Blood Frenzy.** The quipper has advantage on melee attack rolls against any creature that doesn't have all its hit points.\n\n**Water Breathing.** The quipper can breathe only underwater.",
    "actions": "**Bite.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 1 piercing damage.",
    "roleplayingAndTactics": "A single quipper is no threat, but they attack in swarms. They are drawn to the scent of blood and will use their Blood Frenzy to tear apart any wounded creature in the water."
  },
  "statblock": "### Quipper\n\n*Tiny beast, unaligned*\n\n___\n\n- **Armor Class** 13\n\n- **Hit Points** 1 (1d4-1)\n\n- **Speed** 0 ft., swim 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 2 (-4) | 16 (+3) | 9 (-1) | 1 (-5) | 7 (-2) | 2 (-4) |\n\n___\n\n- **Senses** darkvision 60 ft., passive Perception 8\n\n- **Languages** -\n\n- **Challenge** 0 (10 XP)\n\n___\n\n***Blood Frenzy.*** The quipper has advantage on melee attack rolls against any creature that doesn't have all its hit points.\n\n***Water Breathing.*** The quipper can breathe only underwater.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 1 piercing damage."
};

export default SRD_MONSTER_QUIPPER;
