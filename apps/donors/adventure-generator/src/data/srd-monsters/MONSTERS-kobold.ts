

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_KOBOLD: SavedMonster = {
  "id": "srd-kobold",
  "name": "Kobold",
  "description": "Kobolds are small, reptilian humanoids that worship dragons and dwell in dark places. They are known for their cunning trap-making and their cowardly nature, fighting with viciousness only when they have a clear advantage.",
  "profile": {
    "table": {
      "creatureType": "Small humanoid (kobold)",
      "size": "Small",
      "alignment": "lawful evil",
      "armorClass": "12",
      "hitPoints": "5 (2d6-2)",
      "speed": "30 ft.",
      "senses": "darkvision 60 ft., passive Perception 8",
      "languages": "Common, Draconic",
      "challengeRating": "1/8 (25 XP)",
      "keyAbilities": "STR -2, DEX +2, CON -1, INT -1, WIS -2, CHA -1",
      "role": "Minion"
    },
    "abilitiesAndTraits": "**Sunlight Sensitivity.** While in sunlight, the kobold has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.\n\n**Pack Tactics.** The kobold has advantage on an attack roll against a creature if at least one of the kobold's allies is within 5 feet of the creature and the ally isn't incapacitated.",
    "actions": "**Dagger.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 4 (1d4+2) piercing damage.\n\n**Sling.** *Ranged Weapon Attack:* +4 to hit, range 30/120 ft., one target. *Hit:* 4 (1d4+2) bludgeoning damage.",
    "roleplayingAndTactics": "Kobolds are not brave warriors and will use their numbers and traps to their advantage. They use Pack Tactics to swarm enemies and will flee if their leader is defeated or if they are clearly outmatched. They revere dragons and may try to serve or bargain with dragon-like creatures."
  },
  "statblock": "### Kobold\n\n*Small humanoid (kobold), lawful evil*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 5 (2d6-2)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 7 (-2) | 15 (+2) | 9 (-1) | 8 (-1) | 7 (-2) | 8 (-1) |\n\n___\n\n- **Senses** darkvision 60 ft., passive Perception 8\n\n- **Languages** Common, Draconic\n\n- **Challenge** 1/8 (25 XP)\n\n___\n\n***Sunlight Sensitivity.*** While in sunlight, the kobold has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.\n\n***Pack Tactics.*** The kobold has advantage on an attack roll against a creature if at least one of the kobold's allies is within 5 feet of the creature and the ally isn't incapacitated.\n\n### Actions\n***Dagger.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 4 (1d4+2) piercing damage.\n\n***Sling.*** *Ranged Weapon Attack:* +4 to hit, range 30/120 ft., one target. *Hit:* 4 (1d4+2) bludgeoning damage."
};

export default SRD_MONSTER_KOBOLD;