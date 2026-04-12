

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_HYENA: SavedMonster = {
  "id": "srd-hyena",
  "name": "Hyena",
  "description": "These carnivorous mammals are notorious scavengers, known for their eerie, laughing calls. They hunt in packs, using numbers to bring down larger prey.",
  "profile": {
    "table": {
      "creatureType": "Medium beast",
      "size": "Medium",
      "alignment": "unaligned",
      "armorClass": "11",
      "hitPoints": "5 (1d8+1)",
      "speed": "50 ft.",
      "senses": "passive Perception 13",
      "languages": "-",
      "challengeRating": "0 (10 XP)",
      "keyAbilities": "STR +0, DEX +1, CON +1, INT -4, WIS +1, CHA -3",
      "role": "Minion"
    },
    "abilitiesAndTraits": "**Pack Tactics.** The hyena has advantage on an attack roll against a creature if at least one of the hyena's allies is within 5 feet of the creature and the ally isn't incapacitated.",
    "actions": "**Bite.** *Melee Weapon Attack:* +2 to hit, reach 5 ft., one target. *Hit:* 3 (1d6) piercing damage.",
    "roleplayingAndTactics": "Hyenas are cowardly on their own but become bold and aggressive in a pack. They use their Pack Tactics to swarm and overwhelm a single target, nipping and harrying it from all sides. They will flee from a determined or well-armed foe."
  },
  "statblock": "### Hyena\n\n*Medium beast, unaligned*\n\n___\n\n- **Armor Class** 11\n\n- **Hit Points** 5 (1d8+1)\n\n- **Speed** 50 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 11 (+0) | 13 (+1) | 12 (+1) | 2 (-4) | 12 (+1) | 5 (-3) |\n\n___\n\n- **Skills** Perception +3\n\n- **Senses** passive Perception 13\n\n- **Languages** -\n\n- **Challenge** 0 (10 XP)\n\n___\n\n***Pack Tactics.*** The hyena has advantage on an attack roll against a creature if at least one of the hyena's allies is within 5 feet of the creature and the ally isn't incapacitated.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +2 to hit, reach 5 ft., one target. *Hit:* 3 (1d6) piercing damage."
};

export default SRD_MONSTER_HYENA;