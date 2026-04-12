
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_NALFESHNEE_DEMON: SavedMonster = {
    "id": "srd-nalfeshnee-demon",
    "name": "Nalfeshnee (Demon)",
    "description": "A grotesque fusion of an ape and a boar with feathered wings, the nalfeshnee is a high-ranking demon of the Abyss. It is surprisingly intelligent, acting as a judge of the damned and a commander in Abyssal armies.",
    "profile": {
      "table": {
        "creatureType": "Large fiend (demon)",
        "size": "Large",
        "alignment": "chaotic evil",
        "armorClass": "18 (natural armor)",
        "hitPoints": "184 (16d10+96)",
        "speed": "20 ft., fly 30 ft.",
        "senses": "truesight 120 ft., passive Perception 11",
        "languages": "Abyssal, telepathy 120 ft.",
        "challengeRating": "13 (10,000 XP)",
        "keyAbilities": "STR +5, DEX +0, CON +6, INT +4, WIS +1, CHA +2",
        "role": "Controller"
      },
      "savingThrows": {
        "con": 8,
        "int": 7,
        "wis": 4,
        "cha": 5
      },
      "abilitiesAndTraits": "**Magic Resistance.** The nalfeshnee has advantage on saving throws against spells and other magical effects.",
      "actions": "**Multiattack.** The nalfeshnee uses Horror Nimbus if it can. It then makes three attacks: one with its bite and two with its claws.\n\n**Bite.** *Melee Weapon Attack:* +10 to hit, reach 5 ft., one target. *Hit:* 32 (5d10+5) piercing damage.\n\n**Claw.** *Melee Weapon Attack:* +10 to hit, reach 10 ft., one target. *Hit:* 15 (3d6+5) slashing damage.\n\n**Horror Nimbus (Recharge 5-6).** The nalfeshnee magically emits scintillating, multicolored light. Each creature within 15 feet of the nalfeshnee that can see the light must succeed on a DC 15 Wisdom saving throw or be frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the nalfeshnee's Horror Nimbus for the next 24 hours.",
      "roleplayingAndTactics": "This demon is a terrifying combination of brute force and magical power. It uses its Horror Nimbus to frighten and incapacitate foes, then teleports into their midst to unleash a flurry of bites and claws. It is intelligent enough to target spellcasters first."
    },
    "statblock": "### Nalfeshnee (Demon)\n\n*Large fiend (demon), chaotic evil*\n\n___\n\n- **Armor Class** 18 (natural armor)\n\n- **Hit Points** 184 (16d10+96)\n\n- **Speed** 20 ft., fly 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 21 (+5) | 10 (+0) | 22 (+6) | 19 (+4) | 12 (+1) | 15 (+2) |\n\n___\n\n- **Saving Throws** Con +8, Int +7, Wis +4, Cha +5\n- **Senses** truesight 120 ft., passive Perception 11\n\n- **Languages** Abyssal, telepathy 120 ft.\n\n- **Challenge** 13 (10,000 XP)\n\n___\n\n***Magic Resistance.*** The nalfeshnee has advantage on saving throws against spells and other magical effects.\n\n### Actions\n***Multiattack.*** The nalfeshnee uses Horror Nimbus if it can. It then makes three attacks: one with its bite and two with its claws.\n\n***Bite.*** *Melee Weapon Attack:* +10 to hit, reach 5 ft., one target. *Hit:* 32 (5d10+5) piercing damage.\n\n***Claw.*** *Melee Weapon Attack:* +10 to hit, reach 10 ft., one target. *Hit:* 15 (3d6+5) slashing damage.\n\n***Horror Nimbus (Recharge 5-6).*** The nalfeshnee magically emits scintillating, multicolored light. Each creature within 15 feet of the nalfeshnee that can see the light must succeed on a DC 15 Wisdom saving throw or be frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the nalfeshnee's Horror Nimbus for the next 24 hours."
  };
export default SRD_MONSTER_NALFESHNEE_DEMON;
