import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_MEDUSA: SavedMonster = {
  "id": "srd-medusa",
  "name": "Medusa",
  "description": "Cursed for their vanity, a medusa is a monstrous creature with snakes for hair, whose gaze turns living creatures to stone. They often dwell in lonely ruins, their lairs decorated with the statues of their victims.",
  "profile": {
    "table": {
      "creatureType": "Medium monstrosity",
      "size": "Medium",
      "alignment": "lawful evil",
      "armorClass": "15 (natural armor)",
      "hitPoints": "127 (17d8+51)",
      "speed": "30 ft.",
      "senses": "darkvision 60 ft., passive Perception 14",
      "languages": "Common",
      "challengeRating": "6 (2,300 XP)",
      "keyAbilities": "STR +0, DEX +2, CON +3, INT +1, WIS +1, CHA +2",
      "role": "Controller"
    },
    "savingThrows": {
      "dex": 5,
      "con": 6
    },
    "abilitiesAndTraits": "**Petrifying Gaze.** When a creature that can see the medusa's eyes starts its turn within 30 feet of the medusa, the medusa can force it to make a DC 14 Constitution saving throw if the medusa isn't incapacitated and can see the creature. If the saving throw fails by 5 or more, the creature is instantly petrified. Otherwise, a creature that fails the save begins to turn to stone and is restrained. The restrained creature must repeat the saving throw at the end of its next turn, becoming petrified on a failure or ending the effect on a success. The petrification lasts until the creature is freed by the *greater restoration* spell or other magic.",
    "actions": "**Multiattack.** The medusa makes either three melee attacks-one with its snake hair and two with its shortsword-or two ranged attacks with its longbow.\n\n**Snake Hair.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one creature. *Hit:* 4 (1d4+2) piercing damage plus 14 (4d6) poison damage.\n\n**Shortsword.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 5 (1d6+2) piercing damage.\n\n**Longbow.** *Ranged Weapon Attack:* +5 to hit, range 150/600 ft., one target. *Hit:* 6 (1d8+2) piercing damage plus 7 (2d6) poison damage.",
    "roleplayingAndTactics": "A medusa is a cunning and patient killer. It prefers to use its Petrifying Gaze to disable enemies from a distance, enjoying the horror of their transformation. It will use its longbow on those who avert their eyes. In melee, it is a deadly combatant, its venomous snake hair a constant threat."
  },
  "statblock": "### Medusa\n\n*Medium monstrosity, lawful evil*\n\n___\n\n- **Armor Class** 15 (natural armor)\n\n- **Hit Points** 127 (17d8+51)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 10 (+0) | 15 (+2) | 16 (+3) | 12 (+1) | 13 (+1) | 15 (+2) |\n\n___\n\n- **Saving Throws** Dex +5, Con +6\n- **Skills** Deception +5, Insight +4, Perception +4, Stealth +5\n\n- **Senses** darkvision 60 ft., passive Perception 14\n\n- **Languages** Common\n\n- **Challenge** 6 (2,300 XP)\n\n___\n\n***Petrifying Gaze.*** When a creature that can see the medusa's eyes starts its turn within 30 feet of the medusa, the medusa can force it to make a DC 14 Constitution saving throw if the medusa isn't incapacitated and can see the creature. If the saving throw fails by 5 or more, the creature is instantly petrified. Otherwise, a creature that fails the save begins to turn to stone and is restrained. The restrained creature must repeat the saving throw at the end of its next turn, becoming petrified on a failure or ending the effect on a success. The petrification lasts until the creature is freed by the *greater restoration* spell or other magic.\n\n### Actions\n***Multiattack.*** The medusa makes either three melee attacks-one with its snake hair and two with its shortsword-or two ranged attacks with its longbow.\n\n***Snake Hair.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one creature. *Hit:* 4 (1d4+2) piercing damage plus 14 (4d6) poison damage.\n\n***Shortsword.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 5 (1d6+2) piercing damage."
};

export default SRD_MONSTER_MEDUSA;