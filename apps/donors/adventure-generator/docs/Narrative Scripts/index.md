---
title: "Narrative Scripts — Lump Index"
version: "1.0"
generated_by: "GitHub Copilot"
date: "2025-12-21"
format: "machine-friendly"
lumps_count: 18
homebrew_excluded: true
homebrew_path: "Output/homebrew 5e/"
---

# Lump Summary (overview)

| Lump | Short title | File count |
|---|---|---:|
| 00 | 00_meta_and_tooling.md | 9 |
| 01 | 01_ai_behavior_and_style.txt | 4 |
| 02 | 02_agent_architecture.txt | 3 |
| 03 | 03_prose_templates_and_text_formats.txt | 8 |
| 04 | 04_npc_and_character_systems.txt | 8 |
| 05 | 05_locations_and_settlements.txt | 6 |
| 06 | 06_travel_and_exploration.txt | 3 |
| 07 | 07_adventure_and_plot_frameworks.txt | 16 |
| 08 | 08_mysteries_and_riddles.txt | 12 |
| 09 | 09_dungeon_design_and_generation.txt | 13 |
| 10 | 10_encounters_combat_and_traps.txt | 10 |
| 11 | 11_heists.txt | 4 |
| 12 | 12_factions_and_downtime.txt | 3 |
| 13 | 13_items_and_loot.txt | 2 |
| 14 | 14_westmarsh_eldwyn_pack.txt | 10 |
| 15 | 15_reference_resources.txt | 9 |
| 16 | 16_handouts_images_and_prompts.txt | 8 |
| 17 | 17_misc_legacy_experimental.txt | 1 |

---

# Full machine mapping (YAML, one mapping per lump)

```yaml
lumps:
  "00":
    title: "00_meta_and_tooling.md"
    rule: "meta, tooling, manifests, scripts, exports"
    count: 9
    files:
      - "database_schema.md"
      - "folded.ps1"
      - "index.json"
      - "manifest.json"
      - "manifest.yaml"
      - "Output/export/html template.html"
      - "Output/export/scene_html.txt"
      - "Output/export/Template_ImportFoundry_v1.txt"
      - "scripts/generate_manifests.py"

  "01":
    title: "01_ai_behavior_and_style.txt"
    rule: "AI behavior personalities & style entries"
    count: 4
    files:
      - "AI_Behavior/dont_talk_but_do.txt"
      - "AI_Behavior/ed_greenwood.txt"
      - "AI_Behavior/encyclopedic_TextEntry_v1.txt"
      - "AI_Behavior/new_behavior.txt"

  "02":
    title: "02_agent_architecture.txt"
    rule: "hivemind / agent architecture core artifacts"
    count: 3
    files:
      - "AI_Behavior/hivemind/Hivemind companion.txt"
      - "AI_Behavior/hivemind/HiveMindConcept_v1.txt"
      - "AI_Behavior/hivemind/NarrativeMasterAI_v1.txt"

  "03":
    title: "03_prose_templates_and_text_formats.txt"
    rule: "reusable prose templates, style notes, riddle research"
    count: 8
    files:
      - "Prose/Artifact_DeltaGreen_UnnaturalStudy.html"
      - "Prose/Character_drama_template.txt"
      - "Prose/DeltaGreen_family_interlude_hooks.txt"
      - "Prose/Eerie_description_generator.txt"
      - "Prose/FrenchCanadian_portrait_notes.txt"
      - "Prose/Riddle_prompt_research.txt"
      - "Prose/SupportGroup_Loudermilk_style.txt"
      - "Prose/ZenBuddhism_ludic_notes.txt"

  "04":
    title: "04_npc_and_character_systems.txt"
    rule: "NPC generators, lifepaths, relationships, hivemind forms"
    count: 8
    files:
      - "AI_Behavior/hivemind/personality_questionnaire.txt"
      - "AI_Behavior/hivemind/roles.json"
      - "Execution_Systems/NPCs/npc_generator.txt"
      - "Execution_Systems/NPCs/npc_lifepath_ocean_tags.txt"
      - "Execution_Systems/NPCs/npc_incongruous_details.txt"
      - "Execution_Systems/NPCs/npc_dialogue_hooks.txt"
      - "Execution_Systems/NPCs/npc_relationship_webs.txt"
      - "Execution_Systems/NPCs/npc_quirks_tables.txt"

  "05":
    title: "05_locations_and_settlements.txt"
    rule: "location generators, settlements, gazetteers"
    count: 6
    files:
      - "Execution_Systems/Locations/battlefield_generation.txt"
      - "Execution_Systems/Locations/city_gazetteer.txt"
      - "Execution_Systems/Locations/CreateFantasyCity_v1.txt"
      - "Execution_Systems/Locations/fantastic_location.txt"
      - "Execution_Systems/Locations/Make a settlement.txt"
      - "Execution_Systems/Locations/Quick_settlement.txt"

  "06":
    title: "06_travel_and_exploration.txt"
    rule: "travel encounters, wilderness procedures"
    count: 3
    files:
      - "Execution_Systems/Travel/pointyhat_travel_adventure.txt"
      - "Execution_Systems/Travel/urban_crawl.txt"
      - "Execution_Systems/Travel/wilderness_procedures.txt"

  "07":
    title: "07_adventure_and_plot_frameworks.txt"
    rule: "adventure engines, Golden Compass materials, plot recipes"
    count: 16
    files:
      - "Engines/Golden_Compass/Golden Compass Adventure Template.txt"
      - "Engines/Golden_Compass/Golden Compass Challenge Framework.txt"
      - "Engines/Golden_Compass/Golden Compass Danger and Combat Framework.txt"
      - "Engines/Golden_Compass/Golden Compass Wealth and Vehicle System.txt"
      - "Engines/Golden_Compass/GoldenCompass 1.0.html"
      - "Engines/Golden_Compass/GoldenCompass summary.txt"
      - "Engines/Golden_Compass/GoldenCompass usage.txt"
      - "Execution_Systems/adventures/Three-Pass Adventure Creation Method.txt"
      - "Execution_Systems/adventures/Quest_creation.txt"
      - "Execution_Systems/adventures/Adventure_template.txt"
      - "Execution_Systems/adventures/Adventure_hooks.txt"
      - "Execution_Systems/plot/Hook_vs_Meat.txt"
      - "Execution_Systems/plot/Double-Up.txt"
      - "Execution_Systems/plot/Reversal.txt"
      - "Execution_Systems/plot/Scale_Shift.txt"
      - "Execution_Systems/plot/Metaphor_Mapping.txt"
      - "Execution_Systems/plot/Constraint_Play.txt"

  "08":
    title: "08_mysteries_and_riddles.txt"
    rule: "mystery node rules, validation, riddle UI and rules"
    count: 12
    files:
      - "Execution_Systems/Mysteries/non-linear_mystery.txt"
      - "Execution_Systems/Mysteries/proactive_mystery_node.txt"
      - "Execution_Systems/Mysteries/mystery_node_cloud.txt"
      - "Execution_Systems/Mysteries/mystery_validation_rules.txt"
      - "Execution_Systems/Mysteries/clue_redundancy_guidelines.txt"
      - "Execution_Systems/Mysteries/alexandrian_alternate_backbone_notes.txt"
      - "Execution_Systems/Mysteries/barons_study_scene.txt"
      - "Execution_Systems/Mysteries/mystery_scene_editor_contract.txt"
      - "Execution_Systems/riddles/CreateRiddle_v1.txt"
      - "Execution_Systems/riddles/CreateRiddle_v2.txt"
      - "Execution_Systems/riddles/Riddle_UI_Wireframe.txt"
      - "Execution_Systems/riddles/Riddle_quality_rules.txt"

  "09":
    title: "09_dungeon_design_and_generation.txt"
    rule: "dungeon-design engines, planners, room designers"
    count: 13
    files:
      - "dungeon-master-guide.txt"
      - "dungeon-master-toolkit.txt"
      - "Execution_Systems/Dungeons/DungeonCreation_PointyHat_v1.txt"
      - "Execution_Systems/Dungeons/DungeonDesign_5Room_Alternate_v1.txt"
      - "Execution_Systems/Dungeons/DungeonDesign_5Room_v1.txt"
      - "Execution_Systems/Dungeons/dungeon-concept-brainstormer.txt"
      - "Execution_Systems/Dungeons/dungeon-features-summarizer.txt"
      - "Execution_Systems/Dungeons/dungeon-key-writer.txt"
      - "Execution_Systems/Dungeons/dungeon-map-creator.txt"
      - "Execution_Systems/Dungeons/dungeon-room-designer.txt"
      - "Execution_Systems/Dungeons/jp_cooper_10_room_dungeon.txt"
      - "Execution_Systems/Dungeons/megadungeon-planner.txt"
      - "Execution_Systems/Dungeons/xandered-dungeon-designer.txt"

  "10":
    title: "10_encounters_combat_and_traps.txt"
    rule: "combat encounter designs, balancing and social encounters"
    count: 10
    files:
      - "Execution_Systems/Encounters/combat encounter - v2.txt"
      - "Execution_Systems/Encounters/combat-encounter.txt"
      - "Execution_Systems/Encounters/combat-encounter-balancer.txt"
      - "Execution_Systems/Encounters/Encounter_genric_beta.txt"
      - "Execution_Systems/Encounters/EncounterDesign_Older_v1.txt"
      - "Execution_Systems/Encounters/EncounterDesign_v1_DEPRECATED.txt"
      - "Execution_Systems/Encounters/EncounterDesign_v1.txt"
      - "Execution_Systems/Encounters/RPGAdventure_SceneCrafting_v1.txt"
      - "Execution_Systems/Encounters/social_event.txt"
      - "Execution_Systems/Encounters/trap_prep.txt"

  "11":
    title: "11_heists.txt"
    rule: "heist prep, running, tools and variants"
    count: 4
    files:
      - "Execution_Systems/Heists/heist_prep.txt"
      - "Execution_Systems/Heists/heist_running.txt"
      - "Execution_Systems/Heists/heist_tools.txt"
      - "Execution_Systems/Heists/heist_variants.txt"

  "12":
    title: "12_factions_and_downtime.txt"
    rule: "faction conflict, downtime"
    count: 3
    files:
      - "Execution_Systems/Factions/faction_downtime.txt"
      - "Execution_Systems/Factions/faction-conflict-simulator.txt"
      - "Execution_Systems/Factions/factions_creation.txt"

  "13":
    title: "13_items_and_loot.txt"
    rule: "item generation and loot tables"
    count: 2
    files:
      - "Execution_Systems/Item/item_generator.txt"
      - "Execution_Systems/Item/loot_tables.txt"

  "14":
    title: "14_westmarsh_eldwyn_pack.txt"
    rule: "Westmarsh / Eldwyn localized content (region pack)"
    count: 10
    files:
      - "Execution_Systems/Westmarsh/Eldwyn_instant_generator.txt"
      - "Execution_Systems/Westmarsh/Eldwyn_mission_prompt.txt"
      - "Execution_Systems/Westmarsh/Eldwyn_pointyhat_travel_adventure.txt"
      - "Execution_Systems/Westmarsh/Eldwyn_profil_npc_westmarsh.txt"
      - "Execution_Systems/Westmarsh/Eldwyn_prompt_mission_fr.txt"
      - "Execution_Systems/Westmarsh/Eldwyn_prompt_mission_en.txt"
      - "Execution_Systems/Westmarsh/Eldwyn_settlements.txt"
      - "Execution_Systems/Westmarsh/Eldwyn_encounters.txt"
      - "Execution_Systems/Westmarsh/Eldwyn_factions.txt"
      - "Execution_Systems/Westmarsh/Eldwyn_hooks.txt"

  "15":
    title: "15_reference_resources.txt"
    rule: "reference lists, monsters, events, tone, twists"
    count: 9
    files:
      - "Ressources/monster_features.txt"
      - "Ressources/Reference_CreatureRoles_v1.txt"
      - "Ressources/Reference_Minigames_v1.txt"
      - "Ressources/Reference_TerrainFeatures_v1.txt"
      - "Ressources/Reference_ToneMood_v1.txt"
      - "Ressources/Reference_TravelEvents_v1.txt"
      - "Ressources/Reference_Twists_v1.txt"
      - "Ressources/Reference_UrbanEvents_v1.txt"
      - "Ressources/Reference_WildernessEvents_v1.txt"

  "16":
    title: "16_handouts_images_and_prompts.txt"
    rule: "handout text and image prompt templates"
    count: 8
    files:
      - "Output/Handouts_Images/artist_styles.txt"
      - "Output/Handouts_Images/CreateRiddle_v1.txt"
      - "Output/Handouts_Images/CreateRiddle_v2.txt"
      - "Output/Handouts_Images/CreateToken_v1.txt"
      - "Output/Handouts_Images/createToken_v2.txt"
      - "Output/Handouts_Images/image_prompt_sword_and_sorcery.txt"
      - "Output/Handouts_Images/text2art.md"
      - "Output/Handouts_Images/themed_image_v01.txt"

  "17":
    title: "17_misc_legacy_experimental.txt"
    rule: "misc legacy or experiment notes"
    count: 1
    files:
      - "scripts/README_scripts_notes.txt"

homebrew_excluded:
  path: "Output/homebrew 5e/"
  reason: "Contains 39 files; intentionally kept 'untouched' per constraints"
  count: 39
  files:
    - "Output/homebrew 5e/convert to mob.txt"
    - "Output/homebrew 5e/DraftStatblock_v1.txt"
    - "Output/homebrew 5e/statblock july 24 v.2.txt"
    - "Output/homebrew 5e/statblock new.july_24.txt"
    - "Output/homebrew 5e/statblock_oldest.txt"
    - "Output/homebrew 5e/Subclass/Bard/bard base class.txt"
    - "Output/homebrew 5e/Subclass/Bard/bard_scout_final.txt"
    - "Output/homebrew 5e/Subclass/Bard/bard_scout_old.txt"
    - "Output/homebrew 5e/Subclass/Bard/bard_scout_notes.txt"
    - "Output/homebrew 5e/Subclass/Druid/druid base class.txt"
    - "Output/homebrew 5e/Subclass/Druid/druid_grove_final.txt"
    - "Output/homebrew 5e/Subclass/Druid/druid_grove_old.txt"
    - "Output/homebrew 5e/Subclass/Druid/druid_grove_notes.txt"
    - "Output/homebrew 5e/Subclass/Fighter/fighter base class.txt"
    - "Output/homebrew 5e/Subclass/Fighter/fighter_captain_final.txt"
    - "Output/homebrew 5e/Subclass/Fighter/fighter_captain_old.txt"
    - "Output/homebrew 5e/Subclass/Fighter/fighter_captain_notes.txt"
    - "Output/homebrew 5e/Subclass/Fighter/fighter_warlord_final.txt"
    - "Output/homebrew 5e/Subclass/Fighter/fighter_warlord_old.txt"
    - "Output/homebrew 5e/Subclass/Fighter/fighter_warlord_notes.txt"
    - "Output/homebrew 5e/Subclass/Rogue/rogue base class.txt"
    - "Output/homebrew 5e/Subclass/Rogue/rogue_saboteur_final.txt"
    - "Output/homebrew 5e/Subclass/Rogue/rogue_saboteur_old.txt"
    - "Output/homebrew 5e/Subclass/Rogue/rogue_saboteur_notes.txt"
    - "Output/homebrew 5e/Subclass/Wizard/wizard base class.txt"
    - "Output/homebrew 5e/Subclass/Wizard/wizard_sigil_final.txt"
    - "Output/homebrew 5e/Subclass/Wizard/wizard_sigil_old.txt"
    - "Output/homebrew 5e/Subclass/Wizard/wizard_sigil_notes.txt"
    - "Output/homebrew 5e/homebrew_index.txt"
    - "Output/homebrew 5e/monsters/chimera.txt"
    - "Output/homebrew 5e/monsters/goblin_variants.txt"
    - "Output/homebrew 5e/monsters/underdark_creatures.txt"
    - "Output/homebrew 5e/monsters/vaasa_thar_beasts.txt"
    - "Output/homebrew 5e/spells/spell_list.txt"
    - "Output/homebrew 5e/spells/spell_notes.txt"
    - "Output/homebrew 5e/items/magic_items.txt"
    - "Output/homebrew 5e/items/item_notes.txt"
    - "Output/homebrew 5e/formatting_rules.txt"
    - "Output/homebrew 5e/credits.txt"
    - "Output/homebrew 5e/readme.txt"
    - "Output/homebrew 5e/workbench_notes.txt"
    - "Output/homebrew 5e/unused_drafts.txt"
```
