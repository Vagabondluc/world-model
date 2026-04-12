

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_MANTICORE: SavedMonster = {
  "id": "srd-manticore",
  "name": "Manticore",
  "description": "A manticore has the body of a lion, the wings of a dragon, and a humanoid face. Its tail ends in a cluster of deadly spikes that it can launch at its enemies. They are cruel, intelligent predators that enjoy tormenting their prey.",
  "profile": {
    "table": {
      "creatureType": "Large monstrosity",
      "size": "Large",
      "alignment": "lawful evil",
      "armorClass": "14 (natural armor)",
      "hitPoints": "68 (8d10+24)",
      "speed": "30 ft., fly 50 ft.",
      "senses": "darkvision 60 ft., passive Perception 11",
      "languages": "Common",
      "challengeRating": "3 (700 XP)",
      "keyAbilities": "STR +3, DEX +3, CON +3, INT -2, WIS +1, CHA -1",
      "role": "Artillery"
    },
    "abilitiesAndTraits": "**Tail Spike Regrowth.** The manticore has twenty-four tail spikes. Used spikes regrow when the manticore finishes a long rest.",
    "actions": "**Multiattack.** The manticore makes three attacks: one with its bite and two with its claws or three with its tail spikes.\n\n**Bite.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 7 (1d8+3) piercing damage.\n\n**Claw.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 6 (1d6+3) slashing damage.\n\n**Tail Spike.** *Ranged Weapon Attack:* +5 to hit, range 100/200 ft., one target. *Hit:* 7 (1d8+3) piercing damage.",
    "roleplayingAndTactics": "Manticores are intelligent enough to speak and will often taunt their victims. They prefer to fight from the air, loosing volleys of tail spikes before descending to finish off weakened foes with their bite and claws. They are motivated by a relentless hunger for humanoid flesh."
  },
  "statblock": "### Manticore\n\n*Large monstrosity, lawful evil*\n\n___\n\n- **Armor Class** 14 (natural armor)\n\n- **Hit Points** 68 (8d10+24)\n\n- **Speed** 30 ft., fly 50 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 17 (+3) | 16 (+3) | 17 (+3) | 7 (-2) | 12 (+1) | 8 (-1) |\n\n___\n\n- **Senses** darkvision 60 ft., passive Perception 11\n\n- **Languages** Common\n\n- **Challenge** 3 (700 XP)\n\n___\n\n***Tail Spike Regrowth.*** The manticore has twenty-four tail spikes. Used spikes regrow when the manticore finishes a long rest.\n\n### Actions\n***Multiattack.*** The manticore makes three attacks: one with its bite and two with its claws or three with its tail spikes.\n\n***Bite.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 7 (1d8+3) piercing damage.\n\n***Claw.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 6 (1d6+3) slashing damage.\n\n***Tail Spike.*** *Ranged Weapon Attack:* +5 to hit, range 100/200 ft., one target. *Hit:* 7 (1d8+3) piercing damage."
};

export default SRD_MONSTER_MANTICORE;