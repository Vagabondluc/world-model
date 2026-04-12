

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_BLACK_PUDDING_OOZE: SavedMonster = {
  "id": "srd-black-pudding-ooze",
  "name": "Black Pudding (Ooze)",
  "description": "This amorphous horror is a mass of black, acidic slime that silently scours underground passages for organic matter to dissolve and consume.",
  "profile": {
    "table": {
      "creatureType": "Large ooze",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "7",
      "hitPoints": "85 (10d10+30)",
      "speed": "20 ft., climb 20 ft.",
      "senses": "blindsight 60 ft. (blind beyond this radius), passive Perception 8",
      "languages": "-",
      "challengeRating": "4 (1,100 XP)",
      "keyAbilities": "STR +3, DEX -3, CON +3, INT -5, WIS -2, CHA -5",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Amorphous.** The pudding can move through a space as narrow as 1 inch wide without squeezing.\n\n**Corrosive Form.** A creature that touches the pudding or hits it with a melee attack while within 5 feet of it takes 4 (1d8) acid damage. Any nonmagical weapon made of metal or wood that hits the pudding corrodes. After dealing damage, the weapon takes a permanent and cumulative -1 penalty to damage rolls. If its penalty drops to -5, the weapon is destroyed. Nonmagical ammunition made of metal or wood that hits the pudding is destroyed after dealing damage.\n\n**Spider Climb.** The pudding can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
    "actions": "**Pseudopod.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 6 (1d6+3) bludgeoning damage plus 18 (4d8) acid damage. In addition, nonmagical armor worn by the target is partly dissolved and takes a permanent and cumulative -1 penalty to the AC it offers. The armor is destroyed if the penalty reduces its AC to 10.\n\n**Split.** When a pudding that is Medium or larger is subjected to lightning or slashing damage, it splits into two new puddings if it has at least 10 hit points. Each new pudding has hit points equal to half the original pudding's, rounded down. New puddings are one size smaller than the original pudding.",
    "roleplayingAndTactics": "A black pudding is a mindless eating machine. It moves toward the nearest organic material, using its pseudopod to dissolve armor and flesh. Its Split reaction can quickly turn one threat into two, overwhelming unprepared adventurers. It often drips from ceilings to surprise its prey."
  },
  "statblock": "### Black Pudding (Ooze)\n\n*Large ooze, unaligned*\n\n___\n\n- **Armor Class** 7\n\n- **Hit Points** 85 (10d10+30)\n\n- **Speed** 20 ft., climb 20 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 16 (+3) | 5 (-3) | 16 (+3) | 1 (-5) | 6 (-2) | 1 (-5) |\n\n___\n\n- **Senses** blindsight 60 ft. (blind beyond this radius), passive Perception 8\n\n- **Languages** -\n\n- **Challenge** 4 (1,100 XP)\n\n___\n\n***Amorphous.*** The pudding can move through a space as narrow as 1 inch wide without squeezing.\n\n***Corrosive Form.*** A creature that touches the pudding or hits it with a melee attack while within 5 feet of it takes 4 (1d8) acid damage. Any nonmagical weapon made of metal or wood that hits the pudding corrodes. After dealing damage, the weapon takes a permanent and cumulative -1 penalty to damage rolls. If its penalty drops to -5, the weapon is destroyed. Nonmagical ammunition made of metal or wood that hits the pudding is destroyed after dealing damage.\n\n***Spider Climb.*** The pudding can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.\n\n### Actions\n***Pseudopod.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 6 (1d6+3) bludgeoning damage plus 18 (4d8) acid damage. In addition, nonmagical armor worn by the target is partly dissolved and takes a permanent and cumulative -1 penalty to the AC it offers. The armor is destroyed if the penalty reduces its AC to 10.\n\n### Reactions\n***Split.*** When a pudding that is Medium or larger is subjected to lightning or slashing damage, it splits into two new puddings if it has at least 10 hit points. Each new pudding has hit points equal to half the original pudding's, rounded down. New puddings are one size smaller than the original pudding."
};

export default SRD_MONSTER_BLACK_PUDDING_OOZE;