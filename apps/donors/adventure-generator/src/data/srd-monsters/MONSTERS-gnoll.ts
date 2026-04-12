import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GNOLL: SavedMonster = {
  "id": "srd-gnoll",
  "name": "Gnoll",
  "description": "Gnolls are savage, hyena-like humanoids driven by an insatiable hunger. They are agents of chaos and destruction, leaving only ruin in their wake.",
  "profile": {
    "table": {
      "creatureType": "Medium humanoid (gnoll)",
      "size": "Medium",
      "alignment": "chaotic evil",
      "armorClass": "15 (hide armor, shield)",
      "hitPoints": "22 (5d8)",
      "speed": "30 ft.",
      "senses": "darkvision 60 ft., passive Perception 10",
      "languages": "Gnoll",
      "challengeRating": "1/2 (100 XP)",
      "keyAbilities": "STR +2, DEX +1, CON +0, INT -2, WIS +0, CHA -2",
      "role": "Brute"
    },
    "abilitiesAndTraits": "**Rampage.** When the gnoll reduces a creature to 0 hit points with a melee attack on its turn, the gnoll can take a bonus action to move up to half its speed and make a bite attack.",
    "actions": "**Bite.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 4 (1d4+2) piercing damage.\n\n**Spear.** *Melee or Ranged Weapon Attack:* +4 to hit, reach 5 ft. or range 20/60 ft., one target. *Hit:* 5 (1d6+2) piercing damage, or 6 (1d8+2) piercing damage if used with two hands to make a melee attack.\n\n**Longbow.** *Ranged Weapon Attack:* +3 to hit, range 150/600 ft., one target. *Hit:* 5 (1d8+1) piercing damage.",
    "roleplayingAndTactics": "Gnolls are frenzied attackers who rely on numbers and their Rampage ability to overwhelm foes. Once a gnoll fells an enemy, it gains a surge of ferocity, moving and biting again. They are not subtle and will charge headlong into a fight, cackling madly."
  },
  "statblock": "### Gnoll\n\n*Medium humanoid (gnoll), chaotic evil*\n\n___\n\n- **Armor Class** 15 (hide armor, shield)\n\n- **Hit Points** 22 (5d8)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 14 (+2) | 12 (+1) | 11 (+0) | 6 (-2) | 10 (+0) | 7 (-2) |\n\n___\n\n- **Senses** darkvision 60 ft., passive Perception 10\n\n- **Languages** Gnoll\n\n- **Challenge** 1/2 (100 XP)\n\n___\n\n***Rampage.*** When the gnoll reduces a creature to 0 hit points with a melee attack on its turn, the gnoll can take a bonus action to move up to half its speed and make a bite attack.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 4 (1d4+2) piercing damage.\n\n***Spear.*** *Melee or Ranged Weapon Attack:* +4 to hit, reach 5 ft. or range 20/60 ft., one target. *Hit:* 5 (1d6+2) piercing damage, or 6 (1d8+2) piercing damage if used with two hands to make a melee attack.\n\n***Longbow.*** *Ranged Weapon Attack:* +3 to hit, range 150/600 ft., one target. *Hit:* 5 (1d8+1) piercing damage."
};

export default SRD_MONSTER_GNOLL;