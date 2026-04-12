
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_CRAB: SavedMonster = {
  "id": "srd-crab",
  "name": "Crab",
  "description": "A common coastal scavenger, this small crustacean scuttles along the shoreline with a hard shell and sharp pincers.",
  "profile": {
    "table": {
      "creatureType": "Tiny beast",
      "size": "Tiny",
      "alignment": "unaligned",
      "armorClass": "11 (natural armor)",
      "hitPoints": "2 (1d4)",
      "speed": "20 ft., swim 20 ft.",
      "senses": "blindsight 30 ft., passive Perception 9",
      "languages": "-",
      "challengeRating": "0 (10 XP)",
      "keyAbilities": "STR -4, DEX +0, CON +0, INT -5, WIS -1, CHA -4",
      "role": "Minion"
    },
    "abilitiesAndTraits": "**Amphibious.** The crab can breathe air and water.",
    "actions": "**Claw.** *Melee Weapon Attack:* +0 to hit, reach 5 ft., one target. *Hit:* 1 bludgeoning damage.",
    "roleplayingAndTactics": "A crab is no threat and will flee from almost any creature larger than itself, scuttling sideways into a crevice or the water. It only uses its claw defensively if cornered."
  },
  "statblock": "### Crab\n\n*Tiny beast, unaligned*\n\n___\n\n- **Armor Class** 11 (natural armor)\n\n- **Hit Points** 2 (1d4)\n\n- **Speed** 20 ft., swim 20 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 2 (-4) | 11 (+0) | 10 (+0) | 1 (-5) | 8 (-1) | 2 (-4) |\n\n___\n\n- **Skills** Stealth +2\n\n- **Senses** blindsight 30 ft., passive Perception 9\n\n- **Languages** -\n\n- **Challenge** 0 (10 XP)\n\n___\n\n***Amphibious.*** The crab can breathe air and water.\n\n### Actions\n***Claw.*** *Melee Weapon Attack:* +0 to hit, reach 5 ft., one target. *Hit:* 1 bludgeoning damage."
};

export default SRD_MONSTER_CRAB;