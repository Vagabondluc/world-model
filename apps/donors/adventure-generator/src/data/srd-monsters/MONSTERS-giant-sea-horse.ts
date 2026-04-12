import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GIANT_SEA_HORSE: SavedMonster = {
  "id": "srd-giant-sea-horse",
  "name": "Giant Sea Horse",
  "description": "These large, peaceful herbivores of the sea are often used as mounts by aquatic races. They are shy and graceful creatures.",
  "profile": {
    "table": {
      "creatureType": "Large beast",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "13 (natural armor)",
      "hitPoints": "16 (3d10)",
      "speed": "0 ft., swim 40 ft.",
      "senses": "passive Perception 11",
      "languages": "-",
      "challengeRating": "1/2 (100 XP)",
      "keyAbilities": "STR +1, DEX +2, CON +0, INT -4, WIS +1, CHA -3",
      "role": "Skirmisher"
    },
    "abilitiesAndTraits": "**Charge.** If the sea horse moves at least 20 feet straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 7 (2d6) bludgeoning damage. It the target is a creature, it must succeed on a DC 11 Strength saving throw or be knocked prone.\n\n**Water Breathing.** The sea horse can breathe only underwater.",
    "actions": "**Ram.** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 4 (1d6+1) bludgeoning damage.",
    "roleplayingAndTactics": "Giant sea horses are not aggressive and will flee from danger. If cornered, they will use their charge to create an opening to escape. They are often found in colorful reefs and kelp forests."
  },
  "statblock": "### Giant Sea Horse\n\n*Large beast, unaligned*\n\n___\n\n- **Armor Class** 13 (natural armor)\n\n- **Hit Points** 16 (3d10)\n\n- **Speed** 0 ft., swim 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 12 (+1) | 15 (+2) | 11 (+0) | 2 (-4) | 12 (+1) | 5 (-3) |\n\n___\n\n- **Senses** passive Perception 11\n\n- **Languages** -\n\n- **Challenge** 1/2 (100 XP)\n\n___\n\n***Charge.*** If the sea horse moves at least 20 feet straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 7 (2d6) bludgeoning damage. It the target is a creature, it must succeed on a DC 11 Strength saving throw or be knocked prone.\n\n***Water Breathing.*** The sea horse can breathe only underwater.\n\n### Actions\n***Ram.*** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 4 (1d6+1) bludgeoning damage."
};

export default SRD_MONSTER_GIANT_SEA_HORSE;