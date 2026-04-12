
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_ERINYES_DEVIL: SavedMonster = {
  "id": "srd-erinyes-devil",
  "name": "Erinyes (Devil)",
  "description": "An erinyes is a fallen angel, a beautiful and winged warrior who now serves the Nine Hells as a scout, infiltrator, and disciplinarian. They are the furies of the infernal legions.",
  "profile": {
    "table": {
      "creatureType": "Medium fiend (devil)",
      "size": "Medium",
      "alignment": "lawful evil",
      "armorClass": "18 (plate)",
      "hitPoints": "153 (18d8+72)",
      "speed": "30 ft., fly 60 ft.",
      "senses": "truesight 120 ft., passive Perception 12",
      "languages": "Infernal, telepathy 120 ft.",
      "challengeRating": "12 (8,400 XP)",
      "keyAbilities": "STR +4, DEX +3, CON +4, INT +2, WIS +2, CHA +4",
      "role": "Artillery"
    },
    "savingThrows": {
      "dex": 7,
      "con": 8,
      "wis": 6,
      "cha": 8
    },
    "abilitiesAndTraits": "**Hellish Weapons.** The erinyes's weapon attacks are magical and deal an extra 13 (3d8) poison damage on a hit (included in the attacks).\n\n**Magic Resistance.** The erinyes has advantage on saving throws against spells and other magical effects.",
    "actions": "**Multiattack.** The erinyes makes three attacks.\n\n**Longsword.** *Melee Weapon Attack:* +8 to hit, reach 5 ft., one target. *Hit:* 8 (1d8+4) slashing damage, or 9 (1d10+4) slashing damage if used with two hands, plus 13 (3d8) poison damage.\n\n**Longbow.** *Ranged Weapon Attack:* +7 to hit, range 150/600 ft., one target. *Hit:* 7 (1d8+3) piercing damage plus 13 (3d8) poison damage, and the target must succeed on a DC 14 Constitution saving throw or be poisoned. The poison lasts until it is removed by the *lesser restoration* spell or similar magic.",
    "roleplayingAndTactics": "Erinyes are disciplined and tactical warriors. They prefer to attack from the air with their poison-laced longbows, focusing on spellcasters and other high-value targets. They are fearless in combat and will fight to the death to fulfill their orders."
  },
  "statblock": "### Erinyes (Devil)\n\n*Medium fiend (devil), lawful evil*\n\n___\n\n- **Armor Class** 18 (plate)\n\n- **Hit Points** 153 (18d8+72)\n\n- **Speed** 30 ft., fly 60 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 18 (+4) | 16 (+3) | 18 (+4) | 14 (+2) | 14 (+2) | 18 (+4) |\n\n___\n\n- **Saving Throws** Dex +7, Con +8, Wis +6, Cha +8\n- **Senses** truesight 120 ft., passive Perception 12\n\n- **Languages** Infernal, telepathy 120 ft.\n\n- **Challenge** 12 (8,400 XP)\n\n___\n\n***Hellish Weapons.*** The erinyes's weapon attacks are magical and deal an extra 13 (3d8) poison damage on a hit (included in the attacks).\n\n***Magic Resistance.*** The erinyes has advantage on saving throws against spells and other magical effects.\n\n### Actions\n***Multiattack.*** The erinyes makes three attacks.\n\n***Longsword.*** *Melee Weapon Attack:* +8 to hit, reach 5 ft., one target. *Hit:* 8 (1d8+4) slashing damage, or 9 (1d10+4) slashing damage if used with two hands, plus 13 (3d8) poison damage.\n\n***Longbow.*** *Ranged Weapon Attack:* +7 to hit, range 150/600 ft., one target. *Hit:* 7 (1d8+3) piercing damage plus 13 (3d8) poison damage, and the target must succeed on a DC 14 Constitution saving throw or be poisoned. The poison lasts until it is removed by the *lesser restoration* spell or similar magic."
};

export default SRD_MONSTER_ERINYES_DEVIL;