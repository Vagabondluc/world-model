

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_BOAR: SavedMonster = {
  "id": "srd-boar",
  "name": "Boar",
  "description": "These ill-tempered beasts are common in forests and hills. Their sharp tusks and powerful charge make them a danger to any who wander too close.",
  "profile": {
    "table": {
      "creatureType": "Medium beast",
      "size": "Medium",
      "alignment": "unaligned",
      "armorClass": "11 (natural armor)",
      "hitPoints": "11 (2d8+2)",
      "speed": "40 ft.",
      "senses": "passive Perception 9",
      "languages": "-",
      "challengeRating": "1/4 (50 XP)",
      "keyAbilities": "STR +1, DEX +0, CON +1, INT -4, WIS -1, CHA -3",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Charge.** If the boar moves at least 20 feet straight toward a target and then hits it with a tusk attack on the same turn, the target takes an extra 3 (1d6) slashing damage. If the target is a creature, it must succeed on a DC 11 Strength saving throw or be knocked prone.\n\n**Relentless (Recharges after a Short or Long Rest).** If the boar takes 7 damage or less that would reduce it to 0 hit points, it is reduced to 1 hit point instead.",
    "actions": "**Tusk.** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 4 (1d6+1) slashing damage.",
    "roleplayingAndTactics": "A boar will almost always open combat with its Charge, attempting to knock its enemy prone. It fights with primal fury and is surprisingly tough to take down due to its Relentless ability."
  },
  "statblock": "### Boar\n\n*Medium beast, unaligned*\n\n___\n\n- **Armor Class** 11 (natural armor)\n\n- **Hit Points** 11 (2d8+2)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 13 (+1) | 11 (+0) | 12 (+1) | 2 (-4) | 9 (-1) | 5 (-3) |\n\n___\n\n- **Senses** passive Perception 9\n\n- **Languages** -\n\n- **Challenge** 1/4 (50 XP)\n\n___\n\n***Charge.*** If the boar moves at least 20 feet straight toward a target and then hits it with a tusk attack on the same turn, the target takes an extra 3 (1d6) slashing damage. If the target is a creature, it must succeed on a DC 11 Strength saving throw or be knocked prone.\n\n***Relentless (Recharges after a Short or Long Rest).*** If the boar takes 7 damage or less that would reduce it to 0 hit points, it is reduced to 1 hit point instead."
};

export default SRD_MONSTER_BOAR;