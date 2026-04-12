
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_SALAMANDER: SavedMonster = {
  "id": "srd-salamander",
  "name": "Salamander",
  "description": "Salamanders are serpentine creatures of fire, their bodies wreathed in flame. They are native to the Elemental Plane of Fire and are known for their evil tempers and skill at forging.",
  "profile": {
    "table": {
      "creatureType": "Large elemental",
      "size": "Large",
      "alignment": "neutral evil",
      "armorClass": "15 (natural armor)",
      "hitPoints": "90 (12d10+24)",
      "speed": "30 ft.",
      "senses": "darkvision 60 ft., passive Perception 10",
      "languages": "Ignan",
      "challengeRating": "5 (1,800 XP)",
      "keyAbilities": "STR +4, DEX +2, CON +2, INT +0, WIS +0, CHA +1",
      "role": "Brute"
    },
    "savingThrows": {
        "dex": 5,
        "con": 5,
        "wis": 3
    },
    "abilitiesAndTraits": "**Heated Body.** A creature that touches the salamander or hits it with a melee attack while within 5 feet of it takes 7 (2d6) fire damage.\n\n**Heated Weapons.** Any metal melee weapon the salamander wields deals an extra 3 (1d6) fire damage on a hit (included in the attack).",
    "actions": "**Multiattack.** The salamander makes two attacks: one with its spear and one with its tail.\n\n**Spear.** *Melee or Ranged Weapon Attack:* +7 to hit, reach 5 ft. or range 20/60 ft., one target. *Hit:* 11 (2d6+4) piercing damage, or 13 (2d8+4) piercing damage if used with two hands to make a melee attack, plus 3 (1d6) fire damage.\n\n**Tail.** *Melee Weapon Attack:* +7 to hit, reach 10 ft., one target. *Hit:* 11 (2d6+4) bludgeoning damage plus 7 (2d6) fire damage, and the target is grappled (escape DC 14). Until this grapple ends, the target is restrained, and the salamander can't use its tail on another target.",
    "roleplayingAndTactics": "Salamanders are disciplined fighters who use their reach to their advantage. They will throw their heated spears before closing to melee, using their tail to grapple and burn victims. They are often found guarding fiery locations or serving powerful fire creatures."
  },
  "statblock": "### Salamander\n\n*Large elemental, neutral evil*\n\n___\n\n- **Armor Class** 15 (natural armor)\n\n- **Hit Points** 90 (12d10+24)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 18 (+4) | 14 (+2) | 15 (+2) | 11 (+0) | 10 (+0) | 12 (+1) |\n\n___\n\n- **Saving Throws** Dex +5, Con +5, Wis +3\n- **Senses** darkvision 60 ft., passive Perception 10\n\n- **Languages** Ignan\n\n- **Challenge** 5 (1,800 XP)\n\n___\n\n***Heated Body.*** A creature that touches the salamander or hits it with a melee attack while within 5 feet of it takes 7 (2d6) fire damage.\n\n***Heated Weapons.*** Any metal melee weapon the salamander wields deals an extra 3 (1d6) fire damage on a hit (included in the attack).\n\n### Actions\n***Multiattack.*** The salamander makes two attacks: one with its spear and one with its tail.\n\n***Spear.*** *Melee or Ranged Weapon Attack:* +7 to hit, reach 5 ft. or range 20/60 ft., one target. *Hit:* 11 (2d6+4) piercing damage, or 13 (2d8+4) piercing damage if used with two hands to make a melee attack, plus 3 (1d6) fire damage.\n\n***Tail.*** *Melee Weapon Attack:* +7 to hit, reach 10 ft., one target. *Hit:* 11 (2d6+4) bludgeoning damage plus 7 (2d6) fire damage, and the target is grappled (escape DC 14). Until this grapple ends, the target is restrained, and the salamander can't use its tail on another target."
};

export default SRD_MONSTER_SALAMANDER;
