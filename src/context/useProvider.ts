import { useEffect, useMemo, useOwner } from '../hooks';
import { Context } from './createContext';
import { createSubscriptionManager } from './createSubscriptionManager';

export function useProvider<T>(context: Context<T>, value: T) {
  const owner = useOwner();
  const subContext = useMemo<Context<T>>(() => ({ ...context, ...createSubscriptionManager() }), []);

  useEffect(() => {
    owner.modules.context.currentStore[context.id] = subContext;
    return () => {
      delete owner.modules.context.currentStore[context.id];
    };
  }, [owner, subContext]);

  useEffect(() => {
    if (!Object.is(subContext.value, value)) {
      subContext.value = value;
      subContext.notifyUpdates();
    }
  }, [value]);
}
