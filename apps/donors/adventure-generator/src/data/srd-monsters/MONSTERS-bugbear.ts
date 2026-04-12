import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_BUGBEAR: SavedMonster = {
  "id": "srd-bugbear",
  "name": "Bugbear",
  "description": "Bugbears are hairy, brutish goblinoids who delight in bullying the weak and relish terrorizing their victims. They are surprisingly stealthy for their size.",
  "profile": {
    "table": {
      "creatureType": "Medium humanoid (goblinoid)",
      "size": "Medium",
      "alignment": "chaotic evil",
      "armorClass": "16 (hide armor, shield)",
      "hitPoints": "27 (5d8+5)",
      "speed": "30 ft.",
      "senses": "darkvision 60 ft., passive Perception 10",
      "languages": "Common, Goblin",
      "challengeRating": "1 (200 XP)",
      "keyAbilities": "STR +2, DEX +2, CON +1, INT -1, WIS +0, CHA -1",
      "role": "Ambusher"
    },
    "abilitiesAndTraits": "**Brute.** A melee weapon deals one extra die of its damage when the bugbear hits with it (included in the attack).\n\n**Surprise Attack.** If the bugbear surprises a creature and hits it with an attack during the first round of combat, the target takes an extra 7 (2d6) damage from the attack.",
    "actions": "**Morningstar.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 11 (2d8+2) piercing damage.",
    "roleplayingAndTactics": "Bugbears are ambush predators. They use their stealth to get the drop on enemies, striking from the shadows to make use of their Surprise Attack. In a straight fight, they are bullies who will focus on the weakest-looking target. They are not brave and may flee if a fight turns against them unless a stronger leader is present."
  },
  "statblock": "### Bugbear\n\n*Medium humanoid (goblinoid), chaotic evil*\n\n___\n\n- **Armor Class** 16 (hide armor, shield)\n\n- **Hit Points** 27 (5d8+5)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 15 (+2) | 14 (+2) | 13 (+1) | 8 (-1) | 11 (+0) | 9 (-1) |\n\n___\n\n- **Skills** Stealth +6, Survival +2\n\n- **Senses** darkvision 60 ft., passive Perception 10\n\n- **Languages** Common, Goblin\n\n- **Challenge** 1 (200 XP)\n\n___\n\n***Brute.*** A melee weapon deals one extra die of its damage when the bugbear hits with it (included in the attack).\n\n***Surprise Attack.*** If the bugbear surprises a creature and hits it with an attack during the first round of combat, the target takes an extra 7 (2d6) damage from the attack.\n\n### Actions\n***Morningstar.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 11 (2d8+2) piercing damage."
};

export default SRD_MONSTER_BUGBEAR;