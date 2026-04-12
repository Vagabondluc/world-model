import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GIANT_RAT: SavedMonster = {
  "id": "srd-giant-rat",
  "name": "Giant Rat",
  "description": "These dog-sized rodents are aggressive scavengers found in sewers, dungeons, and other squalid places. They are carriers of disease and often attack in swarms.",
  "profile": {
    "table": {
      "creatureType": "Small beast",
      "size": "Small",
      "alignment": "unaligned",
      "armorClass": "12",
      "hitPoints": "7 (2d6)",
      "speed": "30 ft.",
      "senses": "darkvision 60 ft., passive Perception 10",
      "languages": "-",
      "challengeRating": "1/8 (25 XP)",
      "keyAbilities": "STR -2, DEX +2, CON +0, INT -4, WIS +0, CHA -3",
      "role": "Minion"
    },
    "abilitiesAndTraits": "**Keen Smell.** The rat has advantage on Wisdom (Perception) checks that rely on smell.\n\n**Pack Tactics.** The rat has advantage on an attack roll against a creature if at least one of the rat's allies is within 5 feet of the creature and the ally isn't incapacitated.",
    "actions": "**Bite.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 4 (1d4+2) piercing damage.",
    "roleplayingAndTactics": "Giant rats are cowardly alone but bold in packs. They use their numbers and Pack Tactics to swarm and overwhelm isolated targets. They will flee if they face a strong or well-organized defense."
  },
  "statblock": "### Giant Rat\n\n*Small beast, unaligned*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 7 (2d6)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 7 (-2) | 15 (+2) | 11 (+0) | 2 (-4) | 10 (+0) | 4 (-3) |\n\n___\n\n- **Senses** darkvision 60 ft., passive Perception 10\n\n- **Languages** -\n\n- **Challenge** 1/8 (25 XP)\n\n___\n\n***Keen Smell.*** The rat has advantage on Wisdom (Perception) checks that rely on smell.\n\n***Pack Tactics.*** The rat has advantage on an attack roll against a creature if at least one of the rat's allies is within 5 feet of the creature and the ally isn't incapacitated.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 4 (1d4+2) piercing damage."
};

export default SRD_MONSTER_GIANT_RAT;