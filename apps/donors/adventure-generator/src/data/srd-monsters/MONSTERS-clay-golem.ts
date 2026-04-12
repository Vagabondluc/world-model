import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_CLAY_GOLEM: SavedMonster = {
  "id": "srd-clay-golem",
  "name": "Clay Golem",
  "description": "A hulking humanoid figure sculpted from clay, given life by powerful magic. It is a mindless automaton, bound to the will of its creator.",
  "profile": {
    "table": {
      "creatureType": "Large construct",
      "size": "Large",
      "alignment": "unaligned",
      "armorClass": "14 (natural armor)",
      "hitPoints": "133 (14d10+56)",
      "speed": "20 ft.",
      "senses": "darkvision 60 ft., passive Perception 9",
      "languages": "understands the languages of its creator but can't speak",
      "challengeRating": "9 (5,000 XP)",
      "keyAbilities": "STR +5, DEX -1, CON +4, INT -4, WIS -1, CHA -5",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Acid Absorption.** Whenever the golem is subjected to acid damage, it takes no damage and instead regains a number of hit points equal to the acid damage dealt.\n\n**Berserk.** Whenever the golem starts its turn with 60 hit points or fewer, roll a d6. On a 6, the golem goes berserk. On each of its turns while berserk, the golem attacks the nearest creature it can see. If no creature is near enough to move to and attack, the golem attacks an object, with preference for an object smaller than itself. Once the golem goes berserk, it continues to do so until it is destroyed or regains all its hit points.\n\n**Immutable Form.** The golem is immune to any spell or effect that would alter its form.\n\n**Magic Resistance.** The golem has advantage on saving throws against spells and other magical effects.\n\n**Magic Weapons.** The golem's weapon attacks are magical.",
    "actions": "**Multiattack.** The golem makes two slam attacks.\n\n**Slam.** *Melee Weapon Attack:* +8 to hit, reach 5 ft., one target. *Hit:* 16 (2d10+5) bludgeoning damage. If the target is a creature, it must succeed on a DC 15 Constitution saving throw or have its hit point maximum reduced by an amount equal to the damage taken. The target dies if this attack reduces its hit point maximum to 0. The reduction lasts until removed by the *greater restoration* spell or other magic.\n\n**Haste (Recharge 5-6).** Until the end of its next turn, the golem magically gains a +2 bonus to its AC, has advantage on Dexterity saving throws, and can use its slam attack as a bonus action.",
    "roleplayingAndTactics": "A clay golem is an implacable guardian. It follows its last orders without question or deviation. Its slam attacks can permanently reduce a creature's life force. When heavily damaged, it may go berserk, attacking the nearest living thing indiscriminately."
  },
  "statblock": "### Clay Golem\n\n*Large construct, unaligned*\n\n___\n\n- **Armor Class** 14 (natural armor)\n\n- **Hit Points** 133 (14d10+56)\n\n- **Speed** 20 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 20 (+5) | 9 (-1) | 18 (+4) | 3 (-4) | 8 (-1) | 1 (-5) |\n\n___\n\n- **Senses** darkvision 60 ft., passive Perception 9\n\n- **Languages** understands the languages of its creator but can't speak\n\n- **Challenge** 9 (5,000 XP)\n\n___\n\n***Acid Absorption.*** Whenever the golem is subjected to acid damage, it takes no damage and instead regains a number of hit points equal to the acid damage dealt.\n\n***Berserk.*** Whenever the golem starts its turn with 60 hit points or fewer, roll a d6. On a 6, the golem goes berserk. On each of its turns while berserk, the golem attacks the nearest creature it can see. If no creature is near enough to move to and attack, the golem attacks an object, with preference for an object smaller than itself. Once the golem goes berserk, it continues to do so until it is destroyed or regains all its hit points.\n\n***Immutable Form.*** The golem is immune to any spell or effect that would alter its form.\n\n***Magic Resistance.*** The golem has advantage on saving throws against spells and other magical effects.\n\n***Magic Weapons.*** The golem's weapon attacks are magical.\n\n### Actions\n***Multiattack.*** The golem makes two slam attacks.\n\n***Slam.*** *Melee Weapon Attack:* +8 to hit, reach 5 ft., one target. *Hit:* 16 (2d10+5) bludgeoning damage. If the target is a creature, it must succeed on a DC 15 Constitution saving throw or have its hit point maximum reduced by an amount equal to the damage taken. The target dies if this attack reduces its hit point maximum to 0. The reduction lasts until removed by the *greater restoration* spell or other magic.\n\n***Haste (Recharge 5-6).*** Until the end of its next turn, the golem magically gains a +2 bonus to its AC, has advantage on Dexterity saving throws, and can use its slam attack as a bonus action."
};

export default SRD_MONSTER_CLAY_GOLEM;