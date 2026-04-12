
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_BERSERKER: SavedMonster = {
  "id": "srd-berserker",
  "name": "Berserker",
  "description": "These savage warriors can enter a battle rage, ignoring their own safety for a chance to inflict devastating wounds upon their enemies.",
  "profile": {
    "table": {
      "creatureType": "Medium humanoid (any race)",
      "size": "Medium",
      "alignment": "any chaotic alignment",
      "armorClass": "13 (hide armor)",
      "hitPoints": "67 (9d8 + 27)",
      "speed": "30 ft.",
      "senses": "passive Perception 10",
      "languages": "any one language (usually Common)",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +3, DEX +1, CON +3, INT -1, WIS +0, CHA -1",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Reckless.** At the start of its turn, the berserker can gain advantage on all melee weapon attack rolls during that turn, but attack rolls against it have advantage until the start of its next turn.",
    "actions": "**Greataxe.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 9 (1d12 + 3) slashing damage.",
    "roleplayingAndTactics": "A berserker lives for battle. They will use their Reckless ability every round, charging the nearest enemy and swinging their greataxe wildly. They have no sense of self-preservation and will fight to the death."
  },
  "statblock": "### Berserker\n\n*Medium humanoid (any race), any chaotic alignment*\n\n___\n\n- **Armor Class** 13 (hide armor)\n\n- **Hit Points** 67 (9d8 + 27)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 16 (+3) | 12 (+1) | 17 (+3) | 9 (-1) | 11 (+0) | 9 (-1) |\n\n___\n\n- **Senses** passive Perception 10\n\n- **Languages** any one language (usually Common)\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***Reckless.*** At the start of its turn, the berserker can gain advantage on all melee weapon attack rolls during that turn, but attack rolls against it have advantage until the start of its next turn.\n\n### Actions\n***Greataxe.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 9 (1d12 + 3) slashing damage."
};

export default SRD_MONSTER_BERSERKER;
