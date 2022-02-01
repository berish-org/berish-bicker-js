export const DependencyListDeclarationIsNotCorrect = (hookName?: string) =>
  Error(['DependencyList is not correct', hookName && ` for '${hookName}' hook`].filter(Boolean).join(''));

export const DependencyListDeclarationIsNotEqualsCorrect = (hookName?: string) =>
  Error(
    ['DependencyList is not equals by prev depsList', hookName && ` for '${hookName}' hook`].filter(Boolean).join(''),
  );

export const HookWrongCall = (hookName?: string) =>
  Error(['Wrong call hook', hookName && ` with '${hookName}' hookName`].filter(Boolean).join(''));

export const NotValidBickerElement = () => Error('Wrong BickerElement: some items is not valid BickerNode');

export const BickerOwnerInSyncContextNotFound = () => Error('BickerOwner not found in sync context');

export const BickerComponentNotSupportHooks = () => Error('BickerComponen is not support hooks');
