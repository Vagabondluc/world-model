
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_WYVERN: SavedMonster = {
  "id": "srd-wyvern",
  "name": "Wyvern",
  "description": "A lesser cousin to the true dragons, a wyvern is a winged reptilian predator with a venomous stinger on its tail. They are aggressive, territorial hunters of mountains and badlands.",
  "profile": {
    "table": {
      "creatureType": "Large dragon",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "13 (natural armor)",
      "hitPoints": "110 (13d10+39)",
      "speed": "20 ft., fly 80 ft.",
      "senses": "darkvision 60 ft., passive Perception 14",
      "languages": "-",
      "challengeRating": "6 (2,300 XP)",
      "keyAbilities": "STR +4, DEX +0, CON +3, INT -3, WIS +1, CHA -2",
      "role": ""
    },
    "savingThrows": {
      "dex": 3,
      "con": 6,
      "wis": 4,
      "cha": 2
    },
    "abilitiesAndTraits": "",
    "actions": "**Multiattack.** The wyvern makes two attacks: one with its bite and one with its stinger. While flying, it can use its claws in place of one other attack.\n\n**Bite.** *Melee Weapon Attack:* +7 to hit, reach 10 ft., one creature. *Hit:* 11 (2d6+4) piercing damage.",
    "roleplayingAndTactics": "Wyverns are aerial predators. They will dive from the sky to snatch prey with their talons or deliver a venomous sting. They are not as intelligent as true dragons and fight with a simple, brutal ferocity."
  },
  "statblock": "### Wyvern\n\n*Large dragon, unaligned*\n\n___\n\n- **Armor Class** 13 (natural armor)\n\n- **Hit Points** 110 (13d10+39)\n\n- **Speed** 20 ft., fly 80 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 19 (+4) | 10 (+0) | 16 (+3) | 5 (-3) | 12 (+1) | 6 (-2) |\n\n___\n\n- **Saving Throws** Dex +3, Con +6, Wis +4, Cha +2\n- **Skills** Perception +4\n\n- **Senses** darkvision 60 ft., passive Perception 14\n\n- **Languages** -\n\n- **Challenge** 6 (2,300 XP)\n\n___\n\n### Actions\n***Multiattack.*** The wyvern makes two attacks: one with its bite and one with its stinger. While flying, it can use its claws in place of one other attack.\n\n***Bite.*** *Melee Weapon Attack:* +7 to hit, reach 10 ft., one creature. *Hit:* 11 (2d6+4) piercing damage."
};

export default SRD_MONSTER_WYVERN;
