

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_HIPPOGRIFF: SavedMonster = {
  "id": "srd-hippogriff",
  "name": "Hippogriff",
  "description": "A magical beast with the forequarters of a giant eagle and the hindquarters of a horse. Hippogriffs are proud, territorial creatures that can be tamed as flying mounts.",
  "profile": {
    "table": {
      "creatureType": "Large monstrosity",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "11",
      "hitPoints": "19 (3d10+3)",
      "speed": "40 ft., fly 60 ft.",
      "senses": "passive Perception 15",
      "languages": "-",
      "challengeRating": "1 (200 XP)",
      "keyAbilities": "STR +3, DEX +1, CON +1, INT -4, WIS +1, CHA -1",
      "role": "Skirmisher"
    },
    "abilitiesAndTraits": "**Keen Sight.** The hippogriff has advantage on Wisdom (Perception) checks that rely on sight.",
    "actions": "**Multiattack.** The hippogriff makes two attacks: one with its beak and one with its claws.\n\n**Beak.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 8 (1d10+3) piercing damage.\n\n**Claws.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 10 (2d6+3) slashing damage.",
    "roleplayingAndTactics": "Hippogriffs are aerial predators, using their keen sight to spot prey from high above. They will dive down to attack with their beak and claws. While they can be trained, wild hippogriffs are fiercely protective of their nests and will attack any creature that intrudes on their territory."
  },
  "statblock": "### Hippogriff\n\n*Large monstrosity, unaligned*\n\n___\n\n- **Armor Class** 11\n\n- **Hit Points** 19 (3d10+3)\n\n- **Speed** 40 ft., fly 60 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 17 (+3) | 13 (+1) | 13 (+1) | 2 (-4) | 12 (+1) | 8 (-1) |\n\n___\n\n- **Skills** Perception +5\n\n- **Senses** passive Perception 15\n\n- **Languages** -\n\n- **Challenge** 1 (200 XP)\n\n___\n\n***Keen Sight.*** The hippogriff has advantage on Wisdom (Perception) checks that rely on sight.\n\n### Actions\n***Multiattack.*** The hippogriff makes two attacks: one with its beak and one with its claws.\n\n***Beak.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 8 (1d10+3) piercing damage.\n\n***Claws.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 10 (2d6+3) slashing damage."
};

export default SRD_MONSTER_HIPPOGRIFF;