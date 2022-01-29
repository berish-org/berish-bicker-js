import { BickerComponent, PropsWithChildren } from '../node';
import { Context } from './createContext';
import { useProvider } from './useProvider';

export interface ProviderProps<T> {
  value: T;
}

export type Provider<T> = BickerComponent<PropsWithChildren<ProviderProps<T>>>;

export function createProvider<T>(context: Context<T>) {
  return function Provider({ value, children }: PropsWithChildren<ProviderProps<T>>) {
    useProvider(context, value);

    return children;
  };
}
