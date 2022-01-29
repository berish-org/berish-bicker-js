import { BickerOwner } from '../engine';

export function useParentOwner() {
  const owner = BickerOwner.getOwnerFromSyncContex();
  return owner.parentOwner;
}
