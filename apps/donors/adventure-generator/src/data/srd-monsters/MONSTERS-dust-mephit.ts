
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_DUST_MEPHIT: SavedMonster = {
  "id": "srd-dust-mephit",
  "name": "Dust Mephit",
  "description": "A dust mephit is a mischievous elemental creature from the confluence of Air and Earth. It appears as a small, winged humanoid made of swirling dust and grit.",
  "profile": {
    "table": {
      "creatureType": "Small elemental",
      "size": "Small",
      "alignment": "neutral evil",
      "armorClass": "12",
      "hitPoints": "17 (5d6)",
      "speed": "30 ft., fly 30 ft.",
      "senses": "Darkvision 60 ft., passive Perception 12",
      "languages": "Auran, Terran",
      "challengeRating": "1/2 (100 XP)",
      "keyAbilities": "STR -3, DEX +2, CON +0, INT -1, WIS +0, CHA +0",
      "role": "Controller"
    },
    "abilitiesAndTraits": "**Death Burst.** When the mephit dies, it explodes in a burst of dust. Each creature within 5 feet of it must then succeed on a DC 10 Constitution saving throw or be blinded for 1 minute. A blinded creature can repeat the saving throw on each of its turns, ending the effect on itself on a success.\n\n**Innate Spellcasting (1/Day).** The mephit can innately cast *sleep*, requiring no material components. Its innate spellcasting ability is Charisma.",
    "actions": "**Claws.** *Melee Weapon Attack:* +4 to hit, reach 5 ft., one creature. *Hit:* 4 (1d4 + 2) slashing damage.\n\n**Blinding Breath (Recharge 6).** The mephit exhales a 15-foot cone of blinding dust. Each creature in that area must succeed on a DC 10 Dexterity saving throw or be blinded for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.",
    "roleplayingAndTactics": "Dust mephits are cruel tricksters. They will use their Blinding Breath or *sleep* spell to incapacitate foes, then fly in to slash at them with their claws. They are cowardly and will flee if outnumbered, often using their Death Burst to cover their escape."
  },
  "statblock": "### Dust Mephit\n\n*Small elemental, neutral evil*\n\n___\n\n- **Armor Class** 12\n\n- **Hit Points** 17 (5d6)\n\n- **Speed** 30 ft., fly 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 5 (-3) | 14 (+2) | 10 (+0) | 9 (-1) | 11 (+0) | 10 (+0) |\n\n___\n\n- **Skills** Perception +2, Stealth +4\n\n- **Senses** Darkvision 60 ft., passive Perception 12\n\n- **Languages** Auran, Terran\n\n- **Challenge** 1/2 (100 XP)\n\n___\n\n***Death Burst.*** When the mephit dies, it explodes in a burst of dust. Each creature within 5 feet of it must then succeed on a DC 10 Constitution saving throw or be blinded for 1 minute. A blinded creature can repeat the saving throw on each of its turns, ending the effect on itself on a success.\n\n***Innate Spellcasting (1/Day).*** The mephit can innately cast *sleep*, requiring no material components. Its innate spellcasting ability is Charisma."
};

export default SRD_MONSTER_DUST_MEPHIT;