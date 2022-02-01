import { useOwner } from './useOwner';

export interface UseRefHook<T> {
  current: T;
}

export function useRef<T>(initialValue?: T | (() => T)): { current: T } {
  const owner = useOwner();
  const hook = owner.hook.use<UseRefHook<T>>('useRef', () => ({
    current: initialValue instanceof Function ? initialValue() : initialValue,
  }));

  return hook;
}
