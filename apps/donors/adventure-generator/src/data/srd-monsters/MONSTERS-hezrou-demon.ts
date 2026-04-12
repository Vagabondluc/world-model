

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_HEZROU_DEMON: SavedMonster = {
  "id": "srd-hezrou-demon",
  "name": "Hezrou (Demon)",
  "description": "A hulking, toad-like demon, the hezrou serves as a brutish shock trooper in the demonic legions of the Abyss. It exudes a foul stench that sickens all who draw near.",
  "profile": {
    "table": {
      "creatureType": "Large fiend (demon)",
      "size": "Large",
      "alignment": "chaotic evil",
      "armorClass": "16 (natural armor)",
      "hitPoints": "136 (13d10+65)",
      "speed": "30 ft.",
      "senses": "darkvision 120 ft., passive Perception 11",
      "languages": "Abyssal, telepathy 120 ft.",
      "challengeRating": "8 (3,900 XP)",
      "keyAbilities": "STR +4, DEX +3, CON +5, INT -3, WIS +1, CHA +1",
      "role": "Brute"
    },
    "savingThrows": {
      "str": 7,
      "con": 8,
      "wis": 4
    },
    "abilitiesAndTraits": "**Magic Resistance.** The hezrou has advantage on saving throws against spells and other magical effects.\n\n**Stench.** Any creature that starts its turn within 10 feet of the hezrou must succeed on a DC 14 Constitution saving throw or be poisoned until the start of its next turn. On a successful saving throw, the creature is immune to the hezrou's stench for 24 hours.",
    "actions": "**Multiattack.** The hezrou makes three attacks: one with its bite and two with its claws.\n\n**Bite.** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 15 (2d10+4) piercing damage.\n\n**Claws.** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 11 (2d6 + 4) slashing damage.",
    "roleplayingAndTactics": "Hezrous are simple-minded brutes that charge into melee without hesitation. Their Stench ability can poison nearby foes, making them easier targets for the demon's relentless bite and claw attacks. They fight with primal fury and are not known for their cunning."
  },
  "statblock": "### Hezrou (Demon)\n\n*Large fiend (demon), chaotic evil*\n\n___\n\n- **Armor Class** 16 (natural armor)\n\n- **Hit Points** 136 (13d10+65)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 19 (+4) | 17 (+3) | 20 (+5) | 5 (-3) | 12 (+1) | 13 (+1) |\n\n___\n\n- **Saving Throws** Str +7, Con +8, Wis +4\n- **Senses** darkvision 120 ft., passive Perception 11\n\n- **Languages** Abyssal, telepathy 120 ft.\n\n- **Challenge** 8 (3,900 XP)\n\n___\n\n***Magic Resistance.*** The hezrou has advantage on saving throws against spells and other magical effects.\n\n***Stench.*** Any creature that starts its turn within 10 feet of the hezrou must succeed on a DC 14 Constitution saving throw or be poisoned until the start of its next turn. On a successful saving throw, the creature is immune to the hezrou's stench for 24 hours.\n\n### Actions\n***Multiattack.*** The hezrou makes three attacks: one with its bite and two with its claws.\n\n***Bite.*** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 15 (2d10+4) piercing damage.\n\n***Claws.*** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 11 (2d6 + 4) slashing damage."
};

export default SRD_MONSTER_HEZROU_DEMON;