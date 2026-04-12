
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_SPIRIT_NAGA: SavedMonster = {
  "id": "srd-spirit-naga",
  "name": "Spirit Naga",
  "description": "Spirit nagas are malevolent, serpentine creatures with humanoid heads. They are immortal and delight in corrupting sacred sites and enslaving mortals with their foul magic.",
  "profile": {
    "table": {
      "creatureType": "Large monstrosity",
      "size": "Large",
      "alignment": "chaotic evil",
      "armorClass": "15 (natural armor)",
      "hitPoints": "75 (10d10+20)",
      "speed": "40 ft.",
      "senses": "darkvision 60 ft., passive Perception 12",
      "languages": "Abyssal, Common",
      "challengeRating": "8 (3,900 XP)",
      "keyAbilities": "STR +4, DEX +3, CON +2, INT +3, WIS +2, CHA +3",
      "role": "Controller"
    },
    "savingThrows": {
      "dex": 6,
      "con": 5,
      "wis": 5,
      "cha": 6
    },
    "abilitiesAndTraits": "**Rejuvenation.** If it dies, the naga returns to life in 1d6 days and regains all its hit points. Only a *wish* spell can prevent this trait from functioning.\n\n**Spellcasting.** The naga is a 10th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 14, +6 to hit with spell attacks), and it needs only verbal components to cast its spells. It has the following wizard spells prepared:\n- Cantrips (at will): *mage hand, minor illusion, ray of frost*\n- 1st level (4 slots): *charm person, detect magic, sleep*\n- 2nd level (3 slots): *detect thoughts, hold person*\n- 3rd level (3 slots): *lightning bolt, water breathing*\n- 4th level (3 slots): *blight, dimension door*\n- 5th level (2 slots): *dominate person*",
    "actions": "**Bite.** *Melee Weapon Attack:* +7 to hit, reach 10 ft., one creature. *Hit:* 7 (1d6+4) piercing damage, and the target must make a DC 13 Constitution saving throw, taking 31 (7d8) poison damage on a failed save, or half as much damage on a successful one.",
    "roleplayingAndTactics": "A spirit naga is a cunning and cruel spellcaster. It will use its spells to charm and dominate its foes before closing in for a venomous bite. Its rejuvenation ability makes it a recurring threat unless its remains are properly dealt with."
  },
  "statblock": "### Spirit Naga\n\n*Large monstrosity, chaotic evil*\n\n___\n\n- **Armor Class** 15 (natural armor)\n\n- **Hit Points** 75 (10d10+20)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 18 (+4) | 17 (+3) | 14 (+2) | 16 (+3) | 15 (+2) | 16 (+3) |\n\n___\n\n- **Saving Throws** Dex +6, Con +5, Wis +5, Cha +6\n- **Senses** darkvision 60 ft., passive Perception 12\n\n- **Languages** Abyssal, Common\n\n- **Challenge** 8 (3,900 XP)\n\n___\n\n***Rejuvenation.*** If it dies, the naga returns to life in 1d6 days and regains all its hit points. Only a *wish* spell can prevent this trait from functioning.\n\n***Spellcasting.*** The naga is a 10th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 14, +6 to hit with spell attacks), and it needs only verbal components to cast its spells. It has the following wizard spells prepared:\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +7 to hit, reach 10 ft., one creature. *Hit:* 7 (1d6+4) piercing damage, and the target must make a DC 13 Constitution saving throw, taking 31 (7d8) poison damage on a failed save, or half as much damage on a successful one."
};

export default SRD_MONSTER_SPIRIT_NAGA;