import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GIANT_GOAT: SavedMonster = {
  "id": "srd-giant-goat",
  "name": "Giant Goat",
  "description": "These hardy, sure-footed herbivores are much larger than their mundane cousins and are prized in mountainous regions as mounts and beasts of burden.",
  "profile": {
    "table": {
      "creatureType": "Large beast",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "11 (natural armor)",
      "hitPoints": "19 (3d10+3)",
      "speed": "40 ft.",
      "senses": "passive Perception 11",
      "languages": "-",
      "challengeRating": "1/2 (100 XP)",
      "keyAbilities": "STR +3, DEX +0, CON +1, INT -4, WIS +1, CHA -2",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Charge.** If the goat moves at least 20 feet straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 5 (2d4) bludgeoning damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone.\n\n**Sure-Footed.** The goat has advantage on Strength and Dexterity saving throws made against effects that would knock it prone.",
    "actions": "**Ram.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 8 (2d4+3) bludgeoning damage.",
    "roleplayingAndTactics": "Giant goats are temperamental and stubborn. They are not naturally aggressive but will use their powerful charge to knock down anything that threatens them or their herd. They are exceptionally good climbers, easily navigating steep mountain passes."
  },
  "statblock": "### Giant Goat\n\n*Large beast, unaligned*\n\n___\n\n- **Armor Class** 11 (natural armor)\n\n- **Hit Points** 19 (3d10+3)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 17 (+3) | 11 (+0) | 12 (+1) | 3 (-4) | 12 (+1) | 6 (-2) |\n\n___\n\n- **Senses** passive Perception 11\n\n- **Languages** -\n\n- **Challenge** 1/2 (100 XP)\n\n___\n\n***Charge.*** If the goat moves at least 20 feet straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 5 (2d4) bludgeoning damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone.\n\n***Sure-Footed.*** The goat has advantage on Strength and Dexterity saving throws made against effects that would knock it prone.\n\n### Actions\n***Ram.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 8 (2d4+3) bludgeoning damage."
};

export default SRD_MONSTER_GIANT_GOAT;