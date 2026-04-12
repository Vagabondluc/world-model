import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_ELK: SavedMonster = {
  "id": "srd-elk",
  "name": "Elk",
  "description": "These large, majestic deer are known for their massive antlers and powerful build. They are herd animals, found in temperate forests and mountains.",
  "profile": {
    "table": {
      "creatureType": "Large beast",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "10",
      "hitPoints": "13 (2d10+2)",
      "speed": "50 ft.",
      "senses": "passive Perception 10",
      "languages": "-",
      "challengeRating": "1/4 (50 XP)",
      "keyAbilities": "STR +3, DEX +0, CON +1, INT -4, WIS +0, CHA -2",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Charge.** If the elk moves at least 20 feet straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 7 (2d6) damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone.",
    "actions": "**Ram.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 6 (1d6+3) bludgeoning damage.",
    "roleplayingAndTactics": "Elk are generally peaceful herbivores but are fierce when protecting their young or during mating season. An angered elk will use its impressive speed to execute a devastating charge, aiming to knock its opponent prone before fleeing."
  },
  "statblock": "### Elk\n\n*Large beast, unaligned*\n\n___\n\n- **Armor Class** 10\n\n- **Hit Points** 13 (2d10+2)\n\n- **Speed** 50 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 16 (+3) | 10 (+0) | 12 (+1) | 2 (-4) | 10 (+0) | 6 (-2) |\n\n___\n\n- **Senses** passive Perception 10\n\n- **Languages** -\n\n- **Challenge** 1/4 (50 XP)\n\n___\n\n***Charge.*** If the elk moves at least 20 feet straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 7 (2d6) damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone.\n\n### Actions\n***Ram.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 6 (1d6+3) bludgeoning damage."
};

export default SRD_MONSTER_ELK;