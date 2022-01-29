import { SYMBOL_NODE_TYPE, SYMBOL_NODE_TYPE_NODE_ENTITY } from '../const';
import { BickerOwner } from '../engine';

export type BickerElement = void | BickerNode | BickerNode[];
export type PropsWithChildren<T> = T & { children?: BickerElement };

export interface BickerComponent<Props> {
  (props: Props): BickerElement;
  displayName?: string;
}

export interface BickerNode {
  [SYMBOL_NODE_TYPE]: symbol;
  key: string;
  props: Readonly<Record<any, any>>;
  type: BickerComponent<any>;
  owner: BickerOwner;
}

export type CreateNodeProps<Props> = { key?: string; children?: BickerElement } & Props;

export function createNode<Props>(type: BickerComponent<Props>, componentProps: CreateNodeProps<Props>): BickerNode {
  const { key, ...props } = componentProps;
  const entity: BickerNode = { [SYMBOL_NODE_TYPE]: SYMBOL_NODE_TYPE_NODE_ENTITY, key, type, owner: null, props };
  return entity;
}
