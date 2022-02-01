import { Store } from '../store';
import { useEffect } from './useEffect';
import { useForceUpdate } from './useForceUpdate';

export function useStore<TState>(store: Store<TState>) {
  const forceUpdate = useForceUpdate();

  useEffect(() => store.subscribeState(() => forceUpdate()), [store]);

  return store.getState();
}
