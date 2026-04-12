
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_WARHORSE_SKELETON: SavedMonster = {
  "id": "srd-warhorse-skeleton",
  "name": "Warhorse Skeleton",
  "description": "The skeletal remains of a mighty warhorse, reanimated to serve a new, dark master. It is a tireless and fearless mount.",
  "profile": {
    "table": {
      "creatureType": "Large undead",
      "size": "Large",
      "alignment": "lawful evil",
      "armorClass": "13 (barding scraps)",
      "hitPoints": "22 (3d10+6)",
      "speed": "60 ft.",
      "senses": "darkvision 60 ft., passive Perception 9",
      "languages": "-",
      "challengeRating": "1/2 (100 XP)",
      "keyAbilities": "STR +4, DEX +1, CON +2, INT -4, WIS -1, CHA -3",
      "role": "Skirmisher"
    },
    "abilitiesAndTraits": "**Vulnerability to Bludgeoning.** Skeletons are vulnerable to bludgeoning damage.",
    "actions": "**Hooves.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 11 (2d6+4) bludgeoning damage.",
    "roleplayingAndTactics": "A warhorse skeleton is a mindless undead that follows the commands of its rider or creator. It is faster than a living warhorse and immune to exhaustion, making it a terrifying steed."
  },
  "statblock": "### Warhorse Skeleton\n\n*Large undead, lawful evil*\n\n___\n\n- **Armor Class** 13 (barding scraps)\n\n- **Hit Points** 22 (3d10+6)\n\n- **Speed** 60 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 18 (+4) | 12 (+1) | 15 (+2) | 2 (-4) | 8 (-1) | 5 (-3) |\n\n___\n\n- **Senses** darkvision 60 ft., passive Perception 9\n\n- **Languages** -\n\n- **Challenge** 1/2 (100 XP)\n\n___\n\n### Actions\n***Hooves.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 11 (2d6+4) bludgeoning damage."
};

export default SRD_MONSTER_WARHORSE_SKELETON;
