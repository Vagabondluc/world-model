import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_MULE: SavedMonster = {
  "id": "srd-mule",
  "name": "Mule",
  "description": "A sturdy, stubborn hybrid of a horse and a donkey, prized for its strength and resilience as a beast of burden in difficult terrain.",
  "profile": {
    "table": {
      "creatureType": "Medium beast",
      "size": "Medium",
      "alignment": "unaligned",
      "armorClass": "10",
      "hitPoints": "11 (2d8+2)",
      "speed": "40 ft.",
      "senses": "passive Perception 10",
      "languages": "-",
      "challengeRating": "1/8 (25 XP)",
      "keyAbilities": "STR +2, DEX +0, CON +1, INT -4, WIS +0, CHA -3",
      "role": ""
    },
    "abilitiesAndTraits": "**Beast of Burden.** The mule is considered to be a Large animal for the purpose of determining its carrying capacity.\n\n**Sure-Footed.** The mule has advantage on Strength and Dexterity saving throws made against effects that would knock it prone.",
    "actions": "**Hooves.** *Melee Weapon Attack:* +2 to hit, reach 5 ft., one target. *Hit:* 4 (1d4+2) bludgeoning damage.",
    "roleplayingAndTactics": "Mules are not aggressive but can be incredibly stubborn. If threatened or mistreated, a mule will deliver a powerful kick before attempting to flee. It is not a combatant by choice."
  },
  "statblock": "### Mule\n\n*Medium beast, unaligned*\n\n___\n\n- **Armor Class** 10\n\n- **Hit Points** 11 (2d8+2)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 14 (+2) | 10 (+0) | 13 (+1) | 2 (-4) | 10 (+0) | 5 (-3) |\n\n___\n\n- **Senses** passive Perception 10\n\n- **Languages** -\n\n- **Challenge** 1/8 (25 XP)\n\n___\n\n***Beast of Burden.*** The mule is considered to be a Large animal for the purpose of determining its carrying capacity.\n\n***Sure-Footed.*** The mule has advantage on Strength and Dexterity saving throws made against effects that would knock it prone.\n\n### Actions\n***Hooves.*** *Melee Weapon Attack:* +2 to hit, reach 5 ft., one target. *Hit:* 4 (1d4 + 2) bludgeoning damage."
};

export default SRD_MONSTER_MULE;