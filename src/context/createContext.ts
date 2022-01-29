import guid from 'berish-guid';
import { createSubscriptionManager, SubscriptionManager } from './createSubscriptionManager';
import { createProvider, Provider } from './Provider';

export interface Context<T> extends SubscriptionManager {
  id: string;
  Provider: Provider<T>;
  value: T;
}

export function createContext<T>(value?: T): Context<T> {
  const context: Context<T> = {
    id: guid.guid(),
    Provider: null,
    value,
    ...createSubscriptionManager(),
  };

  context.Provider = createProvider(context);

  return context;
}
