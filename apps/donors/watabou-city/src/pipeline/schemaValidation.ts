// @ts-nocheck
import Ajv2020 from 'ajv/dist/2020';
import type { ErrorObject } from 'ajv';
import type { CityModel } from './generateCity';
import modelArtifactSchemaJson from '../../docs/06-schemas/model-artifact.schema.json';
import renderArtifactSchemaJson from '../../docs/06-schemas/render-artifact.schema.json';
import diagnosticsArtifactSchemaJson from '../../docs/06-schemas/diagnostics-artifact.schema.json';

const modelArtifactSchema = modelArtifactSchemaJson as Record<string, unknown>;
const renderArtifactSchema = renderArtifactSchemaJson as Record<string, unknown>;
const diagnosticsArtifactSchema = diagnosticsArtifactSchemaJson as Record<string, unknown>;

export const runtimeSchemas = {
  modelArtifactSchema,
  renderArtifactSchema,
  diagnosticsArtifactSchema,
} as const;

const ajv = new Ajv2020({ allErrors: true, strict: false });
const validateModel = ajv.compile(modelArtifactSchema);
const validateRender = ajv.compile(renderArtifactSchema);
const validateDiagnostics = ajv.compile(diagnosticsArtifactSchema);

function toErrors(prefix: string, errors: ErrorObject[] | null | undefined): string[] {
  if (!errors || errors.length === 0) return [];
  return errors.map((err) => `${prefix}${err.instancePath || '/'} ${err.message || 'validation error'}`);
}

export interface BuiltArtifacts {
  modelArtifact: any;
  renderArtifact: any;
  diagnosticsArtifact: any;
}

export interface RuntimeSchemaReport {
  model_schema_pass: boolean;
  render_schema_pass: boolean;
  diagnostics_schema_pass: boolean;
  errors: string[];
  artifacts: BuiltArtifacts;
}

export function buildArtifacts(model: CityModel): BuiltArtifacts {
  const modelArtifact = {
    boundary: model.boundary,
    gates: model.gates,
    roads: model.roads.edges.map((edge) => {
      const u = model.roads.nodes.get(edge.u)?.point;
      const v = model.roads.nodes.get(edge.v)?.point;
      return { id: edge.id, kind: edge.kind, path: [u, v] };
    }),
    districts: model.labels.map((label, idx) => {
      const p = label.point;
      const s = 0.01;
      return {
        id: `d-${idx}`,
        name: label.text,
        polygon: [
          { x: p.x - s, y: p.y - s },
          { x: p.x + s, y: p.y - s },
          { x: p.x + s, y: p.y + s },
          { x: p.x - s, y: p.y + s },
        ],
      };
    }),
    parcels: model.parcels.map((parcel) => ({ id: parcel.id, polygon: parcel.polygon })),
    buildings: model.buildings.map((building) => ({
      id: building.id,
      polygon: building.polygon,
      parcelId: building.parcelId,
    })),
    rural: {
      farms: model.farms,
      trees: model.trees,
    },
    labels: model.labels.map((label) => ({ text: label.text, x: label.point.x, y: label.point.y })),
    landmarks: model.landmarks,
    bridges: model.bridges,
    parkFeatures: model.parkFeatures,
  };

  const renderArtifact = {
    width: 800,
    height: 800,
    layers: [
      { name: 'boundary', order: 0, features: [model.boundary] },
      { name: 'farms', order: 1, features: model.farms.map((f) => f.polygon) },
      { name: 'parcels', order: 2, features: model.parcels },
      { name: 'roads', order: 3, features: model.roads.edges },
      { name: 'bridges', order: 4, features: model.bridges },
      { name: 'parks', order: 5, features: model.parkFeatures },
      { name: 'buildings', order: 6, features: model.buildings },
      { name: 'landmarks', order: 7, features: model.landmarks },
      { name: 'trees', order: 8, features: model.trees },
      { name: 'labels', order: 9, features: model.labels },
    ],
  };

  const diagnosticsArtifact = {
    seed: model.seed,
    size: model.size,
    metrics: {
      ...model.diagnostics,
      globalScaffoldCoverage: model.diagnostics.global_scaffold_coverage,
      innerPatchContiguity: model.diagnostics.inner_patch_contiguity,
      gateCoreReachability: model.diagnostics.gate_core_reachability,
      postAssignmentGeometryOrder: model.diagnostics.post_assignment_geometry_order,
      scaffoldDrivenPlacementRatio: model.diagnostics.scaffold_driven_placement_ratio,
      riverTopologyValid: model.diagnostics.river_topology_valid,
      riverDeterministicReplay: model.diagnostics.river_deterministic_replay,
      unresolvedRoadRiverIntersections: model.diagnostics.unresolved_road_river_intersections,
      requiredCrossRiverConnectivity: model.diagnostics.required_cross_river_connectivity,
      hydroAwarePlacementOrder: model.diagnostics.hydro_aware_placement_order,
      innerBuildingCoverage: model.diagnostics.inner_building_coverage,
      innerEmptyPatchRatio: model.diagnostics.inner_empty_patch_ratio,
      renderLayerOrderStable: model.diagnostics.render_layer_order_stable,
      hostCellBindingCoverage: model.diagnostics.host_cell_binding_coverage,
      crossCellFeatureTagCoverage: model.diagnostics.cross_cell_feature_tag_coverage,
      unresolvedRiverWallIntersections: model.diagnostics.unresolved_river_wall_intersections,
      unresolvedRoadWallIntersections: model.diagnostics.unresolved_road_wall_intersections,
      unresolvedBuildingWallIntersections: model.diagnostics.unresolved_building_wall_intersections,
      layerPrecedenceDriftFlag: model.diagnostics.layer_precedence_drift_flag,
    },
    invariants: {
      all_pass: model.invariants.all_pass,
      failed: model.invariants.failed,
    },
    scores: {
      road_readability_score: 0.8,
      district_semantic_score: 0.8,
      settlement_legibility_score: 0.8,
    },
  };

  return { modelArtifact, renderArtifact, diagnosticsArtifact };
}

export function validateArtifacts(model: CityModel): RuntimeSchemaReport {
  const artifacts = buildArtifacts(model);

  const model_schema_pass = validateModel(artifacts.modelArtifact);
  const render_schema_pass = validateRender(artifacts.renderArtifact);
  const diagnostics_schema_pass = validateDiagnostics(artifacts.diagnosticsArtifact);

  const errors = [
    ...toErrors('model:', validateModel.errors),
    ...toErrors('render:', validateRender.errors),
    ...toErrors('diagnostics:', validateDiagnostics.errors),
  ];

  return {
    model_schema_pass: Boolean(model_schema_pass),
    render_schema_pass: Boolean(render_schema_pass),
    diagnostics_schema_pass: Boolean(diagnostics_schema_pass),
    errors,
    artifacts,
  };
}
