
// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_HARPY: SavedMonster = {
  "id": "srd-harpy",
  "name": "Harpy",
  "description": "A harpy has the body of a human female and the wings and legs of a vulture. They are cruel creatures that delight in luring sailors to their deaths with their enchanting songs.",
  "profile": {
    "table": {
      "creatureType": "Medium monstrosity",
      "size": "Medium",
      "alignment": "chaotic evil",
      "armorClass": "11",
      "hitPoints": "38 (7d8+7)",
      "speed": "20 ft., fly 40 ft.",
      "senses": "passive Perception 10",
      "languages": "Common",
      "challengeRating": "1 (200 XP)",
      "keyAbilities": "STR +1, DEX +1, CON +1, INT -2, WIS +0, CHA +1",
      "role": "Controller"
    },
    "abilitiesAndTraits": "",
    "actions": "**Multiattack.** The harpy makes two attacks: one with its claws and one with its club.\n\n**Claws.** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 6 (2d4+1) slashing damage.\n\n**Club.** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 3 (1d4+1) bludgeoning damage.\n\n**Luring Song.** The harpy sings a magical melody. Every humanoid and giant within 300 feet of the harpy that can hear the song must succeed on a DC 11 Wisdom saving throw or be charmed until the song ends. The harpy must take a bonus action on its subsequent turns to continue singing. It can stop singing at any time. The song ends if the harpy is incapacitated.",
    "roleplayingAndTactics": "Harpies use their Luring Song to draw victims into dangerous terrain, like cliffs or rapids. Once their prey is helpless, they descend to attack with their claws and clubs. They are cowardly and will flee if they face a determined foe that is immune to their song."
  },
  "statblock": "### Harpy\n\n*Medium monstrosity, chaotic evil*\n\n___\n\n- **Armor Class** 11\n\n- **Hit Points** 38 (7d8+7)\n\n- **Speed** 20 ft., fly 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 12 (+1) | 13 (+1) | 12 (+1) | 7 (-2) | 10 (+0) | 13 (+1) |\n\n___\n\n- **Senses** passive Perception 10\n\n- **Languages** Common\n\n- **Challenge** 1 (200 XP)\n\n___\n\n### Actions\n***Multiattack.*** The harpy makes two attacks: one with its claws and one with its club.\n\n***Claws.*** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 6 (2d4+1) slashing damage.\n\n***Club.*** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 3 (1d4+1) bludgeoning damage.\n\n***Luring Song.*** The harpy sings a magical melody. Every humanoid and giant within 300 feet of the harpy that can hear the song must succeed on a DC 11 Wisdom saving throw or be charmed until the song ends. The harpy must take a bonus action on its subsequent turns to continue singing. It can stop singing at any time. The song ends if the harpy is incapacitated."
};

export default SRD_MONSTER_HARPY;