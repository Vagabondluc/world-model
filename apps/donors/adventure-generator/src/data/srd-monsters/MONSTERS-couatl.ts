
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_COUATL: SavedMonster = {
  "id": "srd-couatl",
  "name": "Couatl",
  "description": "A couatl is a celestial being of immense intelligence and goodness, appearing as a large, winged serpent with rainbow-hued feathers. They are guardians of ancient lore and sworn enemies of evil.",
  "profile": {
    "table": {
      "creatureType": "Medium celestial",
      "size": "Medium",
      "alignment": "lawful good",
      "armorClass": "19 (natural armor)",
      "hitPoints": "97 (13d8+39)",
      "speed": "30 ft., fly 90 ft.",
      "senses": "truesight 120 ft., passive Perception 15",
      "languages": "all, telepathy 120 ft.",
      "challengeRating": "4 (1,100 XP)",
      "keyAbilities": "STR +3, DEX +5, CON +3, INT +4, WIS +5, CHA +4",
      "role": "Controller"
    },
    "savingThrows": {
      "wis": 7,
      "cha": 6
    },
    "abilitiesAndTraits": "**Innate Spellcasting.** The couatl's spellcasting ability is Charisma (spell save DC 14). It can innately cast the following spells, requiring only verbal Components:\n\nAt will: *detect evil and good, detect magic, detect thoughts*\n3/day each: *bless, create food and water, cure wounds, lesser restoration, protection from poison, sanctuary, shield*\n1/day each: *dream, greater restoration, scrying*\n\n**Magic Weapons.** The couatl's weapon attacks are magical.\n\n**Shielded Mind.** The couatl is immune to scrying and to any effect that would sense its emotions, read its thoughts, or detect its location.",
    "actions": "**Bite.** *Melee Weapon Attack:* +8 to hit, reach 5 ft., one creature. *Hit:* 8 (1d6+5) piercing damage, and the target must succeed on a DC 13 Constitution saving throw or be poisoned for 24 hours. Until this poison ends, the target is unconscious. Another creature can use an action to shake the target awake.\n\n**Constrict.** *Melee Weapon Attack:* +6 to hit, reach 10 ft., one Medium or smaller creature. *Hit:* 10 (2d6+3) bludgeoning damage, and the target is grappled (escape DC 15). Until this grapple ends, the target is restrained, and the couatl can't constrict another target.\n\n**Change Shape.** The couatl magically polymorphs into a humanoid or beast that has a challenge rating equal to or less than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the couatl's choice).",
    "roleplayingAndTactics": "A couatl is a wise and benevolent creature that prefers to avoid combat. If forced to fight, it uses its spells to disable and pacify foes, using its bite's poison to render them unconscious rather than kill. It will use Change Shape to observe situations before revealing its true form."
  },
  "statblock": "### Couatl\n\n*Medium celestial, lawful good*\n\n___\n\n- **Armor Class** 19 (natural armor)\n\n- **Hit Points** 97 (13d8+39)\n\n- **Speed** 30 ft., fly 90 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 16 (+3) | 20 (+5) | 17 (+3) | 18 (+4) | 20 (+5) | 18 (+4) |\n\n___\n\n- **Saving Throws** Wis +7, Cha +6\n- **Senses** truesight 120 ft., passive Perception 15\n\n- **Languages** all, telepathy 120 ft.\n\n- **Challenge** 4 (1,100 XP)\n\n___\n\n***Innate Spellcasting.*** The couatl's spellcasting ability is Charisma (spell save DC 14). It can innately cast the following spells, requiring only verbal Components\n\n***Magic Weapons.*** The couatl's weapon attacks are magical.\n\n***Shielded Mind.*** The couatl is immune to scrying and to any effect that would sense its emotions, read its thoughts, or detect its location.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +8 to hit, reach 5 ft., one creature. *Hit:* 8 (1d6+5) piercing damage, and the target must succeed on a DC 13 Constitution saving throw or be poisoned for 24 hours. Until this poison ends, the target is unconscious. Another creature can use an action to shake the target awake.\n\n***Constrict.*** *Melee Weapon Attack:* +6 to hit, reach 10 ft., one Medium or smaller creature. *Hit:* 10 (2d6+3) bludgeoning damage, and the target is grappled (escape DC 15). Until this grapple ends, the target is restrained, and the couatl can't constrict another target.\n\n***Change Shape.*** The couatl magically polymorphs into a humanoid or beast that has a challenge rating equal to or less than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the couatl's choice)."
};

export default SRD_MONSTER_COUATL;