
import { ActionDef } from './types';
import { age1Actions } from './actions/age1';
import { age2Actions } from './actions/age2';
import { age3Actions } from './actions/age3';

export const ACTION_REGISTRY: Record<string, ActionDef> = {
  ...age1Actions,
  ...age2Actions,
  ...age3Actions,
};
