import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import sampleBundle from "./fixtures/canonical-bundle.sample.json";
import { App } from "@/App";
import type { CanonicalBundle } from "@/domain/canonical";
import { loadCanonicalBundle, saveCanonicalBundle } from "@/services/canonical-bundle";

function renderAt(pathname: string) {
  window.history.pushState({}, "", pathname);
  return render(<App />);
}

function buildStressBundle(entityCount: number): CanonicalBundle {
  const bundle = structuredClone(sampleBundle) as CanonicalBundle;
  const world = bundle.world;
  if (!world) {
    throw new Error("sample bundle is missing a world");
  }

  const template = Object.values(bundle.entities)[0];
  if (!template) {
    throw new Error("sample bundle is missing an entity template");
  }

  const entities: CanonicalBundle["entities"] = {};
  const topLevelEntityIndex: string[] = [];

  for (let index = 0; index < entityCount; index += 1) {
    const entityId = `entity:stress-${index + 1}`;
    const entity = structuredClone(template);
    entity.entity_id = entityId;
    entity.world_id = world.world_id;
    entity.metadata = {
      label: `Stress Entity ${index + 1}`,
      summary: `Synthetic entity ${index + 1} for release hardening.`,
      tags: ["stress", "release", "canonical"]
    };
    entity.payload = {
      description: `Synthetic payload ${index + 1}`
    };
    entity.location_attachment = {
      layer_membership: ["surface"],
      map_anchor: `map:stress-${index + 1}`,
      spatial_scope: "city"
    };
    entities[entityId] = entity;
    topLevelEntityIndex.push(entityId);
  }

  bundle.entities = entities;
  world.top_level_entity_index = topLevelEntityIndex;
  bundle.relations = [];
  const sourceEvent = structuredClone(bundle.events[0]);
  bundle.events = topLevelEntityIndex.map((entityId, index) => ({
    ...sourceEvent,
    event_id: `event:stress-${index + 1}`,
    event_type: "EntityCreated",
    occurred_at: "2026-04-08T00:00:00Z",
    owner: { Entity: entityId },
    payload: {
      inline_payload: {
        entityId,
        label: `Stress Entity ${index + 1}`
      },
      payload_ref: null
    }
  }));

  return bundle;
}

describe("release hardening", () => {
  it("keeps release-critical shell controls keyboard reachable and modal focus-safe", async () => {
    renderAt("/world");

    const topBar = screen.getByLabelText("top context bar");
    expect(within(topBar).getByRole("button", { name: "Open bundle" })).toBeVisible();
    expect(within(topBar).getByRole("button", { name: "Save bundle" })).toBeVisible();

    const workspace = screen.getByLabelText("workspace");
    const createWorldButton = within(workspace).getByRole("button", { name: "Create world" });
    createWorldButton.focus();
    expect(createWorldButton).toHaveFocus();

    fireEvent.click(createWorldButton);

    const dialog = await screen.findByRole("dialog", { name: "Create world" });
    await waitFor(() => {
      expect(within(dialog).getByRole("button", { name: "Close" })).toHaveFocus();
    });

    fireEvent.keyDown(dialog, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Create world" })).not.toBeInTheDocument();
    });
    expect(createWorldButton).toHaveFocus();
  });

  it("roundtrips a large canonical bundle within release thresholds", () => {
    const stressBundle = buildStressBundle(250);
    const started = performance.now();
    const serialized = saveCanonicalBundle(stressBundle);
    const savedAt = performance.now();
    const roundtrip = loadCanonicalBundle(serialized);
    const finished = performance.now();

    expect(roundtrip.world?.top_level_entity_index).toHaveLength(250);
    expect(roundtrip.entities["entity:stress-250"]?.metadata.label).toBe("Stress Entity 250");
    expect(serialized.length).toBeGreaterThan(100000);
    expect(savedAt - started).toBeLessThan(1500);
    expect(finished - savedAt).toBeLessThan(1500);
    expect(finished - started).toBeLessThan(2500);
  });
});
