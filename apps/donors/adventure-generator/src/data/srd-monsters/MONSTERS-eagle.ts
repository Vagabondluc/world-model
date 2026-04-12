
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_EAGLE: SavedMonster = {
  "id": "srd-eagle",
  "name": "Eagle",
  "description": "A majestic bird of prey with keen eyes and powerful talons, found soaring over mountains and open plains.",
  "profile": {
    "table": {
      "creatureType": "Small beast",
      "size": "Small",
      "alignment": "unaligned",
      "armorClass": "12",
      "hitPoints": "3 (1d6)",
      "speed": "10 ft., fly 60 ft.",
      "senses": "passive Perception 14",
      "languages": "-",
      "challengeRating": "0 (10 XP)",
      "keyAbilities": "STR -2, DEX +2, CON +0, INT -4, WIS +2, CHA -2",
      "role": "Scout"
    },
    "abilitiesAndTraits": "**Keen Sight.** The eagle has advantage on Wisdom (Perception) checks that rely on sight.",
    "actions": "**Talons.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 4 (1d4+2) slashing damage.",
    "roleplayingAndTactics": "Eagles are not typically aggressive toward humanoids but will fiercely defend their nests. In combat, they use their superior flight to make diving attacks with their talons before soaring out of reach."
  },
  "statblock": "### Eagle\n\n*Small beast, unaligned*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 3 (1d6)\n\n- **Speed** 10 ft., fly 60 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 6 (-2) | 15 (+2) | 10 (+0) | 2 (-4) | 14 (+2) | 7 (-2) |\n\n___\n\n- **Skills** Perception +4\n\n- **Senses** passive Perception 14\n\n- **Languages** -\n\n- **Challenge** 0 (10 XP)\n\n___\n\n***Keen Sight.*** The eagle has advantage on Wisdom (Perception) checks that rely on sight."
};

export default SRD_MONSTER_EAGLE;