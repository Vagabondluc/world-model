import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_BAT: SavedMonster = {
  "id": "srd-bat",
  "name": "Bat",
  "description": "These nocturnal flying mammals are a common sight in caves and ruins, darting through the darkness with incredible agility.",
  "profile": {
    "table": {
      "creatureType": "Tiny beast",
      "size": "Tiny",
      "alignment": "unaligned",
      "armorClass": "12",
      "hitPoints": "1 (1d4-1)",
      "speed": "5 ft., fly 30 ft.",
      "senses": "blindsight 60 ft., passive Perception 11",
      "languages": "-",
      "challengeRating": "0 (10 XP)",
      "keyAbilities": "STR -4, DEX +2, CON -1, INT -4, WIS +1, CHA -3",
      "role": "Minion"
    },
    "abilitiesAndTraits": "**Echolocation.** The bat can't use its blindsight while deafened.\n\n**Keen Hearing.** The bat has advantage on Wisdom (Perception) checks that rely on hearing.",
    "actions": "**Bite.** *Melee Weapon Attack:* +0 to hit, reach 5 ft., one creature. *Hit:* 1 piercing damage.",
    "roleplayingAndTactics": "A single bat is no threat, but they are rarely encountered alone. A swarm of bats can be a disorienting hazard. They avoid combat and will flee if threatened, using their blindsight to navigate in total darkness."
  },
  "statblock": "### Bat\n\n*Tiny beast, unaligned*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 1 (1d4-1)\n\n- **Speed** 5 ft., fly 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 2 (-4) | 15 (+2) | 8 (-1) | 2 (-4) | 12 (+1) | 4 (-3) |\n\n___\n\n- **Senses** blindsight 60 ft., passive Perception 11\n\n- **Languages** -\n\n- **Challenge** 0 (10 XP)\n\n___\n\n***Echolocation.*** The bat can't use its blindsight while deafened.\n\n***Keen Hearing.*** The bat has advantage on Wisdom (Perception) checks that rely on hearing.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +0 to hit, reach 5 ft., one creature. *Hit:* 1 piercing damage."
};

export default SRD_MONSTER_BAT;