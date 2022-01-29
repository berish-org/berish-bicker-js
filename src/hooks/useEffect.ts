import { DependencyListDeclarationIsNotCorrect } from '../errors';
import { DependencyList, isDependencyListDeclarationCorrect, isDependencyListUpdated } from './depsList';
import { useOwner } from './useOwner';

export interface UseEffectHook {
  depsList: DependencyList;
  prevUnmount: void | (() => void);
  callback: () => void | (() => void);
}

export function useEffect(callback: () => void | (() => void), depsList?: DependencyList): void {
  if (!isDependencyListDeclarationCorrect(depsList)) throw DependencyListDeclarationIsNotCorrect('useEffect');

  const owner = useOwner();
  const hook = owner.modules.hook.use<UseEffectHook>('useEffect', () => {
    // first mounting

    owner.modules.process.on('mount', () => {
      const prevUnmount = callback();
      hook.prevUnmount = prevUnmount;
    });

    owner.modules.process.on('unmount', () => {
      if (hook.prevUnmount) {
        hook.prevUnmount();
        hook.prevUnmount = null;
        hook.callback = null;
      }
    });

    return { depsList, callback: null, prevUnmount: null };
  });

  if (isDependencyListUpdated(hook.depsList, depsList, 'useEffect')) {
    hook.depsList = depsList;

    if (hook.prevUnmount) {
      hook.prevUnmount();
      hook.prevUnmount = null;
    }

    hook.callback = callback;
    hook.prevUnmount = hook.callback();
  }
}
