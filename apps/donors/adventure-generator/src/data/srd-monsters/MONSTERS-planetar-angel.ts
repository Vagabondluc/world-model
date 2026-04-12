
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_PLANETAR_ANGEL: SavedMonster = {
  "id": "srd-planetar-angel",
  "name": "Planetar (Angel)",
  "description": "Planetars are the mighty weapons of the gods, celestials of immense power sent to strike down evil. They appear as towering, muscular humanoids with opalescent wings and a divine light in their eyes.",
  "profile": {
    "table": {
      "creatureType": "Large celestial",
      "size": "Large",
      "alignment": "lawful good",
      "armorClass": "19 (natural armor)",
      "hitPoints": "200 (16d10+112)",
      "speed": "40 ft., fly 120 ft.",
      "senses": "truesight 120 ft., passive Perception 21",
      "languages": "all, telepathy 120 ft.",
      "challengeRating": "16 (15,000 XP)",
      "keyAbilities": "STR +7, DEX +5, CON +7, INT +4, WIS +6, CHA +7",
      "role": "Leader"
    },
    "savingThrows": {
        "con": 12,
        "wis": 11,
        "cha": 12
    },
    "abilitiesAndTraits": "**Angelic Weapons.** The planetar's weapon attacks are magical. When the planetar hits with any weapon, the weapon deals an extra 5d8 radiant damage (included in the attack).\n\n**Divine Awareness.** The planetar knows if it hears a lie.\n\n**Innate Spellcasting.** The planetar's spellcasting ability is Charisma (spell save DC 20). The planetar can innately cast the following spells, requiring no material Components\n\n**Magic Resistance.** The planetar has advantage on saving throws against spells and other magical effects.",
    "actions": "**Multiattack.** The planetar makes two melee attacks.\n\n**Greatsword.** *Melee Weapon Attack:* +12 to hit, reach 5 ft., one target. *Hit:* 21 (4d6+7) slashing damage plus 22 (5d8) radiant damage.",
    "roleplayingAndTactics": "A planetar is a force for justice and will not hesitate to destroy evil. In battle, it is a whirlwind of radiant energy, its greatsword striking with divine power. It uses its spells to heal allies and smite foes. A planetar is an avatar of its deity's will and cannot be swayed from its mission."
  },
  "statblock": "### Planetar (Angel)\n\n*Large celestial, lawful good*\n\n___\n\n- **Armor Class** 19 (natural armor)\n\n- **Hit Points** 200 (16d10+112)\n\n- **Speed** 40 ft., fly 120 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 24 (+7) | 20 (+5) | 24 (+7) | 19 (+4) | 22 (+6) | 25 (+7) |\n\n___\n\n- **Saving Throws** Con +12, Wis +11, Cha +12\n- **Skills** Perception +11\n\n- **Senses** truesight 120 ft., passive Perception 21\n\n- **Languages** all, telepathy 120 ft.\n\n- **Challenge** 16 (15,000 XP)\n\n___\n\n***Angelic Weapons.*** The planetar's weapon attacks are magical. When the planetar hits with any weapon, the weapon deals an extra 5d8 radiant damage (included in the attack).\n\n***Divine Awareness.*** The planetar knows if it hears a lie.\n\n***Innate Spellcasting.*** The planetar's spellcasting ability is Charisma (spell save DC 20). The planetar can innately cast the following spells, requiring no material Components\n\n***Magic Resistance.*** The planetar has advantage on saving throws against spells and other magical effects.\n\n### Actions\n***Multiattack.*** The planetar makes two melee attacks.\n\n***Greatsword.*** *Melee Weapon Attack:* +12 to hit, reach 5 ft., one target. *Hit:* 21 (4d6+7) slashing damage plus 22 (5d8) radiant damage."
};

export default SRD_MONSTER_PLANETAR_ANGEL;
