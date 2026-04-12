
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_WERERAT_LYCANTHROPE: SavedMonster = {
  "id": "srd-wererat-lycanthrope",
  "name": "Wererat (Lycanthrope)",
  "description": "Wererats are cunning and cowardly lycanthropes that infest sewers and slums. They are selfish creatures that operate in clans, much like a thieves' guild.",
  "profile": {
    "table": {
      "creatureType": "Medium humanoid (human, shapechanger)",
      "size": "Medium",
      "alignment": "lawful evil",
      "armorClass": "12",
      "hitPoints": "33 (6d8+6)",
      "speed": "30 ft.",
      "senses": "darkvision 60 ft. (rat form only), passive Perception 12",
      "languages": "Common (can't speak in rat form)",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +0, DEX +2, CON +1, INT +0, WIS +0, CHA -1",
      "role": "Skirmisher"
    },
    "savingThrows": {
      "dex": 4
    },
    "abilitiesAndTraits": "**Shapechanger.** The wererat can use its action to polymorph into a rat-humanoid hybrid or into a giant rat, or back into its true form, which is humanoid. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.\n\n**Keen Smell.** The wererat has advantage on Wisdom (Perception) checks that rely on smell.",
    "actions": "**Multiattack (Humanoid or Hybrid Form Only).** The wererat makes two attacks, only one of which can be a bite.\n\n**Bite (Rat or Hybrid Form Only).** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 4 (1d4+2) piercing damage. If the target is a humanoid, it must succeed on a DC 11 Constitution saving throw or be cursed with wererat lycanthropy.\n\n**Shortsword (Humanoid or Hybrid Form Only).** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 5 (1d6+2) piercing damage.\n\n**Hand Crossbow (Humanoid or Hybrid Form Only).** *Ranged Weapon Attack:* +4 to hit, range 30/120 ft., one target. *Hit:* 5 (1d6+2) piercing damage.",
    "roleplayingAndTactics": "Wererats are skirmishers who prefer to attack from the shadows. They will use their hand crossbows to deliver their curse from a distance before changing into rat form to escape. They are not brave and will flee if a fight turns against them."
  },
  "statblock": "### Wererat (Lycanthrope)\n\n*Medium humanoid (human, shapechanger), lawful evil*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 33 (6d8+6)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 10 (+0) | 15 (+2) | 12 (+1) | 11 (+0) | 10 (+0) | 8 (-1) |\n\n___\n\n- **Saving Throws** Dex +4\n- **Skills** Perception +2, Stealth +4\n\n- **Senses** darkvision 60 ft. (rat form only), passive Perception 12\n\n- **Languages** Common (can't speak in rat form)\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***Shapechanger.*** The wererat can use its action to polymorph into a rat-humanoid hybrid or into a giant rat, or back into its true form, which is humanoid. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.\n\n***Keen Smell.*** The wererat has advantage on Wisdom (Perception) checks that rely on smell.\n\n### Actions\n***Multiattack (Humanoid or Hybrid Form Only).*** The wererat makes two attacks, only one of which can be a bite.\n\n***Bite (Rat or Hybrid Form Only).*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 4 (1d4+2) piercing damage. If the target is a humanoid, it must succeed on a DC 11 Constitution saving throw or be cursed with wererat lycanthropy.\n\n***Shortsword (Humanoid or Hybrid Form Only).*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 5 (1d6+2) piercing damage."
};

export default SRD_MONSTER_WERERAT_LYCANTHROPE;
