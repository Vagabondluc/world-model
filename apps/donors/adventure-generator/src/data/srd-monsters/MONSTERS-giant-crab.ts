
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GIANT_CRAB: SavedMonster = {
  "id": "srd-giant-crab",
  "name": "Giant Crab",
  "description": "These oversized crustaceans are common along coastlines and in aquatic caves, their hard shells providing excellent protection as they scavenge for food.",
  "profile": {
    "table": {
      "creatureType": "Medium beast",
      "size": "Medium",
      "alignment": "unaligned",
      "armorClass": "15 (natural armor)",
      "hitPoints": "13 (3d8)",
      "speed": "30 ft., swim 30 ft.",
      "senses": "blindsight 30 ft., passive Perception 9",
      "languages": "-",
      "challengeRating": "1/8 (25 XP)",
      "keyAbilities": "STR +1, DEX +2, CON +0, INT -5, WIS -1, CHA -4",
      "role": "Soldier"
    },
    "abilitiesAndTraits": "**Amphibious.** The crab can breathe air and water.",
    "actions": "**Claw.** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 4 (1d6+1) bludgeoning damage, and the target is grappled (escape DC 11). The crab has two claws, each of which can grapple only one target.",
    "roleplayingAndTactics": "Giant crabs are territorial and will defend their hunting grounds. They move sideways in a disconcerting scuttle and will attempt to grab a target in a pincer and hold it fast. They can be found both in and out of the water."
  },
  "statblock": "### Giant Crab\n\n*Medium beast, unaligned*\n\n___\n\n- **Armor Class** 15 (natural armor)\n\n- **Hit Points** 13 (3d8)\n\n- **Speed** 30 ft., swim 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 13 (+1) | 15 (+2) | 11 (+0) | 1 (-5) | 9 (-1) | 3 (-4) |\n\n___\n\n- **Skills** Stealth +4\n\n- **Senses** blindsight 30 ft., passive Perception 9\n\n- **Languages** -\n\n- **Challenge** 1/8 (25 XP)\n\n___\n\n***Amphibious.*** The crab can breathe air and water.\n\n### Actions\n***Claw.*** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 4 (1d6+1) bludgeoning damage, and the target is grappled (escape DC 11). The crab has two claws, each of which can grapple only one target."
};

export default SRD_MONSTER_GIANT_CRAB;