
// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_HAWK: SavedMonster = {
  "id": "srd-hawk",
  "name": "Hawk",
  "description": "A common bird of prey with exceptionally sharp vision.",
  "profile": {
    "table": {
      "creatureType": "Tiny beast",
      "size": "Tiny",
      "alignment": "unaligned",
      "armorClass": "13",
      "hitPoints": "1 (1d4-1)",
      "speed": "10 ft., fly 60 ft.",
      "senses": "passive Perception 14",
      "languages": "-",
      "challengeRating": "0 (10 XP)",
      "keyAbilities": "STR -3, DEX +3, CON -1, INT -4, WIS +2, CHA -2",
      "role": "Scout"
    },
    "abilitiesAndTraits": "**Keen Sight.** The hawk has advantage on Wisdom (Perception) checks that rely on sight.",
    "actions": "**Talons.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 1 slashing damage.",
    "roleplayingAndTactics": "Hawks are not aggressive towards humanoids unless their nest is threatened. They are often used by rangers and falconers as scouts."
  },
  "statblock": "### Hawk\n\n*Tiny beast, unaligned*\n\n___\n\n- **Armor Class** 13\n\n- **Hit Points** 1 (1d4-1)\n\n- **Speed** 10 ft., fly 60 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 5 (-3) | 16 (+3) | 8 (-1) | 2 (-4) | 14 (+2) | 6 (-2) |\n\n___\n\n- **Skills** Perception +4\n\n- **Senses** passive Perception 14\n\n- **Languages** -\n\n- **Challenge** 0 (10 XP)\n\n___\n\n***Keen Sight.*** The hawk has advantage on Wisdom (Perception) checks that rely on sight."
};

export default SRD_MONSTER_HAWK;