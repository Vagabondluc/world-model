
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_SATYR: SavedMonster = {
  "id": "srd-satyr",
  "name": "Satyr",
  "description": "Satyrs are fey creatures who are half-man and half-goat, known for their love of revelry, music, and mischief. They roam the wild forests, celebrating life with wild abandon.",
  "profile": {
    "table": {
      "creatureType": "Medium fey",
      "size": "Medium",
      "alignment": "chaotic neutral",
      "armorClass": "14 (leather armor)",
      "hitPoints": "31 (7d8)",
      "speed": "40 ft.",
      "senses": "passive Perception 12",
      "languages": "Common, Elvish, Sylvan",
      "challengeRating": "1/2 (100 XP)",
      "keyAbilities": "STR +1, DEX +3, CON +0, INT +1, WIS +0, CHA +2",
      "role": "Controller"
    },
    "abilitiesAndTraits": "**Magic Resistance.** The satyr has advantage on saving throws against spells and other magical effects.",
    "actions": "**Ram.** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 6 (2d4+1) bludgeoning damage.\n\n**Shortsword.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 6 (1d6+3) piercing damage.\n\n**Shortbow.** *Ranged Weapon Attack:* +5 to hit, range 80/320 ft., one target. *Hit:* 6 (1d6+3) piercing damage.\n\n**Pipes.** The satyr plays its pipes and chooses one of the following magical effects: charm, fear, or sleep. Each creature in a 30-foot radius must make a DC 13 Wisdom saving throw.",
    "roleplayingAndTactics": "Satyrs are not malicious, but their pranks can sometimes be dangerous. They will try to charm or trick intruders into joining their revels. If forced to fight, they are surprisingly quick, using their rams to knock foes down and their pipes to charm or frighten them."
  },
  "statblock": "### Satyr\n\n*Medium fey, chaotic neutral*\n\n___\n\n- **Armor Class** 14 (leather armor)\n\n- **Hit Points** 31 (7d8)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 12 (+1) | 16 (+3) | 11 (+0) | 12 (+1) | 10 (+0) | 14 (+2) |\n\n___\n\n- **Skills** Perception +2, Performance +6, Stealth +5\n\n- **Senses** passive Perception 12\n\n- **Languages** Common, Elvish, Sylvan\n\n- **Challenge** 1/2 (100 XP)\n\n___\n\n***Magic Resistance.*** The satyr has advantage on saving throws against spells and other magical effects.\n\n### Actions\n***Ram.*** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 6 (2d4+1) bludgeoning damage.\n\n***Shortsword.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 6 (1d6+3) piercing damage.\n\n***Shortbow.*** *Ranged Weapon Attack:* +5 to hit, range 80/320 ft., one target. *Hit:* 6 (1d6+3) piercing damage."
};

export default SRD_MONSTER_SATYR;
