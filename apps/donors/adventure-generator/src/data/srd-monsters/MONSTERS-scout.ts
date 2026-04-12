import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_SCOUT: SavedMonster = {
  "id": "srd-scout",
  "name": "Scout",
  "description": "Scouts are skilled hunters and trackers, at home in the wilderness. They are invaluable as guides and spies, their keen senses making them difficult to surprise.",
  "profile": {
    "table": {
      "creatureType": "Medium humanoid (any race)",
      "size": "Medium",
      "alignment": "any alignment",
      "armorClass": "13 (leather armor)",
      "hitPoints": "16 (3d8 + 3)",
      "speed": "30 ft.",
      "senses": "passive Perception 15",
      "languages": "any one language (usually Common)",
      "challengeRating": "1/2 (100 XP)",
      "keyAbilities": "STR +0, DEX +2, CON +1, INT +0, WIS +2, CHA +0",
      "role": "Skirmisher"
    },
    "abilitiesAndTraits": "**Keen Hearing and Sight.** The scout has advantage on Wisdom (Perception) checks that rely on hearing or sight.",
    "actions": "**Multiattack.** The scout makes two melee attacks or two ranged attacks.\n\n**Shortsword.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 5 (1d6 + 2) piercing damage.\n\n**Longbow.** *Ranged Weapon Attack:* +4 to hit, range 150/600 ft., one target. *Hit:* 6 (1d8 + 2) piercing damage.",
    "roleplayingAndTactics": "Scouts prefer to fight from a distance using their longbows. They use their stealth and knowledge of the terrain to ambush enemies or to retreat to a more advantageous position. If forced into melee, they will fight defensively until they can break away."
  },
  "statblock": "### Scout\n\n*Medium humanoid (any race), any alignment*\n\n___\n\n- **Armor Class** 13 (leather armor)\n\n- **Hit Points** 16 (3d8 + 3)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 11 (+0) | 14 (+2) | 12 (+1) | 11 (+0) | 13 (+1) | 11 (+0) |\n\n___\n\n- **Skills** Nature +4, Perception +5, Stealth +6, Survival +5\n\n- **Senses** passive Perception 15\n\n- **Languages** any one language (usually Common)\n\n- **Challenge** 1/2 (100 XP)\n\n___\n\n***Keen Hearing and Sight.*** The scout has advantage on Wisdom (Perception) checks that rely on hearing or sight.\n\n### Actions\n***Multiattack.*** The scout makes two melee attacks or two ranged attacks.\n\n***Shortsword.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 5 (1d6 + 2) piercing damage.\n\n***Longbow.*** *Ranged Weapon Attack:* +4 to hit, range 150/600 ft., one target. *Hit:* 6 (1d8 + 2) piercing damage."
};

export default SRD_MONSTER_SCOUT;
