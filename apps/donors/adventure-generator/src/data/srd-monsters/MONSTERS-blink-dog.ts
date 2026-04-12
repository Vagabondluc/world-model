

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_BLINK_DOG: SavedMonster = {
  "id": "srd-blink-dog",
  "name": "Blink Dog",
  "description": "These intelligent, canine creatures of the Feywild have the innate ability to teleport, making them elusive and unpredictable.",
  "profile": {
    "table": {
      "creatureType": "Medium fey",
      "size": "Medium",
      "alignment": "lawful good",
      "armorClass": "13",
      "hitPoints": "22 (4d8+4)",
      "speed": "40 ft.",
      "senses": "passive Perception 13",
      "languages": "Blink Dog, understands Sylvan but can't speak it",
      "challengeRating": "1/4 (50 XP)",
      "keyAbilities": "STR +1, DEX +3, CON +1, INT +0, WIS +1, CHA +0",
      "role": "Skirmisher"
    },
    "abilitiesAndTraits": "**Keen Hearing and Smell.** The dog has advantage on Wisdom (Perception) checks that rely on hearing or smell.",
    "actions": "**Bite.** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 4 (1d6+1) piercing damage.\n\n**Teleport (Recharge 4-6).** The dog magically teleports, along with any equipment it is wearing or carrying, up to 40 feet to an unoccupied space it can see. Before or after teleporting, the dog can make one bite attack.",
    "roleplayingAndTactics": "Blink dogs are noble creatures that hunt in packs. They use their teleport ability to flank enemies, appearing and disappearing in an instant to make coordinated strikes. They are fierce enemies of displacer beasts and will often aid creatures who hunt them."
  },
  "statblock": "### Blink Dog\n\n*Medium fey, lawful good*\n\n___\n\n- **Armor Class** 13\n\n- **Hit Points** 22 (4d8+4)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 12 (+1) | 17 (+3) | 12 (+1) | 10 (+0) | 13 (+1) | 11 (+0) |\n\n___\n\n- **Skills** Perception +3, Stealth +5\n\n- **Senses** passive Perception 13\n\n- **Languages** Blink Dog, understands Sylvan but can't speak it\n\n- **Challenge** 1/4 (50 XP)\n\n___\n\n***Keen Hearing and Smell.*** The dog has advantage on Wisdom (Perception) checks that rely on hearing or smell.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 4 (1d6+1) piercing damage.\n\n***Teleport (Recharge 4-6).*** The dog magically teleports, along with any equipment it is wearing or carrying, up to 40 feet to an unoccupied space it can see. Before or after teleporting, the dog can make one bite attack."
};

export default SRD_MONSTER_BLINK_DOG;