import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GIANT_VULTURE: SavedMonster = {
  "id": "srd-giant-vulture",
  "name": "Giant Vulture",
  "description": "These massive, evil-tempered scavengers have a malevolent intelligence. They often follow armies or caravans, waiting for creatures to die.",
  "profile": {
    "table": {
      "creatureType": "Large beast",
      "size": "Large",
      "alignment": "neutral evil",
      "armorClass": "10",
      "hitPoints": "22 (3d10+6)",
      "speed": "10 ft., fly 60 ft.",
      "senses": "passive Perception 13",
      "languages": "understands Common but can't speak",
      "challengeRating": "1 (200 XP)",
      "keyAbilities": "STR +2, DEX +0, CON +2, INT -2, WIS +1, CHA -2",
      "role": "Skirmisher"
    },
    "abilitiesAndTraits": "**Keen Sight and Smell.** The vulture has advantage on Wisdom (Perception) checks that rely on sight or smell.\n\n**Pack Tactics.** The vulture has advantage on an attack roll against a creature if at least one of the vulture's allies is within 5 feet of the creature and the ally isn't incapacitated.",
    "actions": "**Multiattack.** The vulture makes two attacks: one with its beak and one with its talons.\n\n**Beak.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 7 (2d4+2) piercing damage.\n\n**Talons.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 9 (2d6+2) slashing damage.",
    "roleplayingAndTactics": "Giant vultures are not just scavengers but also predators, especially when in a flock. They use their high-speed flight and Pack Tactics to swarm isolated targets, making repeated diving attacks with their sharp beaks and talons."
  },
  "statblock": "### Giant Vulture\n\n*Large beast, neutral evil*\n\n___\n\n- **Armor Class** 10\n\n- **Hit Points** 22 (3d10+6)\n\n- **Speed** 10 ft., fly 60 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 15 (+2) | 10 (+0) | 15 (+2) | 6 (-2) | 12 (+1) | 7 (-2) |\n\n___\n\n- **Skills** Perception +3\n\n- **Senses** passive Perception 13\n\n- **Languages** understands Common but can't speak\n\n- **Challenge** 1 (200 XP)\n\n___\n\n***Keen Sight and Smell.*** The vulture has advantage on Wisdom (Perception) checks that rely on sight or smell.\n\n***Pack Tactics.*** The vulture has advantage on an attack roll against a creature if at least one of the vulture's allies is within 5 feet of the creature and the ally isn't incapacitated.\n\n### Actions\n***Multiattack.*** The vulture makes two attacks: one with its beak and one with its talons.\n\n***Beak.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 7 (2d4+2) piercing damage.\n\n***Talons.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 9 (2d6+2) slashing damage."
};

export default SRD_MONSTER_GIANT_VULTURE;