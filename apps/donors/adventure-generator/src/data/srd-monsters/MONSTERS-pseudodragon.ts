
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_PSEUDODRAGON: SavedMonster = {
  "id": "srd-pseudodragon",
  "name": "Pseudodragon",
  "description": "A pseudodragon is a tiny, cat-sized dragon with a sinuous body and a barbed tail. They are shy, intelligent creatures that form telepathic bonds with worthy companions.",
  "profile": {
    "table": {
      "creatureType": "Tiny dragon",
      "size": "Tiny",
      "alignment": "neutral good",
      "armorClass": "13 (natural armor)",
      "hitPoints": "7 (2d4+2)",
      "speed": "15 ft., fly 60 ft.",
      "senses": "blindsight 10 ft., darkvision 60 ft., passive Perception 13",
      "languages": "understands Common and Draconic but can't speak",
      "challengeRating": "1/4 (50 XP)",
      "keyAbilities": "STR -2, DEX +2, CON +1, INT +0, WIS +1, CHA +0",
      "role": "Scout"
    },
    "abilitiesAndTraits": "**Keen Senses.** The pseudodragon has advantage on Wisdom (Perception) checks that rely on sight, hearing, or smell.\n\n**Magic Resistance.** The pseudodragon has advantage on saving throws against spells and other magical effects.\n\n**Limited Telepathy.** The pseudodragon can magically communicate simple ideas, emotions, and images telepathically with any creature within 100 feet of it that can understand a language.",
    "actions": "**Bite.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 4 (1d4+2) piercing damage.\n\n**Sting.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 4 (1d4+2) piercing damage, and the target must succeed on a DC 11 Constitution saving throw or become poisoned for 1 hour. If the saving throw fails by 5 or more, the target falls unconscious for the same duration, or until it takes damage or another creature uses an action to shake it awake.",
    "roleplayingAndTactics": "Pseudodragons are not aggressive and will avoid combat. If forced to fight, they use their flight to stay out of reach, striking with their venomous tail stinger. They are fiercely loyal to their bonded companions."
  },
  "statblock": "### Pseudodragon\n\n*Tiny dragon, neutral good*\n\n___\n\n- **Armor Class** 13 (natural armor)\n\n- **Hit Points** 7 (2d4+2)\n\n- **Speed** 15 ft., fly 60 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 6 (-2) | 15 (+2) | 13 (+1) | 10 (+0) | 12 (+1) | 10 (+0) |\n\n___\n\n- **Skills** Perception +3, Stealth +4\n\n- **Senses** blindsight 10 ft., darkvision 60 ft., passive Perception 13\n\n- **Languages** understands Common and Draconic but can't speak\n\n- **Challenge** 1/4 (50 XP)\n\n___\n\n***Keen Senses.*** The pseudodragon has advantage on Wisdom (Perception) checks that rely on sight, hearing, or smell.\n\n***Magic Resistance.*** The pseudodragon has advantage on saving throws against spells and other magical effects.\n\n***Limited Telepathy.*** The pseudodragon can magically communicate simple ideas, emotions, and images telepathically with any creature within 100 feet of it that can understand a language.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 4 (1d4+2) piercing damage.\n\n***Sting.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 4 (1d4+2) piercing damage, and the target must succeed on a DC 11 Constitution saving throw or become poisoned for 1 hour. If the saving throw fails by 5 or more, the target falls unconscious for the same duration, or until it takes damage or another creature uses an action to shake it awake."
};

export default SRD_MONSTER_PSEUDODRAGON;
