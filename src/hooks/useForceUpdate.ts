import { useState } from './useState';
import { useCallback } from './useCallback';

export function useForceUpdate() {
  const [, _setState] = useState(0);
  const forceUpdate = useCallback(() => _setState((count) => count + 1), [_setState]);
  return forceUpdate;
}
