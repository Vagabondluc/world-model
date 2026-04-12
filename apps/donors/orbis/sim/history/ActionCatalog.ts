
import { ActionDef } from './types';
import { TagId } from '../../core/types';

export const ACTIONS: ActionDef[] = [
  // ENERGY ACTIONS
  {
    id: 'GATHER_FOOD',
    targetNeed: TagId.NEED_ENERGY,
    reliefPPM: 200_000,
    costPPM: 50_000,
    riskPPM: 50_000,
    cooldownTicks: 1
  },
  {
    id: 'ESTABLISH_FARM',
    targetNeed: TagId.NEED_ENERGY,
    reliefPPM: 500_000,
    costPPM: 300_000,
    riskPPM: 100_000,
    cooldownTicks: 5
  },

  // SAFETY ACTIONS
  {
    id: 'FORTIFY_POSITION',
    targetNeed: TagId.NEED_SAFETY,
    reliefPPM: 400_000,
    costPPM: 200_000,
    riskPPM: 50_000,
    cooldownTicks: 3
  },
  {
    id: 'RAISE_MILITIA',
    targetNeed: TagId.NEED_SAFETY,
    reliefPPM: 600_000,
    costPPM: 400_000,
    riskPPM: 200_000,
    cooldownTicks: 4
  },

  // EXPANSION ACTIONS
  {
    id: 'EXPLORE_REGION',
    targetNeed: TagId.NEED_EXPANSION,
    reliefPPM: 150_000,
    costPPM: 100_000,
    riskPPM: 150_000,
    cooldownTicks: 2
  },
  {
    id: 'FOUND_OUTPOST',
    targetNeed: TagId.NEED_EXPANSION,
    reliefPPM: 500_000,
    costPPM: 600_000,
    riskPPM: 300_000,
    cooldownTicks: 10
  },

  // STABILITY ACTIONS
  {
    id: 'ENACT_LAW',
    targetNeed: TagId.NEED_STABILITY,
    reliefPPM: 300_000,
    costPPM: 100_000,
    riskPPM: 200_000,
    cooldownTicks: 5
  },
  {
    id: 'SUPPRESS_UNREST',
    targetNeed: TagId.NEED_STABILITY,
    reliefPPM: 400_000,
    costPPM: 300_000,
    riskPPM: 400_000,
    cooldownTicks: 2
  }
];
