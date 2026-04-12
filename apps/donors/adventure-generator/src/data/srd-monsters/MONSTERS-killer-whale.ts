

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_KILLER_WHALE: SavedMonster = {
  "id": "srd-killer-whale",
  "name": "Killer Whale",
  "description": "Also known as orcas, these intelligent marine mammals are powerful apex predators of the sea. They hunt in pods, using sophisticated tactics to take down large prey.",
  "profile": {
    "table": {
      "creatureType": "Huge beast",
      "size": "Huge",
      "alignment": "unaligned",
      "armorClass": "12 (natural armor)",
      "hitPoints": "90 (12d12+12)",
      "speed": "0 ft., swim 60 ft.",
      "senses": "blindsight 120 ft., passive Perception 13",
      "languages": "-",
      "challengeRating": "3 (700 XP)",
      "keyAbilities": "STR +4, DEX +0, CON +1, INT -4, WIS +1, CHA -2",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Echolocation.** The whale can't use its blindsight while deafened.\n\n**Hold Breath.** The whale can hold its breath for 30 minutes.\n\n**Keen Hearing.** The whale has advantage on Wisdom (Perception) checks that rely on hearing.",
    "actions": "**Bite.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 21 (5d6+4) piercing damage.",
    "roleplayingAndTactics": "Killer whales are intelligent pack hunters. They use their blindsight and keen hearing to coordinate attacks, often working together to isolate and attack a single target. They are not malicious but are formidable predators."
  },
  "statblock": "### Killer Whale\n\n*Huge beast, unaligned*\n\n___\n\n- **Armor Class** 12 (natural armor)\n\n- **Hit Points** 90 (12d12+12)\n\n- **Speed** 0 ft., swim 60 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 19 (+4) | 10 (+0) | 13 (+1) | 3 (-4) | 12 (+1) | 7 (-2) |\n\n___\n\n- **Skills** Perception +3\n\n- **Senses** blindsight 120 ft., passive Perception 13\n\n- **Languages** -\n\n- **Challenge** 3 (700 XP)\n\n___\n\n***Echolocation.*** The whale can't use its blindsight while deafened.\n\n***Hold Breath.*** The whale can hold its breath for 30 minutes.\n\n***Keen Hearing.*** The whale has advantage on Wisdom (Perception) checks that rely on hearing.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 21 (5d6 + 4) piercing damage."
};

export default SRD_MONSTER_KILLER_WHALE;