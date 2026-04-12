import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_FLESH_GOLEM: SavedMonster = {
  "id": "srd-flesh-golem",
  "name": "Flesh Golem",
  "description": "Whenever the golem starts its turn with 40 hit points or fewer, roll a d6. On a 6, the golem goes berserk. On each of its turns while berserk, the golem attacks the nearest creature it can see. If no creature is near enough to move to and attack, the golem attacks an object, with preference for an object smaller than itself. Once the golem goes berserk, it continues to do so until it is destroyed or regains all its hit points.",
  "profile": {
    "table": {
      "creatureType": "Medium construct",
      "size": "Medium",
      "alignment": "neutral",
      "armorClass": "9",
      "hitPoints": "93 (11d8+44)",
      "speed": "30 ft.",
      "senses": "darkvision 60 ft., passive Perception 10",
      "languages": "understands the languages of its creator but can't speak",
      "challengeRating": "5 (1,800 XP)",
      "keyAbilities": "STR +4, DEX -1, CON +4, INT -2, WIS +0, CHA -3",
      "role": ""
    },
    "abilitiesAndTraits": "**Berserk.** Whenever the golem starts its turn with 40 hit points or fewer, roll a d6. On a 6, the golem goes berserk. On each of its turns while berserk, the golem attacks the nearest creature it can see. If no creature is near enough to move to and attack, the golem attacks an object, with preference for an object smaller than itself. Once the golem goes berserk, it continues to do so until it is destroyed or regains all its hit points.\n\n**Aversion of Fire.** If the golem takes fire damage, it has disadvantage on attack rolls and ability checks until the end of its next turn.\n\n**Immutable Form.** The golem is immune to any spell or effect that would alter its form.\n\n**Lightning Absorption.** Whenever the golem is subjected to lightning damage, it takes no damage and instead regains a number of hit points equal to the lightning damage dealt.\n\n**Magic Resistance.** The golem has advantage on saving throws against spells and other magical effects.\n\n**Magic Weapons.** The golem's weapon attacks are magical.",
    "actions": "**Multiattack.** The golem makes two slam attacks.",
    "roleplayingAndTactics": ""
  },
  "statblock": "### Flesh Golem\n\n*Medium construct, neutral*\n\n___\n\n- **Armor Class** 9\n\n- **Hit Points** 93 (11d8+44)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 19 (+4) | 9 (-1) | 18 (+4) | 6 (-2) | 10 (+0) | 5 (-3) |\n\n___\n\n- **Senses** darkvision 60 ft., passive Perception 10\n\n- **Languages** understands the languages of its creator but can't speak\n\n- **Challenge** 5 (1,800 XP)\n\n___\n\n***Berserk.*** Whenever the golem starts its turn with 40 hit points or fewer, roll a d6. On a 6, the golem goes berserk. On each of its turns while berserk, the golem attacks the nearest creature it can see. If no creature is near enough to move to and attack, the golem attacks an object, with preference for an object smaller than itself. Once the golem goes berserk, it continues to do so until it is destroyed or regains all its hit points.\n\n***Aversion of Fire.*** If the golem takes fire damage, it has disadvantage on attack rolls and ability checks until the end of its next turn.\n\n***Immutable Form.*** The golem is immune to any spell or effect that would alter its form.\n\n***Lightning Absorption.*** Whenever the golem is subjected to lightning damage, it takes no damage and instead regains a number of hit points equal to the lightning damage dealt.\n\n***Magic Resistance.*** The golem has advantage on saving throws against spells and other magical effects.\n\n***Magic Weapons.*** The golem's weapon attacks are magical.\n\n### Actions\n***Multiattack.*** The golem makes two slam attacks."
};

export default SRD_MONSTER_FLESH_GOLEM;