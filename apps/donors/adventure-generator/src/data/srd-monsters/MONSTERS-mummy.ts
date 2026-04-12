import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_MUMMY: SavedMonster = {
  "id": "srd-mummy",
  "name": "Mummy",
  "description": "A mummy is the preserved corpse of a mortal, animated by dark funerary rights to guard its tomb for eternity.",
  "profile": {
    "table": {
      "creatureType": "Medium undead",
      "size": "Medium",
      "alignment": "lawful evil",
      "armorClass": "11 (natural armor)",
      "hitPoints": "58 (9d8+18)",
      "speed": "20 ft.",
      "senses": "darkvision 60 ft., passive Perception 10",
      "languages": "the languages it knew in life",
      "challengeRating": "3 (700 XP)",
      "keyAbilities": "STR +3, DEX -1, CON +2, INT -2, WIS +0, CHA +1",
      "role": "Brute"
    },
    "savingThrows": {
      "wis": 2
    },
    "abilitiesAndTraits": "**Vulnerability to Fire.** The mummy is vulnerable to fire damage.",
    "actions": "**Multiattack.** The mummy can use its Dreadful Glare and makes one attack with its rotting fist.\n\n**Rotting Fist.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 10 (2d6+3) bludgeoning damage plus 10 (3d6) necrotic damage. If the target is a creature, it must succeed on a DC 12 Constitution saving throw or be cursed with mummy rot. The cursed target can't regain hit points, and its hit point maximum decreases by 10 (3d6) for every 24 hours that elapse. If the curse reduces the target's hit point maximum to 0, the target dies, and its body turns to dust. The curse lasts until removed by the *remove curse* spell or other magic.\n\n**Dreadful Glare.** The mummy targets one creature it can see within 60 ft. of it. If the target can see the mummy, it must succeed on a DC 11 Wisdom saving throw or be frightened until the end of the mummy's next turn. If the target fails the saving throw by 5 or more, it is also paralyzed for the same duration. A target that succeeds on the saving throw is immune to the Dreadful Glare of all mummies for the next 24 hours.",
    "roleplayingAndTactics": "Mummies are relentless guardians of their tombs. They move slowly but with implacable purpose. Their dreadful glare can paralyze with fear, allowing them to close in and inflict their rotting curse."
  },
  "statblock": "### Mummy\n\n*Medium undead, lawful evil*\n\n___\n\n- **Armor Class** 11 (natural armor)\n\n- **Hit Points** 58 (9d8+18)\n\n- **Speed** 20 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 16 (+3) | 8 (-1) | 15 (+2) | 6 (-2) | 10 (+0) | 12 (+1) |\n\n___\n\n- **Saving Throws** Wis +2\n- **Vulnerabilities** fire\n- **Damage Immunities** necrotic, poison\n- **Condition Immunities** charmed, exhaustion, frightened, paralyzed, poisoned\n- **Senses** darkvision 60 ft., passive Perception 10\n\n- **Languages** the languages it knew in life\n\n- **Challenge** 3 (700 XP)\n\n___\n\n### Actions\n***Multiattack.*** The mummy can use its Dreadful Glare and makes one attack with its rotting fist.\n\n***Rotting Fist.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 10 (2d6+3) bludgeoning damage plus 10 (3d6) necrotic damage. If the target is a creature, it must succeed on a DC 12 Constitution saving throw or be cursed with mummy rot. The cursed target can't regain hit points, and its hit point maximum decreases by 10 (3d6) for every 24 hours that elapse. If the curse reduces the target's hit point maximum to 0, the target dies, and its body turns to dust. The curse lasts until removed by the *remove curse* spell or other magic.\n\n***Dreadful Glare.*** The mummy targets one creature it can see within 60 ft. of it. If the target can see the mummy, it must succeed on a DC 11 Wisdom saving throw or be frightened until the end of the mummy's next turn. If the target fails the saving throw by 5 or more, it is also paralyzed for the same duration. A target that succeeds on the saving throw is immune to the Dreadful Glare of all mummies for the next 24 hours."
};

export default SRD_MONSTER_MUMMY;