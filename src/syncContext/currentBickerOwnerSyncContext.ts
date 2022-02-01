import { BickerFunctionComponent } from '../component';
import { BickerOwner } from '../engine';
import { createSyncContext } from './createSyncContext';

export const currentBickerOwnerSyncContext = createSyncContext<BickerOwner<BickerFunctionComponent<any>>>(null);
