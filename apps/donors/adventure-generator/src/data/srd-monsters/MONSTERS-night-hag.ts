
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_NIGHT_HAG: SavedMonster = {
    "id": "srd-night-hag",
    "name": "Night Hag",
    "description": "Night hags are fiendish crones who traffic in souls. They are soul-mongers of the lower planes, visiting mortals in their sleep to corrupt their dreams and steal their vital essence.",
    "profile": {
      "table": {
        "creatureType": "Medium fiend",
        "size": "Medium",
        "alignment": "neutral evil",
        "armorClass": "17 (natural armor)",
        "hitPoints": "112 (15d8+45)",
        "speed": "30 ft.",
        "senses": "darkvision 120 ft., passive Perception 16",
        "languages": "Abyssal, Common, Infernal, Primordial",
        "challengeRating": "5 (1,800 XP)",
        "keyAbilities": "STR +4, DEX +2, CON +3, INT +3, WIS +2, CHA +3",
        "role": "Controller"
      },
      "savingThrows": {
          "wis": 6,
          "cha": 7
      },
      "abilitiesAndTraits": "**Innate Spellcasting.** The hag's innate spellcasting ability is Charisma (spell save DC 14, +6 to hit with spell attacks). She can innately cast the following spells, requiring no material Components:\n\n**Magic Resistance.** The hag has advantage on saving throws against spells and other magical effects.",
      "actions": "**Claws (Hag Form Only).** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 13 (2d8+4) slashing damage.\n\n**Change Shape.** The hag magically polymorphs into a Small or Medium female humanoid, or back into her true form. Her statistics are the same in each form. Any equipment she is wearing or carrying isn't transformed. She reverts to her true form if she dies.\n\n**Etherealness.** The hag magically enters the Ethereal Plane from the Material Plane, or vice versa. To do so, the hag must have a *heartstone* in her possession.\n\n**Nightmare Haunting (1/Day).** While on the Ethereal Plane, the hag magically touches a sleeping humanoid on the Material Plane. A *protection from evil and good* spell cast on the target prevents this contact, as does a *magic circle*. As long as the contact persists, the target has horrific visions. If these visions last for at least 1 hour, the target gains no benefit from its rest, and its hit point maximum is reduced by 5 (1d10).",
      "roleplayingAndTactics": "A night hag is a master of subterfuge. It will use its shape-changing and etherealness to torment a victim from the Ethereal Plane, haunting their dreams to weaken them. In direct combat, it uses its spells and claws, but it will always prefer to escape to fight another day."
    },
    "statblock": "### Night Hag\n\n*Medium fiend, neutral evil*\n\n___\n\n- **Armor Class** 17 (natural armor)\n\n- **Hit Points** 112 (15d8+45)\n\n- **Speed** 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 18 (+4) | 15 (+2) | 16 (+3) | 16 (+3) | 14 (+2) | 16 (+3) |\n\n___\n\n- **Saving Throws** Wis +6, Cha +7\n- **Skills** Deception +7, Insight +6, Perception +6, Stealth +6\n\n- **Senses** darkvision 120 ft., passive Perception 16\n\n- **Languages** Abyssal, Common, Infernal, Primordial\n\n- **Challenge** 5 (1,800 XP)\n\n___\n\n***Innate Spellcasting.*** The hag's innate spellcasting ability is Charisma (spell save DC 14, +6 to hit with spell attacks). She can innately cast the following spells, requiring no material Components\n\n***Magic Resistance.*** The hag has advantage on saving throws against spells and other magical effects.\n\n### Actions\n***Claws (Hag Form Only).*** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 13 (2d8+4) slashing damage.\n\n***Change Shape.*** The hag magically polymorphs into a Small or Medium female humanoid, or back into her true form. Her statistics are the same in each form. Any equipment she is wearing or carrying isn't transformed. She reverts to her true form if she dies.\n\n***Etherealness.*** The hag magically enters the Ethereal Plane from the Material Plane, or vice versa. To do so, the hag must have a *heartstone* in her possession."
  };
export default SRD_MONSTER_NIGHT_HAG;
