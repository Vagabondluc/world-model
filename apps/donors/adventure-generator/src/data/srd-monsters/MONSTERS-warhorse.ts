
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_WARHORSE: SavedMonster = {
  "id": "srd-warhorse",
  "name": "Warhorse",
  "description": "A horse bred and trained for war, a warhorse is larger, stronger, and more courageous than a common riding horse.",
  "profile": {
    "table": {
      "creatureType": "Large beast",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "11",
      "hitPoints": "19 (3d10+3)",
      "speed": "60 ft.",
      "senses": "passive Perception 11",
      "languages": "-",
      "challengeRating": "1/2 (100 XP)",
      "keyAbilities": "STR +4, DEX +1, CON +1, INT -4, WIS +1, CHA -2",
      "role": "Skirmisher"
    },
    "abilitiesAndTraits": "**Trampling Charge.** If the horse moves at least 20 feet straight toward a creature and then hits it with a hooves attack on the same turn, that target must succeed on a DC 14 Strength saving throw or be knocked prone. If the target is prone, the horse can make another attack with its hooves against it as a bonus action.",
    "actions": "**Hooves.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 11 (2d6+4) bludgeoning damage.",
    "roleplayingAndTactics": "A warhorse is a loyal and brave mount that will not shy away from combat. Its trampling charge can be a devastating opening to a battle."
  },
  "statblock": "### Warhorse\n\n*Large beast, unaligned*\n\n___\n\n- **Armor Class** 11\n\n- **Hit Points** 19 (3d10+3)\n\n- **Speed** 60 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 18 (+4) | 12 (+1) | 13 (+1) | 2 (-4) | 12 (+1) | 7 (-2) |\n\n___\n\n- **Senses** passive Perception 11\n\n- **Languages** -\n\n- **Challenge** 1/2 (100 XP)\n\n___\n\n***Trampling Charge.*** If the horse moves at least 20 feet straight toward a creature and then hits it with a hooves attack on the same turn, that target must succeed on a DC 14 Strength saving throw or be knocked prone. If the target is prone, the horse can make another attack with its hooves against it as a bonus action.\n\n### Actions\n***Hooves.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 11 (2d6+4) bludgeoning damage."
};

export default SRD_MONSTER_WARHORSE;
