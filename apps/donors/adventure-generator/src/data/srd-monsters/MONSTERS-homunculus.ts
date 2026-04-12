

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_HOMUNCULUS: SavedMonster = {
  "id": "srd-homunculus",
  "name": "Homunculus",
  "description": "A homunculus is a tiny, winged construct created by a spellcaster to serve as a spy, messenger, and assistant. It is a living extension of its master's will.",
  "profile": {
    "table": {
      "creatureType": "Tiny construct",
      "size": "Tiny",
      "alignment": "neutral",
      "armorClass": "13 (natural armor)",
      "hitPoints": "5 (2d4)",
      "speed": "20 ft., fly 40 ft.",
      "senses": "darkvision 60 ft., passive Perception 10",
      "languages": "understands the languages of its creator but can't speak",
      "challengeRating": "0 (10 XP)",
      "keyAbilities": "STR -3, DEX +2, CON +0, INT +0, WIS +0, CHA -2",
      "role": "Scout"
    },
    "abilitiesAndTraits": "**Telepathic Bond.** While the homunculus is on the same plane of existence as its master, it can magically convey what it senses to its master, and the two can communicate telepathically.",
    "actions": "**Bite.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 1 piercing damage, and the target must succeed on a DC 10 Constitution saving throw or be poisoned for 1 minute. If the saving throw fails by 5 or more, the target is instead poisoned for 5 (1d10) minutes and unconscious while poisoned in this way.",
    "roleplayingAndTactics": "A homunculus avoids combat at all costs, using its flight and small size to stay out of harm's way. Its primary role is to act as a scout, using its telepathic bond to relay information back to its creator. If forced to fight, it delivers a venomous bite before attempting to flee."
  },
  "statblock": "### Homunculus\n\n*Tiny construct, neutral*\n\n___\n\n- **Armor Class** 13 (natural armor)\n\n- **Hit Points** 5 (2d4)\n\n- **Speed** 20 ft., fly 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 4 (-3) | 15 (+2) | 11 (+0) | 10 (+0) | 10 (+0) | 7 (-2) |\n\n___\n\n- **Senses** darkvision 60 ft., passive Perception 10\n\n- **Languages** understands the languages of its creator but can't speak\n\n- **Challenge** 0 (10 XP)\n\n___\n\n***Telepathic Bond.*** While the homunculus is on the same plane of existence as its master, it can magically convey what it senses to its master, and the two can communicate telepathically.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 1 piercing damage, and the target must succeed on a DC 10 Constitution saving throw or be poisoned for 1 minute. If the saving throw fails by 5 or more, the target is instead poisoned for 5 (1d10) minutes and unconscious while poisoned in this way."
};

export default SRD_MONSTER_HOMUNCULUS;