
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_CONSTRICTOR_SNAKE: SavedMonster = {
  "id": "srd-constrictor-snake",
  "name": "Constrictor Snake",
  "description": "A large, nonvenomous snake that kills its prey by wrapping its muscular body around it and squeezing the life out of it.",
  "profile": {
    "table": {
      "creatureType": "Large beast",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "12",
      "hitPoints": "13 (2d10+2)",
      "speed": "30 ft., swim 30 ft.",
      "senses": "blindsight 10 ft., passive Perception 10",
      "languages": "-",
      "challengeRating": "1/4 (50 XP)",
      "keyAbilities": "STR +2, DEX +2, CON +1, INT -5, WIS +0, CHA -4",
      "role": "Controller"
    },
    "abilitiesAndTraits": "",
    "actions": "**Bite.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 5 (1d6+2) piercing damage.\n\n**Constrict.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 6 (1d8+2) bludgeoning damage, and the target is grappled (escape DC 14). Until this grapple ends, the creature is restrained, and the snake can't constrict another target.",
    "roleplayingAndTactics": "A constrictor snake is an ambush predator, often dropping from trees or hiding in undergrowth. It strikes with a bite to establish a hold and then immediately constricts its victim, crushing them into submission."
  },
  "statblock": "### Constrictor Snake\n\n*Large beast, unaligned*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 13 (2d10+2)\n\n- **Speed** 30 ft., swim 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 15 (+2) | 14 (+2) | 12 (+1) | 1 (-5) | 10 (+0) | 3 (-4) |\n\n___\n\n- **Senses** blindsight 10 ft., passive Perception 10\n\n- **Languages** -\n\n- **Challenge** 1/4 (50 XP)\n\n___\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 5 (1d6+2) piercing damage.\n\n***Constrict.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 6 (1d8 + 2) bludgeoning damage, and the target is grappled (escape DC 14). Until this grapple ends, the creature is restrained, and the snake can't constrict another target."
};

export default SRD_MONSTER_CONSTRICTOR_SNAKE;