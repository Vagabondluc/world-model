
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_STONE_GIANT: SavedMonster = {
  "id": "srd-stone-giant",
  "name": "Stone Giant",
  "description": "Stone giants are reclusive, artistic giants who live in high mountain caves. They are masters of rock-throwing and view themselves as the pinnacle of giant civilization, looking down on other races as fleeting and insignificant.",
  "profile": {
    "table": {
      "creatureType": "Huge giant",
      "size": "Huge",
      "alignment": "neutral",
      "armorClass": "17 (natural armor)",
      "hitPoints": "126 (11d12+55)",
      "speed": "40 ft.",
      "senses": "darkvision 60 ft., passive Perception 14",
      "languages": "Giant",
      "challengeRating": "7 (2,900 XP)",
      "keyAbilities": "STR +6, DEX +2, CON +5, INT +0, WIS +1, CHA -1",
      "role": "Artillery"
    },
    "savingThrows": {
      "dex": 5,
      "con": 8,
      "wis": 4
    },
    "abilitiesAndTraits": "**Stone Camouflage.** The giant has advantage on Dexterity (Stealth) checks made to hide in rocky terrain.",
    "actions": "**Multiattack.** The giant makes two greatclub attacks.\n\n**Greatclub.** *Melee Weapon Attack:* +9 to hit, reach 15 ft., one target. *Hit:* 19 (3d8+6) bludgeoning damage.\n\n**Rock.** *Ranged Weapon Attack:* +9 to hit, range 60/240 ft., one target. *Hit:* 28 (4d10+6) bludgeoning damage. If the target is a creature, it must succeed on a DC 17 Strength saving throw or be knocked prone.",
    "roleplayingAndTactics": "Stone giants prefer to be left alone. If threatened, they are deadly combatants from a distance, hurling massive rocks with incredible accuracy. In melee, their greatclubs are just as dangerous. They are not inherently evil but are fiercely territorial."
  },
  "statblock": "### Stone Giant\n\n*Huge giant, neutral*\n\n___\n\n- **Armor Class** 17 (natural armor)\n\n- **Hit Points** 126 (11d12+55)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 23 (+6) | 15 (+2) | 20 (+5) | 10 (+0) | 12 (+1) | 9 (-1) |\n\n___\n\n- **Saving Throws** Dex +5, Con +8, Wis +4\n- **Skills** Athletics +12, Perception +4\n\n- **Senses** darkvision 60 ft., passive Perception 14\n\n- **Languages** Giant\n\n- **Challenge** 7 (2,900 XP)\n\n___\n\n***Stone Camouflage.*** The giant has advantage on Dexterity (Stealth) checks made to hide in rocky terrain.\n\n### Actions\n***Multiattack.*** The giant makes two greatclub attacks.\n\n***Greatclub.*** *Melee Weapon Attack:* +9 to hit, reach 15 ft., one target. *Hit:* 19 (3d8+6) bludgeoning damage.\n\n***Rock.*** *Ranged Weapon Attack:* +9 to hit, range 60/240 ft., one target. *Hit:* 28 (4d10+6) bludgeoning damage. If the target is a creature, it must succeed on a DC 17 Strength saving throw or be knocked prone."
};

export default SRD_MONSTER_STONE_GIANT;