
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_POLAR_BEAR: SavedMonster = {
  "id": "srd-polar-bear",
  "name": "Polar Bear",
  "description": "A massive predator of the arctic, the polar bear is a powerful swimmer and a relentless hunter, perfectly adapted to its frozen environment.",
  "profile": {
    "table": {
      "creatureType": "Large beast",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "12 (natural armor)",
      "hitPoints": "42 (5d10+15)",
      "speed": "40 ft., swim 30 ft.",
      "senses": "passive Perception 13",
      "languages": "-",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +5, DEX +0, CON +3, INT -4, WIS +1, CHA -2",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Keen Smell.** The bear has advantage on Wisdom (Perception) checks that rely on smell.",
    "actions": "**Multiattack.** The bear makes two attacks: one with its bite and one with its claws.\n\n**Bite.** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 9 (1d8+5) piercing damage.\n\n**Claws.** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 12 (2d6 + 5) slashing damage.",
    "roleplayingAndTactics": "Polar bears are aggressive predators that see most other creatures as food. They are strong swimmers and will attack from the water or land. In combat, they are straightforward and brutal, using their bite and claws to savage their prey."
  },
  "statblock": "### Polar Bear\n\n*Large beast, unaligned*\n\n___\n\n- **Armor Class** 12 (natural armor)\n\n- **Hit Points** 42 (5d10+15)\n\n- **Speed** 40 ft., swim 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 20 (+5) | 10 (+0) | 16 (+3) | 2 (-4) | 13 (+1) | 7 (-2) |\n\n___\n\n- **Skills** Perception +3\n\n- **Senses** passive Perception 13\n\n- **Languages** -\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***Keen Smell.*** The bear has advantage on Wisdom (Perception) checks that rely on smell.\n\n### Actions\n***Multiattack.*** The bear makes two attacks: one with its bite and one with its claws.\n\n***Bite.*** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 9 (1d8+5) piercing damage.\n\n***Claws.*** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 12 (2d6 + 5) slashing damage."
};

export default SRD_MONSTER_POLAR_BEAR;
