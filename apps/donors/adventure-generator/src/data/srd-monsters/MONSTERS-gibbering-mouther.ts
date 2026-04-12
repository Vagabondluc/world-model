import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GIBBERING_MOUTHER: SavedMonster = {
  "id": "srd-gibbering-mouther",
  "name": "Gibbering Mouther",
  "description": "A horrifying creature of flesh, eyes, and mouths, the gibbering mouther is an amorphous blob of insanity. The constant, maddening babble from its many mouths can drive creatures to madness.",
  "profile": {
    "table": {
      "creatureType": "Medium aberration",
      "size": "Medium",
      "alignment": "neutral",
      "armorClass": "9",
      "hitPoints": "67 (9d8+27)",
      "speed": "10 ft., swim 10 ft.",
      "senses": "darkvision 60 ft., passive Perception 10",
      "languages": "-",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +0, DEX -1, CON +3, INT -4, WIS +0, CHA -2",
      "role": "Controller"
    },
    "savingThrows": {
      "con": 5
    },
    "abilitiesAndTraits": "**Aberrant Ground.** The ground in a 10-foot radius around the mouther is dough-like difficult terrain. Each creature that starts its turn in that area must succeed on a DC 10 Strength saving throw or have its speed reduced to 0 until the start of its next turn.\n\n**Gibbering.** The mouther babbles incoherently while it can see any creature and isn't incapacitated. Each creature that starts its turn within 20 feet of the mouther and can hear the gibbering must succeed on a DC 10 Wisdom saving throw. On a failure, the creature can't take reactions until the start of its next turn and rolls a d8 to determine what it does during its turn. On a 1 to 4, the creature does nothing. On a 5 or 6, the creature takes no action or bonus action and uses all its movement to move in a randomly determined direction. On a 7 or 8, the creature makes a melee attack against a randomly determined creature within its reach or does nothing if it can't make such an attack.",
    "actions": "**Multiattack.** The gibbering mouther makes one bite attack and, if it can, uses its Blinding Spittle.\n\n**Bites.** *Melee Weapon Attack:* +2 to hit, reach 5 ft., one creature. *Hit:* 17 (5d6) piercing damage. If the target is Medium or smaller, it must succeed on a DC 10 Strength saving throw or be knocked prone. If the target is killed by this damage, it is absorbed into the mouther.\n\n**Blinding Spittle (Recharge 5-6).** The mouther spits a chemical glob at a point it can see within 15 feet of it. The glob explodes in a blinding flash of light on impact. Each creature within 5 feet of the flash must succeed on a DC 13 Dexterity saving throw or be blinded for 1 minute.",
    "roleplayingAndTactics": "The gibbering mouther is a chaotic combatant. Its Aberrant Ground and Gibbering abilities create a zone of confusion and helplessness. It will attempt to bite and absorb any creature that gets stuck or confused, showing no real strategy beyond consuming whatever is nearest."
  },
  "statblock": "### Gibbering Mouther\n\n*Medium aberration, neutral*\n\n___\n\n- **Armor Class** 9\n\n- **Hit Points** 67 (9d8+27)\n\n- **Speed** 10 ft., swim 10 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 10 (+0) | 8 (-1) | 16 (+3) | 3 (-4) | 10 (+0) | 6 (-2) |\n\n___\n\n- **Saving Throws** Con +5\n- **Senses** darkvision 60 ft., passive Perception 10\n\n- **Languages** -\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***Aberrant Ground.*** The ground in a 10-foot radius around the mouther is dough-like difficult terrain. Each creature that starts its turn in that area must succeed on a DC 10 Strength saving throw or have its speed reduced to 0 until the start of its next turn.\n\n***Gibbering.*** The mouther babbles incoherently while it can see any creature and isn't incapacitated. Each creature that starts its turn within 20 feet of the mouther and can hear the gibbering must succeed on a DC 10 Wisdom saving throw. On a failure, the creature can't take reactions until the start of its next turn and rolls a d8 to determine what it does during its turn. On a 1 to 4, the creature does nothing. On a 5 or 6, the creature takes no action or bonus action and uses all its movement to move in a randomly determined direction. On a 7 or 8, the creature makes a melee attack against a randomly determined creature within its reach or does nothing if it can't make such an attack.\n\n### Actions\n***Multiattack.*** The gibbering mouther makes one bite attack and, if it can, uses its Blinding Spittle.\n\n***Bites.*** *Melee Weapon Attack:* +2 to hit, reach 5 ft., one creature. *Hit:* 17 (5d6) piercing damage. If the target is Medium or smaller, it must succeed on a DC 10 Strength saving throw or be knocked prone. If the target is killed by this damage, it is absorbed into the mouther.\n\n***Blinding Spittle (Recharge 5-6).*** The mouther spits a chemical glob at a point it can see within 15 feet of it. The glob explodes in a blinding flash of light on impact. Each creature within 5 feet of the flash must succeed on a DC 13 Dexterity saving throw or be blinded for 1 minute."
};

export default SRD_MONSTER_GIBBERING_MOUTHER;