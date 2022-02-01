import { BickerNode } from '../node';

export interface BickerFunctionComponent<Props> {
  (props: Props): BickerElement;
  displayName?: string;
}

// export interface BickerClassComponent<Props> {
//   new (props: Props): Component<Props, any>;
//   displayName?: string;
// }

export type BickerComponentType<Props> = BickerFunctionComponent<Props>;

export type BickerElement = void | BickerNode | BickerNode[];
export type PropsWithChildren<T> = T & { children?: BickerElement };
export type CreateNodeProps<Props> = { key?: string; children?: BickerElement } & Props;
