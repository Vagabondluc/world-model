import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_COCKATRICE: SavedMonster = {
  "id": "srd-cockatrice",
  "name": "Cockatrice",
  "description": "This bizarre creature has the body of a rooster and the tail of a serpent. Its bite carries a petrifying curse.",
  "profile": {
    "table": {
      "creatureType": "Small monstrosity",
      "size": "Small",
      "alignment": "unaligned",
      "armorClass": "11",
      "hitPoints": "27 (6d6+6)",
      "speed": "20 ft., fly 40 ft.",
      "senses": "darkvision 60 ft., passive Perception 11",
      "languages": "-",
      "challengeRating": "1/2 (100 XP)",
      "keyAbilities": "STR -2, DEX +1, CON +1, INT -4, WIS +1, CHA -3",
      "role": "Controller"
    },
    "abilitiesAndTraits": "",
    "actions": "**Bite.** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one creature. *Hit:* 3 (1d4 + 1) piercing damage, and the target must succeed on a DC 11 Constitution saving throw against being magically petrified. On a failed save, the creature begins to turn to stone and is restrained. It must repeat the saving throw at the end of its next turn. On a success, the effect ends. On a failure, the creature is petrified for 24 hours.",
    "roleplayingAndTactics": "Cockatrices are aggressive and territorial, attacking any creature that appears to be a threat. They often peck at shiny objects. They fight with their bite, relying on their petrifying poison to neutralize foes."
  },
  "statblock": "### Cockatrice\n\n*Small monstrosity, unaligned*\n\n___\n\n- **Armor Class** 11\n\n- **Hit Points** 27 (6d6+6)\n\n- **Speed** 20 ft., fly 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 6 (-2) | 12 (+1) | 12 (+1) | 2 (-4) | 13 (+1) | 5 (-3) |\n\n___\n\n- **Senses** darkvision 60 ft., passive Perception 11\n\n- **Languages** -\n\n- **Challenge** 1/2 (100 XP)\n\n___\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one creature. *Hit:* 3 (1d4 + 1) piercing damage, and the target must succeed on a DC 11 Constitution saving throw against being magically petrified. On a failed save, the creature begins to turn to stone and is restrained. It must repeat the saving throw at the end of its next turn. On a success, the effect ends. On a failure, the creature is petrified for 24 hours."
};

export default SRD_MONSTER_COCKATRICE;