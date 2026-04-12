import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_APE: SavedMonster = {
  "id": "srd-ape",
  "name": "Ape",
  "description": "Apes are strong, agile primates found in jungles and forests. They are social creatures, often living in troops.",
  "profile": {
    "table": {
      "creatureType": "Medium beast",
      "size": "Medium",
      "alignment": "unaligned",
      "armorClass": "12",
      "hitPoints": "19 (3d8+6)",
      "speed": "30 ft., climb 30 ft.",
      "senses": "passive Perception 13",
      "languages": "-",
      "challengeRating": "1/2 (100 XP)",
      "keyAbilities": "STR +3, DEX +2, CON +2, INT -2, WIS +1, CHA -2",
      "role": "Brute"
    },
    "abilitiesAndTraits": "",
    "actions": "**Multiattack.** The ape makes two fist attacks.\n\n**Fist.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 6 (1d6+3) bludgeoning damage.\n\n**Rock.** *Ranged Weapon Attack:* +5 to hit, range 25/50 ft., one target. *Hit:* 6 (1d6+3) bludgeoning damage.",
    "roleplayingAndTactics": "Apes are territorial and will attack to defend their group. They use their fists to batter foes and are surprisingly strong. They will flee from overwhelming threats, especially fire."
  },
  "statblock": "### Ape\n\n*Medium beast, unaligned*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 19 (3d8+6)\n\n- **Speed** 30 ft., climb 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 16 (+3) | 14 (+2) | 14 (+2) | 6 (-2) | 12 (+1) | 7 (-2) |\n\n___\n\n- **Skills** Athletics +5, Perception +3\n\n- **Senses** passive Perception 13\n\n- **Languages** -\n\n- **Challenge** 1/2 (100 XP)\n\n___\n\n### Actions\n***Multiattack.*** The ape makes two fist attacks.\n\n***Fist.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 6 (1d6+3) bludgeoning damage.\n\n***Rock.*** *Ranged Weapon Attack:* +5 to hit, range 25/50 ft., one target. *Hit:* 6 (1d6+3) bludgeoning damage."
};

export default SRD_MONSTER_APE;