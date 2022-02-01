import { DependencyListDeclarationIsNotCorrect } from '../errors';
import { DependencyList, isDependencyListDeclarationCorrect, isDependencyListUpdated } from './depsList';
import { useOwner } from './useOwner';

export interface UseMemoHook<T> {
  depsList: DependencyList;
  value: T;
}

export function useMemo<T>(callback: () => T, depsList?: DependencyList): T {
  if (!isDependencyListDeclarationCorrect(depsList)) throw DependencyListDeclarationIsNotCorrect('useMemo');

  const owner = useOwner();
  const hook = owner.hook.use<UseMemoHook<T>>('useMemo', () => ({ depsList, value: callback() }));

  if (isDependencyListUpdated(hook.depsList, depsList, 'useMemo')) {
    hook.depsList = depsList;
    hook.value = callback();
  }
  return hook.value;
}
