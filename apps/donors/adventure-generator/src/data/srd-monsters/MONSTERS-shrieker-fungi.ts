
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_SHRIEKER_FUNGI: SavedMonster = {
  "id": "srd-shrieker-fungi",
  "name": "Shrieker (Fungi)",
  "description": "Shriekers are large, mushroom-like fungi found in the Underdark. They get their name from the piercing shriek they emit when they detect light or movement.",
  "profile": {
    "table": {
      "creatureType": "Medium plant",
      "size": "Medium",
      "alignment": "unaligned",
      "armorClass": "5",
      "hitPoints": "13 (3d8)",
      "speed": "0 ft.",
      "senses": "blindsight 30 ft. (blind beyond this radius), passive Perception 6",
      "languages": "-",
      "challengeRating": "0 (10 XP)",
      "keyAbilities": "STR -5, DEX -5, CON +0, INT -5, WIS -4, CHA -5",
      "role": "Scout"
    },
    "abilitiesAndTraits": "**False Appearance.** While the shrieker remains motionless, it is indistinguishable from an ordinary fungus.",
    "actions": "**Shriek.** When bright light or a creature is within 30 feet of the shrieker, it emits a shrill screech that can be heard up to 300 feet away. The shrieker continues to shriek until the disturbance moves out of range and for 1d4 of the shrieker's turns afterward.",
    "roleplayingAndTactics": "Shriekers are not creatures in the traditional sense. They are living alarm systems, and their shrieks can attract other, more dangerous creatures. They have no attacks and are completely immobile."
  },
  "statblock": "### Shrieker (Fungi)\n\n*Medium plant, unaligned*\n\n___\n\n- **Armor Class** 5\n\n- **Hit Points** 13 (3d8)\n\n- **Speed** 0 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 1 (-5) | 1 (-5) | 10 (+0) | 1 (-5) | 3 (-4) | 1 (-5) |\n\n___\n\n- **Senses** blindsight 30 ft. (blind beyond this radius), passive Perception 6\n\n- **Languages** -\n\n- **Challenge** 0 (10 XP)\n\n___\n\n***False Appearance.*** While the shrieker remains motionless, it is indistinguishable from an ordinary fungus.\n\n### Reactions\n***Shriek.*** When bright light or a creature is within 30 feet of the shrieker, it emits a shrill screech that can be heard up to 300 feet away. The shrieker continues to shriek until the disturbance moves out of range and for 1d4 of the shrieker's turns afterward."
};

export default SRD_MONSTER_SHRIEKER_FUNGI;