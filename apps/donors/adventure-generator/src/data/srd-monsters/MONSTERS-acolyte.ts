
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_ACOLYTE: SavedMonster = {
    "id": "srd-acolyte",
    "name": "Acolyte",
    "description": "Acolytes are junior members of a clergy, training under priests and other religious leaders. They perform humble duties in temples and assist in sacred rites.",
    "profile": {
      "table": {
        "creatureType": "Medium humanoid (any race)",
        "size": "Medium",
        "alignment": "any alignment",
        "armorClass": "10",
        "hitPoints": "9 (2d8)",
        "speed": "30 ft.",
        "senses": "passive Perception 12",
        "languages": "any one language (usually Common)",
        "challengeRating": "1/4 (50 XP)",
        "keyAbilities": "WIS +2",
        "role": "Support"
      },
      "abilitiesAndTraits": "**Spellcasting.** The acolyte is a 1st-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 12, +4 to hit with spell attacks). The acolyte has the following cleric spells prepared:\n\n- Cantrips (at will): *light, sacred flame, thaumaturgy*\n- 1st level (3 slots): *bless, cure wounds, sanctuary*",
      "actions": "**Club.** *Melee Weapon Attack:* +2 to hit, reach 5 ft., one target. *Hit:* 2 (1d4) bludgeoning damage.",
      "roleplayingAndTactics": "Acolytes are not warriors and will avoid combat if possible, using spells like *sanctuary* to protect themselves or others. If forced to fight, they use *sacred flame* from a distance. They are often devout but inexperienced."
    },
    "statblock": "### Acolyte\n\n*Medium humanoid (any race), any alignment*\n\n___\n\n- **Armor Class** 10\n\n- **Hit Points** 9 (2d8)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 10 (+0) | 10 (+0) | 10 (+0) | 10 (+0) | 14 (+2) | 11 (+0) |\n\n___\n\n- **Skills** Medicine +4, Religion +2\n\n- **Senses** passive Perception 12\n\n- **Languages** any one language (usually Common)\n\n- **Challenge** 1/4 (50 XP)\n\n___\n\n***Spellcasting.*** The acolyte is a 1st-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 12, +4 to hit with spell attacks). The acolyte has following cleric spells prepared:\n\n- Cantrips (at will): *light, sacred flame, thaumaturgy*\n- 1st level (3 slots): *bless, cure wounds, sanctuary*\n\n### Actions\n***Club.*** *Melee Weapon Attack:* +2 to hit, reach 5 ft., one target. *Hit:* 2 (1d4) bludgeoning damage."
  };
export default SRD_MONSTER_ACOLYTE;
