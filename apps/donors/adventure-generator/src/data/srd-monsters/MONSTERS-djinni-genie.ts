
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_DJINNI_GENIE: SavedMonster = {
  "id": "srd-djinni-genie",
  "name": "Djinni (Genie)",
  "description": "Djinn are genies from the Elemental Plane of Air. They are capricious and proud, but generally well-disposed towards mortals. They appear as towering, muscular humanoids of blue skin and swirling air.",
  "profile": {
    "table": {
      "creatureType": "Large elemental",
      "size": "Large",
      "alignment": "chaotic good",
      "armorClass": "17 (natural armor)",
      "hitPoints": "161 (14d10+84)",
      "speed": "30 ft., fly 90 ft.",
      "senses": "darkvision 120 ft., passive Perception 13",
      "languages": "Auran",
      "challengeRating": "11 (7,200 XP)",
      "keyAbilities": "STR +5, DEX +2, CON +6, INT +2, WIS +3, CHA +5",
      "role": "Controller"
    },
    "savingThrows": {
      "dex": 6,
      "wis": 7,
      "cha": 9
    },
    "abilitiesAndTraits": "**Elemental Demise.** If the djinni dies, its body disintegrates into a warm breeze, leaving behind only equipment the djinni was wearing or carrying.\n\n**Innate Spellcasting.** The djinni's innate spellcasting ability is Charisma (spell save DC 17, +9 to hit with spell attacks). It can innately cast the following spells, requiring no material Components:\n\nAt will: *detect evil and good, detect magic, thunderwave*\n3/day each: *create food and water, create wind, gaseous form, invisibility, major image, plane shift, wind walk*\n1/day each: *conjure elemental (air elemental only), creation, gaseous form, invisibility, major image, plane shift*",
    "actions": "**Multiattack.** The djinni makes three scimitar attacks.\n\n**Scimitar.** *Melee Weapon Attack:* +9 to hit, reach 5 ft., one target. *Hit:* 12 (2d6+5) slashing damage plus 3 (1d6) lightning or thunder damage (djinni's choice).\n\n**Create Whirlwind.** A 5-foot radius, 30-foot tall cylinder of swirling air magically forms on a point the djinni can see within 120 feet of it. The whirlwind lasts as long as the djinni maintains concentration (as if concentrating on a spell). Any creature but the djinni that enters the whirlwind must succeed on a DC 18 Strength saving throw or be restrained by it. The djinni can move the whirlwind up to 60 feet as an action, and creatures restrained by the whirlwind move with it. The whirlwind ends if the djinni loses sight of it.",
    "roleplayingAndTactics": "A djinni is a powerful aerial combatant. It will use its Create Whirlwind ability to incapacitate strong melee fighters and its spellcasting to control the battlefield. It is a proud creature and may offer a wish or service in exchange for its freedom if captured."
  },
  "statblock": "### Djinni (Genie)\n\n*Large elemental, chaotic good*\n\n___\n\n- **Armor Class** 17 (natural armor)\n\n- **Hit Points** 161 (14d10+84)\n\n- **Speed** 30 ft., fly 90 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 21 (+5) | 15 (+2) | 22 (+6) | 15 (+2) | 16 (+3) | 20 (+5) |\n\n___\n\n- **Saving Throws** Dex +6, Wis +7, Cha +9\n- **Senses** darkvision 120 ft., passive Perception 13\n\n- **Languages** Auran\n\n- **Challenge** 11 (7,200 XP)\n\n___\n\n***Elemental Demise.*** If the djinni dies, its body disintegrates into a warm breeze, leaving behind only equipment the djinni was wearing or carrying.\n\n***Innate Spellcasting.*** The djinni's innate spellcasting ability is Charisma (spell save DC 17, +9 to hit with spell attacks). It can innately cast the following spells, requiring no material Components\n\n### Actions\n***Multiattack.*** The djinni makes three scimitar attacks.\n\n***Scimitar.*** *Melee Weapon Attack:* +9 to hit, reach 5 ft., one target. *Hit:* 12 (2d6+5) slashing damage plus 3 (1d6) lightning or thunder damage (djinni's choice).\n\n***Create Whirlwind.*** A 5-foot radius, 30-foot tall cylinder of swirling air magically forms on a point the djinni can see within 120 feet of it. The whirlwind lasts as long as the djinni maintains concentration (as if concentrating on a spell). Any creature but the djinni that enters the whirlwind must succeed on a DC 18 Strength saving throw or be restrained by it. The djinni can move the whirlwind up to 60 feet as an action, and creatures restrained by the whirlwind move with it. The whirlwind ends if the djinni loses sight of it."
};

export default SRD_MONSTER_DJINNI_GENIE;