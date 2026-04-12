import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_MUMMY_LORD: SavedMonster = {
  "id": "srd-mummy-lord",
  "name": "Mummy Lord",
  "description": "A mummy lord is the preserved and reanimated corpse of a powerful priest or monarch, granted terrible unlife by dark rituals. It retains its intelligence and magical prowess, ruling over its dusty tomb with ancient authority.",
  "profile": {
    "table": {
      "creatureType": "Medium undead",
      "size": "Medium",
      "alignment": "lawful evil",
      "armorClass": "17 (natural armor)",
      "hitPoints": "97 (13d8+39)",
      "speed": "20 ft.",
      "senses": "darkvision 60 ft., passive Perception 14",
      "languages": "the languages it knew in life",
      "challengeRating": "15 (13,000 XP)",
      "keyAbilities": "STR +4, DEX +0, CON +3, INT +0, WIS +4, CHA +3",
      "role": "Controller"
    },
    "savingThrows": {
      "con": 8,
      "int": 5,
      "wis": 9,
      "cha": 8
    },
    "abilitiesAndTraits": "**Magic Resistance.** The mummy lord has advantage on saving throws against spells and other magical effects.\n\n**Rejuvenation.** A destroyed mummy lord gains a new body in 24 hours if its heart is intact, regaining all its hit points and becoming active again. The new body appears within 5 feet of the mummy lord's heart.\n\n**Spellcasting.** The mummy lord is a 10th-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 17, +9 to hit with spell attacks). The mummy lord has the following cleric spells prepared:",
    "actions": "**Multiattack.** The mummy can use its Dreadful Glare and makes one attack with its rotting fist.\n\n**Rotting Fist.** *Melee Weapon Attack:* +9 to hit, reach 5 ft., one target. *Hit:* 14 (3d6+4) bludgeoning damage plus 21 (6d6) necrotic damage. If the target is a creature, it must succeed on a DC 16 Constitution saving throw or be cursed with mummy rot. The cursed target can't regain hit points, and its hit point maximum decreases by 10 (3d6) for every 24 hours that elapse. If the curse reduces the target's hit point maximum to 0, the target dies, and its body turns to dust. The curse lasts until removed by the *remove curse* spell or other magic.\n\n**Dreadful Glare.** The mummy lord targets one creature it can see within 60 feet of it. If the target can see the mummy lord, it must succeed on a DC 16 Wisdom saving throw against this magic or become frightened until the end of the mummy's next turn. If the target fails the saving throw by 5 or more, it is also paralyzed for the same duration. A target that succeeds on the saving throw is immune to the Dreadful Glare of all mummies and mummy lords for the next 24 hours.",
    "roleplayingAndTactics": "A mummy lord is a brilliant and patient strategist. It will use its spells and Dreadful Glare to control the battlefield from a distance, allowing its lesser undead servants to engage intruders. It only enters melee to deliver its rotting curse to a particularly troublesome foe. Its main goal is to protect its tomb, and it will use all its cunning to do so."
  },
  "statblock": "### Mummy Lord\n\n*Medium undead, lawful evil*\n\n___\n\n- **Armor Class** 17 (natural armor)\n\n- **Hit Points** 97 (13d8+39)\n\n- **Speed** 20 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 18 (+4) | 10 (+0) | 17 (+3) | 11 (+0) | 18 (+4) | 16 (+3) |\n\n___\n\n- **Saving Throws** Con +8, Int +5, Wis +9, Cha +8\n- **Skills** History +5, Religion +5\n\n- **Senses** darkvision 60 ft., passive Perception 14\n\n- **Languages** the languages it knew in life\n\n- **Challenge** 15 (13,000 XP)\n\n___\n\n***Magic Resistance.*** The mummy lord has advantage on saving throws against spells and other magical effects.\n\n***Rejuvenation.*** A destroyed mummy lord gains a new body in 24 hours if its heart is intact, regaining all its hit points and becoming active again. The new body appears within 5 feet of the mummy lord's heart.\n\n***Spellcasting.*** The mummy lord is a 10th-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 17, +9 to hit with spell attacks). The mummy lord has the following cleric spells prepared:\n\n### Actions\n***Multiattack.*** The mummy can use its Dreadful Glare and makes one attack with its rotting fist.\n\n***Rotting Fist.*** *Melee Weapon Attack:* +9 to hit, reach 5 ft., one target. *Hit:* 14 (3d6+4) bludgeoning damage plus 21 (6d6) necrotic damage. If the target is a creature, it must succeed on a DC 16 Constitution saving throw or be cursed with mummy rot. The cursed target can't regain hit points, and its hit point maximum decreases by 10 (3d6) for every 24 hours that elapse. If the curse reduces the target's hit point maximum to 0, the target dies, and its body turns to dust. The curse lasts until removed by the *remove curse* spell or other magic.\n\n***Dreadful Glare.*** The mummy lord targets one creature it can see within 60 feet of it. If the target can see the mummy lord, it must succeed on a DC 16 Wisdom saving throw against this magic or become frightened until the end of the mummy's next turn. If the target fails the saving throw by 5 or more, it is also paralyzed for the same duration. A target that succeeds on the saving throw is immune to the Dreadful Glare of all mummies and mummy lords for the next 24 hours."
};

export default SRD_MONSTER_MUMMY_LORD;