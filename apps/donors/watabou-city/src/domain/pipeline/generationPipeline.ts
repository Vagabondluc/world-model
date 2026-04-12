// @ts-nocheck
/**
 * Generation Pipeline Module
 * Provides pipeline stage management and ordering for city generation
 */

export interface PipelineStage {
  name: string;
  dependencies?: string[];
  consumesHydroContext?: boolean;
  enabled?: boolean;
}

export interface PipelineConfig {
  hasRiver?: boolean;
  hasWalls?: boolean;
  hasFarms?: boolean;
  hasTrees?: boolean;
  roadDensity?: 'low' | 'medium' | 'high';
  [key: string]: unknown;
}

/**
 * Gets the generation pipeline for a configuration
 */
export function getGenerationPipeline(config: PipelineConfig): PipelineStage[] {
  const stages: PipelineStage[] = [];
  
  // Early stages
  stages.push({ name: 'seedInitialization', dependencies: [] });
  
  if (config.hasRiver) {
    stages.push({ 
      name: 'riverSynthesis', 
      dependencies: ['seedInitialization'],
      consumesHydroContext: false
    });
  }
  
  // Scaffold stages
  stages.push({ 
    name: 'scaffoldGeneration', 
    dependencies: config.hasRiver ? ['riverSynthesis'] : ['seedInitialization']
  });
  
  // Wall/boundary stages
  if (config.hasWalls) {
    stages.push({ 
      name: 'wallSynthesis', 
      dependencies: ['scaffoldGeneration', ...(config.hasRiver ? ['riverSynthesis'] : [])],
      consumesHydroContext: config.hasRiver
    });
    stages.push({ 
      name: 'gatePlacement', 
      dependencies: ['wallSynthesis']
    });
  }
  
  // Road stages
  stages.push({ 
    name: 'roadRouting', 
    dependencies: config.hasRiver ? ['riverSynthesis', 'scaffoldGeneration'] : ['scaffoldGeneration'],
    consumesHydroContext: config.hasRiver
  });
  
  // District stages
  stages.push({ 
    name: 'districtAssignment', 
    dependencies: ['roadRouting', ...(config.hasRiver ? ['riverSynthesis'] : [])],
    consumesHydroContext: config.hasRiver
  });
  
  // Parcel stages
  stages.push({ 
    name: 'parcelSynthesis', 
    dependencies: ['districtAssignment', ...(config.hasRiver ? ['riverSynthesis'] : [])],
    consumesHydroContext: config.hasRiver
  });
  
  // Building stages
  stages.push({ 
    name: 'buildingSynthesis', 
    dependencies: ['parcelSynthesis']
  });
  
  // Rural stages
  if (config.hasFarms || config.hasTrees) {
    stages.push({ 
      name: 'ruralPlacement', 
      dependencies: ['districtAssignment', ...(config.hasRiver ? ['riverSynthesis'] : [])],
      consumesHydroContext: config.hasRiver
    });
  }
  
  // Final stages
  stages.push({ name: 'labelPlacement', dependencies: ['buildingSynthesis'] });
  stages.push({ name: 'finalization', dependencies: ['labelPlacement'] });
  
  return stages;
}

/**
 * Checks if the hydro-aware placement order is valid
 */
export function checkHydroAwarePlacementOrder(pipeline: PipelineStage[]): boolean {
  const riverIndex = pipeline.findIndex(s => s.name === 'riverSynthesis');
  
  if (riverIndex < 0) return true; // No river, order is valid
  
  const dependentStages = ['wallSynthesis', 'roadRouting', 'districtAssignment', 'parcelSynthesis', 'ruralPlacement'];
  
  for (const stageName of dependentStages) {
    const stageIndex = pipeline.findIndex(s => s.name === stageName);
    if (stageIndex >= 0 && riverIndex >= stageIndex) {
      return false; // River synthesis must come before dependent stages
    }
  }
  
  return true;
}
