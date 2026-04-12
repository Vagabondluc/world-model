
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_EFREETI_GENIE: SavedMonster = {
  "id": "srd-efreeti-genie",
  "name": "Efreeti (Genie)",
  "description": "Hailing from the Elemental Plane of Fire, efreet are cruel, arrogant genies who rule over vast domains from their magnificent basalt palaces. They see mortals as tools to be used and discarded.",
  "profile": {
    "table": {
      "creatureType": "Large elemental",
      "size": "Large",
      "alignment": "lawful evil",
      "armorClass": "17 (natural armor)",
      "hitPoints": "200 (16d10+112)",
      "speed": "40 ft., fly 60 ft.",
      "senses": "darkvision 120 ft., passive Perception 12",
      "languages": "Ignan",
      "challengeRating": "11 (7,200 XP)",
      "keyAbilities": "STR +6, DEX +1, CON +7, INT +3, WIS +2, CHA +3",
      "role": "Artillery"
    },
    "savingThrows": {
      "int": 7,
      "wis": 6,
      "cha": 7
    },
    "abilitiesAndTraits": "**Elemental Demise.** If the efreeti dies, its body disintegrates in a flash of fire and puff of smoke, leaving behind only equipment the efreeti was wearing or carrying.\n\n**Innate Spellcasting.** The efreeti's innate spellcasting ability is Charisma (spell save DC 15, +7 to hit with spell attacks). It can innately cast the following spells, requiring no material Components",
    "actions": "**Multiattack.** The efreeti makes two scimitar attacks or uses its Hurl Flame twice.\n\n**Scimitar.** *Melee Weapon Attack:* +10 to hit, reach 5 ft., one target. *Hit:* 13 (2d6+6) slashing damage plus 7 (2d6) fire damage.",
    "roleplayingAndTactics": "An efreeti prefers to demonstrate its power from a distance, using its innate spellcasting to hurl fireballs or create walls of fire. It will only resort to melee if cornered, where its flaming scimitar is still deadly. It may attempt to bargain for its life if defeated, offering a wish with a malicious twist."
  },
  "statblock": "### Efreeti (Genie)\n\n*Large elemental, lawful evil*\n\n___\n\n- **Armor Class** 17 (natural armor)\n\n- **Hit Points** 200 (16d10+112)\n\n- **Speed** 40 ft., fly 60 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 22 (+6) | 12 (+1) | 24 (+7) | 16 (+3) | 15 (+2) | 16 (+3) |\n\n___\n\n- **Saving Throws** Int +7, Wis +6, Cha +7\n- **Senses** darkvision 120 ft., passive Perception 12\n\n- **Languages** Ignan\n\n- **Challenge** 11 (7,200 XP)\n\n___\n\n***Elemental Demise.*** If the efreeti dies, its body disintegrates in a flash of fire and puff of smoke, leaving behind only equipment the efreeti was wearing or carrying.\n\n***Innate Spellcasting.*** The efreeti's innate spellcasting ability is Charisma (spell save DC 15, +7 to hit with spell attacks). It can innately cast the following spells, requiring no material Components\n\n### Actions\n***Multiattack.*** The efreeti makes two scimitar attacks or uses its Hurl Flame twice.\n\n***Scimitar.*** *Melee Weapon Attack:* +10 to hit, reach 5 ft., one target. *Hit:* 13 (2d6+6) slashing damage plus 7 (2d6) fire damage."
};

export default SRD_MONSTER_EFREETI_GENIE;