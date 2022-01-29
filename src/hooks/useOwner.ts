import { BickerOwner } from '../engine';

export function useOwner() {
  return BickerOwner.getOwnerFromSyncContex();
}
