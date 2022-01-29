import { Context } from '../context';
import { createSyncContext } from './createSyncContext';

export const currentComponentContextSyncContext = createSyncContext<Context<any>[]>([]);
