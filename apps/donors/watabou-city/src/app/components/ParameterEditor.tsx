// @ts-nocheck
import React from 'react';
import { useCityStore } from '../state';
import {
  CollapsibleSection,
  ParameterSlider,
  ParameterToggle,
  SelectInput,
} from './ParameterGroups';

export const ParameterEditor: React.FC = () => {
  const { params, setParams } = useCityStore();

  const handleNumberChange = (key: keyof typeof params, value: number) => {
    setParams({ [key]: value });
  };

  const handleBoolChange = (key: keyof typeof params, value: boolean) => {
    setParams({ [key]: value });
  };

  const handleSelectChange = (key: keyof typeof params, value: string) => {
    setParams({ [key]: value as any });
  };

  return (
    <div className="space-y-3">
      {/* Geography Section */}
      <CollapsibleSection title="🌍 Geography" defaultOpen={true}>
        <ParameterToggle
          label="Enable River"
          value={params.riverEnabled}
          onChange={(v) => handleBoolChange('riverEnabled', v)}
          description="Generate river system"
        />
        {params.riverEnabled && (
          <>
            <ParameterSlider
              label="River Width"
              value={params.riverWidth}
              min={0.5}
              max={8}
              unit=" units"
              onChange={(v) => handleNumberChange('riverWidth', v)}
            />
            <ParameterSlider
              label="Meander Strength"
              value={params.riverMeanderStrength}
              min={0}
              max={1}
              onChange={(v) => handleNumberChange('riverMeanderStrength', v)}
            />
            <ParameterSlider
              label="Bank Buffer"
              value={params.riverBankBuffer}
              min={0}
              max={5}
              unit=" units"
              onChange={(v) => handleNumberChange('riverBankBuffer', v)}
            />
            <ParameterToggle
              label="City Crosses River"
              value={params.riverCrossingAllowed}
              onChange={(v) => handleBoolChange('riverCrossingAllowed', v)}
            />
          </>
        )}

        <ParameterToggle
          label="Enable Parks"
          value={params.parksEnabled}
          onChange={(v) => handleBoolChange('parksEnabled', v)}
          description="Generate forested areas"
        />
        {params.parksEnabled && (
          <>
            <ParameterSlider
              label="Parks Density"
              value={params.parksDensity}
              min={0}
              max={1}
              onChange={(v) => handleNumberChange('parksDensity', v)}
            />
            <ParameterSlider
              label="Parks Clustering"
              value={params.parksClustering}
              min={0}
              max={1}
              onChange={(v) => handleNumberChange('parksClustering', v)}
            />
          </>
        )}
      </CollapsibleSection>

      {/* Fortifications Section */}
      <CollapsibleSection title="🏰 Fortifications">
        <ParameterSlider
          label="Wall Thickness"
          value={params.wallThickness}
          min={0.1}
          max={1}
          unit=" units"
          onChange={(v) => handleNumberChange('wallThickness', v)}
        />
        <ParameterSlider
          label="Wall Smoothing"
          value={params.wallSmoothing}
          min={0}
          max={1}
          onChange={(v) => handleNumberChange('wallSmoothing', v)}
        />
        <ParameterSlider
          label="Wall Corner Bias"
          value={params.wallCornerBias}
          min={0}
          max={1}
          onChange={(v) => handleNumberChange('wallCornerBias', v)}
        />
        <ParameterSlider
          label="Wall Offset from Built Area"
          value={params.wallOffsetFromBuiltArea}
          min={0}
          max={3}
          unit=" units"
          onChange={(v) => handleNumberChange('wallOffsetFromBuiltArea', v)}
        />

        <div className="border-t border-stone-200 pt-3 mt-3">
          <h4 className="text-xs font-semibold text-stone-600 mb-2">Towers</h4>
          <ParameterSlider
            label="Tower Radius Ratio"
            value={params.towerRadiusRatio}
            min={0.1}
            max={0.5}
            onChange={(v) => handleNumberChange('towerRadiusRatio', v)}
          />
          <ParameterSlider
            label="Min Tower Spacing"
            value={params.towerMinSpacing}
            min={1}
            max={5}
            unit=" units"
            onChange={(v) => handleNumberChange('towerMinSpacing', v)}
          />
          <ParameterSlider
            label="Max Tower Spacing"
            value={params.towerMaxSpacing}
            min={2}
            max={8}
            unit=" units"
            onChange={(v) => handleNumberChange('towerMaxSpacing', v)}
          />
          <SelectInput
            label="Tower Placement Mode"
            value={params.towerPlacementMode}
            options={[
              { value: 'corner-only', label: 'Corner Only' },
              { value: 'periodic', label: 'Periodic' },
            ]}
            onChange={(v) => handleSelectChange('towerPlacementMode', v)}
          />
        </div>

        <div className="border-t border-stone-200 pt-3 mt-3">
          <h4 className="text-xs font-semibold text-stone-600 mb-2">Gates</h4>
          <ParameterSlider
            label="Target Gate Count"
            value={params.gatesTargetCount}
            min={1}
            max={16}
            step={1}
            onChange={(v) => handleNumberChange('gatesTargetCount', v)}
          />
          <ParameterSlider
            label="Gate Min Spacing"
            value={params.gatesMinSpacing}
            min={1}
            max={5}
            unit=" units"
            onChange={(v) => handleNumberChange('gatesMinSpacing', v)}
          />
          <ParameterToggle
            label="Gates Only on Arterials"
            value={params.gatesOnArteralsOnly}
            onChange={(v) => handleBoolChange('gatesOnArteralsOnly', v)}
          />
          <ParameterToggle
            label="Watergate Mode (if river)"
            value={params.watergateMode}
            onChange={(v) => handleBoolChange('watergateMode', v)}
          />
        </div>
      </CollapsibleSection>

      {/* Bridges Section */}
      <CollapsibleSection title="🌉 Bridges">
        <ParameterSlider
          label="Max Bridges"
          value={params.bridgesMaxCount}
          min={0}
          max={10}
          step={1}
          onChange={(v) => handleNumberChange('bridgesMaxCount', v)}
        />
        <ParameterSlider
          label="Min Bridge Spacing"
          value={params.bridgesMinSpacing}
          min={0.5}
          max={5}
          unit=" units"
          onChange={(v) => handleNumberChange('bridgesMinSpacing', v)}
        />
        <ParameterToggle
          label="Collectors & Arterials Only"
          value={params.bridgesCollectorsOnly}
          onChange={(v) => handleBoolChange('bridgesCollectorsOnly', v)}
        />
        <ParameterSlider
          label="Bridge Width"
          value={params.bridgesWidth}
          min={0.3}
          max={2}
          unit=" units"
          onChange={(v) => handleNumberChange('bridgesWidth', v)}
        />

        <div className="border-t border-stone-200 pt-3 mt-3">
          <h4 className="text-xs font-semibold text-stone-600 mb-2">
            Candidate Scoring Weights
          </h4>
          <ParameterSlider
            label="Demand Weight"
            value={params.bridgeDemandWeight}
            min={0}
            max={1}
            onChange={(v) => handleNumberChange('bridgeDemandWeight', v)}
          />
          <ParameterSlider
            label="Centrality Weight"
            value={params.bridgeCentralityWeight}
            min={0}
            max={1}
            onChange={(v) => handleNumberChange('bridgeCentralityWeight', v)}
          />
          <ParameterSlider
            label="Proximity Weight"
            value={params.bridgeProximityWeight}
            min={0}
            max={1}
            onChange={(v) => handleNumberChange('bridgeProximityWeight', v)}
          />
        </div>
      </CollapsibleSection>

      {/* Roads Section */}
      <CollapsibleSection title="🛣️ Roads">
        <ParameterSlider
          label="Arterials Count"
          value={params.arterialsCount}
          min={1}
          max={20}
          step={1}
          onChange={(v) => handleNumberChange('arterialsCount', v)}
        />
        <ParameterSlider
          label="Ring Road Chance"
          value={params.ringRoadChance}
          min={0}
          max={1}
          onChange={(v) => handleNumberChange('ringRoadChance', v)}
        />
        <ParameterSlider
          label="Organic vs Planned Bias"
          value={params.organicBias}
          min={0}
          max={1}
          onChange={(v) => handleNumberChange('organicBias', v)}
        />

        <div className="border-t border-stone-200 pt-3 mt-3">
          <h4 className="text-xs font-semibold text-stone-600 mb-2">Road Widths</h4>
          <ParameterSlider
            label="Arterial Width"
            value={params.arterialWidth}
            min={0.3}
            max={2}
            unit=" units"
            onChange={(v) => handleNumberChange('arterialWidth', v)}
          />
          <ParameterSlider
            label="Collector Width"
            value={params.collectorWidth}
            min={0.2}
            max={1.5}
            unit=" units"
            onChange={(v) => handleNumberChange('collectorWidth', v)}
          />
          <ParameterSlider
            label="Local Width"
            value={params.localWidth}
            min={0.1}
            max={1}
            unit=" units"
            onChange={(v) => handleNumberChange('localWidth', v)}
          />
        </div>
      </CollapsibleSection>

      {/* Buildings Section */}
      <CollapsibleSection title="🏢 Buildings">
        <ParameterSlider
          label="Core Density"
          value={params.densityCore}
          min={0}
          max={1}
          onChange={(v) => handleNumberChange('densityCore', v)}
        />
        <ParameterSlider
          label="Outskirts Density"
          value={params.densityOutskirts}
          min={0}
          max={1}
          onChange={(v) => handleNumberChange('densityOutskirts', v)}
        />
        <ParameterSlider
          label="Min Setback from Boundary"
          value={params.buildingMinSetback}
          min={0}
          max={2}
          unit=" units"
          onChange={(v) => handleNumberChange('buildingMinSetback', v)}
        />
        <ParameterSlider
          label="Street Alignment Strength"
          value={params.alignmentStrength}
          min={0}
          max={1}
          onChange={(v) => handleNumberChange('alignmentStrength', v)}
        />

        <div className="border-t border-stone-200 pt-3 mt-3">
          <h4 className="text-xs font-semibold text-stone-600 mb-2">
            Footprint Size Range
          </h4>
          <ParameterSlider
            label="Min Footprint"
            value={params.footprintMinSize}
            min={0.1}
            max={2}
            unit=" units"
            onChange={(v) => handleNumberChange('footprintMinSize', v)}
          />
          <ParameterSlider
            label="Max Footprint"
            value={params.footprintMaxSize}
            min={1}
            max={5}
            unit=" units"
            onChange={(v) => handleNumberChange('footprintMaxSize', v)}
          />
        </div>
      </CollapsibleSection>
    </div>
  );
};
