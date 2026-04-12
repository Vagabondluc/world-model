
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_WRAITH: SavedMonster = {
  "id": "srd-wraith",
  "name": "Wraith",
  "description": "Wraiths are incorporeal undead born of pure evil and malice. They are formless, consumed by a bottomless hatred for all living things, and their touch drains the very life force from their victims.",
  "profile": {
    "table": {
      "creatureType": "Medium undead",
      "size": "Medium",
      "alignment": "neutral evil",
      "armorClass": "13",
      "hitPoints": "67 (9d8+27)",
      "speed": "0 ft., fly 60 ft. (hover)",
      "senses": "darkvision 60 ft., passive Perception 12",
      "languages": "the languages it knew in life",
      "challengeRating": "5 (1,800 XP)",
      "keyAbilities": "STR -2, DEX +3, CON +3, INT +1, WIS +2, CHA +2",
      "role": ""
    },
    "savingThrows": {
      "dex": 6,
      "wis": 5,
      "cha": 5
    },
    "abilitiesAndTraits": "**Incorporeal Movement.** The wraith can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object.\n\n**Sunlight Sensitivity.** While in sunlight, the wraith has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.",
    "actions": "**Life Drain.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one creature. *Hit:* 21 (4d8+3) necrotic damage. The target must succeed on a DC 14 Constitution saving throw or its hit point maximum is reduced by an amount equal to the damage taken. This reduction lasts until the target finishes a long rest. The target dies if this effect reduces its hit point maximum to 0.",
    "roleplayingAndTactics": "A wraith is a terrifying and relentless foe. It uses its incorporeal nature to pass through walls and surprise its victims. Its primary attack is its life-draining touch, and it will focus on a single target until it is dead. Any creature slain by a wraith becomes a specter under its control."
  },
  "statblock": "### Wraith\n\n*Medium undead, neutral evil*\n\n___\n\n- **Armor Class** 13\n\n- **Hit Points** 67 (9d8+27)\n\n- **Speed** 0 ft., fly 60 ft. (hover)\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 6 (-2) | 16 (+3) | 16 (+3) | 12 (+1) | 14 (+2) | 15 (+2) |\n\n___\n\n- **Saving Throws** Dex +6, Wis +5, Cha +5\n- **Senses** darkvision 60 ft., passive Perception 12\n\n- **Languages** the languages it knew in life\n\n- **Challenge** 5 (1,800 XP)\n\n___\n\n***Incorporeal Movement.*** The wraith can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object.\n\n***Sunlight Sensitivity.*** While in sunlight, the wraith has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.\n\n### Actions\n***Life Drain.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one creature. *Hit:* 21 (4d8+3) necrotic damage. The target must succeed on a DC 14 Constitution saving throw or its hit point maximum is reduced by an amount equal to the damage taken. This reduction lasts until the target finishes a long rest. The target dies if this effect reduces its hit point maximum to 0."
};

export default SRD_MONSTER_WRAITH;
