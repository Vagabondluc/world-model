
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GIANT_CENTIPEDE: SavedMonster = {
  "id": "srd-giant-centipede",
  "name": "Giant Centipede",
  "description": "This foot-long, many-legged invertebrate is a common predator in subterranean environments, its bite carrying a debilitating poison.",
  "profile": {
    "table": {
      "creatureType": "Small beast",
      "size": "Small",
      "alignment": "unaligned",
      "armorClass": "13 (natural armor)",
      "hitPoints": "4 (1d6+1)",
      "speed": "30 ft., climb 30 ft.",
      "senses": "blindsight 30 ft., passive Perception 8",
      "languages": "-",
      "challengeRating": "1/4 (50 XP)",
      "keyAbilities": "STR -3, DEX +2, CON +1, INT -5, WIS -2, CHA -4",
      "role": "Ambusher"
    },
    "abilitiesAndTraits": "",
    "actions": "**Bite.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 4 (1d4+2) piercing damage, and the target must succeed on a DC 11 Constitution saving throw or take 10 (3d6) poison damage. If the poison damage reduces the target to 0 hit points, the target is stable but poisoned for 1 hour, even after regaining hit points, and is paralyzed while poisoned in this way.",
    "roleplayingAndTactics": "Giant centipedes are simple predators that attack any creature they think they can eat. They use their climb speed to drop onto prey from walls or ceilings. Their primary tactic is to deliver a venomous bite and wait for the poison to incapacitate their meal."
  },
  "statblock": "### Giant Centipede\n\n*Small beast, unaligned*\n\n___\n\n- **Armor Class** 13 (natural armor)\n\n- **Hit Points** 4 (1d6+1)\n\n- **Speed** 30 ft., climb 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 5 (-3) | 14 (+2) | 12 (+1) | 1 (-5) | 7 (-2) | 3 (-4) |\n\n___\n\n- **Senses** blindsight 30 ft., passive Perception 8\n\n- **Languages** -\n\n- **Challenge** 1/4 (50 XP)\n\n___\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 4 (1d4+2) piercing damage, and the target must succeed on a DC 11 Constitution saving throw or take 10 (3d6) poison damage. If the poison damage reduces the target to 0 hit points, the target is stable but poisoned for 1 hour, even after regaining hit points, and is paralyzed while poisoned in this way."
};

export default SRD_MONSTER_GIANT_CENTIPEDE;