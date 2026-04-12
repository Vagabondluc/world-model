import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GIANT_FIRE_BEETLE: SavedMonster = {
  "id": "srd-giant-fire-beetle",
  "name": "Giant Fire Beetle",
  "description": "This knee-high beetle has two glowing glands that produce a constant, magical light. They are often domesticated by miners and underground dwellers for their illumination.",
  "profile": {
    "table": {
      "creatureType": "Small beast",
      "size": "Small",
      "alignment": "unaligned",
      "armorClass": "13 (natural armor)",
      "hitPoints": "4 (1d6+1)",
      "speed": "30 ft.",
      "senses": "blindsight 30 ft., passive Perception 8",
      "languages": "-",
      "challengeRating": "0 (10 XP)",
      "keyAbilities": "STR -1, DEX +0, CON +1, INT -5, WIS -2, CHA -4",
      "role": "Minion"
    },
    "abilitiesAndTraits": "**Illumination.** The beetle sheds bright light in a 10-foot radius and dim light for an additional 10 feet.",
    "actions": "**Bite.** *Melee Weapon Attack:* +1 to hit, reach 5 ft., one target. *Hit:* 2 (1d6-1) slashing damage.",
    "roleplayingAndTactics": "Giant fire beetles are not aggressive and will only bite if cornered or handled roughly. Their main purpose in an encounter is often environmental, providing light in a dark area. A swarm of them can be a minor nuisance."
  },
  "statblock": "### Giant Fire Beetle\n\n*Small beast, unaligned*\n\n___\n\n- **Armor Class** 13 (natural armor)\n\n- **Hit Points** 4 (1d6+1)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 8 (-1) | 10 (+0) | 12 (+1) | 1 (-5) | 7 (-2) | 3 (-4) |\n\n___\n\n- **Senses** blindsight 30 ft., passive Perception 8\n\n- **Languages** -\n\n- **Challenge** 0 (10 XP)\n\n___\n\n***Illumination.*** The beetle sheds bright light in a 10-foot radius and dim light for an additional 10 feet.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +1 to hit, reach 5 ft., one target. *Hit:* 2 (1d6-1) slashing damage."
};

export default SRD_MONSTER_GIANT_FIRE_BEETLE;