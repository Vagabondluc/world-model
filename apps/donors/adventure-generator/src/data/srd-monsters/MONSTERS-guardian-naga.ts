

// FIX: Corrected import path for SavedMonster type.
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GUARDIAN_NAGA: SavedMonster = {
  "id": "srd-guardian-naga",
  "name": "Guardian Naga",
  "description": "Guardian nagas are benevolent, serpentine creatures that guard sacred places from the forces of evil. They are wise and patient, with a powerful command of divine magic.",
  "profile": {
    "table": {
      "creatureType": "Large monstrosity",
      "size": "Large",
      "alignment": "lawful good",
      "armorClass": "18 (natural armor)",
      "hitPoints": "127 (15d10+45)",
      "speed": "40 ft.",
      "senses": "darkvision 60 ft., passive Perception 14",
      "languages": "Celestial, Common",
      "challengeRating": "10 (5,900 XP)",
      "keyAbilities": "STR +4, DEX +4, CON +3, INT +3, WIS +4, CHA +4",
      "role": "Controller"
    },
    "savingThrows": {
      "dex": 8,
      "con": 7,
      "int": 7,
      "wis": 8,
      "cha": 8
    },
    "abilitiesAndTraits": "**Rejuvenation.** If it dies, the naga returns to life in 1d6 days and regains all its hit points. Only a *wish* spell can prevent this trait from functioning.\n\n**Spellcasting.** The naga is an 11th-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 16, +8 to hit with spell attacks), and it needs only verbal components to cast its spells. It has the following cleric spells prepared:\n- Cantrips (at will): *mending, sacred flame, thaumaturgy*\n- 1st level (4 slots): *command, cure wounds, shield of faith*\n- 2nd level (3 slots): *calm emotions, hold person*\n- 3rd level (3 slots): *bestow curse, clairvoyance*\n- 4th level (3 slots): *banishment, freedom of movement*\n- 5th level (2 slots): *flame strike, geas*\n- 6th level (1 slot): *true seeing*",
    "actions": "**Bite.** *Melee Weapon Attack:* +8 to hit, reach 10 ft., one creature. *Hit:* 8 (1d8+4) piercing damage, and the target must make a DC 15 Constitution saving throw, taking 45 (10d8) poison damage on a failed save, or half as much damage on a successful one.\n\n**Spit Poison.** *Ranged Weapon Attack:* +8 to hit, range 15/30 ft., one creature. *Hit:* The target must make a DC 15 Constitution saving throw, taking 45 (10d8) poison damage on a failed save, or half as much damage on a successful one.",
    "roleplayingAndTactics": "A guardian naga prefers to use its wisdom and spells to deter intruders without violence. If combat is unavoidable, it will use spells like *hold person* and *banishment* to control the battlefield, resorting to its venomous bite or spit only against truly evil foes."
  },
  "statblock": "### Guardian Naga\n\n*Large monstrosity, lawful good*\n\n___\n\n- **Armor Class** 18 (natural armor)\n\n- **Hit Points** 127 (15d10+45)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 19 (+4) | 18 (+4) | 16 (+3) | 16 (+3) | 19 (+4) | 18 (+4) |\n\n___\n\n- **Saving Throws** Dex +8, Con +7, Int +7, Wis +8, Cha +8\n- **Senses** darkvision 60 ft., passive Perception 14\n\n- **Languages** Celestial, Common\n\n- **Challenge** 10 (5,900 XP)\n\n___\n\n***Rejuvenation.*** If it dies, the naga returns to life in 1d6 days and regains all its hit points. Only a *wish* spell can prevent this trait from functioning.\n\n***Spellcasting.*** The naga is an 11th-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 16, +8 to hit with spell attacks), and it needs only verbal components to cast its spells. It has the following cleric spells prepared:\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +8 to hit, reach 10 ft., one creature. *Hit:* 8 (1d8+4) piercing damage, and the target must make a DC 15 Constitution saving throw, taking 45 (10d8) poison damage on a failed save, or half as much damage on a successful one."
};

export default SRD_MONSTER_GUARDIAN_NAGA;