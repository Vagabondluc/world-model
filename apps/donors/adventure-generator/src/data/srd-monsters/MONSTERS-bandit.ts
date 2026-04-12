import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_BANDIT: SavedMonster = {
  "id": "srd-bandit",
  "name": "Bandit",
  "description": "Bandits are common robbers and highwaymen, preying on travelers and remote farmsteads. They are motivated by greed and are often little more than bullies with weapons.",
  "profile": {
    "table": {
      "creatureType": "Medium humanoid (any race)",
      "size": "Medium",
      "alignment": "any non-lawful alignment",
      "armorClass": "12 (leather armor)",
      "hitPoints": "11 (2d8 + 2)",
      "speed": "30 ft.",
      "senses": "passive Perception 10",
      "languages": "any one language (usually Common)",
      "challengeRating": "1/8 (25 XP)",
      "keyAbilities": "STR +0, DEX +1, CON +1, INT +0, WIS +0, CHA +0",
      "role": "Minion"
    },
    "abilitiesAndTraits": "",
    "actions": "**Scimitar.** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 4 (1d6 + 1) slashing damage.\n\n**Light Crossbow.** *Ranged Weapon Attack:* +3 to hit, range 80/320 ft., one target. *Hit:* 5 (1d8 + 1) piercing damage.",
    "roleplayingAndTactics": "Bandits rely on surprise and superior numbers. They will often start an ambush with a volley of crossbow bolts before charging into melee. They are cowardly and will flee if they face a determined or powerful foe, especially if their leader is defeated."
  },
  "statblock": "### Bandit\n\n*Medium humanoid (any race), any non-lawful alignment*\n\n___\n\n- **Armor Class** 12 (leather armor)\n\n- **Hit Points** 11 (2d8 + 2)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 11 (+0) | 12 (+1) | 12 (+1) | 10 (+0) | 10 (+0) | 10 (+0) |\n\n___\n\n- **Senses** passive Perception 10\n\n- **Languages** any one language (usually Common)\n\n- **Challenge** 1/8 (25 XP)\n\n___\n\n### Actions\n***Scimitar.*** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 4 (1d6 + 1) slashing damage.\n\n***Light Crossbow.*** *Ranged Weapon Attack:* +3 to hit, range 80/320 ft., one target. *Hit:* 5 (1d8 + 1) piercing damage."
};

export default SRD_MONSTER_BANDIT;