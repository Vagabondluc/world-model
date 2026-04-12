
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_STEAM_MEPHIT: SavedMonster = {
  "id": "srd-steam-mephit",
  "name": "Steam Mephit",
  "description": "A mischievous elemental creature from the confluence of Fire and Water, a steam mephit appears as a small, winged humanoid made of billowing clouds of hot steam.",
  "profile": {
    "table": {
      "creatureType": "Small elemental",
      "size": "Small",
      "alignment": "neutral evil",
      "armorClass": "10",
      "hitPoints": "21 (6d6)",
      "speed": "30 ft., fly 30 ft.",
      "senses": "darkvision 60 ft., passive Perception 10",
      "languages": "Aquan, Ignan",
      "challengeRating": "1/4 (50 XP)",
      "keyAbilities": "STR -3, DEX +0, CON +0, INT +0, WIS +0, CHA +1",
      "role": "Controller"
    },
    "abilitiesAndTraits": "**Death Burst.** When the mephit dies, it explodes in a cloud of steam. Each creature within 5 feet of the mephit must succeed on a DC 10 Dexterity saving throw or take 4 (1d8) fire damage.\n\n**Innate Spellcasting (1/Day).** The mephit can innately cast *blur*, requiring no material components. Its innate spellcasting ability is Charisma.",
    "actions": "**Claws.** *Melee Weapon Attack:* +2 to hit, reach 5 ft., one creature. *Hit:* 2 (1d4) slashing damage plus 2 (1d4) fire damage.\n\n**Steam Breath (Recharge 6).** The mephit exhales a 15-foot cone of scalding steam. Each creature in that area must succeed on a DC 10 Dexterity saving throw, taking 4 (1d8) fire damage on a failed save, or half as much damage on a successful one.",
    "roleplayingAndTactics": "Steam mephits are tricksters who enjoy scalding their foes. They will use their Steam Breath from a distance, then fly in to slash with their claws. Their Death Burst is a final, painful surprise for anyone who gets too close."
  },
  "statblock": "### Steam Mephit\n\n*Small elemental, neutral evil*\n\n___\n\n- **Armor Class** 10\n\n- **Hit Points** 21 (6d6)\n\n- **Speed** 30 ft., fly 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 5 (-3) | 11 (+0) | 10 (+0) | 11 (+0) | 10 (+0) | 12 (+1) |\n\n___\n\n- **Senses** darkvision 60 ft., passive Perception 10\n\n- **Languages** Aquan, Ignan\n\n- **Challenge** 1/4 (50 XP)\n\n___\n\n***Death Burst.*** When the mephit dies, it explodes in a cloud of steam. Each creature within 5 feet of the mephit must succeed on a DC 10 Dexterity saving throw or take 4 (1d8) fire damage.\n\n***Innate Spellcasting (1/Day).*** The mephit can innately cast *blur*, requiring no material components. Its innate spellcasting ability is Charisma.\n\n### Actions\n***Claws.*** *Melee Weapon Attack:* +2 to hit, reach 5 ft., one creature. *Hit:* 2 (1d4) slashing damage plus 2 (1d4) fire damage.\n\n***Steam Breath (Recharge 6).*** The mephit exhales a 15-foot cone of scalding steam. Each creature in that area must succeed on a DC 10 Dexterity saving throw, taking 4 (1d8) fire damage on a failed save, or half as much damage on a successful one."
};

export default SRD_MONSTER_STEAM_MEPHIT;