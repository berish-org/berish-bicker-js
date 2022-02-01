import { BickerFunctionComponent, PropsWithChildren } from '../component';
import { Context } from './createContext';
import { useProvider } from './useProvider';

export interface ProviderProps<T> {
  value: T;
}

export type Provider<T> = BickerFunctionComponent<PropsWithChildren<ProviderProps<T>>>;

export function createProvider<T>(context: Context<T>): Provider<T> {
  return function Provider({ value, children }: PropsWithChildren<ProviderProps<T>>) {
    useProvider(context, value);

    return children;
  };
}
