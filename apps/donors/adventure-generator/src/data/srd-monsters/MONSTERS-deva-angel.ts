
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_DEVA_ANGEL: SavedMonster = {
  "id": "srd-deva-angel",
  "name": "Deva (Angel)",
  "description": "Devas are angels that act as divine messengers or agents in the mortal world. They can take any form and their true appearance is that of a beautiful humanoid with silvery wings.",
  "profile": {
    "table": {
      "creatureType": "Medium celestial",
      "size": "Medium",
      "alignment": "lawful good",
      "armorClass": "17 (natural armor)",
      "hitPoints": "136 (16d8+64)",
      "speed": "30 ft., fly 90 ft.",
      "senses": "darkvision 120 ft., passive Perception 19",
      "languages": "all, telepathy 120 ft.",
      "challengeRating": "10 (5,900 XP)",
      "keyAbilities": "STR +4, DEX +4, CON +4, INT +3, WIS +5, CHA +5",
      "role": "Leader"
    },
    "savingThrows": {
      "wis": 9,
      "cha": 9
    },
    "abilitiesAndTraits": "**Angelic Weapons.** The deva's weapon attacks are magical. When the deva hits with any weapon, the weapon deals an extra 4d8 radiant damage (included in the attack).\n\n**Innate Spellcasting.** The deva's spellcasting ability is Charisma (spell save DC 17). The deva can innately cast the following spells, requiring only verbal Components:\n\nAt will: *detect evil and good*\n1/day each: *commune, raise dead*\n\n**Magic Resistance.** The deva has advantage on saving throws against spells and other magical effects.",
    "actions": "**Multiattack.** The deva makes two melee attacks.\n\n**Mace.** *Melee Weapon Attack:* +8 to hit, reach 5 ft., one target. *Hit:* 7 (1d6+4) bludgeoning damage plus 18 (4d8) radiant damage.\n\n**Healing Touch (3/Day).** The deva touches another creature. The target magically regains 20 (4d8+2) hit points and is freed from any curse, disease, poison, blindness, or deafness.\n\n**Change Shape.** The deva magically polymorphs into a humanoid or beast that has a challenge rating equal to or less than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the deva's choice).",
    "roleplayingAndTactics": "A deva will only resort to combat when diplomacy fails and evil must be confronted. They are powerful warriors, smiting foes with radiant power. They will use their Healing Touch to aid allies. Their primary role is as a guide and protector, not a soldier."
  },
  "statblock": "### Deva (Angel)\n\n*Medium celestial, lawful good*\n\n___\n\n- **Armor Class** 17 (natural armor)\n\n- **Hit Points** 136 (16d8+64)\n\n- **Speed** 30 ft., fly 90 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 18 (+4) | 18 (+4) | 18 (+4) | 17 (+3) | 20 (+5) | 20 (+5) |\n\n___\n\n- **Saving Throws** Wis +9, Cha +9\n- **Skills** Insight +9, Perception +9\n\n- **Senses** darkvision 120 ft., passive Perception 19\n\n- **Languages** all, telepathy 120 ft.\n\n- **Challenge** 10 (5,900 XP)\n\n___\n\n***Angelic Weapons.*** The deva's weapon attacks are magical. When the deva hits with any weapon, the weapon deals an extra 4d8 radiant damage (included in the attack).\n\n***Innate Spellcasting.*** The deva's spellcasting ability is Charisma (spell save DC 17). The deva can innately cast the following spells, requiring only verbal Components\n\n***Magic Resistance.*** The deva has advantage on saving throws against spells and other magical effects.\n\n### Actions\n***Multiattack.*** The deva makes two melee attacks.\n\n***Mace.*** *Melee Weapon Attack:* +8 to hit, reach 5 ft., one target. *Hit:* 7 (1d6+4) bludgeoning damage plus 18 (4d8) radiant damage.\n\n***Healing Touch (3/Day).*** The deva touches another creature. The target magically regains 20 (4d8+2) hit points and is freed from any curse, disease, poison, blindness, or deafness.\n\n***Change Shape.*** The deva magically polymorphs into a humanoid or beast that has a challenge rating equal to or less than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the deva's choice)."
};

export default SRD_MONSTER_DEVA_ANGEL;