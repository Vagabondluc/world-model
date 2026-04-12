
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_SAHUAGIN: SavedMonster = {
  "id": "srd-sahuagin",
  "name": "Sahuagin",
  "description": "Sahuagin, also known as sea devils, are a cruel, predatory race of aquatic humanoids. They are the scourge of the seas, raiding coastal settlements and enslaving those they do not eat.",
  "profile": {
    "table": {
      "creatureType": "Medium humanoid (sahuagin)",
      "size": "Medium",
      "alignment": "lawful evil",
      "armorClass": "12 (natural armor)",
      "hitPoints": "22 (4d8+4)",
      "speed": "30 ft., swim 40 ft.",
      "senses": "darkvision 120 ft., passive Perception 15",
      "languages": "Sahuagin",
      "challengeRating": "1/2 (100 XP)",
      "keyAbilities": "STR +1, DEX +0, CON +1, INT +1, WIS +1, CHA -1",
      "role": "Soldier"
    },
    "abilitiesAndTraits": "**Blood Frenzy.** The sahuagin has advantage on melee attack rolls against any creature that doesn't have all its hit points.\n\n**Limited Amphibiousness.** The sahuagin can breathe air and water, but it needs to be submerged at least once every 4 hours to avoid suffocating.\n\n**Shark Telepathy.** The sahuagin can magically command any shark within 120 feet of it, using a limited telepathy.",
    "actions": "**Multiattack.** The sahuagin makes two melee attacks: one with its bite and one with its claws or spear.\n\n**Bite.** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 3 (1d4+1) piercing damage.\n\n**Claws.** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 4 (1d4+2) slashing damage.\n\n**Spear.** *Melee or Ranged Weapon Attack:* +3 to hit, reach 5 ft. or range 20/60 ft., one target. *Hit:* 4 (1d6+1) piercing damage, or 5 (1d8+1) piercing damage if used with two hands to make a melee attack.",
    "roleplayingAndTactics": "Sahuagin are intelligent and organized hunters. They attack in groups, using their Shark Telepathy to coordinate attacks with sharks. Their Blood Frenzy makes them particularly deadly against wounded opponents. They are fanatically devoted to their god, Sekolah."
  },
  "statblock": "### Sahuagin\n\n*Medium humanoid (sahuagin), lawful evil*\n\n___\n\n- **Armor Class** 12 (natural armor)\n\n- **Hit Points** 22 (4d8+4)\n\n- **Speed** 30 ft., swim 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 13 (+1) | 11 (+0) | 12 (+1) | 12 (+1) | 13 (+1) | 9 (-1) |\n\n___\n\n- **Skills** Perception +5\n\n- **Senses** darkvision 120 ft., passive Perception 15\n\n- **Languages** Sahuagin\n\n- **Challenge** 1/2 (100 XP)\n\n___\n\n***Blood Frenzy.*** The sahuagin has advantage on melee attack rolls against any creature that doesn't have all its hit points.\n\n***Limited Amphibiousness.*** The sahuagin can breathe air and water, but it needs to be submerged at least once every 4 hours to avoid suffocating.\n\n***Shark Telepathy.*** The sahuagin can magically command any shark within 120 feet of it, using a limited telepathy.\n\n### Actions\n***Multiattack.*** The sahuagin makes two melee attacks: one with its bite and one with its claws or spear.\n\n***Bite.*** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 3 (1d4+1) piercing damage.\n\n***Claws.*** *Melee Weapon Attack:* +3 to hit, reach 5 ft., one target. *Hit:* 4 (1d4+2) slashing damage.\n\n***Spear.*** *Melee or Ranged Weapon Attack:* +3 to hit, reach 5 ft. or range 20/60 ft., one target. *Hit:* 4 (1d6+1) piercing damage, or 5 (1d8+1) piercing damage if used with two hands to make a melee attack."
};

export default SRD_MONSTER_SAHUAGIN;
