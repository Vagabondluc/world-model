# Onboarding Step Definitions

This file provides concrete step definitions for all onboarding tracks in Orbis Spec 2.0. Each step maps learning content from `docs/onboard/` to executable UI flows.

## 1) TypeScript Interfaces

```ts
/**
 * Unique identifier for each onboarding track
 */
type OnboardingTrackId =
  | "intro"
  | "foundations"
  | "planetary_physics"
  | "biology"
  | "civilization"
  | "technical"

/**
 * Type of onboarding step - determines UI interaction pattern
 */
type OnboardingStepType =
  | "read"           // User reads documentation content
  | "visualize"      // User views a visualization or diagram
  | "inspect_metric" // User inspects a specific metric in the dashboard
  | "run_scenario"   // User runs a benchmark scenario
  | "answer_check"   // User answers a quiz question
  | "summary"        // Summary checkpoint before moving to next section

/**
 * Gate type - condition that must be met to proceed
 */
type GateKind =
  | "step_completed"
  | "metric_threshold"
  | "event_seen"
  | "benchmark_passed"
  | "quiz_score"

/**
 * Gate definition - a condition that must be satisfied
 */
interface OnboardingGate {
  gateId: string
  kind: GateKind
  payload: Record<string, number | string | boolean>
}

/**
 * Complete onboarding step definition
 */
interface OnboardingStepDef {
  stepId: string                // Unique step identifier
  trackId: OnboardingTrackId    // Which track this step belongs to
  index: number                 // Order within the track
  type: OnboardingStepType      // Type of interaction
  title: string                 // Display title for the step
  sourceDocPath: string         // Path to learning content (docs/onboard/*)
  requiredGates: OnboardingGate[] // Gates that must be passed
  optionalHints: string[]       // Optional hints for users stuck on this step
  unlocksStepIds: string[]      // Steps this step unlocks
  estimatedMinutes: number      // Estimated time to complete
  difficulty: "beginner" | "intermediate" | "advanced"
}

/**
 * Complete onboarding track definition
 */
interface OnboardingTrackDef {
  trackId: OnboardingTrackId
  title: string
  description: string
  steps: OnboardingStepDef[]
  prerequisites: OnboardingTrackId[]
}
```

## 2) Track: Intro

```ts
const introTrack: OnboardingTrackDef = {
  trackId: "intro",
  title: "Introduction to Orbis",
  description: "Learn what Orbis is and who it's for",
  prerequisites: [],
  steps: [
    {
      stepId: "intro_01_welcome",
      trackId: "intro",
      index: 0,
      type: "read",
      title: "Welcome to Orbis",
      sourceDocPath: "docs/onboard/00-introduction.md",
      requiredGates: [],
      optionalHints: [
        "Take your time reading - there's no rush!",
        "If something doesn't make sense, skip ahead and come back later"
      ],
      unlocksStepIds: ["intro_02_what_is_orbis"],
      estimatedMinutes: 5,
      difficulty: "beginner"
    },
    {
      stepId: "intro_02_what_is_orbis",
      trackId: "intro",
      index: 1,
      type: "read",
      title: "What is Orbis?",
      sourceDocPath: "docs/onboard/00-introduction.md",
      requiredGates: [
        { gateId: "intro_01_complete", kind: "step_completed", payload: { stepId: "intro_01_welcome" } }
      ],
      optionalHints: [
        "Think of Orbis as a laboratory for planets",
        "You can experiment without breaking anything real"
      ],
      unlocksStepIds: ["intro_03_who_is_this_for"],
      estimatedMinutes: 5,
      difficulty: "beginner"
    },
    {
      stepId: "intro_03_who_is_this_for",
      trackId: "intro",
      index: 2,
      type: "read",
      title: "Who Is This For?",
      sourceDocPath: "docs/onboard/00-introduction.md",
      requiredGates: [
        { gateId: "intro_02_complete", kind: "step_completed", payload: { stepId: "intro_02_what_is_orbis" } }
      ],
      optionalHints: [
        "Find your age group and focus on that content first",
        "You can always come back to more advanced content later"
      ],
      unlocksStepIds: ["intro_04_learning_path"],
      estimatedMinutes: 3,
      difficulty: "beginner"
    },
    {
      stepId: "intro_04_learning_path",
      trackId: "intro",
      index: 3,
      type: "read",
      title: "Learning Path Overview",
      sourceDocPath: "docs/onboard/00-introduction.md",
      requiredGates: [
        { gateId: "intro_03_complete", kind: "step_completed", payload: { stepId: "intro_03_who_is_this_for" } }
      ],
      optionalHints: [
        "The learning path is designed to build knowledge step by step",
        "Each section prepares you for the next"
      ],
      unlocksStepIds: ["intro_05_time_estimates"],
      estimatedMinutes: 3,
      difficulty: "beginner"
    },
    {
      stepId: "intro_05_time_estimates",
      trackId: "intro",
      index: 4,
      type: "read",
      title: "Time Estimates",
      sourceDocPath: "docs/onboard/00-introduction.md",
      requiredGates: [
        { gateId: "intro_04_complete", kind: "step_completed", payload: { stepId: "intro_04_learning_path" } }
      ],
      optionalHints: [
        "These are estimates - take as long as you need",
        "It's better to understand thoroughly than rush through"
      ],
      unlocksStepIds: ["intro_06_content_levels"],
      estimatedMinutes: 2,
      difficulty: "beginner"
    },
    {
      stepId: "intro_06_content_levels",
      trackId: "intro",
      index: 5,
      type: "read",
      title: "Content Levels",
      sourceDocPath: "docs/onboard/00-introduction.md",
      requiredGates: [
        { gateId: "intro_05_complete", kind: "step_completed", payload: { stepId: "intro_05_time_estimates" } }
      ],
      optionalHints: [
        "Start with beginner content, then explore deeper",
        "Each level builds on the previous one"
      ],
      unlocksStepIds: ["intro_07_diagrams"],
      estimatedMinutes: 3,
      difficulty: "beginner"
    },
    {
      stepId: "intro_07_diagrams",
      trackId: "intro",
      index: 6,
      type: "visualize",
      title: "Visual Learning Resources",
      sourceDocPath: "docs/onboard/00-introduction.md",
      requiredGates: [
        { gateId: "intro_06_complete", kind: "step_completed", payload: { stepId: "intro_06_content_levels" } }
      ],
      optionalHints: [
        "Visual learners will love the diagrams folder",
        "Each diagram has explanations for all age groups"
      ],
      unlocksStepIds: ["intro_08_how_to_use"],
      estimatedMinutes: 3,
      difficulty: "beginner"
    },
    {
      stepId: "intro_08_how_to_use",
      trackId: "intro",
      index: 7,
      type: "read",
      title: "How to Use This Guide",
      sourceDocPath: "docs/onboard/00-introduction.md",
      requiredGates: [
        { gateId: "intro_07_complete", kind: "step_completed", payload: { stepId: "intro_07_diagrams" } }
      ],
      optionalHints: [
        "Follow the numbered guides in order",
        "Use the glossary if you encounter unfamiliar terms"
      ],
      unlocksStepIds: ["intro_09_summary"],
      estimatedMinutes: 3,
      difficulty: "beginner"
    },
    {
      stepId: "intro_09_summary",
      trackId: "intro",
      index: 8,
      type: "summary",
      title: "Introduction Summary",
      sourceDocPath: "docs/onboard/00-introduction.md",
      requiredGates: [
        { gateId: "intro_08_complete", kind: "step_completed", payload: { stepId: "intro_08_how_to_use" } }
      ],
      optionalHints: [
        "You're ready to start learning about planetary simulation!",
        "Next up: Foundations - the building blocks of Orbis"
      ],
      unlocksStepIds: ["foundations_01_time_system"],
      estimatedMinutes: 2,
      difficulty: "beginner"
    }
  ]
}
```

## 3) Track: Foundations

```ts
const foundationsTrack: OnboardingTrackDef = {
  trackId: "foundations",
  title: "Foundations: Time, Data Types, and Magnetosphere",
  description: "Learn the fundamental building blocks of the Orbis simulation system",
  prerequisites: ["intro"],
  steps: [
    {
      stepId: "foundations_01_time_system",
      trackId: "foundations",
      index: 0,
      type: "read",
      title: "The Time System",
      sourceDocPath: "docs/onboard/01-foundations.md",
      requiredGates: [
        { gateId: "intro_complete", kind: "step_completed", payload: { stepId: "intro_09_summary" } }
      ],
      optionalHints: [
        "Understanding time is crucial - everything in Orbis depends on it",
        "The different clocks concept is key to how the simulation works"
      ],
      unlocksStepIds: ["foundations_02_domain_clocks"],
      estimatedMinutes: 15,
      difficulty: "beginner"
    },
    {
      stepId: "foundations_02_domain_clocks",
      trackId: "foundations",
      index: 1,
      type: "read",
      title: "Domain Clocks and Absolute Time",
      sourceDocPath: "docs/onboard/01-foundations.md",
      requiredGates: [
        { gateId: "foundations_01_complete", kind: "step_completed", payload: { stepId: "foundations_01_time_system" } }
      ],
      optionalHints: [
        "AbsTime is the master clock - everything references it",
        "Different domains sample AbsTime at different rates"
      ],
      unlocksStepIds: ["foundations_03_clock_architecture"],
      estimatedMinutes: 15,
      difficulty: "intermediate"
    },
    {
      stepId: "foundations_03_clock_architecture",
      trackId: "foundations",
      index: 2,
      type: "read",
      title: "Clock Architecture Details",
      sourceDocPath: "docs/onboard/01-foundations.md",
      requiredGates: [
        { gateId: "foundations_02_complete", kind: "step_completed", payload: { stepId: "foundations_02_domain_clocks" } }
      ],
      optionalHints: [
        "Domain modes control how each system updates",
        "This is technical content - focus on understanding the concepts"
      ],
      unlocksStepIds: ["foundations_04_data_types"],
      estimatedMinutes: 20,
      difficulty: "advanced"
    },
    {
      stepId: "foundations_04_data_types",
      trackId: "foundations",
      index: 3,
      type: "read",
      title: "Core Data Types",
      sourceDocPath: "docs/onboard/01-foundations.md",
      requiredGates: [
        { gateId: "foundations_03_complete", kind: "step_completed", payload: { stepId: "foundations_03_clock_architecture" } }
      ],
      optionalHints: [
        "Fixed-point math ensures deterministic results",
        "This prevents floating-point errors from accumulating"
      ],
      unlocksStepIds: ["foundations_05_magnetosphere"],
      estimatedMinutes: 15,
      difficulty: "intermediate"
    },
    {
      stepId: "foundations_05_magnetosphere",
      trackId: "foundations",
      index: 4,
      type: "visualize",
      title: "The Magnetosphere",
      sourceDocPath: "docs/onboard/01-foundations.md",
      requiredGates: [
        { gateId: "foundations_04_complete", kind: "step_completed", payload: { stepId: "foundations_04_data_types" } }
      ],
      optionalHints: [
        "The magnetosphere protects the planet from solar radiation",
        "Without it, the atmosphere would be stripped away like Mars"
      ],
      unlocksStepIds: ["foundations_06_magnetosphere_diagram"],
      estimatedMinutes: 10,
      difficulty: "beginner"
    },
    {
      stepId: "foundations_06_magnetosphere_diagram",
      trackId: "foundations",
      index: 5,
      type: "visualize",
      title: "Magnetosphere Diagram",
      sourceDocPath: "docs/onboard/diagrams/02-magnetosphere.md",
      requiredGates: [
        { gateId: "foundations_05_complete", kind: "step_completed", payload: { stepId: "foundations_05_magnetosphere" } }
      ],
      optionalHints: [
        "The diagram shows how the magnetic field deflects solar wind",
        "Van Allen belts trap charged particles"
      ],
      unlocksStepIds: ["foundations_07_summary"],
      estimatedMinutes: 5,
      difficulty: "beginner"
    },
    {
      stepId: "foundations_07_summary",
      trackId: "foundations",
      index: 6,
      type: "summary",
      title: "Foundations Summary",
      sourceDocPath: "docs/onboard/01-foundations.md",
      requiredGates: [
        { gateId: "foundations_06_complete", kind: "step_completed", payload: { stepId: "foundations_06_magnetosphere_diagram" } }
      ],
      optionalHints: [
        "You now understand the time system and magnetosphere",
        "Next up: Planetary Physics - climate, carbon cycle, and geology"
      ],
      unlocksStepIds: ["planetary_physics_01_climate_system"],
      estimatedMinutes: 5,
      difficulty: "beginner"
    }
  ]
}
```

## 4) Track: Planetary Physics

```ts
const planetaryPhysicsTrack: OnboardingTrackDef = {
  trackId: "planetary_physics",
  title: "Planetary Physics: Climate, Carbon Cycle, and Geology",
  description: "Explore how physical systems create conditions for life",
  prerequisites: ["foundations"],
  steps: [
    {
      stepId: "planetary_physics_01_climate_system",
      trackId: "planetary_physics",
      index: 0,
      type: "read",
      title: "The Climate System",
      sourceDocPath: "docs/onboard/02-planetary-physics.md",
      requiredGates: [
        { gateId: "foundations_complete", kind: "step_completed", payload: { stepId: "foundations_07_summary" } }
      ],
      optionalHints: [
        "Climate is long-term weather patterns",
        "Sunlight distribution is the main driver of climate differences"
      ],
      unlocksStepIds: ["planetary_physics_02_climate_bands"],
      estimatedMinutes: 20,
      difficulty: "beginner"
    },
    {
      stepId: "planetary_physics_02_climate_bands",
      trackId: "planetary_physics",
      index: 1,
      type: "read",
      title: "Climate Bands and Energy Balance",
      sourceDocPath: "docs/onboard/02-planetary-physics.md",
      requiredGates: [
        { gateId: "planetary_physics_01_complete", kind: "step_completed", payload: { stepId: "planetary_physics_01_climate_system" } }
      ],
      optionalHints: [
        "Each latitude band must balance energy in and out",
        "Albedo determines how much sunlight is reflected"
      ],
      unlocksStepIds: ["planetary_physics_03_climate_diagram"],
      estimatedMinutes: 20,
      difficulty: "intermediate"
    },
    {
      stepId: "planetary_physics_03_climate_diagram",
      trackId: "planetary_physics",
      index: 2,
      type: "visualize",
      title: "Climate System Diagram",
      sourceDocPath: "docs/onboard/diagrams/03-climate-system.md",
      requiredGates: [
        { gateId: "planetary_physics_02_complete", kind: "step_completed", payload: { stepId: "planetary_physics_02_climate_bands" } }
      ],
      optionalHints: [
        "The diagram shows climate bands from pole to pole",
        "Notice how temperature changes with latitude"
      ],
      unlocksStepIds: ["planetary_physics_04_carbon_cycle"],
      estimatedMinutes: 5,
      difficulty: "beginner"
    },
    {
      stepId: "planetary_physics_04_carbon_cycle",
      trackId: "planetary_physics",
      index: 3,
      type: "read",
      title: "The Carbon Cycle",
      sourceDocPath: "docs/onboard/02-planetary-physics.md",
      requiredGates: [
        { gateId: "planetary_physics_03_complete", kind: "step_completed", payload: { stepId: "planetary_physics_03_climate_diagram" } }
      ],
      optionalHints: [
        "Carbon moves between atmosphere, ocean, land, and life",
        "The carbon cycle regulates Earth's temperature"
      ],
      unlocksStepIds: ["planetary_physics_05_carbon_cycle_diagram"],
      estimatedMinutes: 20,
      difficulty: "beginner"
    },
    {
      stepId: "planetary_physics_05_carbon_cycle_diagram",
      trackId: "planetary_physics",
      index: 4,
      type: "visualize",
      title: "Carbon Cycle Diagram",
      sourceDocPath: "docs/onboard/diagrams/04-carbon-cycle.md",
      requiredGates: [
        { gateId: "planetary_physics_04_complete", kind: "step_completed", payload: { stepId: "planetary_physics_04_carbon_cycle" } }
      ],
      optionalHints: [
        "Follow the arrows to see how carbon moves between reservoirs",
        "Human activities have disrupted this natural cycle"
      ],
      unlocksStepIds: ["planetary_physics_06_geology"],
      estimatedMinutes: 5,
      difficulty: "beginner"
    },
    {
      stepId: "planetary_physics_06_geology",
      trackId: "planetary_physics",
      index: 5,
      type: "read",
      title: "Geology and Tectonics",
      sourceDocPath: "docs/onboard/02-planetary-physics.md",
      requiredGates: [
        { gateId: "planetary_physics_05_complete", kind: "step_completed", payload: { stepId: "planetary_physics_05_carbon_cycle_diagram" } }
      ],
      optionalHints: [
        "Plate tectonics shapes continents over millions of years",
        "Volcanoes and erosion are key geological processes"
      ],
      unlocksStepIds: ["planetary_physics_07_summary"],
      estimatedMinutes: 20,
      difficulty: "intermediate"
    },
    {
      stepId: "planetary_physics_07_summary",
      trackId: "planetary_physics",
      index: 6,
      type: "summary",
      title: "Planetary Physics Summary",
      sourceDocPath: "docs/onboard/02-planetary-physics.md",
      requiredGates: [
        { gateId: "planetary_physics_06_complete", kind: "step_completed", payload: { stepId: "planetary_physics_06_geology" } }
      ],
      optionalHints: [
        "You now understand climate, carbon cycle, and geology",
        "Next up: Biology - species, evolution, and ecosystems"
      ],
      unlocksStepIds: ["biology_01_introduction"],
      estimatedMinutes: 5,
      difficulty: "beginner"
    }
  ]
}
```

## 5) Track: Biology

```ts
const biologyTrack: OnboardingTrackDef = {
  trackId: "biology",
  title: "Biology: Species, Evolution, and Ecosystems",
  description: "Learn how life evolves and interacts on planetary scales",
  prerequisites: ["planetary_physics"],
  steps: [
    {
      stepId: "biology_01_introduction",
      trackId: "biology",
      index: 0,
      type: "read",
      title: "Introduction to Biology in Orbis",
      sourceDocPath: "docs/onboard/03-biology.md",
      requiredGates: [
        { gateId: "planetary_physics_complete", kind: "step_completed", payload: { stepId: "planetary_physics_07_summary" } }
      ],
      optionalHints: [
        "Biology in Orbis models how life evolves over millions of years",
        "We focus on populations and ecosystems, not individual organisms"
      ],
      unlocksStepIds: ["biology_02_trophic_energy"],
      estimatedMinutes: 10,
      difficulty: "beginner"
    },
    {
      stepId: "biology_02_trophic_energy",
      trackId: "biology",
      index: 1,
      type: "read",
      title: "Trophic Energy and Food Chains",
      sourceDocPath: "docs/onboard/03-biology.md",
      requiredGates: [
        { gateId: "biology_01_complete", kind: "step_completed", payload: { stepId: "biology_01_introduction" } }
      ],
      optionalHints: [
        "Energy flows from producers to consumers",
        "Only about 10% of energy transfers between trophic levels"
      ],
      unlocksStepIds: ["biology_03_trophic_diagram"],
      estimatedMinutes: 15,
      difficulty: "beginner"
    },
    {
      stepId: "biology_03_trophic_diagram",
      trackId: "biology",
      index: 2,
      type: "visualize",
      title: "Trophic Energy Diagram",
      sourceDocPath: "docs/onboard/diagrams/05-trophic-energy.md",
      requiredGates: [
        { gateId: "biology_02_complete", kind: "step_completed", payload: { stepId: "biology_02_trophic_energy" } }
      ],
      optionalHints: [
        "The pyramid shows how energy decreases at each level",
        "Top predators are rare because they need so much energy"
      ],
      unlocksStepIds: ["biology_04_evolution"],
      estimatedMinutes: 5,
      difficulty: "beginner"
    },
    {
      stepId: "biology_04_evolution",
      trackId: "biology",
      index: 3,
      type: "read",
      title: "Evolution and Natural Selection",
      sourceDocPath: "docs/onboard/03-biology.md",
      requiredGates: [
        { gateId: "biology_03_complete", kind: "step_completed", payload: { stepId: "biology_03_trophic_diagram" } }
      ],
      optionalHints: [
        "Evolution is change in populations over generations",
        "Natural selection favors traits that improve survival and reproduction"
      ],
      unlocksStepIds: ["biology_05_extinction_cycle"],
      estimatedMinutes: 20,
      difficulty: "intermediate"
    },
    {
      stepId: "biology_05_extinction_cycle",
      trackId: "biology",
      index: 4,
      type: "read",
      title: "Extinction and Adaptive Radiation",
      sourceDocPath: "docs/onboard/03-biology.md",
      requiredGates: [
        { gateId: "biology_04_complete", kind: "step_completed", payload: { stepId: "biology_04_evolution" } }
      ],
      optionalHints: [
        "Extinction opens ecological niches for new species",
        "Adaptive radiation is rapid diversification after extinction"
      ],
      unlocksStepIds: ["biology_06_extinction_diagram"],
      estimatedMinutes: 15,
      difficulty: "intermediate"
    },
    {
      stepId: "biology_06_extinction_diagram",
      trackId: "biology",
      index: 5,
      type: "visualize",
      title: "Extinction Cycle Diagram",
      sourceDocPath: "docs/onboard/diagrams/06-extinction-cycle.md",
      requiredGates: [
        { gateId: "biology_05_complete", kind: "step_completed", payload: { stepId: "biology_05_extinction_cycle" } }
      ],
      optionalHints: [
        "The cycle shows how extinction and radiation alternate",
        "Mass extinctions can trigger adaptive radiation"
      ],
      unlocksStepIds: ["biology_07_summary"],
      estimatedMinutes: 5,
      difficulty: "beginner"
    },
    {
      stepId: "biology_07_summary",
      trackId: "biology",
      index: 6,
      type: "summary",
      title: "Biology Summary",
      sourceDocPath: "docs/onboard/03-biology.md",
      requiredGates: [
        { gateId: "biology_06_complete", kind: "step_completed", payload: { stepId: "biology_06_extinction_diagram" } }
      ],
      optionalHints: [
        "You now understand how life evolves and ecosystems function",
        "Next up: Civilization - settlements, trade, and behavior"
      ],
      unlocksStepIds: ["civilization_01_introduction"],
      estimatedMinutes: 5,
      difficulty: "beginner"
    }
  ]
}
```

## 6) Track: Civilization

```ts
const civilizationTrack: OnboardingTrackDef = {
  trackId: "civilization",
  title: "Civilization: Settlements, Trade, and Behavior",
  description: "Learn how civilizations emerge, grow, and interact",
  prerequisites: ["biology"],
  steps: [
    {
      stepId: "civilization_01_introduction",
      trackId: "civilization",
      index: 0,
      type: "read",
      title: "Introduction to Civilization in Orbis",
      sourceDocPath: "docs/onboard/04-civilization.md",
      requiredGates: [
        { gateId: "biology_complete", kind: "step_completed", payload: { stepId: "biology_07_summary" } }
      ],
      optionalHints: [
        "Civilization emerges when certain biological and environmental conditions are met",
        "We model populations, not individual people"
      ],
      unlocksStepIds: ["civilization_02_settlements"],
      estimatedMinutes: 10,
      difficulty: "beginner"
    },
    {
      stepId: "civilization_02_settlements",
      trackId: "civilization",
      index: 1,
      type: "read",
      title: "Settlements and Population",
      sourceDocPath: "docs/onboard/04-civilization.md",
      requiredGates: [
        { gateId: "civilization_01_complete", kind: "step_completed", payload: { stepId: "civilization_01_introduction" } }
      ],
      optionalHints: [
        "Settlements form where resources are abundant",
        "Population grows when food and shelter are available"
      ],
      unlocksStepIds: ["civilization_03_trade"],
      estimatedMinutes: 15,
      difficulty: "beginner"
    },
    {
      stepId: "civilization_03_trade",
      trackId: "civilization",
      index: 2,
      type: "read",
      title: "Trade and Supply Networks",
      sourceDocPath: "docs/onboard/04-civilization.md",
      requiredGates: [
        { gateId: "civilization_02_complete", kind: "step_completed", payload: { stepId: "civilization_02_settlements" } }
      ],
      optionalHints: [
        "Trade allows settlements to specialize and access resources they don't have",
        "Supply networks connect producers and consumers"
      ],
      unlocksStepIds: ["civilization_04_behavior"],
      estimatedMinutes: 15,
      difficulty: "intermediate"
    },
    {
      stepId: "civilization_04_behavior",
      trackId: "civilization",
      index: 3,
      type: "read",
      title: "Civilization Behavior and Decision Making",
      sourceDocPath: "docs/onboard/04-civilization.md",
      requiredGates: [
        { gateId: "civilization_03_complete", kind: "step_completed", payload: { stepId: "civilization_03_trade" } }
      ],
      optionalHints: [
        "Civilizations make decisions based on needs, beliefs, and circumstances",
        "Behavior emerges from complex interactions of many factors"
      ],
      unlocksStepIds: ["civilization_05_summary"],
      estimatedMinutes: 20,
      difficulty: "intermediate"
    },
    {
      stepId: "civilization_05_summary",
      trackId: "civilization",
      index: 4,
      type: "summary",
      title: "Civilization Summary",
      sourceDocPath: "docs/onboard/04-civilization.md",
      requiredGates: [
        { gateId: "civilization_04_complete", kind: "step_completed", payload: { stepId: "civilization_04_behavior" } }
      ],
      optionalHints: [
        "You now understand how civilizations emerge and interact",
        "Next up: Technical - determinism, RNG, and event ordering"
      ],
      unlocksStepIds: ["technical_01_determinism"],
      estimatedMinutes: 5,
      difficulty: "beginner"
    }
  ]
}
```

## 7) Track: Technical

```ts
const technicalTrack: OnboardingTrackDef = {
  trackId: "technical",
  title: "Technical: Determinism, RNG, and Event Ordering",
  description: "Understand the technical architecture that makes Orbis work",
  prerequisites: ["civilization"],
  steps: [
    {
      stepId: "technical_01_determinism",
      trackId: "technical",
      index: 0,
      type: "read",
      title: "Determinism and Reproducibility",
      sourceDocPath: "docs/onboard/05-technical.md",
      requiredGates: [
        { gateId: "civilization_complete", kind: "step_completed", payload: { stepId: "civilization_05_summary" } }
      ],
      optionalHints: [
        "Determinism means the same inputs always produce the same outputs",
        "This is crucial for scientific simulations and debugging"
      ],
      unlocksStepIds: ["technical_02_rng"],
      estimatedMinutes: 15,
      difficulty: "intermediate"
    },
    {
      stepId: "technical_02_rng",
      trackId: "technical",
      index: 1,
      type: "read",
      title: "Random Number Generation",
      sourceDocPath: "docs/onboard/05-technical.md",
      requiredGates: [
        { gateId: "technical_01_complete", kind: "step_completed", payload: { stepId: "technical_01_determinism" } }
      ],
      optionalHints: [
        "Seeded RNG ensures reproducibility",
        "Each domain has its own RNG stream for independence"
      ],
      unlocksStepIds: ["technical_03_event_ordering"],
      estimatedMinutes: 20,
      difficulty: "advanced"
    },
    {
      stepId: "technical_03_event_ordering",
      trackId: "technical",
      index: 2,
      type: "read",
      title: "Event Ordering and Causality",
      sourceDocPath: "docs/onboard/05-technical.md",
      requiredGates: [
        { gateId: "technical_02_complete", kind: "step_completed", payload: { stepId: "technical_02_rng" } }
      ],
      optionalHints: [
        "Events must be processed in a consistent order",
        "Causality ensures cause precedes effect"
      ],
      unlocksStepIds: ["technical_04_summary"],
      estimatedMinutes: 20,
      difficulty: "advanced"
    },
    {
      stepId: "technical_04_summary",
      trackId: "technical",
      index: 3,
      type: "summary",
      title: "Technical Summary",
      sourceDocPath: "docs/onboard/05-technical.md",
      requiredGates: [
        { gateId: "technical_03_complete", kind: "step_completed", payload: { stepId: "technical_03_event_ordering" } }
      ],
      optionalHints: [
        "You now understand the technical foundations of Orbis",
        "Next up: Dashboard Onboarding - learn to use the simulator interface"
      ],
      unlocksStepIds: ["dashboard_01_intro"],
      estimatedMinutes: 5,
      difficulty: "intermediate"
    }
  ]
}
```

## 8) Track: Dashboard Onboarding

```ts
const dashboardTrack: OnboardingTrackDef = {
  trackId: "dashboard",
  title: "Simulator Dashboard Onboarding",
  description: "Learn to use the interactive dashboard to explore and modify planets",
  prerequisites: ["technical"],
  steps: [
    {
      stepId: "dashboard_01_intro",
      trackId: "dashboard",
      index: 0,
      type: "read",
      title: "Dashboard Introduction",
      sourceDocPath: "docs/onboard/06-dashboard-intro.md",
      requiredGates: [
        { gateId: "technical_complete", kind: "step_completed", payload: { stepId: "technical_04_summary" } }
      ],
      optionalHints: [
        "The dashboard is your control center for planetary simulation",
        "It uses a three-panel layout for maximum efficiency"
      ],
      unlocksStepIds: ["dashboard_02_layout"],
      estimatedMinutes: 10,
      difficulty: "beginner"
    },
    {
      stepId: "dashboard_02_layout",
      trackId: "dashboard",
      index: 1,
      type: "read",
      title: "Dashboard Layout",
      sourceDocPath: "docs/onboard/06-dashboard-intro.md",
      requiredGates: [
        { gateId: "dashboard_01_complete", kind: "step_completed", payload: { stepId: "dashboard_01_intro" } }
      ],
      optionalHints: [
        "Left: Time Control | Center: Planet View | Right: Inspector & Tools",
        "Each panel serves a specific purpose"
      ],
      unlocksStepIds: ["dashboard_03_time_controls"],
      estimatedMinutes: 5,
      difficulty: "beginner"
    },
    {
      stepId: "dashboard_03_time_controls",
      trackId: "dashboard",
      index: 2,
      type: "read",
      title: "Time Controls",
      sourceDocPath: "docs/onboard/07-time-controls.md",
      requiredGates: [
        { gateId: "dashboard_02_complete", kind: "step_completed", payload: { stepId: "dashboard_02_layout" } }
      ],
      optionalHints: [
        "You can play, pause, and speed up time",
        "Different temporal regimes let you see different time scales"
      ],
      unlocksStepIds: ["dashboard_04_view_modes"],
      estimatedMinutes: 15,
      difficulty: "beginner"
    },
    {
      stepId: "dashboard_04_view_modes",
      trackId: "dashboard",
      index: 3,
      type: "read",
      title: "View Modes",
      sourceDocPath: "docs/onboard/08-view-modes.md",
      requiredGates: [
        { gateId: "dashboard_03_complete", kind: "step_completed", payload: { stepId: "dashboard_03_time_controls" } }
      ],
      optionalHints: [
        "View modes let you see different data layers",
        "Each mode highlights different aspects of the planet"
      ],
      unlocksStepIds: ["dashboard_05_terraform_tools"],
      estimatedMinutes: 15,
      difficulty: "beginner"
    },
    {
      stepId: "dashboard_05_terraform_tools",
      trackId: "dashboard",
      index: 4,
      type: "read",
      title: "Terraform Tools",
      sourceDocPath: "docs/onboard/09-terraform-tools.md",
      requiredGates: [
        { gateId: "dashboard_04_complete", kind: "step_completed", payload: { stepId: "dashboard_04_view_modes" } }
      ],
      optionalHints: [
        "Terraform tools let you modify the planet",
        "Use brushes to raise mountains, add oceans, or change climate"
      ],
      unlocksStepIds: ["dashboard_06_cosmic_panel"],
      estimatedMinutes: 20,
      difficulty: "intermediate"
    },
    {
      stepId: "dashboard_06_cosmic_panel",
      trackId: "dashboard",
      index: 5,
      type: "read",
      title: "Cosmic Panel",
      sourceDocPath: "docs/onboard/10-cosmic-panel.md",
      requiredGates: [
        { gateId: "dashboard_05_complete", kind: "step_completed", payload: { stepId: "dashboard_05_terraform_tools" } }
      ],
      optionalHints: [
        "The cosmic panel controls planetary physics",
        "Adjust orbital parameters, solar output, and more"
      ],
      unlocksStepIds: ["dashboard_07_inspector_panel"],
      estimatedMinutes: 15,
      difficulty: "intermediate"
    },
    {
      stepId: "dashboard_07_inspector_panel",
      trackId: "dashboard",
      index: 6,
      type: "read",
      title: "Inspector Panel",
      sourceDocPath: "docs/onboard/11-inspector-panel.md",
      requiredGates: [
        { gateId: "dashboard_06_complete", kind: "step_completed", payload: { stepId: "dashboard_06_cosmic_panel" } }
      ],
      optionalHints: [
        "Click any hex to see detailed information",
        "The inspector shows state, history, and metrics"
      ],
      unlocksStepIds: ["dashboard_08_advanced_features"],
      estimatedMinutes: 15,
      difficulty: "intermediate"
    },
    {
      stepId: "dashboard_08_advanced_features",
      trackId: "dashboard",
      index: 7,
      type: "read",
      title: "Advanced Features",
      sourceDocPath: "docs/onboard/12-advanced-features.md",
      requiredGates: [
        { gateId: "dashboard_07_complete", kind: "step_completed", payload: { stepId: "dashboard_07_inspector_panel" } }
      ],
      optionalHints: [
        "Advanced features include scenarios, comparisons, and more",
        "These tools are for power users and researchers"
      ],
      unlocksStepIds: ["dashboard_09_summary"],
      estimatedMinutes: 20,
      difficulty: "advanced"
    },
    {
      stepId: "dashboard_09_summary",
      trackId: "dashboard",
      index: 8,
      type: "summary",
      title: "Dashboard Onboarding Complete",
      sourceDocPath: "docs/onboard/06-dashboard-intro.md",
      requiredGates: [
        { gateId: "dashboard_08_complete", kind: "step_completed", payload: { stepId: "dashboard_08_advanced_features" } }
      ],
      optionalHints: [
        "Congratulations! You've completed the full onboarding",
        "You're ready to explore planets over deep time!"
      ],
      unlocksStepIds: [],
      estimatedMinutes: 5,
      difficulty: "beginner"
    }
  ]
}
```

## 9) Complete Step Registry

```ts
/**
 * Complete registry of all onboarding steps
 */
export const ONBOARDING_STEPS: OnboardingStepDef[] = [
  // Intro Track
  ...introTrack.steps,
  // Foundations Track
  ...foundationsTrack.steps,
  // Planetary Physics Track
  ...planetaryPhysicsTrack.steps,
  // Biology Track
  ...biologyTrack.steps,
  // Civilization Track
  ...civilizationTrack.steps,
  // Technical Track
  ...technicalTrack.steps,
  // Dashboard Track
  ...dashboardTrack.steps
]

/**
 * Complete registry of all onboarding tracks
 */
export const ONBOARDING_TRACKS: OnboardingTrackDef[] = [
  introTrack,
  foundationsTrack,
  planetaryPhysicsTrack,
  biologyTrack,
  civilizationTrack,
  technicalTrack,
  dashboardTrack
]

/**
 * Helper function to get step by ID
 */
export function getStepById(stepId: string): OnboardingStepDef | undefined {
  return ONBOARDING_STEPS.find(step => step.stepId === stepId)
}

/**
 * Helper function to get track by ID
 */
export function getTrackById(trackId: OnboardingTrackId): OnboardingTrackDef | undefined {
  return ONBOARDING_TRACKS.find(track => track.trackId === trackId)
}

/**
 * Helper function to get steps for a track
 */
export function getStepsForTrack(trackId: OnboardingTrackId): OnboardingStepDef[] {
  return ONBOARDING_STEPS.filter(step => step.trackId === trackId)
}

/**
 * Helper function to get next step in a track
 */
export function getNextStep(currentStepId: string): OnboardingStepDef | undefined {
  const currentStep = getStepById(currentStepId)
  if (!currentStep) return undefined
  
  const trackSteps = getStepsForTrack(currentStep.trackId)
  const currentIndex = trackSteps.findIndex(s => s.stepId === currentStepId)
  
  if (currentIndex === -1 || currentIndex === trackSteps.length - 1) {
    return undefined
  }
  
  return trackSteps[currentIndex + 1]
}

/**
 * Helper function to get unlocked steps for a given step
 */
export function getUnlockedSteps(stepId: string): OnboardingStepDef[] {
  const step = getStepById(stepId)
  if (!step) return []
  
  return step.unlocksStepIds
    .map(unlockedId => getStepById(unlockedId))
    .filter((s): s is OnboardingStepDef => s !== undefined)
}
```

## 10) Usage Example

```ts
// Example: Starting the intro track
const introSteps = getStepsForTrack("intro")
const firstStep = introSteps[0]

console.log(`Starting: ${firstStep.title}`)
console.log(`Source: ${firstStep.sourceDocPath}`)
console.log(`Estimated time: ${firstStep.estimatedMinutes} minutes`)

// Example: Checking if a step can be started
function canStartStep(step: OnboardingStepDef, completedSteps: Set<string>): boolean {
  return step.requiredGates.every(gate => {
    if (gate.kind === "step_completed") {
      return completedSteps.has(gate.payload.stepId as string)
    }
    // Handle other gate types as needed
    return false
  })
}

// Example: Getting the next step after completion
const nextStep = getNextStep("intro_01_welcome")
if (nextStep) {
  console.log(`Next step: ${nextStep.title}`)
}
```

## 11) Related Documentation

- [`00-onboarding-experience-map.md`](./00-onboarding-experience-map.md) - High-level onboarding flow
- [`01-onboarding-engine-interface-contract.md`](./01-onboarding-engine-interface-contract.md) - Engine adapter API
- [`02-onboarding-progress-persistence-contract.md`](./02-onboarding-progress-persistence-contract.md) - Progress storage
- [`03-onboarding-telemetry-contract.md`](./03-onboarding-telemetry-contract.md) - Telemetry events
- [`../onboard/`](../onboard/) - Learning content for each step
