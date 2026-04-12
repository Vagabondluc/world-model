import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GOBLIN: SavedMonster = {
  "id": "srd-goblin",
  "name": "Goblin",
  "description": "Goblins are small, black-hearted, selfish humanoids that lair in caves, abandoned mines, despoiled dungeons, and other dismal settings.",
  "profile": {
    "table": {
      "creatureType": "Small humanoid (goblinoid)",
      "size": "Small",
      "alignment": "neutral evil",
      "armorClass": "15 (leather armor, shield)",
      "hitPoints": "7 (2d6)",
      "speed": "30 ft.",
      "senses": "darkvision 60 ft., passive Perception 9",
      "languages": "Common, Goblin",
      "challengeRating": "1/4 (50 XP)",
      "keyAbilities": "STR -1, DEX +2, CON +0, INT +0, WIS -1, CHA -1",
      "role": "Minion"
    },
    "abilitiesAndTraits": "**Nimble Escape.** The goblin can take the Disengage or Hide action as a bonus action on each of its turns.",
    "actions": "**Scimitar.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 5 (1d6+2) slashing damage.\n\n**Shortbow.** *Ranged Weapon Attack:* +4 to hit, range 80/320 ft., one target. *Hit:* 5 (1d6+2) piercing damage.",
    "roleplayingAndTactics": "Goblins are cowardly and cruel creatures that fight in groups. They prefer to ambush their enemies, using their Nimble Escape to hide and gain advantage. They will flee if a fight turns against them, especially if their leader is defeated."
  },
  "statblock": "### Goblin\n\n*Small humanoid (goblinoid), neutral evil*\n\n___\n\n- **Armor Class** 15 (leather armor, shield)\n\n- **Hit Points** 7 (2d6)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 8 (-1) | 14 (+2) | 10 (+0) | 10 (+0) | 8 (-1) | 8 (-1) |\n\n___\n\n- **Skills** Stealth +6\n\n- **Senses** darkvision 60 ft., passive Perception 9\n\n- **Languages** Common, Goblin\n\n- **Challenge** 1/4 (50 XP)\n\n___\n\n***Nimble Escape.*** The goblin can take the Disengage or Hide action as a bonus action on each of its turns.\n\n### Actions\n***Scimitar.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 5 (1d6+2) slashing damage.\n\n***Shortbow.*** *Ranged Weapon Attack:* +4 to hit, range 80/320 ft., one target. *Hit:* 5 (1d6+2) piercing damage."
};

export default SRD_MONSTER_GOBLIN;