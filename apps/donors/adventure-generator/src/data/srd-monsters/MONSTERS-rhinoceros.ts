
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_RHINOCEROS: SavedMonster = {
  "id": "srd-rhinoceros",
  "name": "Rhinoceros",
  "description": "A large, thick-skinned herbivore with a powerful horn on its snout. Rhinoceroses are known for their poor eyesight and even poorer tempers.",
  "profile": {
    "table": {
      "creatureType": "Large beast",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "11 (natural armor)",
      "hitPoints": "45 (6d10+12)",
      "speed": "40 ft.",
      "senses": "passive Perception 11",
      "languages": "-",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +5, DEX -1, CON +2, INT -4, WIS +1, CHA -2",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Charge.** If the rhinoceros moves at least 20 feet straight toward a target and then hits it with a gore attack on the same turn, the target takes an extra 9 (2d8) bludgeoning damage. If the target is a creature, it must succeed on a DC 15 Strength saving throw or be knocked prone.",
    "actions": "**Gore.** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 14 (2d8+5) piercing damage.",
    "roleplayingAndTactics": "A rhinoceros is easily startled and will charge any creature it perceives as a threat. Its Trampling Charge is a devastating opening attack, often enough to scare off most predators."
  },
  "statblock": "### Rhinoceros\n\n*Large beast, unaligned*\n\n___\n\n- **Armor Class** 11 (natural armor)\n\n- **Hit Points** 45 (6d10+12)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 21 (+5) | 8 (-1) | 15 (+2) | 2 (-4) | 12 (+1) | 6 (-2) |\n\n___\n\n- **Senses** passive Perception 11\n\n- **Languages** -\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***Charge.*** If the rhinoceros moves at least 20 feet straight toward a target and then hits it with a gore attack on the same turn, the target takes an extra 9 (2d8) bludgeoning damage. If the target is a creature, it must succeed on a DC 15 Strength saving throw or be knocked prone.\n\n### Actions\n***Gore.*** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 14 (2d8+5) piercing damage."
};

export default SRD_MONSTER_RHINOCEROS;
