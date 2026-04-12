import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_CENTAUR: SavedMonster = {
  "id": "srd-centaur",
  "name": "Centaur",
  "description": "Centaurs have the upper body of a humanoid and the lower body of a horse. They are proud, territorial beings who roam the wilds, living in harmony with nature.",
  "profile": {
    "table": {
      "creatureType": "Large monstrosity",
      "size": "Large",
      "alignment": "neutral good",
      "armorClass": "12",
      "hitPoints": "45 (6d10+12)",
      "speed": "50 ft.",
      "senses": "passive Perception 13",
      "languages": "Elvish, Sylvan",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +4, DEX +2, CON +2, INT -1, WIS +1, CHA +0",
      "role": "Skirmisher"
    },
    "abilitiesAndTraits": "**Charge.** If the centaur moves at least 30 feet straight toward a target and then hits it with a pike attack on the same turn, the target takes an extra 10 (3d6) piercing damage.",
    "actions": "**Multiattack.** The centaur makes two attacks: one with its pike and one with its hooves or two with its longbow.\n\n**Pike.** *Melee Weapon Attack:* +6 to hit, reach 10 ft., one target. *Hit:* 9 (1d10+4) piercing damage.\n\n**Hooves.** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 11 (2d6+4) bludgeoning damage.\n\n**Longbow.** *Ranged Weapon Attack:* +4 to hit, range 150/600 ft., one target. *Hit:* 6 (1d8+2) piercing damage.",
    "roleplayingAndTactics": "Centaurs are proud and reclusive. They are slow to trust outsiders. In battle, they are masters of hit-and-run tactics, using their superior speed to charge with pikes and then retreat to fire their longbows. They fight fiercely to protect their territory and their tribe."
  },
  "statblock": "### Centaur\n\n*Large monstrosity, neutral good*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 45 (6d10+12)\n\n- **Speed** 50 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 18 (+4) | 14 (+2) | 14 (+2) | 9 (-1) | 13 (+1) | 11 (+0) |\n\n___\n\n- **Skills** Athletics +6, Perception +3, Survival +3\n\n- **Senses** passive Perception 13\n\n- **Languages** Elvish, Sylvan\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***Charge.*** If the centaur moves at least 30 feet straight toward a target and then hits it with a pike attack on the same turn, the target takes an extra 10 (3d6) piercing damage.\n\n### Actions\n***Multiattack.*** The centaur makes two attacks: one with its pike and one with its hooves or two with its longbow.\n\n***Pike.*** *Melee Weapon Attack:* +6 to hit, reach 10 ft., one target. *Hit:* 9 (1d10+4) piercing damage.\n\n***Hooves.*** *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. *Hit:* 11 (2d6+4) bludgeoning damage.\n\n***Longbow.*** *Ranged Weapon Attack:* +4 to hit, range 150/600 ft., one target. *Hit:* 6 (1d8 + 2) piercing damage."
};

export default SRD_MONSTER_CENTAUR;