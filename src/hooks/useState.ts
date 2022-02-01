import { useOwner } from './useOwner';

export type UseStateHook<T> = [T, (value: T | ((state: T) => T)) => void];

export function useState<T>(initialValue?: T | (() => T)): [T, (value: T | ((state: T) => T)) => void] {
  const owner = useOwner();

  const hook = owner.hook.use<UseStateHook<T>>('useState', () => {
    const _setValue = (callback: T | ((state: T) => T)) => {
      const value = callback instanceof Function ? callback(hook[0]) : callback;
      const needToUpdate = !Object.is(hook[0], value);
      hook[0] = value;
      if (needToUpdate) owner.render(true);
    };

    const _initialValue = initialValue instanceof Function ? initialValue() : initialValue;
    return [_initialValue, _setValue];
  });

  return hook;
}
