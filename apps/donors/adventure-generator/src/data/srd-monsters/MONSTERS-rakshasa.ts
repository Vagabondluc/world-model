
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_RAKSHASA: SavedMonster = {
  "id": "srd-rakshasa",
  "name": "Rakshasa",
  "description": "A rakshasa is a fiend that delights in corrupting mortals. In its true form, it has the head of a tiger and the body of a humanoid, with hands that are backwards. They are masters of illusion and deception.",
  "profile": {
    "table": {
      "creatureType": "Medium fiend",
      "size": "Medium",
      "alignment": "lawful evil",
      "armorClass": "16 (natural armor)",
      "hitPoints": "110 (13d8+52)",
      "speed": "40 ft.",
      "senses": "darkvision 60 ft., passive Perception 13",
      "languages": "Common, Infernal",
      "challengeRating": "13 (10,000 XP)",
      "keyAbilities": "STR +2, DEX +3, CON +4, INT +1, WIS +3, CHA +5",
      "role": "Controller"
    },
    "abilitiesAndTraits": "**Limited Magic Immunity.** The rakshasa can't be affected or detected by spells of 6th level or lower unless it wishes to be. It has advantage on saving throws against all other spells and magical effects.\n\n**Innate Spellcasting.** The rakshasa's innate spellcasting ability is Charisma (spell save DC 18, +10 to hit with spell attacks). The rakshasa can innately cast the following spells, requiring no material Components:\nAt will: *detect thoughts, disguise self, mage hand, minor illusion*\n3/day each: *charm person, detect magic, invisibility, major image, suggestion*\n1/day each: *dominate person, fly, plane shift, true seeing*",
    "actions": "**Multiattack.** The rakshasa makes two claw attacks.\n\n**Claw.** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 9 (2d6+2) slashing damage, and the target is cursed if it is a creature. The magical curse takes effect whenever the target takes a short or long rest, filling the target's thoughts with horrible images and dreams and preventing the target from gaining any benefit from that rest. The curse lasts until it is lifted by a *remove curse* spell or similar magic.",
    "roleplayingAndTactics": "Rakshasas are master manipulators who prefer to destroy their enemies through social and political ruin rather than direct combat. They are nearly immune to magic and will use their spells to dominate and confuse their foes. If forced into a physical confrontation, they will strike with their cursed claws before making a swift retreat."
  },
  "statblock": "### Rakshasa\n\n*Medium fiend, lawful evil*\n\n___\n\n- **Armor Class** 16 (natural armor)\n\n- **Hit Points** 110 (13d8+52)\n\n- **Speed** 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 14 (+2) | 17 (+3) | 18 (+4) | 13 (+1) | 16 (+3) | 20 (+5) |\n\n___\n\n- **Skills** Deception +10, Insight +8\n\n- **Senses** darkvision 60 ft., passive Perception 13\n\n- **Languages** Common, Infernal\n\n- **Challenge** 13 (10,000 XP)\n\n___\n\n***Limited Magic Immunity.*** The rakshasa can't be affected or detected by spells of 6th level or lower unless it wishes to be. It has advantage on saving throws against all other spells and magical effects.\n\n***Innate Spellcasting.*** The rakshasa's innate spellcasting ability is Charisma (spell save DC 18, +10 to hit with spell attacks). The rakshasa can innately cast the following spells, requiring no material Components\n\n### Actions\n***Multiattack.*** The rakshasa makes two claw attacks."
};

export default SRD_MONSTER_RAKSHASA;
