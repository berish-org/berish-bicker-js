import { BickerOwner } from '../engine';
import { createSyncContext } from './createSyncContext';

export const currentBickerOwnerSyncContext = createSyncContext<BickerOwner>(null);
