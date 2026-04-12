
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_DRAFT_HORSE: SavedMonster = {
  "id": "srd-draft-horse",
  "name": "Draft Horse",
  "description": "A large, powerful horse bred for heavy labor like pulling plows and wagons. They are strong and steady, but not built for speed.",
  "profile": {
    "table": {
      "creatureType": "Large beast",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "10",
      "hitPoints": "19 (3d10+3)",
      "speed": "40 ft.",
      "senses": "passive Perception 10",
      "languages": "-",
      "challengeRating": "1/4 (50 XP)",
      "keyAbilities": "STR +4, DEX +0, CON +1, INT -4, WIS +0, CHA -2",
      "role": ""
    },
    "abilitiesAndTraits": "",
    "actions": "**Hooves.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 9 (2d4+4) bludgeoning damage.",
    "roleplayingAndTactics": "A draft horse is a docile animal and will not fight unless panicked or defending itself. If threatened, it may kick out with its powerful hind legs."
  },
  "statblock": "### Draft Horse\n\n*Large beast, unaligned*\n\n___\n\n- **Armor Class** 10\n\n- **Hit Points** 19 (3d10+3)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 18 (+4) | 10 (+0) | 12 (+1) | 2 (-4) | 11 (+0) | 7 (-2) |\n\n___\n\n- **Senses** passive Perception 10\n\n- **Languages** -\n\n- **Challenge** 1/4 (50 XP)\n\n___\n\n### Actions\n***Hooves.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 9 (2d4 + 4) bludgeoning damage."
};

export default SRD_MONSTER_DRAFT_HORSE;