# Arc Composer Spec

## 1) Timeline Model

```ts
type ArcComposerPhase = "setup" | "escalation" | "catastrophe" | "recovery" | "aftermath"

interface ArcComposerBeat {
  beatId: string
  tick: number
  phase: ArcComposerPhase
  title: string
  summary: string
  linkedActionIds: string[]
  canonLocked: boolean
}

interface ArcComposerTimeline {
  timelineId: string
  worldId: string
  beats: ArcComposerBeat[]
}
```

## 2) Canon Rules

1. Canon-locked beats cannot be modified without an explicit “fork timeline” action.
2. New beats inserted between locked beats must preserve increasing tick order.

## 3) Export Shape

```ts
interface ArcComposerExportPacket {
  timeline: ArcComposerTimeline
  worldBibleSections: Array<"geography" | "species" | "factions" | "events">
  generatedAt: string
}
```

