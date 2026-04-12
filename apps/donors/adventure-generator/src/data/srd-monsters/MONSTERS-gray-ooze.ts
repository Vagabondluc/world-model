import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GRAY_OOZE: SavedMonster = {
  "id": "srd-gray-ooze",
  "name": "Gray Ooze",
  "description": "This creature appears to be a puddle of oily water or a patch of wet stone, perfectly camouflaged in damp dungeons. It is a mindless predator that corrodes flesh and metal with equal ease.",
  "profile": {
    "table": {
      "creatureType": "Medium ooze",
      "size": "Medium",
      "alignment": "unaligned",
      "armorClass": "8",
      "hitPoints": "22 (3d8+9)",
      "speed": "10 ft., climb 10 ft.",
      "senses": "blindsight 60 ft. (blind beyond this radius), passive Perception 8",
      "languages": "-",
      "challengeRating": "1/2 (100 XP)",
      "keyAbilities": "STR +1, DEX -2, CON +3, INT -5, WIS -2, CHA -4",
      "role": "Ambusher"
    },
    "abilitiesAndTraits": "**Amorphous.** The ooze can move through a space as narrow as 1 inch wide without squeezing.\n\n**Corrode Metal.** Any nonmagical weapon made of metal that hits the ooze corrodes. After dealing damage, the weapon takes a permanent and cumulative -1 penalty to damage rolls. If its penalty drops to -5, the weapon is destroyed. Nonmagical ammunition made of metal that hits the ooze is destroyed after dealing damage.\n\n**False Appearance.** While the ooze remains motionless, it is indistinguishable from an oily pool or wet rock.",
    "actions": "**Pseudopod.** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 4 (1d6+1) bludgeoning damage plus 7 (2d6) acid damage. In addition, nonmagical armor worn by the target is partly dissolved and takes a permanent and cumulative -1 penalty to the AC it offers. The armor is destroyed if the penalty reduces its AC to 10.",
    "roleplayingAndTactics": "The gray ooze is an ambush predator, relying on its false appearance to surprise victims. It will attempt to corrode a warrior's armor and weapons before dissolving their flesh. It is slow and has no sense of self-preservation."
  },
  "statblock": "### Gray Ooze\n\n*Medium ooze, unaligned*\n\n___\n\n- **Armor Class** 8\n\n- **Hit Points** 22 (3d8+9)\n\n- **Speed** 10 ft., climb 10 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 12 (+1) | 6 (-2) | 16 (+3) | 1 (-5) | 6 (-2) | 2 (-4) |\n\n___\n\n- **Skills** Stealth +2\n\n- **Senses** blindsight 60 ft. (blind beyond this radius), passive Perception 8\n\n- **Languages** -\n\n- **Challenge** 1/2 (100 XP)\n\n___\n\n***Amorphous.*** The ooze can move through a space as narrow as 1 inch wide without squeezing.\n\n***Corrode Metal.*** Any nonmagical weapon made of metal that hits the ooze corrodes. After dealing damage, the weapon takes a permanent and cumulative -1 penalty to damage rolls. If its penalty drops to -5, the weapon is destroyed. Nonmagical ammunition made of metal that hits the ooze is destroyed after dealing damage.\n\n***False Appearance.*** While the ooze remains motionless, it is indistinguishable from an oily pool or wet rock.\n\n### Actions\n***Pseudopod.*** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 4 (1d6 + 1) bludgeoning damage plus 7 (2d6) acid damage. In addition, nonmagical armor worn by the target is partly dissolved and takes a permanent and cumulative -1 penalty to the AC it offers. The armor is destroyed if the penalty reduces its AC to 10."
};

export default SRD_MONSTER_GRAY_OOZE;