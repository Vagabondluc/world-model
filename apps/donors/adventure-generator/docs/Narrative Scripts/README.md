# Narrative Scripts

A comprehensive collection of AI-powered prompts, templates, and tools for tabletop RPG game masters, particularly focused on Dungeons & Dragons 5th Edition. This repository contains structured narrative generation systems for creating adventures, NPCs, locations, encounters, and more.

## 📁 Directory Structure

### Root Files

| File | Purpose |
|------|---------|
| [`database_schema.md`](database_schema.md:1) | Defines the Google Cloud Firestore database schema for the Element Manager application, including Card document structure with UUIDs, connections, and metadata |
| [`dungeon-master-guide.txt`](dungeon-master-guide.txt:1) | Comprehensive guide for dungeon masters covering best practices, session preparation, and game management techniques |
| [`dungeon-master-toolkit.txt`](dungeon-master-toolkit.txt:1) | Collection of practical tools, quick reference materials, and utilities for dungeon masters during gameplay |
| [`index.json`](index.json:1) | JSON index file containing metadata and categorization of all narrative scripts |
| [`index.md`](index.md:1) | Markdown index document with lump summary and machine-friendly mapping of all files organized by category |
| [`manifest.json`](manifest.json:1) | JSON manifest file listing all scripts and their organizational structure |
| [`manifest.yaml`](manifest.yaml:1) | YAML manifest file providing a structured inventory of all scripts organized by category |

---

## 📂 Subdirectories

### 🤖 AI_Behavior

Contains AI personality profiles and behavior configurations for different narrative generation styles.

| File | Purpose |
|------|---------|
| [`AI_Behavior/dont_talk_but_do.txt`](AI_Behavior/dont_talk_but_do.txt:1) | AI behavior profile that focuses on action-oriented responses rather than conversational output |
| [`AI_Behavior/ed_greenwood.txt`](AI_Behavior/ed_greenwood.txt:1) | AI personality modeled after Ed Greenwood's writing style for Forgotten Realms content |
| [`AI_Behavior/encyclopedic_TextEntry_v1.txt`](AI_Behavior/encyclopedic_TextEntry_v1.txt:1) | Template for generating encyclopedic-style text entries with structured information |
| [`AI_Behavior/new_behavior.txt`](AI_Behavior/new_behavior.txt:1) | Template or placeholder for defining new AI behavior profiles |

#### 🧠 AI_Behavior/hivemind

Advanced multi-agent architecture for collaborative narrative generation.

| File | Purpose |
|------|---------|
| [`AI_Behavior/hivemind/Hivemind companion.txt`](AI_Behavior/hivemind/Hivemind companion.txt:1) | Companion agent configuration for the hivemind system |
| [`AI_Behavior/hivemind/HiveMindConcept_v1.txt`](AI_Behavior/hivemind/HiveMindConcept_v1.txt:1) | Core concept documentation for the hivemind multi-agent architecture |
| [`AI_Behavior/hivemind/NarrativeMasterAI_v1.txt`](AI_Behavior/hivemind/NarrativeMasterAI_v1.txt:1) | Master AI agent that coordinates other agents in the hivemind system |
| [`AI_Behavior/hivemind/personality_questionnaire.txt`](AI_Behavior/hivemind/personality_questionnaire.txt:1) | Questionnaire for defining personality traits and behaviors for AI agents |
| [`AI_Behavior/hivemind/roles.json`](AI_Behavior/hivemind/roles.json:1) | JSON configuration defining different roles and responsibilities for AI agents |

---

### ⚙️ Engines

Core narrative generation engines and frameworks.

#### 🧭 Engines/Golden_Compass

The Golden Compass adventure generation framework.

| File | Purpose |
|------|---------|
| [`Engines/Golden_Compass/Golden Compass Adventure Template.txt`](Engines/Golden_Compass/Golden Compass Adventure Template.txt:1) | Master template for creating adventures using the Golden Compass framework |
| [`Engines/Golden_Compass/Golden Compass Challenge Framework.txt`](Engines/Golden_Compass/Golden Compass Challenge Framework.txt:1) | Framework for designing and balancing challenges within adventures |
| [`Engines/Golden_Compass/Golden Compass Danger and Combat Framework.txt`](Engines/Golden_Compass/Golden Compass Danger and Combat Framework.txt:1) | System for creating danger levels and combat encounters |
| [`Engines/Golden_Compass/Golden Compass Wealth and Vehicle System.txt`](Engines/Golden_Compass/Golden Compass Wealth and Vehicle System.txt:1) | Rules for wealth distribution and vehicle mechanics in adventures |
| [`Engines/Golden_Compass/Three-Pass Adventure Creation Method.txt`](Engines/Golden_Compass/Three-Pass Adventure Creation Method.txt:1) | Three-step methodology for creating structured adventures |

#### ✍️ Engines/prompt creator

Tools for creating and customizing generation prompts.

| File | Purpose |
|------|---------|
| [`Engines/prompt creator/PromptCreator_v1.txt`](Engines/prompt creator/PromptCreator_v1.txt:1) | Tool for creating structured prompts for narrative generation |
| [`Engines/prompt creator/whimsy.txt`](Engines/prompt creator/whimsy.txt:1) | Prompt template focused on whimsical and fantastical content generation |

---

### 🎮 Execution_Systems

Practical execution systems for generating specific game content.

#### 📚 Execution_Systems/adventures

Adventure creation and management systems.

| File | Purpose |
|------|---------|
| [`Execution_Systems/adventures/AI_QuestCreation_v1.txt`](Execution_Systems/adventures/AI_QuestCreation_v1.txt:1) | AI-powered quest creation system |
| [`Execution_Systems/adventures/arcane_library_method.txt`](Execution_Systems/adventures/arcane_library_method.txt:1) | Method for creating adventures based on arcane library themes |
| [`Execution_Systems/adventures/arcane_library_method2.txt`](Execution_Systems/adventures/arcane_library_method2.txt:1) | Alternative version of the arcane library adventure method |
| [`Execution_Systems/adventures/pointyhat travel adventure.txt`](Execution_Systems/adventures/pointyhat travel adventure.txt:1) | Travel-focused adventure generator |
| [`Execution_Systems/adventures/Three-Pass Adventure Creation Method.txt`](Execution_Systems/adventures/Three-Pass Adventure Creation Method.txt:1) | Three-step adventure creation methodology |

#### 🏰 Execution_Systems/Dungeons

Dungeon design and generation tools.

| File | Purpose |
|------|---------|
| [`Execution_Systems/Dungeons/DungeonCreation_PointyHat_v1.txt`](Execution_Systems/Dungeons/DungeonCreation_PointyHat_v1.txt:1) | PointyHat dungeon creation system |
| [`Execution_Systems/Dungeons/DungeonDesign_5Room_Alternate_v1.txt`](Execution_Systems/Dungeons/DungeonDesign_5Room_Alternate_v1.txt:1) | Alternative 5-room dungeon design method |
| [`Execution_Systems/Dungeons/DungeonDesign_5Room_v1.txt`](Execution_Systems/Dungeons/DungeonDesign_5Room_v1.txt:1) | 5-room dungeon design framework |
| [`Execution_Systems/Dungeons/corridor-themes-generator.txt`](Execution_Systems/Dungeons/corridor-themes-generator.txt:1) | Generator for creating themed dungeon corridors |
| [`Execution_Systems/Dungeons/dungeon-concept-brainstormer.txt`](Execution_Systems/Dungeons/dungeon-concept-brainstormer.txt:1) | Brainstorming tool for dungeon concepts and themes |
| [`Execution_Systems/Dungeons/dungeon-features-summarizer.txt`](Execution_Systems/Dungeons/dungeon-features-summarizer.txt:1) | Tool for summarizing and organizing dungeon features |
| [`Execution_Systems/Dungeons/dungeon-key-writer.txt`](Execution_Systems/Dungeons/dungeon-key-writer.txt:1) | System for writing dungeon room keys and descriptions |
| [`Execution_Systems/Dungeons/dungeon-map-creator.txt`](Execution_Systems/Dungeons/dungeon-map-creator.txt:1) | Dungeon map generation system |
| [`Execution_Systems/Dungeons/dungeon-room-designer.txt`](Execution_Systems/Dungeons/dungeon-room-designer.txt:1) | Individual room design generator |
| [`Execution_Systems/Dungeons/jp cooper 10 room dungeon.txt`](Execution_Systems/Dungeons/jp cooper 10 room dungeon.txt:1) | JP Cooper's 10-room dungeon design method |
| [`Execution_Systems/Dungeons/megadungeon-planner.txt`](Execution_Systems/Dungeons/megadungeon-planner.txt:1) | Planning tool for large-scale megadungeons |
| [`Execution_Systems/Dungeons/xandered-dungeon-designer.txt`](Execution_Systems/Dungeons/xandered-dungeon-designer.txt:1) | Xandered's dungeon design methodology |

#### ⚔️ Execution_Systems/Encounters

Encounter and combat design systems.

| File | Purpose |
|------|---------|
| [`Execution_Systems/Encounters/EncounterDesign_Older_v1.txt`](Execution_Systems/Encounters/EncounterDesign_Older_v1.txt:1) | Older version of encounter design system |
| [`Execution_Systems/Encounters/EncounterDesign_v1.txt`](Execution_Systems/Encounters/EncounterDesign_v1.txt:1) | Current encounter design framework |
| [`Execution_Systems/Encounters/EncounterDesign_v1_DEPRECATED.txt`](Execution_Systems/Encounters/EncounterDesign_v1_DEPRECATED.txt:1) | Deprecated version kept for reference |
| [`Execution_Systems/Encounters/Encounter_genric_beta.txt`](Execution_Systems/Encounters/Encounter_genric_beta.txt:1) | Beta version of generic encounter generator |
| [`Execution_Systems/Encounters/RPGAdventure_SceneCrafting_v1.txt`](Execution_Systems/Encounters/RPGAdventure_SceneCrafting_v1.txt:1) | Scene crafting system for RPG adventures |
| [`Execution_Systems/Encounters/combat-encounter-balancer.txt`](Execution_Systems/Encounters/combat-encounter-balancer.txt:1) | Tool for balancing combat encounters |
| [`Execution_Systems/Encounters/combat_encounter - V2.txt`](Execution_Systems/Encounters/combat_encounter - V2.txt:1) | Version 2 of combat encounter generator |
| [`Execution_Systems/Encounters/combat_encounter.txt`](Execution_Systems/Encounters/combat_encounter.txt:1) | Basic combat encounter generator |
| [`Execution_Systems/Encounters/social_event.txt`](Execution_Systems/Encounters/social_event.txt:1) | Social encounter creation system |
| [`Execution_Systems/Encounters/trap_prep.txt`](Execution_Systems/Encounters/trap_prep.txt:1) | Trap preparation and design system |
| [`Execution_Systems/Encounters/urban_crawl.txt`](Execution_Systems/Encounters/urban_crawl.txt:1) | Urban exploration encounter system |

#### 🏛️ Execution_Systems/Factions

Faction creation and management tools.

| File | Purpose |
|------|---------|
| [`Execution_Systems/Factions/faction-conflict-simulator.txt`](Execution_Systems/Factions/faction-conflict-simulator.txt:1) | Simulator for faction conflicts and interactions |
| [`Execution_Systems/Factions/faction_downtime.txt`](Execution_Systems/Factions/faction_downtime.txt:1) | Downtime activities for factions |
| [`Execution_Systems/Factions/factions_creation.txt`](Execution_Systems/Factions/factions_creation.txt:1) | Faction creation generator |

#### 🔓 Execution_Systems/Heists

Heist planning and execution systems.

| File | Purpose |
|------|---------|
| [`Execution_Systems/Heists/heist_prep.txt`](Execution_Systems/Heists/heist_prep.txt:1) | Heist preparation and planning system |
| [`Execution_Systems/Heists/heist_running.txt`](Execution_Systems/Heists/heist_running.txt:1) | Running heists during gameplay |
| [`Execution_Systems/Heists/raid_execution.txt`](Execution_Systems/Heists/raid_execution.txt:1) | Raid execution mechanics |
| [`Execution_Systems/Heists/raid_prep.txt`](Execution_Systems/Heists/raid_prep.txt:1) | Raid preparation system |

#### ⚔️ Execution_Systems/Item

Item and equipment generation tools.

| File | Purpose |
|------|---------|
| [`Execution_Systems/Item/magic weapon basic.txt`](Execution_Systems/Item/magic weapon basic.txt:1) | Basic magic weapon generator |
| [`Execution_Systems/Item/magic_item.txt`](Execution_Systems/Item/magic_item.txt:1) | Magic item creation system |

#### 🗺️ Execution_Systems/Locations

Location and settlement generation systems.

| File | Purpose |
|------|---------|
| [`Execution_Systems/Locations/CreateFantasyCity_v1.txt`](Execution_Systems/Locations/CreateFantasyCity_v1.txt:1) | Fantasy city creation system |
| [`Execution_Systems/Locations/Make a settlement.txt`](Execution_Systems/Locations/Make a settlement.txt:1) | Settlement generator |
| [`Execution_Systems/Locations/Quick_settlement.txt`](Execution_Systems/Locations/Quick_settlement.txt:1) | Quick settlement creation tool |
| [`Execution_Systems/Locations/battlefield_generation.txt`](Execution_Systems/Locations/battlefield_generation.txt:1) | Battlefield and encounter location generator |
| [`Execution_Systems/Locations/city_gazetteer.txt`](Execution_Systems/Locations/city_gazetteer.txt:1) | City gazetteer and description generator |
| [`Execution_Systems/Locations/fantastic_location.txt`](Execution_Systems/Locations/fantastic_location.txt:1) | Fantastic and magical location creator |

#### 🔍 Execution_Systems/Mysteries

Mystery design and investigation systems.

| File | Purpose |
|------|---------|
| [`Execution_Systems/Mysteries/5_node_mystery.txt`](Execution_Systems/Mysteries/5_node_mystery.txt:1) | 5-node mystery structure framework |
| [`Execution_Systems/Mysteries/5x5_mystery_campaign.txt`](Execution_Systems/Mysteries/5x5_mystery_campaign.txt:1) | 5x5 mystery campaign structure |
| [`Execution_Systems/Mysteries/mystery_node.txt`](Execution_Systems/Mysteries/mystery_node.txt:1) | Individual mystery node generator |
| [`Execution_Systems/Mysteries/node_cloud_mystery.txt`](Execution_Systems/Mysteries/node_cloud_mystery.txt:1) | Node cloud mystery structure |
| [`Execution_Systems/Mysteries/non-linear_mystery.txt`](Execution_Systems/Mysteries/non-linear_mystery.txt:1) | Non-linear mystery design system |
| [`Execution_Systems/Mysteries/proactive_mystery_node.txt`](Execution_Systems/Mysteries/proactive_mystery_node.txt:1) | Proactive mystery node creation |
| [`Execution_Systems/Mysteries/revelations_dm_aid.txt`](Execution_Systems/Mysteries/revelations_dm_aid.txt:1) | DM aid for mystery revelations |
| [`Execution_Systems/Mysteries/swap_mystery.txt`](Execution_Systems/Mysteries/swap_mystery.txt:1) | Swap mystery mechanic generator |

#### 👤 Execution_Systems/NPCs

NPC and character generation systems.

| File | Purpose |
|------|---------|
| [`Execution_Systems/NPCs/CreateNPC_Alternate_v1.txt`](Execution_Systems/NPCs/CreateNPC_Alternate_v1.txt:1) | Alternative NPC creation method |
| [`Execution_Systems/NPCs/NPC_Description_Simple_v1.txt`](Execution_Systems/NPCs/NPC_Description_Simple_v1.txt:1) | Simple NPC description generator |
| [`Execution_Systems/NPCs/NPC_Description_v1.txt`](Execution_Systems/NPCs/NPC_Description_v1.txt:1) | Detailed NPC description system |
| [`Execution_Systems/NPCs/QuickNPC_Creation_v1.txt`](Execution_Systems/NPCs/QuickNPC_Creation_v1.txt:1) | Quick NPC creation tool |
| [`Execution_Systems/NPCs/Quick_NPC.txt`](Execution_Systems/NPCs/Quick_NPC.txt:1) | Rapid NPC generator |
| [`Execution_Systems/NPCs/npc_creator_bot.txt`](Execution_Systems/NPCs/npc_creator_bot.txt:1) | Bot-style NPC creator |

#### 📖 Execution_Systems/plot

Plot and narrative structure tools.

| File | Purpose |
|------|---------|
| [`Execution_Systems/plot/SceneDescriptor_v1.txt`](Execution_Systems/plot/SceneDescriptor_v1.txt:1) | Scene description generator |
| [`Execution_Systems/plot/campaign_prep.txt`](Execution_Systems/plot/campaign_prep.txt:1) | Campaign preparation system |
| [`Execution_Systems/plot/crafting scenes.txt`](Execution_Systems/plot/crafting scenes.txt:1) | Scene crafting methodology |
| [`Execution_Systems/plot/create_hook.txt`](Execution_Systems/plot/create_hook.txt:1) | Adventure hook generator |
| [`Execution_Systems/plot/rumors.txt`](Execution_Systems/plot/rumors.txt:1) | Rumor creation system |
| [`Execution_Systems/plot/vivid_description.txt`](Execution_Systems/plot/vivid_description.txt:1) | Vivid description generator |

#### 🧩 Execution_Systems/riddles

Riddle and puzzle creation tools.

| File | Purpose |
|------|---------|
| [`Execution_Systems/riddles/CreateRiddle_v1.txt`](Execution_Systems/riddles/CreateRiddle_v1.txt:1) | Riddle creation system version 1 |
| [`Execution_Systems/riddles/CreateRiddle_v2.txt`](Execution_Systems/riddles/CreateRiddle_v2.txt:1) | Riddle creation system version 2 |
| [`Execution_Systems/riddles/CreateToken_v1.txt`](Execution_Systems/riddles/CreateToken_v1.txt:1) | Token creation system version 1 |
| [`Execution_Systems/riddles/createToken_v2.txt`](Execution_Systems/riddles/createToken_v2.txt:1) | Token creation system version 2 |

#### 🚶 Execution_Systems/Travel

Travel and exploration systems.

| File | Purpose |
|------|---------|
| [`Execution_Systems/Travel/random-encounter-table-generator.txt`](Execution_Systems/Travel/random-encounter-table-generator.txt:1) | Random encounter table generator |
| [`Execution_Systems/Travel/wilderness_travel.txt`](Execution_Systems/Travel/wilderness_travel.txt:1) | Wilderness travel system |
| [`Execution_Systems/Travel/wilderness_travel_long.txt`](Execution_Systems/Travel/wilderness_travel_long.txt:1) | Extended wilderness travel mechanics |

#### 🌾 Execution_Systems/Westmarsh

Westmarsh region-specific content generators.

| File | Purpose |
|------|---------|
| [`Execution_Systems/Westmarsh/Eldwyn_instant_generator.txt`](Execution_Systems/Westmarsh/Eldwyn_instant_generator.txt:1) | Instant generator for Eldwyn content |
| [`Execution_Systems/Westmarsh/Eldwyn_mission_prompt.txt`](Execution_Systems/Westmarsh/Eldwyn_mission_prompt.txt:1) | Eldwyn mission prompt generator |
| [`Execution_Systems/Westmarsh/Eldwyn_pointyhat_travel_adventure.txt`](Execution_Systems/Westmarsh/Eldwyn_pointyhat_travel_adventure.txt:1) | Eldwyn travel adventure generator |
| [`Execution_Systems/Westmarsh/Eldwyn_profil_npc_westmarsh.txt`](Execution_Systems/Westmarsh/Eldwyn_profil_npc_westmarsh.txt:1) | Eldwyn NPC profile generator |
| [`Execution_Systems/Westmarsh/Eldwyn_prompt_mission_fr.txt`](Execution_Systems/Westmarsh/Eldwyn_prompt_mission_fr.txt:1) | French-language Eldwyn mission prompts |
| [`Execution_Systems/Westmarsh/Eldwyn_rail_road_quest_generator.txt`](Execution_Systems/Westmarsh/Eldwyn_rail_road_quest_generator.txt:1) | Railroad quest generator for Eldwyn |
| [`Execution_Systems/Westmarsh/instant generator.txt`](Execution_Systems/Westmarsh/instant generator.txt:1) | General instant generator for Westmarsh |
| [`Execution_Systems/Westmarsh/mission prompt.txt`](Execution_Systems/Westmarsh/mission prompt.txt:1) | Mission prompt generator |
| [`Execution_Systems/Westmarsh/profil_npc_westmarsh.txt`](Execution_Systems/Westmarsh/profil_npc_westmarsh.txt:1) | Westmarsh NPC profile generator |
| [`Execution_Systems/Westmarsh/prompt mission francais.txt`](Execution_Systems/Westmarsh/prompt mission francais.txt:1) | French mission prompt generator |
| [`Execution_Systems/Westmarsh/rail road quest  generator.txt`](Execution_Systems/Westmarsh/rail road quest  generator.txt:1) | Railroad quest generator |

---

### 📤 Output

Generated output templates and export formats.

#### 📄 Output/export

Export templates for various platforms.

| File | Purpose |
|------|---------|
| [`Output/export/Template_ImportFoundry_v1.txt`](Output/export/Template_ImportFoundry_v1.txt:1) | Template for importing into Foundry VTT |
| [`Output/export/html template.html`](Output/export/html template.html:1) | HTML export template |
| [`Output/export/scene_html.txt`](Output/export/scene_html.txt:1) | Scene HTML export format |

#### 🎨 Output/Handouts_Images

Handout and image generation prompts.

| File | Purpose |
|------|---------|
| [`Output/Handouts_Images/artist_styles.txt`](Output/Handouts_Images/artist_styles.txt:1) | Artist style reference for image generation |
| [`Output/Handouts_Images/CreateRiddle_v1.txt`](Output/Handouts_Images/CreateRiddle_v1.txt:1) | Riddle creation for handouts |
| [`Output/Handouts_Images/CreateRiddle_v2.txt`](Output/Handouts_Images/CreateRiddle_v2.txt:1) | Riddle creation version 2 for handouts |
| [`Output/Handouts_Images/CreateToken_v1.txt`](Output/Handouts_Images/CreateToken_v1.txt:1) | Token creation for handouts |
| [`Output/Handouts_Images/createToken_v2.txt`](Output/Handouts_Images/createToken_v2.txt:1) | Token creation version 2 for handouts |
| [`Output/Handouts_Images/image_prompt_sword_and_sorcery.txt`](Output/Handouts_Images/image_prompt_sword_and_sorcery.txt:1) | Sword and sorcery image prompts |
| [`Output/Handouts_Images/text2art.md`](Output/Handouts_Images/text2art.md:1) | Text to art conversion documentation |
| [`Output/Handouts_Images/themed_image_v01.txt`](Output/Handouts_Images/themed_image_v01.txt:1) | Themed image generation prompts |

#### 🎲 Output/homebrew 5e

D&D 5e homebrew content generators.

| File | Purpose |
|------|---------|
| [`Output/homebrew 5e/DraftStatblock_v1.txt`](Output/homebrew 5e/DraftStatblock_v1.txt:1) | Draft statblock generator |
| [`Output/homebrew 5e/StatblockExpended_v1-pc-creature.txt`](Output/homebrew 5e/StatblockExpended_v1-pc-creature.txt:1) | Expanded statblock for PCs and creatures |
| [`Output/homebrew 5e/Statblockexpended_v1.txt`](Output/homebrew 5e/Statblockexpended_v1.txt:1) | Expanded statblock generator |
| [`Output/homebrew 5e/convert to mob.txt`](Output/homebrew 5e/convert to mob.txt:1) | PC to monster conversion tool |
| [`Output/homebrew 5e/statblock july 24 v.2.txt`](Output/homebrew 5e/statblock july 24 v.2.txt:1) | Statblock template version 2 (July 2024) |
| [`Output/homebrew 5e/statblock new.july_24.txt`](Output/homebrew 5e/statblock new.july_24.txt:1) | New statblock template (July 2024) |
| [`Output/homebrew 5e/statblock_oldest.txt`](Output/homebrew 5e/statblock_oldest.txt:1) | Oldest statblock template (legacy) |
| [`Output/homebrew 5e/master prompt.txt`](Output/homebrew 5e/master prompt.txt:1) | Master prompt for homebrew generation |

##### 📚 Output/homebrew 5e/Subclass

Subclass creation templates for various classes.

| File | Purpose |
|------|---------|
| [`Output/homebrew 5e/Subclass/Barbarians/Barbarian_path_balance.txt`](Output/homebrew 5e/Subclass/Barbarians/Barbarian_path_balance.txt:1) | Barbarian path balancing guide |
| [`Output/homebrew 5e/Subclass/Barbarians/Barbarians_path_reference.txt`](Output/homebrew 5e/Subclass/Barbarians/Barbarians_path_reference.txt:1) | Barbarian path reference |
| [`Output/homebrew 5e/Subclass/Barbarians/barbarian_path_template.txt`](Output/homebrew 5e/Subclass/Barbarians/barbarian_path_template.txt:1) | Barbarian path template |
| [`Output/homebrew 5e/Subclass/Bard/bard_base_class.txt`](Output/homebrew 5e/Subclass/Bard/bard_base_class.txt:1) | Bard base class reference |
| [`Output/homebrew 5e/Subclass/Bard/bard_college_balance.txt`](Output/homebrew 5e/Subclass/Bard/bard_college_balance.txt:1) | Bard college balancing guide |
| [`Output/homebrew 5e/Subclass/Bard/bard_subclass_reference.txt`](Output/homebrew 5e/Subclass/Bard/bard_subclass_reference.txt:1) | Bard subclass reference |
| [`Output/homebrew 5e/Subclass/Clerics/Cleric_domains.txt`](Output/homebrew 5e/Subclass/Clerics/Cleric_domains.txt:1) | Cleric domain reference |
| [`Output/homebrew 5e/Subclass/Druid/Druid_circle_balance.txt`](Output/homebrew 5e/Subclass/Druid/Druid_circle_balance.txt:1) | Druid circle balancing guide |
| [`Output/homebrew 5e/Subclass/Druid/Druid_subclass_reference.txt`](Output/homebrew 5e/Subclass/Druid/Druid_subclass_reference.txt:1) | Druid subclass reference |
| [`Output/homebrew 5e/Subclass/Druid/Template_DruidCircle_v1.txt`](Output/homebrew 5e/Subclass/Druid/Template_DruidCircle_v1.txt:1) | Druid circle template |
| [`Output/homebrew 5e/Subclass/Druid/assembled_druid_subclaas_prompt.txt`](Output/homebrew 5e/Subclass/Druid/assembled_druid_subclaas_prompt.txt:1) | Assembled druid subclass prompt |
| [`Output/homebrew 5e/Subclass/Druid/drui_balance.old`](Output/homebrew 5e/Subclass/Druid/drui_balance.old:1) | Old druid balance guide (legacy) |
| [`Output/homebrew 5e/Subclass/Druid/druid_base_class.txt`](Output/homebrew 5e/Subclass/Druid/druid_base_class.txt:1) | Druid base class reference |
| [`Output/homebrew 5e/Subclass/Fighter/fighter_archetype.txt`](Output/homebrew 5e/Subclass/Fighter/fighter_archetype.txt:1) | Fighter archetype template |
| [`Output/homebrew 5e/Subclass/Monks/monk_way.txt`](Output/homebrew 5e/Subclass/Monks/monk_way.txt:1) | Monk way template |
| [`Output/homebrew 5e/Subclass/Paladin/Paladin_oath_balance.txt`](Output/homebrew 5e/Subclass/Paladin/Paladin_oath_balance.txt:1) | Paladin oath balancing guide |
| [`Output/homebrew 5e/Subclass/Paladin/Paladin_oath_template.txt`](Output/homebrew 5e/Subclass/Paladin/Paladin_oath_template.txt:1) | Paladin oath template |
| [`Output/homebrew 5e/Subclass/Paladin/Paladin_subclass_reference.txt`](Output/homebrew 5e/Subclass/Paladin/Paladin_subclass_reference.txt:1) | Paladin subclass reference |
| [`Output/homebrew 5e/Subclass/Rangers/ranger_archetype.txt`](Output/homebrew 5e/Subclass/Rangers/ranger_archetype.txt:1) | Ranger archetype template |
| [`Output/homebrew 5e/Subclass/Rogues/rogue_archetype.txt`](Output/homebrew 5e/Subclass/Rogues/rogue_archetype.txt:1) | Rogue archetype template |
| [`Output/homebrew 5e/Subclass/Sorcerers/sorcerer_origin.txt`](Output/homebrew 5e/Subclass/Sorcerers/sorcerer_origin.txt:1) | Sorcerer origin template |
| [`Output/homebrew 5e/Subclass/Warlocks/warlocks_pact.txt`](Output/homebrew 5e/Subclass/Warlocks/warlocks_pact.txt:1) | Warlock pact template |
| [`Output/homebrew 5e/Subclass/Wizards/wizard_traditon.txt`](Output/homebrew 5e/Subclass/Wizards/wizard_traditon.txt:1) | Wizard tradition template |

##### 📝 Output/homebrew 5e/Subclass/druids

Duplicate druid subclass directory (legacy).

| File | Purpose |
|------|---------|
| [`Output/homebrew 5e/Subclass/druids/Druid_circle_balance.txt`](Output/homebrew 5e/Subclass/druids/Druid_circle_balance.txt:1) | Druid circle balancing guide (duplicate) |
| [`Output/homebrew 5e/Subclass/druids/Druid_subclass_reference.txt`](Output/homebrew 5e/Subclass/druids/Druid_subclass_reference.txt:1) | Druid subclass reference (duplicate) |
| [`Output/homebrew 5e/Subclass/druids/Template_DruidCircle_v1.txt`](Output/homebrew 5e/Subclass/druids/Template_DruidCircle_v1.txt:1) | Druid circle template (duplicate) |
| [`Output/homebrew 5e/Subclass/druids/druid_base_class.txt`](Output/homebrew 5e/Subclass/druids/druid_base_class.txt:1) | Druid base class reference (duplicate) |

##### 📋 Output/homebrew 5e/misc 5e

Miscellaneous 5e homebrew tools.

| File | Purpose |
|------|---------|
| [`Output/homebrew 5e/misc 5e/ConvertPC_to_NPC_v1.txt`](Output/homebrew 5e/misc 5e/ConvertPC_to_NPC_v1.txt:1) | PC to NPC conversion tool |
| [`Output/homebrew 5e/misc 5e/QuickNPC_to_MD_v1.txt`](Output/homebrew 5e/misc 5e/QuickNPC_to_MD_v1.txt:1) | Quick NPC to Markdown converter |
| [`Output/homebrew 5e/misc 5e/Template Stat Block Homebrewery.txt`](Output/homebrew 5e/misc 5e/Template Stat Block Homebrewery.txt:1) | Statblock template for Homebrewery |
| [`Output/homebrew 5e/misc 5e/convert to mob.txt`](Output/homebrew 5e/misc 5e/convert to mob.txt:1) | PC to monster conversion (duplicate) |

---

### ✍️ Prose

Prose writing templates and style guides.

| File | Purpose |
|------|---------|
| [`Prose/bring_ur_outline.md`](Prose/bring_ur_outline.md:1) | Template for bringing outlines to prose |
| [`Prose/character_profile.md`](Prose/character_profile.md:1) | Character profile template |
| [`Prose/simple_style_prompt.md`](Prose/simple_style_prompt.md:1) | Simple style prompt for prose |
| [`Prose/Story_beat_adv.md`](Prose/Story_beat_adv.md:1) | Advanced story beat template |
| [`Prose/story_beat_simple.md`](Prose/story_beat_simple.md:1) | Simple story beat template |
| [`Prose/story_hacker.md`](Prose/story_hacker.md:1) | Story hacking methodology |
| [`Prose/style_prompt_example.md`](Prose/style_prompt_example.md:1) | Style prompt examples |

#### 📚 Prose/Structures

Story structure templates.

| File | Purpose |
|------|---------|
| [`Prose/Structures/HeroJourneyPlot_v1.txt`](Prose/Structures/HeroJourneyPlot_v1.txt:1) | Hero's Journey plot structure |
| [`Prose/Structures/StoryStructure_101_v1.txt`](Prose/Structures/StoryStructure_101_v1.txt:1) | Basic story structure guide |

---

### 📚 Ressources

Reference materials and resources.

| File | Purpose |
|------|---------|
| [`Ressources/big_list_rpg.md`](Ressources/big_list_rpg.md:1) | Comprehensive RPG reference list |
| [`Ressources/Chain-statblock-to-md.txt`](Ressources/Chain-statblock-to-md.txt:1) | Chain statblock to Markdown converter |
| [`Ressources/game master apply template.txt`](Ressources/game master apply template.txt:1) | Game master template application |
| [`Ressources/monster features raw.txt`](Ressources/monster features raw.txt:1) | Raw monster feature data |
| [`Ressources/monster template.txt`](Ressources/monster template.txt:1) | Monster template |
| [`Ressources/monster_features.txt`](Ressources/monster_features.txt:1) | Monster feature list |
| [`Ressources/Reference_CreatureRoles_v1.txt`](Ressources/Reference_CreatureRoles_v1.txt:1) | Creature role reference |
| [`Ressources/Reference_Minigames_v1.txt`](Ressources/Reference_Minigames_v1.txt:1) | Minigame reference |
| [`Ressources/Reference_TerrainFeatures_v1.txt`](Ressources/Reference_TerrainFeatures_v1.txt:1) | Terrain feature reference |

---

### 📋 lump_mapping

Lump mapping configuration.

| File | Purpose |
|------|---------|
| [`lump_mapping/lump_mapping.json`](lump_mapping/lump_mapping.json:1) | JSON configuration for lump mapping |

---

### 🔧 scripts

Utility scripts for automation and processing.

| File | Purpose |
|------|---------|
| [`scripts/generate_manifests.py`](scripts/generate_manifests.py:1) | Python script for generating manifest files |

---

## 📊 Organization Summary

The Narrative Scripts folder is organized into several main categories:

1. **AI Behavior** - Personality profiles and multi-agent architectures
2. **Engines** - Core narrative generation frameworks (Golden Compass, prompt creators)
3. **Execution Systems** - Practical generators for specific game content (adventures, dungeons, NPCs, encounters, etc.)
4. **Output** - Export templates and homebrew content generators
5. **Prose** - Writing templates and style guides
6. **Resources** - Reference materials and templates
7. **Configuration** - Manifests, indexes, and database schemas

## 🎯 Usage

These scripts are designed to be used with AI language models to generate consistent, high-quality RPG content. Each file contains structured prompts that can be fed to an AI to generate specific types of content for tabletop RPG sessions.

## 📝 Notes

- The [`index.md`](index.md:1) file provides a machine-friendly mapping organized into "lumps" for easier processing
- The [`manifest.yaml`](manifest.yaml:1) and [`manifest.json`](manifest.json:1) files provide structured inventories of all scripts
- Homebrew 5e content in [`Output/homebrew 5e/`](Output/homebrew 5e/) is intentionally kept separate and contains 39+ files for D&D 5e-specific content
- Westmarsh content in [`Execution_Systems/Westmarsh/`](Execution_Systems/Westmarsh/) is region-specific and includes both English and French versions
