
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_PANTHER: SavedMonster = {
  "id": "srd-panther",
  "name": "Panther",
  "description": "A large, black-furred cat of the jungle, the panther is a stealthy and deadly predator. It is a solitary hunter that stalks its prey from the treetops.",
  "profile": {
    "table": {
      "creatureType": "Medium beast",
      "size": "Medium",
      "alignment": "unaligned",
      "armorClass": "12",
      "hitPoints": "13 (3d8)",
      "speed": "50 ft., climb 40 ft.",
      "senses": "passive Perception 14",
      "languages": "-",
      "challengeRating": "1/4 (50 XP)",
      "keyAbilities": "STR +2, DEX +2, CON +0, INT -4, WIS +2, CHA -2",
      "role": "Skirmisher"
    },
    "abilitiesAndTraits": "**Keen Smell.** The panther has advantage on Wisdom (Perception) checks that rely on smell.\n\n**Pounce.** If the panther moves at least 20 feet straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 12 Strength saving throw or be knocked prone. If the target is prone, the panther can make one bite attack against it as a bonus action.",
    "actions": "**Bite.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 5 (1d6+2) piercing damage.\n\n**Claw.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 4 (1d4 + 2) slashing damage.",
    "roleplayingAndTactics": "Panthers are masters of ambush. They use their natural stealth and ability to climb to get the drop on their prey. They will initiate combat with their Pounce ability, aiming to knock a target prone before finishing it with a bite. They are patient and will wait for the perfect moment to strike."
  },
  "statblock": "### Panther\n\n*Medium beast, unaligned*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 13 (3d8)\n\n- **Speed** 50 ft., climb 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 14 (+2) | 15 (+2) | 10 (+0) | 3 (-4) | 14 (+2) | 7 (-2) |\n\n___\n\n- **Skills** Perception +4, Stealth +6\n\n- **Senses** passive Perception 14\n\n- **Languages** -\n\n- **Challenge** 1/4 (50 XP)\n\n___\n\n***Keen Smell.*** The panther has advantage on Wisdom (Perception) checks that rely on smell.\n\n***Pounce.*** If the panther moves at least 20 feet straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 12 Strength saving throw or be knocked prone. If the target is prone, the panther can make one bite attack against it as a bonus action.\n\n### Actions\n***Bite.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 5 (1d6+2) piercing damage."
};

export default SRD_MONSTER_PANTHER;
