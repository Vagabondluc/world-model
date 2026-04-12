import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_BASILISK: SavedMonster = {
  "id": "srd-basilisk",
  "name": "Basilisk",
  "description": "This reptilian monster's gaze is legendary, capable of turning living creatures to stone.",
  "profile": {
    "table": {
      "creatureType": "Medium monstrosity",
      "size": "Medium",
      "alignment": "unaligned",
      "armorClass": "15 (natural armor)",
      "hitPoints": "52 (8d8+16)",
      "speed": "20 ft.",
      "senses": "darkvision 60 ft., passive Perception 9",
      "languages": "-",
      "challengeRating": "3 (700 XP)",
      "keyAbilities": "STR +3, DEX -1, CON +2, INT -4, WIS -1, CHA -2",
      "role": "Controller"
    },
    "abilitiesAndTraits": "**Petrifying Gaze.** If a creature starts its turn within 30 feet of the basilisk and the two of them can see each other, the basilisk can force the creature to make a DC 12 Constitution saving throw if the basilisk isn't incapacitated. On a failed save, the creature magically begins to turn to stone and is restrained. It must repeat the saving throw at the end of its next turn. On a success, the effect ends. On a failure, the creature is petrified until freed by the *greater restoration* spell or other magic.\nA creature that isn't surprised can avert its eyes to avoid the saving throw at the start of its turn. If it does so, it can't see the basilisk until the start of its next turn, when it can avert its eyes again. If it looks at the basilisk in the meantime, it must immediately make the save.\nIf the basilisk sees its reflection within 30 feet of it in bright light, it mistakes itself for a rival and targets itself with its gaze.",
    "actions": "**Bite.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 10 (2d6 + 3) piercing damage plus 7 (2d6) poison damage.",
    "roleplayingAndTactics": "A basilisk is a territorial hunter that relies on its gaze to incapacitate prey. It will often remain still, appearing as a statue, until creatures come within range of its gaze. It only resorts to its bite if its gaze is ineffective or if it is cornered."
  },
  "statblock": "### Basilisk\n\n*Medium monstrosity, unaligned*\n\n___\n\n- **Armor Class** 15 (natural armor)\n\n- **Hit Points** 52 (8d8+16)\n\n- **Speed** 20 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 16 (+3) | 8 (-1) | 15 (+2) | 2 (-4) | 8 (-1) | 7 (-2) |\n\n___\n\n- **Senses** darkvision 60 ft., passive Perception 9\n\n- **Languages** -\n\n- **Challenge** 3 (700 XP)\n\n___\n\n***Petrifying Gaze.*** If a creature starts its turn within 30 ft. of the basilisk and the two of them can see each other, the basilisk can force the creature to make a DC 12 Constitution saving throw if the basilisk isn't incapacitated. On a failed save, the creature magically begins to turn to stone and is restrained. It must repeat the saving throw at the end of its next turn. On a success, the effect ends. On a failure, the creature is petrified until freed by the *greater restoration* spell or other magic.\n\nA creature that isn't surprised can avert its eyes to avoid the saving throw at the start of its turn. If it does so, it can't see the basilisk until the start of its next turn, when it can avert its eyes again. If it looks at the basilisk in the meantime, it must immediately make the save.\n\nIf the basilisk sees its reflection within 30 ft. of it in bright light, it mistakes itself for a rival and targets itself with its gaze.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 10 (2d6 + 3) piercing damage plus 7 (2d6) poison damage."
};

export default SRD_MONSTER_BASILISK;