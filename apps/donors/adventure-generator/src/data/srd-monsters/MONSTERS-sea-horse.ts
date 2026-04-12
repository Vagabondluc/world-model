
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_SEA_HORSE: SavedMonster = {
  "id": "srd-sea-horse",
  "name": "Sea Horse",
  "description": "A tiny, delicate fish with a horse-like head that drifts gracefully through coral reefs and kelp forests.",
  "profile": {
    "table": {
      "creatureType": "Tiny beast",
      "size": "Tiny",
      "alignment": "unaligned",
      "armorClass": "11",
      "hitPoints": "1 (1d4-1)",
      "speed": "0 ft., swim 20 ft.",
      "senses": "passive Perception 10",
      "languages": "-",
      "challengeRating": "0 (0 XP)",
      "keyAbilities": "STR -5, DEX +1, CON -1, INT -5, WIS +0, CHA -4",
      "role": ""
    },
    "abilitiesAndTraits": "**Water Breathing.** The sea horse can breathe only underwater.",
    "actions": "",
    "roleplayingAndTactics": "Sea horses are completely harmless and pose no threat. They are shy and will flee from any larger creature."
  },
  "statblock": "### Sea Horse\n\n*Tiny beast, unaligned*\n\n___\n\n- **Armor Class** 11\n\n- **Hit Points** 1 (1d4-1)\n\n- **Speed** 0 ft., swim 20 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 1 (-5) | 12 (+1) | 8 (-1) | 1 (-5) | 10 (+0) | 2 (-4) |\n\n___\n\n- **Senses** passive Perception 10\n\n- **Languages** -\n\n- **Challenge** 0 (0 XP)\n\n___\n\n***Water Breathing.*** The sea horse can breathe only underwater."
};

export default SRD_MONSTER_SEA_HORSE;