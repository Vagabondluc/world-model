
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_WIGHT: SavedMonster = {
  "id": "srd-wight",
  "name": "Wight",
  "description": "Wights are intelligent undead driven by a bottomless hunger for life and a cold, malevolent will. They are often found guarding ancient tombs, their very touch draining the life from their victims.",
  "profile": {
    "table": {
      "creatureType": "Medium undead",
      "size": "Medium",
      "alignment": "neutral evil",
      "armorClass": "14 (studded leather)",
      "hitPoints": "45 (6d8+18)",
      "speed": "30 ft.",
      "senses": "darkvision 60 ft., passive Perception 13",
      "languages": "the languages it knew in life",
      "challengeRating": "3 (700 XP)",
      "keyAbilities": "STR +2, DEX +2, CON +3, INT +0, WIS +1, CHA +2",
      "role": ""
    },
    "savingThrows": {
      "dex": 4,
      "wis": 3
    },
    "abilitiesAndTraits": "**Sunlight Sensitivity.** While in sunlight, the wight has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.",
    "actions": "**Multiattack.** The wight makes two longsword attacks or two longbow attacks. It can use its Life Drain in place of one longsword attack.\n\n**Life Drain.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 5 (1d6+2) necrotic damage. The target must succeed on a DC 13 Constitution saving throw or its hit point maximum is reduced by an amount equal to the damage taken. This reduction lasts until the target finishes a long rest. The target dies if this effect reduces its hit point maximum to 0.\n\n**Longsword.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 6 (1d8+2) slashing damage, or 7 (1d10+2) slashing damage if used with two hands.",
    "roleplayingAndTactics": "A wight is a cunning and strategic foe. It will use its longbow to weaken enemies from a distance before closing to melee. Its primary goal is to use its Life Drain ability to create more undead under its command. Any creature slain by its life drain rises as a zombie."
  },
  "statblock": "### Wight\n\n*Medium undead, neutral evil*\n\n___\n\n- **Armor Class** 14 (studded leather)\n\n- **Hit Points** 45 (6d8+18)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 15 (+2) | 14 (+2) | 16 (+3) | 10 (+0) | 13 (+1) | 15 (+2) |\n\n___\n\n- **Saving Throws** Dex +4, Wis +3\n- **Skills** Perception +3, Stealth +4\n\n- **Senses** darkvision 60 ft., passive Perception 13\n\n- **Languages** the languages it knew in life\n\n- **Challenge** 3 (700 XP)\n\n___\n\n***Sunlight Sensitivity.*** While in sunlight, the wight has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.\n\n### Actions\n***Multiattack.*** The wight makes two longsword attacks or two longbow attacks. It can use its Life Drain in place of one longsword attack.\n\n***Life Drain.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 5 (1d6+2) necrotic damage. The target must succeed on a DC 13 Constitution saving throw or its hit point maximum is reduced by an amount equal to the damage taken. This reduction lasts until the target finishes a long rest. The target dies if this effect reduces its hit point maximum to 0.\n\n***Longsword.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 6 (1d8+2) slashing damage, or 7 (1d10+2) slashing damage if used with two hands."
};

export default SRD_MONSTER_WIGHT;
