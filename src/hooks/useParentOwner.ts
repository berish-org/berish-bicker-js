import { BickerOwnerFunction } from '../engine/bickerOwnerFunction';

export function useParentOwner() {
  const owner = BickerOwnerFunction.getOwnerFromSyncContex();
  return owner.parentOwner;
}
