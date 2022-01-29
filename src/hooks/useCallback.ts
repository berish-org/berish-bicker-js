import { DependencyListDeclarationIsNotCorrect } from '../errors';
import { DependencyList, isDependencyListDeclarationCorrect, isDependencyListUpdated } from './depsList';
import { useOwner } from './useOwner';

export interface UseCallbackHook<T> {
  depsList: DependencyList;
  callback: T;
}

export function useCallback<T extends (...args: any[]) => any>(callback: T, depsList: DependencyList): T {
  if (!depsList || !isDependencyListDeclarationCorrect(depsList))
    throw DependencyListDeclarationIsNotCorrect('useCallback');

  const owner = useOwner();
  const hook = owner.modules.hook.use<UseCallbackHook<T>>('useCallback', () => ({ depsList, callback }));

  if (isDependencyListUpdated(hook.depsList, depsList, 'useCallback')) {
    hook.depsList = depsList;
    hook.callback = callback;
  }

  return hook.callback;
}
