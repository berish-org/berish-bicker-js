import { BickerNode } from '../node';

export type BickerElement = void | BickerNode | BickerNode[];
export type PropsWithChildren<T> = T & { children?: BickerElement };
export type CreateNodeProps<Props> = { key?: string; children?: BickerElement } & Props;
