
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_POISONOUS_SNAKE: SavedMonster = {
  "id": "srd-poisonous-snake",
  "name": "Poisonous Snake",
  "description": "A common threat in many climates, this tiny serpent can deliver a venomous bite far deadlier than its size would suggest.",
  "profile": {
    "table": {
      "creatureType": "Tiny beast",
      "size": "Tiny",
      "alignment": "unaligned",
      "armorClass": "13",
      "hitPoints": "2 (1d4)",
      "speed": "30 ft., swim 30 ft.",
      "senses": "blindsight 10 ft., passive Perception 10",
      "languages": "-",
      "challengeRating": "1/8 (25 XP)",
      "keyAbilities": "STR -4, DEX +3, CON +0, INT -5, WIS +0, CHA -4",
      "role": "Ambusher"
    },
    "abilitiesAndTraits": "",
    "actions": "**Bite.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 1 piercing damage, and the target must make a DC 10 Constitution saving throw, taking 5 (2d4) poison damage on a failed save, or half as much damage on a successful one.",
    "roleplayingAndTactics": "Poisonous snakes are ambush predators that rely on camouflage to get close to their prey. They will strike quickly with a venomous bite and then retreat, waiting for the poison to take effect. They are not aggressive unless threatened or startled."
  },
  "statblock": "### Poisonous Snake\n\n*Tiny beast, unaligned*\n\n___\n\n- **Armor Class** 13\n\n- **Hit Points** 2 (1d4)\n\n- **Speed** 30 ft., swim 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 2 (-4) | 16 (+3) | 11 (+0) | 1 (-5) | 10 (+0) | 3 (-4) |\n\n___\n\n- **Senses** blindsight 10 ft., passive Perception 10\n\n- **Languages** -\n\n- **Challenge** 1/8 (25 XP)\n\n___\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 1 piercing damage, and the target must make a DC 10 Constitution saving throw, taking 5 (2d4) poison damage on a failed save, or half as much damage on a successful one."
};

export default SRD_MONSTER_POISONOUS_SNAKE;
