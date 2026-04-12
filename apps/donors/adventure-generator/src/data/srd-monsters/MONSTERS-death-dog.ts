
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_DEATH_DOG: SavedMonster = {
  "id": "srd-death-dog",
  "name": "Death Dog",
  "description": "A foul, two-headed hound that roams deserts and wastelands. Its bite carries a dreadful, flesh-rotting disease.",
  "profile": {
    "table": {
      "creatureType": "Medium monstrosity",
      "size": "Medium",
      "alignment": "neutral evil",
      "armorClass": "12",
      "hitPoints": "39 (6d8+12)",
      "speed": "40 ft.",
      "senses": "darkvision 120 ft., passive Perception 15",
      "languages": "-",
      "challengeRating": "1 (200 XP)",
      "keyAbilities": "STR +2, DEX +2, CON +2, INT -4, WIS +1, CHA -2",
      "role": "Skirmisher"
    },
    "abilitiesAndTraits": "**Two-Headed.** The dog has advantage on Wisdom (Perception) checks and on saving throws against being blinded, charmed, deafened, frightened, stunned, or knocked unconscious.",
    "actions": "**Multiattack.** The dog makes two bite attacks.\n\n**Bite.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 5 (1d6+2) piercing damage. If the target is a creature, it must succeed on a DC 12 Constitution saving throw against disease or become poisoned until the disease is cured. Every 24 hours that elapse, the creature must repeat the saving throw, reducing its hit point maximum by 5 (1d10) on a failure. This reduction lasts until the disease is cured. The creature dies if the disease reduces its hit point maximum to 0.",
    "roleplayingAndTactics": "Death dogs are pack hunters, using their superior numbers and multi-headed perception to track prey. In combat, they swarm a target, making multiple bite attacks to inflict their debilitating disease. They are tenacious and will fight until slain."
  },
  "statblock": "### Death Dog\n\n*Medium monstrosity, neutral evil*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 39 (6d8+12)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 15 (+2) | 14 (+2) | 14 (+2) | 3 (-4) | 13 (+1) | 6 (-2) |\n\n___\n\n- **Skills** Perception +5, Stealth +4\n\n- **Senses** darkvision 120 ft., passive Perception 15\n\n- **Languages** -\n\n- **Challenge** 1 (200 XP)\n\n___\n\n***Two-Headed.*** The dog has advantage on Wisdom (Perception) checks and on saving throws against being blinded, charmed, deafened, frightened, stunned, or knocked unconscious.\n\n### Actions\n***Multiattack.*** The dog makes two bite attacks.\n\n***Bite.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 5 (1d6+2) piercing damage. If the target is a creature, it must succeed on a DC 12 Constitution saving throw against disease or become poisoned until the disease is cured. Every 24 hours that elapse, the creature must repeat the saving throw, reducing its hit point maximum by 5 (1d10) on a failure. This reduction lasts until the disease is cured. The creature dies if the disease reduces its hit point maximum to 0."
};

export default SRD_MONSTER_DEATH_DOG;