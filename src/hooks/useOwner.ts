import { BickerOwnerFunction } from '../engine/bickerOwnerFunction';

export function useOwner() {
  return BickerOwnerFunction.getOwnerFromSyncContex();
}
