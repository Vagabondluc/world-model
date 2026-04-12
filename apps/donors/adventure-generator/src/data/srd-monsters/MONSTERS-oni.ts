
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_ONI: SavedMonster = {
  "id": "srd-oni",
  "name": "Oni",
  "description": "Oni are cruel, ogre-like giants that delight in tormenting humanoids. They can change shape and turn invisible, using these abilities to infiltrate communities and sow terror from within before revealing their monstrous true forms.",
  "profile": {
    "table": {
      "creatureType": "Large giant",
      "size": "Large",
      "alignment": "lawful evil",
      "armorClass": "16 (chain mail)",
      "hitPoints": "110 (13d10+39)",
      "speed": "30 ft., fly 30 ft.",
      "senses": "darkvision 60 ft., passive Perception 14",
      "languages": "Common, Giant",
      "challengeRating": "7 (2,900 XP)",
      "keyAbilities": "STR +4, DEX +0, CON +3, INT +2, WIS +1, CHA +2",
      "role": "Controller"
    },
    "savingThrows": {
        "dex": 3,
        "con": 6,
        "wis": 4,
        "cha": 5
    },
    "abilitiesAndTraits": "**Innate Spellcasting.** The oni's innate spellcasting ability is Charisma (spell save DC 13). The oni can innately cast the following spells, requiring no material Components\n\n**Magic Weapons.** The oni's weapon attacks are magical.\n\n**Regeneration.** The oni regains 10 hit points at the start of its turn if it has at least 1 hit point.",
    "actions": "**Multiattack.** The oni makes two attacks, either with its claws or its glaive.\n\n**Claw (Oni Form Only).** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 8 (1d8+4) slashing damage.\n\n**Glaive.** *Melee Weapon Attack:* +7 to hit, reach 10 ft., one target. *Hit:* 15 (2d10+4) slashing damage, or 9 (1d10+4) slashing damage in Small or Medium form.",
    "roleplayingAndTactics": "An oni is a cunning and strategic foe. It will use its shapechanging abilities to get close to its victims, often posing as a helpful stranger. In combat, it uses its spells like *cone of cold* and *gaseous form* to control the battlefield. Its regeneration makes it a resilient opponent, and it will not hesitate to fly away if a fight turns against it, only to return later to exact its revenge."
  },
  "statblock": "### Oni\n\n*Large giant, lawful evil*\n\n___\n\n- **Armor Class** 16 (chain mail)\n\n- **Hit Points** 110 (13d10+39)\n\n- **Speed** 30 ft., fly 30 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 19 (+4) | 11 (+0) | 16 (+3) | 14 (+2) | 12 (+1) | 15 (+2) |\n\n___\n\n- **Saving Throws** Dex +3, Con +6, Wis +4, Cha +5\n- **Skills** Arcana +5, Deception +8, Perception +4\n\n- **Senses** darkvision 60 ft., passive Perception 14\n\n- **Languages** Common, Giant\n\n- **Challenge** 7 (2,900 XP)\n\n___\n\n***Innate Spellcasting.*** The oni's innate spellcasting ability is Charisma (spell save DC 13). The oni can innately cast the following spells, requiring no material Components\n\n***Magic Weapons.*** The oni's weapon attacks are magical.\n\n***Regeneration.*** The oni regains 10 hit points at the start of its turn if it has at least 1 hit point.\n\n### Actions\n***Multiattack.*** The oni makes two attacks, either with its claws or its glaive.\n\n***Claw (Oni Form Only).*** *Melee Weapon Attack:* +7 to hit, reach 5 ft., one target. *Hit:* 8 (1d8+4) slashing damage.\n\n***Glaive.*** *Melee Weapon Attack:* +7 to hit, reach 10 ft., one target. *Hit:* 15 (2d10+4) slashing damage, or 9 (1d10+4) slashing damage in Small or Medium form."
};

export default SRD_MONSTER_ONI;
