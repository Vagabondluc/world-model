
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GIANT_CONSTRICTOR_SNAKE: SavedMonster = {
  "id": "srd-giant-constrictor-snake",
  "name": "Giant Constrictor Snake",
  "description": "A truly massive snake, capable of crushing a pony to death in its powerful coils. These patient ambush predators are found in jungles, swamps, and other warm climates.",
  "profile": {
    "table": {
      "creatureType": "Huge beast",
      "size": "Huge",
      "alignment": "unaligned",
      "armorClass": "12",
      "hitPoints": "60 (8d12+8)",
      "speed": "30 ft., swim 30 ft.",
      "senses": "blindsight 10 ft., passive Perception 12",
      "languages": "-",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +4, DEX +2, CON +1, INT -5, WIS +0, CHA -4",
      "role": "Controller"
    },
    "abilitiesAndTraits": "",
    "actions": "**Bite.** *Melee Weapon Attack:* +6 to hit, reach 10 ft., one creature. *Hit:* 11 (2d6+4) piercing damage.\n\n**Constrict.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one creature. *Hit:* 13 (2d8+4) bludgeoning damage, and the target is grappled (escape DC 16). Until this grapple ends, the creature is restrained, and the snake can't constrict another target.",
    "roleplayingAndTactics": "The giant constrictor snake lies in wait, often in trees or murky water, striking when prey comes near. It bites to get a grip, then immediately wraps its victim in its coils. It will hold and crush one target to death before moving on to the next."
  },
  "statblock": "### Giant Constrictor Snake\n\n*Huge beast, unaligned*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 60 (8d12+8)\n\n- **Speed** 30 ft., swim 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 19 (+4) | 14 (+2) | 12 (+1) | 1 (-5) | 10 (+0) | 3 (-4) |\n\n___\n\n- **Skills** Perception +2\n\n- **Senses** blindsight 10 ft., passive Perception 12\n\n- **Languages** -\n\n- **Challenge** 2 (450 XP)\n\n___\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +6 to hit, reach 10 ft., one creature. *Hit:* 11 (2d6+4) piercing damage.\n\n***Constrict.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one creature. *Hit:* 13 (2d8+4) bludgeoning damage, and the target is grappled (escape DC 16). Until this grapple ends, the creature is restrained, and the snake can't constrict another target."
};

export default SRD_MONSTER_GIANT_CONSTRICTOR_SNAKE;