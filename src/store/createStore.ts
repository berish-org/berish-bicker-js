import { createSubscriptionManager } from '../context/createSubscriptionManager';

export interface Store<State> {
  getState(): State;
  updateState(callback: (prevState: State) => State): void;
  subscribeState(callback: () => any): () => void;
}

export function createStore<State>(initialState: State): Store<State> {
  const manager = createSubscriptionManager();

  const getState: Store<State>['getState'] = () => initialState;

  const updateState: Store<State>['updateState'] = (callback) => {
    const _prev = initialState;
    initialState = callback(initialState);
    if (!Object.is(_prev, initialState)) manager.notifyUpdates();
  };

  const subscribeState: Store<State>['subscribeState'] = (callback) => {
    return manager.subscribe(callback);
  };
  return { getState, updateState, subscribeState };
}
