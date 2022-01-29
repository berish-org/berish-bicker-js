import { DependencyListDeclarationIsNotEqualsCorrect } from '../errors';

export type DependencyList = ReadonlyArray<any>;

/**
 * Проверяет, корректно ли отправили DependencyList
 * @param depsList
 */
export function isDependencyListDeclarationCorrect(depsList: DependencyList) {
  return !depsList || Array.isArray(depsList);
}

/**
 * Првоеряет, корректно ли декларация
 * @param depsListOriginal
 * @param depsListNew
 * @returns
 */
export function isDependencyListDeclarationEqualsCorrect(
  depsListOriginal: DependencyList,
  depsListNew: DependencyList,
) {
  if (depsListOriginal && !depsListNew) return false;
  if (!depsListOriginal && depsListNew) return false;
  if (!depsListOriginal && !depsListNew) return true;

  return depsListOriginal.length === depsListNew.length;
}

/**
 * Проверяет, обновился ли DependencyList
 * @param prevDepsList
 * @param currentDepsList
 * @returns
 */
export function isDependencyListUpdated(
  prevDepsList: DependencyList,
  currentDepsList: DependencyList,
  hookName?: string,
) {
  if (!isDependencyListDeclarationEqualsCorrect(prevDepsList, currentDepsList))
    throw DependencyListDeclarationIsNotEqualsCorrect(hookName);

  if (!prevDepsList) return true;
  return (prevDepsList || []).some((item, index) => !Object.is(item, currentDepsList[index]));
}
