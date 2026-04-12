

import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_SEA_HAG: SavedMonster = {
  "id": "srd-sea-hag",
  "name": "Sea Hag",
  "description": "The most hideous of all hags, sea hags are wretched crones who dwell in filthy underwater lairs. Their appearance is so horrifying it can frighten a creature to death.",
  "profile": {
    "table": {
      "creatureType": "Medium fey",
      "size": "Medium",
      "alignment": "chaotic evil",
      "armorClass": "14 (natural armor)",
      "hitPoints": "52 (7d8+21)",
      "speed": "30 ft., swim 40 ft.",
      "senses": "darkvision 60 ft., passive Perception 11",
      "languages": "Aquan, Common, Giant",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +3, DEX +1, CON +3, INT +1, WIS +1, CHA +1",
      "role": "Controller"
    },
    "abilitiesAndTraits": "**Amphibious.** The hag can breathe air and water.\n\n**Horrific Appearance.** Any humanoid that starts its turn within 30 feet of the hag and can see the hag's true form must make a DC 11 Wisdom saving throw. On a failed save, the creature is frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, with disadvantage if the hag is within line of sight, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the hag's Horrific Appearance for the next 24 hours.",
    "actions": "**Claws.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 10 (2d6+3) slashing damage.\n\n**Death Glare.** The hag targets one frightened creature she can see within 30 feet of her. If the target can see the hag, it must succeed on a DC 11 Wisdom saving throw against this magic or drop to 0 hit points.\n\n**Illusory Appearance.** The hag covers herself and anything she is wearing or carrying with a magical illusion that makes her look like an ugly creature of her general size and humanoid shape. The effect ends if the hag takes a bonus action to end it or if she dies.",
    "roleplayingAndTactics": "Sea hags are cruel and hateful. They use their illusory appearance to lure sailors or children to their doom. In combat, their horrific appearance can frighten foes, and their death glare can finish them off. They often form covens with other hags to increase their magical power."
  },
  "statblock": "### Sea Hag\n\n*Medium fey, chaotic evil*\n\n___\n\n- **Armor Class** 14 (natural armor)\n\n- **Hit Points** 52 (7d8+21)\n\n- **Speed** 30 ft., swim 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 16 (+3) | 13 (+1) | 16 (+3) | 12 (+1) | 12 (+1) | 13 (+1) |\n\n___\n\n- **Senses** darkvision 60 ft., passive Perception 11\n\n- **Languages** Aquan, Common, Giant\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***Amphibious.*** The hag can breathe air and water.\n\n***Horrific Appearance.*** Any humanoid that starts its turn within 30 feet of the hag and can see the hag's true form must make a DC 11 Wisdom saving throw. On a failed save, the creature is frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, with disadvantage if the hag is within line of sight, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the hag's Horrific Appearance for the next 24 hours.\n\n### Actions\n***Claws.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 10 (2d6+3) slashing damage.\n\n***Death Glare.*** The hag targets one frightened creature she can see within 30 feet of her. If the target can see the hag, it must succeed on a DC 11 Wisdom saving throw against this magic or drop to 0 hit points.\n\n***Illusory Appearance.*** The hag covers herself and anything she is wearing or carrying with a magical illusion that makes her look like an ugly creature of her general size and humanoid shape. The effect ends if the hag takes a bonus action to end it or if she dies."
};

export default SRD_MONSTER_SEA_HAG;