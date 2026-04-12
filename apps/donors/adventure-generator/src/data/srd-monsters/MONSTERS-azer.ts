import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_AZER: SavedMonster = {
  "id": "srd-azer",
  "name": "Azer",
  "description": "Native to the Plane of Fire, azers are master crafters and miners. They resemble stout dwarves with metallic skin and beards of pure flame.",
  "profile": {
    "table": {
      "creatureType": "Medium elemental",
      "size": "Medium",
      "alignment": "lawful neutral",
      "armorClass": "17 (natural armor, shield)",
      "hitPoints": "39 (6d8+12)",
      "speed": "30 ft.",
      "senses": "passive Perception 11",
      "languages": "Ignan",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +3, DEX +1, CON +2, INT +1, WIS +1, CHA +0",
      "role": "Soldier"
    },
    "abilitiesAndTraits": "**Heated Body.** A creature that touches the azer or hits it with a melee attack while within 5 feet of it takes 5 (1d10) fire damage.\n\n**Heated Weapons.** When the azer hits with a metal melee weapon, it deals an extra 3 (1d6) fire damage (included in the attack).\n\n**Illumination.** The azer sheds bright light in a 10-foot radius and dim light for an additional 10 feet.",
    "actions": "**Warhammer.** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 7 (1d8+3) bludgeoning damage, or 8 (1d10+3) bludgeoning damage if used with two hands to make a melee attack, plus 3 (1d6) fire damage.",
    "roleplayingAndTactics": "Azers are disciplined warriors who fight in organized groups. They use their Heated Body and Heated Weapons to make melee combat dangerous for their foes. They are not talkative but will honor agreements if made."
  },
  "statblock": "### Azer\n\n*Medium elemental, lawful neutral*\n\n___\n\n- **Armor Class** 17 (natural armor, shield)\n\n- **Hit Points** 39 (6d8+12)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 17 (+3) | 12 (+1) | 15 (+2) | 12 (+1) | 13 (+1) | 10 (+0) |\n\n___\n\n- **Senses** passive Perception 11\n\n- **Languages** Ignan\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***Heated Body.*** A creature that touches the azer or hits it with a melee attack while within 5 feet of it takes 5 (1d10) fire damage.\n\n***Heated Weapons.*** When the azer hits with a metal melee weapon, it deals an extra 3 (1d6) fire damage (included in the attack).\n\n***Illumination.*** The azer sheds bright light in a 10-foot radius and dim light for an additional 10 feet.\n\n### Actions\n***Warhammer.*** *Melee Weapon Attack:* +5 to hit, reach 5 ft., one target. *Hit:* 7 (1d8+3) bludgeoning damage, or 8 (1d10+3) bludgeoning damage if used with two hands to make a melee attack, plus 3 (1d6) fire damage."
};

export default SRD_MONSTER_AZER;