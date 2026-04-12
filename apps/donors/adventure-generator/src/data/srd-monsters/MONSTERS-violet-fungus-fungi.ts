
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_VIOLET_FUNGUS_FUNGI: SavedMonster = {
  "id": "srd-violet-fungus-fungi",
  "name": "Violet Fungus (Fungi)",
  "description": "A violet fungus is a large, purple mushroom that lurks in the Underdark. Its tentacles can rot flesh with a single touch.",
  "profile": {
    "table": {
      "creatureType": "Medium plant",
      "size": "Medium",
      "alignment": "unaligned",
      "armorClass": "5",
      "hitPoints": "18 (4d8)",
      "speed": "5 ft.",
      "senses": "blindsight 30 ft. (blind beyond this radius), passive Perception 6",
      "languages": "-",
      "challengeRating": "1/4 (50 XP)",
      "keyAbilities": "STR -4, DEX -5, CON +0, INT -5, WIS -4, CHA -5",
      "role": "Ambusher"
    },
    "abilitiesAndTraits": "**False Appearance.** While the violet fungus remains motionless, it is indistinguishable from an ordinary fungus.",
    "actions": "**Multiattack.** The fungus makes 1d4 Rotting Touch attacks.\n\n**Rotting Touch.** *Melee Weapon Attack:* +2 to hit, reach 10 ft., one creature. *Hit:* 4 (1d8) necrotic damage.",
    "roleplayingAndTactics": "Violet fungi are mindless ambush predators. They remain motionless, indistinguishable from normal fungi, until a creature comes within reach. They will then lash out with their rotting touch."
  },
  "statblock": "### Violet Fungus (Fungi)\n\n*Medium plant, unaligned*\n\n___\n\n- **Armor Class** 5\n\n- **Hit Points** 18 (4d8)\n\n- **Speed** 5 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 3 (-4) | 1 (-5) | 10 (+0) | 1 (-5) | 3 (-4) | 1 (-5) |\n\n___\n\n- **Senses** blindsight 30 ft. (blind beyond this radius), passive Perception 6\n\n- **Languages** -\n\n- **Challenge** 1/4 (50 XP)\n\n___\n\n***False Appearance.*** While the violet fungus remains motionless, it is indistinguishable from an ordinary fungus.\n\n### Actions\n***Multiattack.*** The fungus makes 1d4 Rotting Touch attacks.\n\n***Rotting Touch.*** *Melee Weapon Attack:* +2 to hit, reach 10 ft., one creature. *Hit:* 4 (1d8) necrotic damage."
};

export default SRD_MONSTER_VIOLET_FUNGUS_FUNGI;
