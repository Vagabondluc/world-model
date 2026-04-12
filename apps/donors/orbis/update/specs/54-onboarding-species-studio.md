# Species & Race Studio Onboarding Guide

## Overview

The Species & Race Studio allows you to design and create new species for your world, with comprehensive trait systems, viability checks, and population projections. It ensures your creations are biologically plausible and can survive in the environments you place them in.

## Learning Objectives

### 🟢 Beginner (Ages 12-15)
- Understand what Species & Race Studio does
- Learn to create basic species with simple traits
- Use viability checks to see if species can survive
- Place new species in the world

### 🟡 Intermediate (Ages 16-18)
- Understand the five trait categories (physiology, cognition, social, habitat, culture)
- Use parameter overrides for fine-tuning
- Interpret survivability scores and population projections
- Manage species compatibility with existing ecosystems

### 🔴 Advanced (Ages 19-99)
- Master the trait pack system for complex species design
- Understand the underlying biological constraints
- Create species with specific ecological niches
- Use species design for narrative purposes

---

## Step-by-Step Walkthrough

### Step 1: Opening Species & Race Studio

1. From the Narrative Dashboard, click on **Species & Race Studio** in the navigation menu
2. The studio will load with the species creation interface
3. You'll see three main sections:
   - **Trait Editor** (left): Configure species characteristics
   - **Viability Analysis** (center): Survival and population projections
   - **Publishing Options** (right): Sandbox and canon controls

### Step 2: Understanding Trait Categories

**🟢 Beginner:**

Species have five trait categories:

| Category | What it Controls | Example Traits |
|-----------|------------------|----------------|
| Physiology | Physical body characteristics | Size, metabolism, senses |
| Cognition | Mental abilities | Intelligence, memory, learning |
| Social | Group behavior | Hierarchy, cooperation, communication |
| Habitat | Environmental needs | Temperature, humidity, terrain |
| Culture | Beliefs and customs | Art, religion, traditions |

**🟡 Intermediate:**

Each category affects species differently:
- **Physiology**: Determines resource needs and physical capabilities
- **Cognition**: Affects technology use and problem-solving
- **Social**: Influences settlement patterns and government
- **Habitat**: Controls where species can live and thrive
- **Culture**: Shapes art, religion, and social structures

**🔴 Advanced:**

Trait system uses:
```ts
interface SpeciesStudioTraitPack {
  physiologyTags: string[]
  cognitionTags: string[]
  socialTags: string[]
  habitatTags: string[]
  cultureTags: string[]
}
```

### Step 3: Creating a Basic Species

**🟢 Beginner:**

Create your first species:
1. Enter a display name (e.g., "Sky People")
2. Choose basic physiology traits (size, diet, etc.)
3. Select cognition traits (intelligence level)
4. Pick social traits (how they group together)
5. Define habitat needs (where they live)
6. Add cultural traits (beliefs and customs)

**🟡 Intermediate:**

Advanced creation options:
- **Lineage hints**: Suggest evolutionary relationships
- **Trait synergies**: How traits enhance each other
- **Trade-offs**: Balancing advantages and disadvantages
- **Niche specialization**: Adapting to specific environments
- **Evolutionary pressure**: How environment shapes traits

**🔴 Advanced:**

Creation mechanics use:
```ts
interface SpeciesStudioRaceDraft {
  draftId: string
  displayName: string
  lineageHint?: string
  traits: SpeciesStudioTraitPack
  parameterOverridesPPM: Record<string, number>
  startRegions: string[]
}
```

### Step 4: Using Viability Checks

**🟢 Beginner:**

Check if your species can survive:
1. Click **"Run Viability Check"**
2. Look for green checkmarks (good) or red warnings (problems)
3. Read the suggestions for fixing issues
4. Adjust traits based on feedback

**🟡 Intermediate:**

Viability analysis includes:
- **Survivability Score**: Overall chance of survival (0-1,000,000 PPM)
- **Population Projection**: Estimated population range (min-max PPM)
- **Constraint Issues**: Specific problems that need fixing
- **Environmental Compatibility**: Match with chosen habitats

**🔴 Advanced:**

Viability system uses:
```ts
interface SpeciesStudioValidationReport {
  valid: boolean
  survivabilityScorePPM: number
  projectedPopulationBandPPM: [number, number]
  issues: SpeciesStudioConstraintIssue[]
}
```

### Step 5: Understanding Constraint Issues

**🟢 Beginner:**

Common viability issues:
- ❌ **Oxygen Incompatibility**: Species can't breathe the air
- ❌ **Temperature Mismatch**: Too hot or too cold
- ❌ **Food Scarcity**: Not enough food of the right type
- ❌ **Water Needs**: Not enough water available

**🟡 Intermediate:**

Constraint categories:
- **Physiological**: Body-environment mismatches
- **Trophic**: Food chain and energy budget problems
- **Reproductive**: Population growth limitations
- **Competitive**: Conflicts with existing species
- **Resource**: Insufficient resources for population

**🔴 Advanced:**

Constraint checking includes:
- Oxygen level compatibility
- Thermal/hydrological habitat compatibility
- Trophic feasibility and energy budget
- Reproductive rate calculations
- Competitive exclusion analysis

### Step 6: Publishing Your Species

**🟢 Beginner:**

Add your species to the world:
1. Choose **Sandbox** or **Canon** mode
2. Select where to place the species
3. Click **"Publish Species"**
4. Watch your species appear in the world

**🟡 Intermediate:**

Publishing considerations:
- **Population seeding**: Initial numbers and distribution
- **Geographic spread**: Multiple starting regions
- **Timing**: When species appears in timeline
- **Ecological impact**: Effect on existing species
- **Evolutionary potential**: Future adaptation possibilities

**🔴 Advanced:**

Publishing system uses:
```ts
interface SpeciesStudioPublishRequest {
  draftId: string
  canonMode: boolean
  applyAtTick?: number
}
```

---

## Key Concepts

### 🟢 Beginner Concepts

1. **Species & Race Studio** - Tool for creating new species
2. **Trait Categories** - Five groups of characteristics (physiology, cognition, social, habitat, culture)
3. **Viability Check** - Test to see if species can survive
4. **Sandbox vs. Canon** - Temporary vs. permanent species creation

### 🟡 Intermediate Concepts

1. **Trait Pack** - Complete set of species characteristics
2. **Survivability Score** - Numerical rating of survival chances
3. **Population Projection** - Expected population range
4. **Constraint Issues** - Specific problems preventing survival

### 🔴 Advanced Concepts

1. **Parameter Overrides** - Fine-tuning specific biological values
2. **Trophic Feasibility** - Energy budget and food chain analysis
3. **Competitive Exclusion** - How species compete for resources
4. **Evolutionary Lineage** - Relationship to other species

---

## Verification Checkpoints

### 🟢 Beginner Checkpoints

- [ ] I can open Species & Race Studio and understand the interface
- [ ] I can create a basic species with traits from all five categories
- [ ] I understand what viability checks tell me
- [ ] I can fix common constraint issues
- [ ] I can publish a species to sandbox mode

### 🟡 Intermediate Checkpoints

- [ ] I understand all trait categories and their effects
- [ ] I can use parameter overrides effectively
- [ ] I can interpret survivability scores and population projections
- [ ] I understand species compatibility with existing ecosystems
- [ ] I can publish species to canon mode

### 🔴 Advanced Checkpoints

- [ ] I understand the trait pack system for complex species design
- [ ] I understand the underlying biological constraints
- [ ] I can create species with specific ecological niches
- [ ] I can use species design for narrative purposes
- [ ] I understand the technical implementation of species

---

## Related Learning Content

### Core Onboarding
- [`docs/onboard/03-biology.md`](../onboard/03-biology.md) - Biology: Species, Evolution, and Ecosystems
- [`docs/onboard/05-technical.md`](../onboard/05-technical.md) - Technical: Determinism, RNG, and Event Ordering

### Dashboard Onboarding
- [`docs/onboard/06-dashboard-intro.md`](../onboard/06-dashboard-intro.md) - Dashboard Overview
- [`52-onboarding-narrative-dashboard.md`](./52-onboarding-narrative-dashboard.md) - Narrative Dashboard

### Diagrams
- [`docs/onboard/diagrams/05-trophic-energy.svg`](../onboard/diagrams/05-trophic-energy.svg) - Trophic Energy
- [`docs/onboard/diagrams/06-extinction-cycle.svg`](../onboard/diagrams/06-extinction-cycle.svg) - Extinction Cycle

---

## Reference to UI/UX Spec

For technical details about Species & Race Studio, see:
- [`docs/ui-ux/07-species-race-studio-spec.md`](./07-species-race-studio-spec.md)

This spec includes:
- TypeScript interfaces for the view contract
- Trait definitions and validation rules
- Viability check algorithms
- Publishing requirements

---

## Common Tasks

### Task 1: Create a Simple Species

1. Open Species & Race Studio
2. Enter a name and choose basic traits
3. Run viability check
4. Fix any constraint issues
5. Publish to sandbox mode

### Task 2: Design a Specialized Species

1. Plan a specific ecological niche
2. Choose complementary traits
3. Use parameter overrides for fine-tuning
4. Check viability multiple times
5. Consider impact on existing species

### Task 3: Add Species to Canon

1. Perfect species design in sandbox
2. Verify all constraints are satisfied
3. Switch to canon mode
4. Choose appropriate starting regions
5. Publish with proper timing

---

## Tips and Tricks

### 🟢 Beginner Tips
- Start with simple species before trying complex ones
- Always run viability checks before publishing
- Fix oxygen and temperature issues first
- Consider food sources when designing physiology

### 🟡 Intermediate Tips
- Balance advantages with disadvantages
- Use parameter overrides for precise control
- Consider how species interact with existing ones
- Plan multiple starting regions for widespread species

### 🔴 Advanced Tips
- Design species with specific narrative roles
- Use lineage hints for evolutionary storytelling
- Create species that fill empty ecological niches
- Consider long-term evolutionary pressures

---

## Troubleshooting

### Issue: Species fails viability check

**Solution:**
- Check oxygen compatibility with atmosphere
- Verify temperature range matches habitat
- Ensure food sources are available
- Review all constraint issues

### Issue: Population projection is too low

**Solution:**
- Increase reproductive rate traits
- Improve resource access
- Reduce competitive disadvantages
- Check for hidden constraints

### Issue: Canon publish rejected

**Solution:**
- Verify all constraints are satisfied
- Check for conflicts with existing species
- Ensure proper timing in timeline
- Review error messages for specific issues

---

## Next Steps

After mastering Species & Race Studio, explore:
- [`52-onboarding-narrative-dashboard.md`](./52-onboarding-narrative-dashboard.md) - Narrative Dashboard
- [`53-onboarding-event-forge.md`](./53-onboarding-event-forge.md) - Event Forge
- [`55-onboarding-arc-composer.md`](./55-onboarding-arc-composer.md) - Arc Composer
- [`56-onboarding-region-story-cards.md`](./56-onboarding-region-story-cards.md) - Region Story Cards

---

## Glossary

| Term | Definition |
|------|------------|
| **Species & Race Studio** | Tool for designing and creating new species |
| **Trait Categories** | Five groups of characteristics (physiology, cognition, social, habitat, culture) |
| **Trait Pack** | Complete set of all traits defining a species |
| **Viability Check** | Analysis of whether a species can survive in its environment |
| **Survivability Score** | Numerical rating (0-1,000,000 PPM) of survival chances |
| **Population Projection** | Expected population range for a species |
| **Constraint Issues** | Specific problems preventing species survival |
| **Parameter Overrides** | Fine-tuning of specific biological values |
| **Trophic Feasibility** | Analysis of food chain position and energy budget |
| **Competitive Exclusion** | How species compete for limited resources |
| **Evolutionary Lineage** | Relationship between species in evolutionary history |