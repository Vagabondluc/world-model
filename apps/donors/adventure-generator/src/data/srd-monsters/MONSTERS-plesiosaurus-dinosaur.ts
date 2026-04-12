
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_PLESIOSAURUS_DINOSAUR: SavedMonster = {
  "id": "srd-plesiosaurus-dinosaur",
  "name": "Plesiosaurus (Dinosaur)",
  "description": "A large aquatic reptile with a broad body, four flippers, and a long, serpentine neck. Plesiosaurs are marine predators that hunt fish and other sea creatures.",
  "profile": {
    "table": {
      "creatureType": "Large beast",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "13 (natural armor)",
      "hitPoints": "68 (8d10+24)",
      "speed": "20 ft., swim 40 ft.",
      "senses": "passive Perception 13",
      "languages": "-",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +4, DEX +2, CON +3, INT -4, WIS +1, CHA -3",
      "role": "Skirmisher"
    },
    "abilitiesAndTraits": "**Hold Breath.** The plesiosaurus can hold its breath for 1 hour.",
    "actions": "**Bite.** *Melee Weapon Attack:* +6 to hit, reach 10 ft., one target. *Hit:* 14 (3d6 + 4) piercing damage.",
    "roleplayingAndTactics": "The plesiosaurus is a swift and agile swimmer. It uses its long neck to strike at prey from a distance. While not typically aggressive towards humanoids, it will defend its territory or attack creatures it mistakes for food."
  },
  "statblock": "### Plesiosaurus (Dinosaur)\n\n*Large beast, unaligned*\n\n___\n\n- **Armor Class** 13 (natural armor)\n\n- **Hit Points** 68 (8d10+24)\n\n- **Speed** 20 ft., swim 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 18 (+4) | 15 (+2) | 16 (+3) | 2 (-4) | 12 (+1) | 5 (-3) |\n\n___\n\n- **Skills** Perception +3, Stealth +4\n\n- **Senses** passive Perception 13\n\n- **Languages** -\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***Hold Breath.*** The plesiosaurus can hold its breath for 1 hour.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +6 to hit, reach 10 ft., one target. *Hit:* 14 (3d6 + 4) piercing damage."
};

export default SRD_MONSTER_PLESIOSAURUS_DINOSAUR;
