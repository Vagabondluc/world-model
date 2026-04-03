use crate::{
    AssetId, AssetRecord, EntityId, EntityRecord, EventEnvelope, MigrationRecord, ProjectionId,
    ProjectionRecord, RelationRecord, WorkflowId, WorkflowRecord, WorldId, WorldRecord,
};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, JsonSchema, Default)]
pub struct CanonicalBundle {
    pub world: Option<WorldRecord>,
    pub entities: BTreeMap<EntityId, EntityRecord>,
    pub assets: BTreeMap<AssetId, AssetRecord>,
    pub workflows: BTreeMap<WorkflowId, WorkflowRecord>,
    pub relations: Vec<RelationRecord>,
    pub events: Vec<EventEnvelope>,
    pub projections: BTreeMap<ProjectionId, ProjectionRecord>,
    pub migrations: Vec<MigrationRecord>,
}

impl CanonicalBundle {
    pub fn empty() -> Self {
        Self::default()
    }

    pub fn world_id(&self) -> Option<&WorldId> {
        self.world.as_ref().map(|world| &world.world_id)
    }

    pub fn ensure_world(&mut self, world: WorldRecord) {
        self.world = Some(world);
    }

    pub fn entity_ids(&self) -> impl Iterator<Item = &EntityId> {
        self.entities.keys()
    }

    pub fn workflow_ids(&self) -> impl Iterator<Item = &WorkflowId> {
        self.workflows.keys()
    }
}

pub type WorldBundle = CanonicalBundle;
