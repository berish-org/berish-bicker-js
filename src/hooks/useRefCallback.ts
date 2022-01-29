import { DependencyList } from './depsList';
import { useEffect } from './useEffect';
import { useRef, UseRefHook } from './useRef';

export function useRefCallback<T extends (...args: any[]) => any>(
  callback: T,
  depsList?: DependencyList,
): UseRefHook<T> {
  const tick = useRef(() => callback);

  useEffect(() => {
    tick.current = callback;
  }, depsList);

  return tick;
}
