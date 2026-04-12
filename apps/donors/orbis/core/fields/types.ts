
import { FieldId } from '../registry/FieldRegistry';

/**
 * Defines the spatial basis for a data field.
 */
export enum FieldBasis {
  GlobalScalar = 'GLOBAL_SCALAR', // Single value per planet
  DomainScalar = 'DOMAIN_SCALAR', // Single value per domain
  Cell = 'CELL',                  // One value per Hex Cell (Dense)
  Band = 'BAND',                  // One value per Latitude Band (Dense)
  Vertex = 'VERTEX',              // One value per Grid Vertex (Dense)
  Region = 'REGION'               // Sparse map
}

export enum ConservationPolicy {
  None = 'NONE',
  GlobalSum = 'GLOBAL_SUM',       // Total value across planet must remain constant during projection
  LocalConcentration = 'LOCAL_CONCENTRATION'
}

export enum ProjectionPolicy {
  Nearest = 'NEAREST',            // Discrete values (Biome ID)
  Linear = 'LINEAR',              // Continuous values (Temp, Elev)
  AreaWeighted = 'AREA_WEIGHTED', // Conserved quantities (Water volume)
  Analytic = 'ANALYTICAL'         // Function-based (Solar insolation)
}

/**
 * Structural definition of a simulation field.
 */
export interface FieldDef {
  id: FieldId;
  basis: FieldBasis;
  dtype: 'Float32' | 'Int32' | 'Uint32' | 'Uint8';
  components: 1 | 2 | 3 | 4; // 1=Scalar, >1=Vector
  conservation: ConservationPolicy;
  projection: ProjectionPolicy;
  unit: string;
}
