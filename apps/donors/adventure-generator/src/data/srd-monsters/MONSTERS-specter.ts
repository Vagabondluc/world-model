
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_SPECTER: SavedMonster = {
  "id": "srd-specter",
  "name": "Specter",
  "description": "A specter is the angry, unfettered spirit of a humanoid that was prevented from passing into the afterlife. They are filled with a bottomless hatred for all living things.",
  "profile": {
    "table": {
      "creatureType": "Medium undead",
      "size": "Medium",
      "alignment": "chaotic evil",
      "armorClass": "12",
      "hitPoints": "22 (5d8)",
      "speed": "0 ft., fly 50 ft. (hover)",
      "senses": "darkvision 60 ft., passive Perception 10",
      "languages": "understands all languages it knew in life but can't speak",
      "challengeRating": "1 (200 XP)",
      "keyAbilities": "STR -5, DEX +2, CON +0, INT +0, WIS +0, CHA +0",
      "role": "Ambusher"
    },
    "abilitiesAndTraits": "**Incorporeal Movement.** The specter can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object.\n\n**Sunlight Sensitivity.** While in sunlight, the specter has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.",
    "actions": "**Life Drain.** *Melee Spell Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 10 (3d6) necrotic damage. The target must succeed on a DC 10 Constitution saving throw or its hit point maximum is reduced by an amount equal to the damage taken. This reduction lasts until the target finishes a long rest. The target dies if this effect reduces its hit point maximum to 0.",
    "roleplayingAndTactics": "Specters are incorporeal ambush predators, using their Incorporeal Movement to pass through walls and surprise their victims. They despise sunlight. Their life-draining touch can fell even the mightiest warrior, and any creature slain by it rises as a new specter under its control."
  },
  "statblock": "### Specter\n\n*Medium undead, chaotic evil*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 22 (5d8)\n\n- **Speed** 0 ft., fly 50 ft. (hover)\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 1 (-5) | 14 (+2) | 11 (+0) | 10 (+0) | 10 (+0) | 11 (+0) |\n\n___\n\n- **Senses** darkvision 60 ft., passive Perception 10\n\n- **Languages** understands all languages it knew in life but can't speak\n\n- **Challenge** 1 (200 XP)\n\n___\n\n***Incorporeal Movement.*** The specter can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object.\n\n***Sunlight Sensitivity.*** While in sunlight, the specter has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.\n\n### Actions\n***Life Drain.*** *Melee Spell Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 10 (3d6) necrotic damage. The target must succeed on a DC 10 Constitution saving throw or its hit point maximum is reduced by an amount equal to the damage taken. This reduction lasts until the target finishes a long rest. The target dies if this effect reduces its hit point maximum to 0."
};

export default SRD_MONSTER_SPECTER;