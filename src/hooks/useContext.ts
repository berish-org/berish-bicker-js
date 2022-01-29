import { Context } from '../context';
import { BickerOwner } from '../engine';
import { useEffect } from './useEffect';
import { useOwner } from './useOwner';
import { useRef } from './useRef';
import { useForceUpdate } from './useForceUpdate';
import { useMemo } from './useMemo';
import defer from 'lodash.defer';

export function useContext<T>(context: Context<T>): T {
  const owner = useOwner();
  const subcontext = useMemo<Context<T>>(() => getContext(owner, context), [owner, context]);
  const storeRef = useRef<T>();
  storeRef.current = subcontext.value;

  useEffect(
    () =>
      subcontext.subscribe(() => {
        defer(() => owner.render(true));
      }),
    [subcontext],
  );

  return storeRef.current;
}

function getContext<T>(owner: BickerOwner, context: Context<T>): Context<T> {
  const nodeContext = owner.modules.context.getInheritStore();
  if (context.id in nodeContext) return nodeContext[context.id];
  return context;
}
