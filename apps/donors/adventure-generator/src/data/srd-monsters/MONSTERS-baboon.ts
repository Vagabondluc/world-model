import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_BABOON: SavedMonster = {
  "id": "srd-baboon",
  "name": "Baboon",
  "description": "These aggressive primates are known for their sharp teeth and territorial nature. They travel in large, noisy troops.",
  "profile": {
    "table": {
      "creatureType": "Small beast",
      "size": "Small",
      "alignment": "unaligned",
      "armorClass": "12",
      "hitPoints": "3 (1d6)",
      "speed": "30 ft., climb 30 ft.",
      "senses": "passive Perception 11",
      "languages": "-",
      "challengeRating": "0 (10 XP)",
      "keyAbilities": "STR -1, DEX +2, CON +0, INT -3, WIS +1, CHA -2",
      "role": "Minion"
    },
    "abilitiesAndTraits": "**Pack Tactics.** The baboon has advantage on an attack roll against a creature if at least one of the baboon's allies is within 5 feet of the creature and the ally isn't incapacitated.",
    "actions": "**Bite.** *Melee Weapon Attack:* +1 to hit, reach 5 ft., one target. *Hit:* 1 (1d4-1) piercing damage.",
    "roleplayingAndTactics": "Baboons rely on numbers to overwhelm their foes. They use Pack Tactics to swarm a single enemy. While not brave, they are vicious when defending their territory or young."
  },
  "statblock": "### Baboon\n\n*Small beast, unaligned*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 3 (1d6)\n\n- **Speed** 30 ft., climb 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 8 (-1) | 14 (+2) | 11 (+0) | 4 (-3) | 12 (+1) | 6 (-2) |\n\n___\n\n- **Senses** passive Perception 11\n\n- **Languages** -\n\n- **Challenge** 0 (10 XP)\n\n___\n\n***Pack Tactics.*** The baboon has advantage on an attack roll against a creature if at least one of the baboon's allies is within 5 feet of the creature and the ally isn't incapacitated.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +1 to hit, reach 5 ft., one target. *Hit:* 1 (1d4-1) piercing damage."
};

export default SRD_MONSTER_BABOON;