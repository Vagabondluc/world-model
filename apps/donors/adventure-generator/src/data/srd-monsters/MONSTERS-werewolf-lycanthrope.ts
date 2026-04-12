
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_WEREWOLF_LYCANTHROPE: SavedMonster = {
  "id": "srd-werewolf-lycanthrope",
  "name": "Werewolf (Lycanthrope)",
  "description": "A werewolf is a savage predator, a humanoid cursed to transform into a ravenous wolf under the light of the full moon. They are driven by a bloodlust they can barely control.",
  "profile": {
    "table": {
      "creatureType": "Medium humanoid (human, shapechanger)",
      "size": "Medium",
      "alignment": "chaotic evil",
      "armorClass": "11 in humanoid form, 12 (natural armor) in wolf or hybrid form",
      "hitPoints": "58 (9d8+18)",
      "speed": "30 ft. (40 ft. in wolf form)",
      "senses": "passive Perception 14",
      "languages": "Common (can't speak in wolf form)",
      "challengeRating": "3 (700 XP)",
      "keyAbilities": "STR +2, DEX +1, CON +2, INT +0, WIS +0, CHA +0",
      "role": "Brute"
    },
    "savingThrows": {
      "str": 4,
      "con": 4
    },
    "abilitiesAndTraits": "**Shapechanger.** The werewolf can use its action to polymorph into a wolf-humanoid hybrid or into a wolf, or back into its true form, which is humanoid. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.\n\n**Keen Hearing and Smell.** The werewolf has advantage on Wisdom (Perception) checks that rely on hearing or smell.",
    "actions": "**Multiattack (Humanoid or Hybrid Form Only).** The werewolf makes two attacks: two with its spear (humanoid form) or one with its bite and one with its claws (hybrid form).\n\n**Bite (Wolf or Hybrid Form Only).** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 6 (1d8+2) piercing damage. If the target is a humanoid, it must succeed on a DC 12 Constitution saving throw or be cursed with werewolf lycanthropy.\n\n**Claws (Hybrid Form Only).** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 7 (2d4+2) slashing damage.\n\n**Spear (Humanoid Form Only).** *Melee or Ranged Weapon Attack:* +4 to hit, reach 5 ft. or range 20/60 ft., one target. *Hit:* 5 (1d6+2) piercing damage, or 6 (1d8+2) piercing damage if used with two hands to make a melee attack.",
    "roleplayingAndTactics": "A werewolf in hybrid or wolf form is a frenzied attacker. It will use its multiattack to tear into its prey with its bite and claws. They often hunt in packs and will try to spread their lycanthropic curse."
  },
  "statblock": "### Werewolf (Lycanthrope)\n\n*Medium humanoid (human, shapechanger), chaotic evil*\n\n___\n\n- **Armor Class** 11 in humanoid form, 12 (natural armor) in wolf or hybrid form\n\n- **Hit Points** 58 (9d8+18)\n\n- **Speed** 30 ft. (40 ft. in wolf form)\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 15 (+2) | 13 (+1) | 14 (+2) | 10 (+0) | 11 (+0) | 10 (+0) |\n\n___\n\n- **Saving Throws** Str +4, Con +4\n- **Skills** Perception +4, Stealth +3\n\n- **Senses** passive Perception 14\n\n- **Languages** Common (can't speak in wolf form)\n\n- **Challenge** 3 (700 XP)\n\n___\n\n***Shapechanger.*** The werewolf can use its action to polymorph into a wolf-humanoid hybrid or into a wolf, or back into its true form, which is humanoid. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.\n\n***Keen Hearing and Smell.*** The werewolf has advantage on Wisdom (Perception) checks that rely on hearing or smell.\n\n### Actions\n***Multiattack (Humanoid or Hybrid Form Only).*** The werewolf makes two attacks: two with its spear (humanoid form) or one with its bite and one with its claws (hybrid form).\n\n***Bite (Wolf or Hybrid Form Only).*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 6 (1d8+2) piercing damage. If the target is a humanoid, it must succeed on a DC 12 Constitution saving throw or be cursed with werewolf lycanthropy.\n\n***Claws (Hybrid Form Only).*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 7 (2d4+2) slashing damage."
};

export default SRD_MONSTER_WEREWOLF_LYCANTHROPE;
