import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GIANT_POISONOUS_SNAKE: SavedMonster = {
  "id": "srd-giant-poisonous-snake",
  "name": "Giant Poisonous Snake",
  "description": "This enormous serpent is a deadly predator, often found in jungles, swamps, and underground caverns. Its venomous bite can fell creatures much larger than itself.",
  "profile": {
    "table": {
      "creatureType": "Medium beast",
      "size": "Medium",
      "alignment": "unaligned",
      "armorClass": "14",
      "hitPoints": "11 (2d8+2)",
      "speed": "30 ft., swim 30 ft.",
      "senses": "blindsight 10 ft., passive Perception 12",
      "languages": "-",
      "challengeRating": "1/4 (50 XP)",
      "keyAbilities": "STR +0, DEX +4, CON +1, INT -4, WIS +0, CHA -4",
      "role": "Ambusher"
    },
    "abilitiesAndTraits": "**Keen Smell.** The snake has advantage on Wisdom (Perception) checks that rely on smell.",
    "actions": "**Bite.** *Melee Weapon Attack:* +6 to hit, reach 10 ft., one target. *Hit:* 6 (1d4+4) piercing damage, and the target must make a DC 11 Constitution saving throw, taking 10 (3d6) poison damage on a failed save, or half as much damage on a successful one.",
    "roleplayingAndTactics": "A giant poisonous snake relies on surprise, striking from hiding with its long reach. Its goal is to deliver its venom and then retreat, waiting for the poison to do its work. It is not a brave fighter and will avoid a prolonged melee."
  },
  "statblock": "### Giant Poisonous Snake\n\n*Medium beast, unaligned*\n\n___\n\n- **Armor Class** 14\n\n- **Hit Points** 11 (2d8+2)\n\n- **Speed** 30 ft., swim 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 10 (+0) | 18 (+4) | 13 (+1) | 2 (-4) | 10 (+0) | 3 (-4) |\n\n___\n\n- **Skills** Perception +2\n\n- **Senses** blindsight 10 ft., passive Perception 12\n\n- **Languages** -\n\n- **Challenge** 1/4 (50 XP)\n\n___\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +6 to hit, reach 10 ft., one target. *Hit:* 6 (1d4+4) piercing damage, and the target must make a DC 11 Constitution saving throw, taking 10 (3d6) poison damage on a failed save, or half as much damage on a successful one."
};

export default SRD_MONSTER_GIANT_POISONOUS_SNAKE;