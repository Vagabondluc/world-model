
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_CULT_FANATIC: SavedMonster = {
  "id": "srd-cult-fanatic",
  "name": "Cult Fanatic",
  "description": "A cult fanatic is a spellcaster with a dangerous, zealous devotion to a dark power. They are often charismatic recruiters and enforcers of their cult's dogma.",
  "profile": {
    "table": {
      "creatureType": "Medium humanoid (any race)",
      "size": "Medium",
      "alignment": "any non-good alignment",
      "armorClass": "13 (leather armor)",
      "hitPoints": "33 (6d8 + 6)",
      "speed": "30 ft.",
      "senses": "passive Perception 11",
      "languages": "any one language (usually Common)",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +0, DEX +2, CON +1, INT +0, WIS +1, CHA +2",
      "role": "Leader"
    },
    "savingThrows": {
      "wis": 3,
      "cha": 4
    },
    "abilitiesAndTraits": "**Dark Devotion.** The fanatic has advantage on saving throws against being charmed or frightened.\n\n**Spellcasting.** The fanatic is a 4th-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 11, +3 to hit with spell attacks). The fanatic has the following cleric spells prepared:\n\n- Cantrips (at will): *light, sacred flame, thaumaturgy*\n- 1st level (4 slots): *command, inflict wounds, shield of faith*\n- 2nd level (3 slots): *hold person, spiritual weapon*",
    "actions": "**Multiattack.** The fanatic makes two melee attacks.\n\n**Dagger.** *Melee or Ranged Weapon Attack:* +4 to hit, reach 5 ft. or range 20/60 ft., one creature. *Hit:* 4 (1d4 + 2) piercing damage.",
    "roleplayingAndTactics": "Cult fanatics will use their spells to control the battlefield, using *hold person* to incapacitate a strong foe while their *spiritual weapon* attacks another. They are fanatically loyal and will gladly die for their cause, often with a prayer to their dark patron on their lips."
  },
  "statblock": "### Cult Fanatic\n\n*Medium humanoid (any race), any non-good alignment*\n\n___\n\n- **Armor Class** 13 (leather armor)\n\n- **Hit Points** 33 (6d8 + 6)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 11 (+0) | 14 (+2) | 12 (+1) | 10 (+0) | 13 (+1) | 14 (+2) |\n\n___\n\n- **Saving Throws** Wis +3, Cha +4\n- **Skills** Deception +4, Persuasion +4, Religion +2\n\n- **Senses** passive Perception 11\n\n- **Languages** any one language (usually Common)\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***Dark Devotion.*** The fanatic has advantage on saving throws against being charmed or frightened.\n\n***Spellcasting.*** The fanatic is a 4th-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 11, +3 to hit with spell attacks). The fanatic has the following cleric spells prepared:\n\n### Actions\n***Multiattack.*** The fanatic makes two melee attacks.\n\n***Dagger.*** *Melee or Ranged Weapon Attack:* +4 to hit, reach 5 ft. or range 20/60 ft., one creature. *Hit:* 4 (1d4 + 2) piercing damage."
};

export default SRD_MONSTER_CULT_FANATIC;