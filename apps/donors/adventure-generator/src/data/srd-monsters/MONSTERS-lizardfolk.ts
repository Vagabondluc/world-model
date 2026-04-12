

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_LIZARDFOLK: SavedMonster = {
  "id": "srd-lizardfolk",
  "name": "Lizardfolk",
  "description": "Lizardfolk are primitive, reptilian humanoids who live in swamps and marshes. They are territorial and view other humanoids as either threats or food.",
  "profile": {
    "table": {
      "creatureType": "Medium humanoid (lizardfolk)",
      "size": "Medium",
      "alignment": "neutral",
      "armorClass": "15 (natural armor, shield)",
      "hitPoints": "22 (4d8+4)",
      "speed": "30 ft., swim 30 ft.",
      "senses": "passive Perception 13",
      "languages": "Draconic",
      "challengeRating": "1/2 (100 XP)",
      "keyAbilities": "STR +2, DEX +0, CON +1, INT -2, WIS +1, CHA -2",
      "role": "Soldier"
    },
    "abilitiesAndTraits": "**Hold Breath.** The lizardfolk can hold its breath for 15 minutes.",
    "actions": "**Multiattack.** The lizardfolk makes two melee attacks, each one with a different weapon.\n\n**Bite.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 5 (1d6+2) piercing damage.\n\n**Heavy Club.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 5 (1d6+2) bludgeoning damage.\n\n**Javelin.** *Melee or Ranged Weapon Attack:* +4 to hit, reach 5 ft. or range 30/120 ft., one target. *Hit:* 5 (1d6+2) piercing damage.",
    "roleplayingAndTactics": "Lizardfolk are pragmatic hunters and warriors. They use their natural environment for ambushes, emerging from the water to attack. They fight with a cold, alien intelligence, using their multiattack to overwhelm a single target. They are known to craft weapons from the bones of their enemies."
  },
  "statblock": "### Lizardfolk\n\n*Medium humanoid (lizardfolk), neutral*\n\n___\n\n- **Armor Class** 15 (natural armor, shield)\n\n- **Hit Points** 22 (4d8+4)\n\n- **Speed** 30 ft., swim 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 15 (+2) | 10 (+0) | 13 (+1) | 7 (-2) | 12 (+1) | 7 (-2) |\n\n___\n\n- **Skills** Perception +3, Stealth +4, Survival +5\n\n- **Senses** passive Perception 13\n\n- **Languages** Draconic\n\n- **Challenge** 1/2 (100 XP)\n\n___\n\n***Hold Breath.*** The lizardfolk can hold its breath for 15 minutes.\n\n### Actions\n***Multiattack.*** The lizardfolk makes two melee attacks, each one with a different weapon.\n\n***Bite.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 5 (1d6+2) piercing damage.\n\n***Heavy Club.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 5 (1d6+2) bludgeoning damage.\n\n***Javelin.*** *Melee or Ranged Weapon Attack:* +4 to hit, reach 5 ft. or range 30/120 ft., one target. *Hit:* 5 (1d6+2) piercing damage."
};

export default SRD_MONSTER_LIZARDFOLK;