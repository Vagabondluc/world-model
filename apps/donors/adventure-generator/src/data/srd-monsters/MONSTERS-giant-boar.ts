import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GIANT_BOAR: SavedMonster = {
  "id": "srd-giant-boar",
  "name": "Giant Boar",
  "description": "If the boar moves at least 20 feet straight toward a target and then hits it with a tusk attack on the same turn, the target takes an extra 7 (2d6) slashing damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone.",
  "profile": {
    "table": {
      "creatureType": "Large beast",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "12 (natural armor)",
      "hitPoints": "42 (5d10+15)",
      "speed": "40 ft.",
      "senses": "passive Perception 8",
      "languages": "-",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +3, DEX +0, CON +3, INT -4, WIS -2, CHA -3",
      "role": ""
    },
    "abilitiesAndTraits": "**Charge.** If the boar moves at least 20 feet straight toward a target and then hits it with a tusk attack on the same turn, the target takes an extra 7 (2d6) slashing damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone.\n\n**Relentless (Recharges after a Short or Long Rest).** If the boar takes 10 damage or less that would reduce it to 0 hit points, it is reduced to 1 hit point instead.",
    "actions": "",
    "roleplayingAndTactics": ""
  },
  "statblock": "### Giant Boar\n\n*Large beast, unaligned*\n\n___\n\n- **Armor Class** 12 (natural armor)\n\n- **Hit Points** 42 (5d10+15)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 17 (+3) | 10 (+0) | 16 (+3) | 2 (-4) | 7 (-2) | 5 (-3) |\n\n___\n\n- **Senses** passive Perception 8\n\n- **Languages** -\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***Charge.*** If the boar moves at least 20 feet straight toward a target and then hits it with a tusk attack on the same turn, the target takes an extra 7 (2d6) slashing damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone.\n\n***Relentless (Recharges after a Short or Long Rest).*** If the boar takes 10 damage or less that would reduce it to 0 hit points, it is reduced to 1 hit point instead."
};

export default SRD_MONSTER_GIANT_BOAR;