
import { SavedMonster } from '../../types/npc';

export const SRD_MONSTER_BEHIR: SavedMonster = {
  "id": "srd-behir",
  "name": "Behir",
  "description": "A behir is a serpentine monstrosity with a dozen legs, capable of slithering and climbing with terrifying speed. It is a vicious predator often found in deep caves and other dark, lonely places.",
  "profile": {
    "table": {
      "creatureType": "Huge monstrosity",
      "size": "Huge",
      "alignment": "neutral evil",
      "armorClass": "17 (natural armor)",
      "hitPoints": "168 (16d12+64)",
      "speed": "50 ft., climb 40 ft.",
      "senses": "darkvision 90 ft., passive Perception 16",
      "languages": "Draconic",
      "challengeRating": "11 (7,200 XP)",
      "keyAbilities": "STR +6, DEX +3, CON +4, INT -2, WIS +2, CHA +1",
      "role": "Controller"
    },
    "savingThrows": {
        "dex": 7,
        "con": 8
    },
    "abilitiesAndTraits": "**Immunity to Lightning.** The behir is immune to lightning damage.",
    "actions": "**Multiattack.** The behir makes two attacks: one with its bite and one to constrict.\n\n**Bite.** *Melee Weapon Attack:* +10 to hit, reach 10 ft., one target. *Hit:* 22 (3d10+6) piercing damage.\n\n**Constrict.** *Melee Weapon Attack:* +10 to hit, reach 5 ft., one Large or smaller creature. *Hit:* 17 (2d10+6) bludgeoning damage plus 17 (2d10+6) slashing damage. The target is grappled (escape DC 16) if the behir isn't already constricting a creature, and the target is restrained until this grapple ends.\n\n**Lightning Breath (Recharge 5-6).** The behir exhales a line of lightning that is 20 feet long and 5 feet wide. Each creature in that line must make a DC 16 Dexterity saving throw, taking 66 (12d10) lightning damage on a failed save, or half as much damage on a successful one.\n\n**Swallow.** The behir makes one bite attack against a Medium or smaller target it is grappling. If the attack hits, the target is also swallowed, and the grapple ends. While swallowed, the target is blinded and restrained, it has total cover against attacks and other effects outside the behir, and it takes 21 (6d6) acid damage at the start of each of the behir's turns.",
    "roleplayingAndTactics": "A behir is an aggressive predator. It uses its climb speed to ambush from ceilings or high ledges. It will use its lightning breath to start a fight, then constrict a target while biting another. It despises dragons and will attack them on sight."
  },
  "statblock": "### Behir\n\n*Huge monstrosity, neutral evil*\n\n___\n\n- **Armor Class** 17 (natural armor)\n\n- **Hit Points** 168 (16d12+64)\n\n- **Speed** 50 ft., climb 40 ft.\n\n___\n\n| STR | DEX | CON | INT | WIS | CHA |\n\n|:---:|:---:|:---:|:---:|:---:|:---:|\n\n| 23 (+6) | 16 (+3) | 18 (+4) | 7 (-2) | 14 (+2) | 12 (+1) |\n\n___\n\n- **Saving Throws** Dex +7, Con +8\n- **Skills** Perception +6, Stealth +7\n\n- **Senses** darkvision 90 ft., passive Perception 16\n\n- **Languages** Draconic\n\n- **Challenge** 11 (7,200 XP)\n\n___\n\n### Actions\n***Multiattack.*** The behir makes two attacks: one with its bite and one to constrict.\n\n***Bite.*** *Melee Weapon Attack:* +10 to hit, reach 10 ft., one target. *Hit:* 22 (3d10+6) piercing damage.\n\n***Constrict.*** *Melee Weapon Attack:* +10 to hit, reach 5 ft., one Large or smaller creature. *Hit:* 17 (2d10+6) bludgeoning damage plus 17 (2d10+6) slashing damage. The target is grappled (escape DC 16) if the behir isn't already constricting a creature, and the target is restrained until this grapple ends."
};

export default SRD_MONSTER_BEHIR;
