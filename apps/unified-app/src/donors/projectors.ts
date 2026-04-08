import type {
  CanonicalBundle,
  EntityRecord,
  EventEnvelope,
  SimulationAttachment,
  WorkflowAttachment,
  WorkflowRecord
} from "@/domain/canonical";

export interface MythforgeEntityView {
  entityId: string;
  label: string;
  entityType: string;
  summary: string;
  tags: string[];
}

export function buildMythforgeGroups(bundle: CanonicalBundle): Record<string, MythforgeEntityView[]> {
  const groups: Record<string, MythforgeEntityView[]> = {};
  for (const entity of Object.values(bundle.entities)) {
    const key = entity.entity_type || "uncategorized";
    groups[key] ??= [];
    groups[key].push({
      entityId: entity.entity_id,
      label: entity.metadata.label,
      entityType: entity.entity_type,
      summary: entity.metadata.summary ?? "",
      tags: entity.metadata.tags
    });
  }
  for (const list of Object.values(groups)) {
    list.sort((left, right) => left.label.localeCompare(right.label));
  }
  return Object.fromEntries(Object.entries(groups).sort(([left], [right]) => left.localeCompare(right)));
}

export function currentEntity(bundle: CanonicalBundle, entityId: string | null): EntityRecord | null {
  const entities = Object.values(bundle.entities);
  return entities.find((entity) => entity.entity_id === entityId) ?? entities[0] ?? null;
}

export interface OrbisDomainView {
  id: string;
  enabled: boolean;
  fidelity: string;
  tickMode: string;
}

export function getSimulationAttachment(bundle: CanonicalBundle): SimulationAttachment | null {
  return bundle.world?.simulation_attachment ?? null;
}

export function buildOrbisDomains(bundle: CanonicalBundle): OrbisDomainView[] {
  const attachment = getSimulationAttachment(bundle);
  if (!attachment) {
    return [];
  }
  return attachment.enabled_domains.map((domain) => ({
    id: String(domain.id),
    enabled: domain.enabled,
    fidelity: String(domain.fidelity),
    tickMode: String(domain.tick_mode)
  }));
}

export function buildOrbisEventFeed(bundle: CanonicalBundle): EventEnvelope[] {
  return [...bundle.events].slice(-5).reverse();
}

export function collectWorkflowAttachments(bundle: CanonicalBundle): WorkflowAttachment[] {
  const attachments = Object.values(bundle.workflows).map((workflow) => workflow.attachment);
  for (const entity of Object.values(bundle.entities)) {
    if (entity.workflow_attachment) {
      attachments.push(entity.workflow_attachment);
    }
  }
  const deduped = new Map<string, WorkflowAttachment>();
  for (const attachment of attachments) {
    if (!deduped.has(attachment.workflow_id)) {
      deduped.set(attachment.workflow_id, attachment);
    }
  }
  return [...deduped.values()];
}

export function buildAdventureWorkflowList(bundle: CanonicalBundle): WorkflowRecord[] {
  return Object.values(bundle.workflows).sort((left, right) => left.metadata.label.localeCompare(right.metadata.label));
}
