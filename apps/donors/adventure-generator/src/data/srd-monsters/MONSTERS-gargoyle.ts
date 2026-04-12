
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_GARGOYLE: SavedMonster = {
  "id": "srd-gargoyle",
  "name": "Gargoyle",
  "description": "Gargoyles are malevolent constructs of living stone. They perch on buildings and in ruins, remaining perfectly still until their prey is close enough to ambush.",
  "profile": {
    "table": {
      "creatureType": "Medium elemental",
      "size": "Medium",
      "alignment": "chaotic evil",
      "armorClass": "15 (natural armor)",
      "hitPoints": "52 (7d8+21)",
      "speed": "30 ft., fly 60 ft.",
      "senses": "darkvision 60 ft., passive Perception 10",
      "languages": "Terran",
      "challengeRating": "2 (450 XP)",
      "keyAbilities": "STR +2, DEX +0, CON +3, INT -2, WIS +0, CHA -2",
      "role": "Soldier"
    },
    "abilitiesAndTraits": "**False Appearance.** While the gargoyle remains motionless, it is indistinguishable from an inanimate statue.",
    "actions": "**Multiattack.** The gargoyle makes two attacks: one with its bite and one with its claws.\n\n**Bite.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 5 (1d6+2) piercing damage.\n\n**Claws.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 5 (1d6+2) slashing damage.",
    "roleplayingAndTactics": "Gargoyles are patient hunters, often waiting for days for the perfect moment to strike. They rely on their False Appearance to gain surprise, swooping down to tear at foes with claws and teeth. They enjoy tormenting weak prey but will retreat if they face strong resistance, flying out of reach to wait for another opportunity."
  },
  "statblock": "### Gargoyle\n\n*Medium elemental, chaotic evil*\n\n___\n\n- **Armor Class** 15 (natural armor)\n\n- **Hit Points** 52 (7d8+21)\n\n- **Speed** 30 ft., fly 60 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 15 (+2) | 11 (+0) | 16 (+3) | 6 (-2) | 11 (+0) | 7 (-2) |\n\n___\n\n- **Senses** darkvision 60 ft., passive Perception 10\n\n- **Languages** Terran\n\n- **Challenge** 2 (450 XP)\n\n___\n\n***False Appearance.*** While the gargoyle remains motionless, it is indistinguishable from an inanimate statue.\n\n### Actions\n***Multiattack.*** The gargoyle makes two attacks: one with its bite and one with its claws.\n\n***Bite.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 5 (1d6+2) piercing damage.\n\n***Claws.*** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one target. *Hit:* 5 (1d6+2) slashing damage."
};

export default SRD_MONSTER_GARGOYLE;
