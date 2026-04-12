
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_STIRGE: SavedMonster = {
  "id": "srd-stirge",
  "name": "Stirge",
  "description": "Stirges are flying monstrosities that resemble a cross between a giant mosquito and a bat. They are blood-drinkers that attack in swarms, their sharp proboscis draining the life from their victims.",
  "profile": {
    "table": {
      "creatureType": "Tiny beast",
      "size": "Tiny",
      "alignment": "unaligned",
      "armorClass": "14 (natural armor)",
      "hitPoints": "2 (1d4)",
      "speed": "10 ft., fly 40 ft.",
      "senses": "darkvision 60 ft., passive Perception 9",
      "languages": "-",
      "challengeRating": "1/8 (25 XP)",
      "keyAbilities": "STR -3, DEX +3, CON +0, INT -4, WIS -1, CHA -2",
      "role": "Ambusher"
    },
    "abilitiesAndTraits": "",
    "actions": "**Blood Drain.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one creature. *Hit:* 5 (1d4+3) piercing damage, and the stirge attaches to the target. While attached, the stirge doesn't attack. Instead, at the start of each of the stirge's turns, the target loses 5 (1d4+3) hit points due to blood loss.",
    "roleplayingAndTactics": "Stirges are simple creatures driven by hunger. They will fly at the nearest living creature and attempt to attach with their Blood Drain attack. Once attached, they will drink until they are full or killed."
  },
  "statblock": "### Stirge\n\n*Tiny beast, unaligned*\n\n___\n\n- **Armor Class** 14 (natural armor)\n\n- **Hit Points** 2 (1d4)\n\n- **Speed** 10 ft., fly 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 4 (-3) | 16 (+3) | 11 (+0) | 2 (-4) | 8 (-1) | 6 (-2) |\n\n___\n\n- **Senses** darkvision 60 ft., passive Perception 9\n\n- **Languages** -\n\n- **Challenge** 1/8 (25 XP)\n\n___\n\n### Actions\n***Blood Drain.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one creature. *Hit:* 5 (1d4+3) piercing damage, and the stirge attaches to the target. While attached, the stirge doesn't attack. Instead, at the start of each of the stirge's turns, the target loses 5 (1d4+3) hit points due to blood loss."
};

export default SRD_MONSTER_STIRGE;