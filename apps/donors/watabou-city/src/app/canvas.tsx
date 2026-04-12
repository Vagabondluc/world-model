// @ts-nocheck
import React from 'react';
import { useCityStore } from './state';
import { renderToSVG } from '../adapters/render/svgRenderer';

export const CityCanvas: React.FC = () => {
  const model = useCityStore(state => state.model);
  const showDebug = useCityStore(state => state.showDebug);
  const showVoronoi = useCityStore(state => state.showVoronoi);
  const featureFlags = useCityStore(state => state.featureFlags);

  if (!model) {
    return (
      <div className="flex items-center justify-center h-full bg-stone-100 rounded-sm border border-stone-300">
        <p className="text-stone-500 font-medium">Click "Generate" to build your city</p>
      </div>
    );
  }

  const svg = renderToSVG(
    model.boundary,
    model.gates,
    model.river,
    model.roads,
    model.parcels,
    model.assignments,
    model.buildings,
    model.farms,
    model.trees,
    model.labels,
    model.pois,
    model.landmarks,
    model.bridges,
    model.parkFeatures,
    model.seed,
    {
      showDebug,
      showVoronoi,
      scaffoldPolygons: model.scaffoldPolygons,
      hydraulicNodes: model.hydraulicNodes,
      facetedWalls: featureFlags.feature_edge_ownership_boundary,
      allowDebugGeometry: featureFlags.feature_render_debug_geometry,
      enforceWhitelist: featureFlags.feature_render_whitelist_v1,
      embeddedDrainStyle: featureFlags.feature_drain_wall_embedded_v1,
    },
  );

  return (
    <div className="relative w-full h-full bg-stone-50 rounded-sm overflow-hidden border border-stone-300">
      <div
        className="w-full h-full flex items-center justify-center"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
};
