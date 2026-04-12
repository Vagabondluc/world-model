
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_FIRE_GIANT: SavedMonster = {
  "id": "srd-fire-giant",
  "name": "Fire Giant",
  "description": "Fire giants are masters of the forge and war, dwelling in volcanic fortresses. They are rigid, militaristic, and see themselves as the rightful rulers of the giant world.",
  "profile": {
    "table": {
      "creatureType": "Huge giant",
      "size": "Huge",
      "alignment": "lawful evil",
      "armorClass": "18 (plate)",
      "hitPoints": "162 (13d12+78)",
      "speed": "30 ft.",
      "senses": "passive Perception 16",
      "languages": "Giant",
      "challengeRating": "9 (5,000 XP)",
      "keyAbilities": "STR +7, DEX -1, CON +6, INT +0, WIS +2, CHA +1",
      "role": ""
    },
    "savingThrows": {
      "str": 11,
      "con": 10,
      "wis": 6
    },
    "abilitiesAndTraits": "",
    "actions": "**Multiattack.** The giant makes two greatsword attacks.\n\n**Greatsword.** *Melee Weapon Attack:* +11 to hit, reach 10 ft., one target. *Hit:* 28 (6d6+7) slashing damage.",
    "roleplayingAndTactics": "Fire giants fight with military discipline. They will soften up targets with thrown rocks before closing to melee with their massive greatswords. They are immune to fire and often use the hazardous terrain of their volcanic lairs to their advantage."
  },
  "statblock": "### Fire Giant\n\n*Huge giant, lawful evil*\n\n___\n\n- **Armor Class** 18 (plate)\n\n- **Hit Points** 162 (13d12+78)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 25 (+7) | 9 (-1) | 23 (+6) | 10 (+0) | 14 (+2) | 13 (+1) |\n\n___\n\n- **Saving Throws** Str +11, Con +10, Wis +6\n- **Skills** Athletics +11, Perception +6\n\n- **Senses** passive Perception 16\n\n- **Languages** Giant\n\n- **Challenge** 9 (5,000 XP)\n\n___\n\n### Actions\n***Multiattack.*** The giant makes two greatsword attacks.\n\n***Greatsword.*** *Melee Weapon Attack:* +11 to hit, reach 10 ft., one target. *Hit:* 28 (6d6+7) slashing damage."
};

export default SRD_MONSTER_FIRE_GIANT;