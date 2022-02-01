import { SYMBOL_NODE_TYPE, SYMBOL_NODE_TYPE_NODE_ENTITY } from '../const';
import { BickerOwner } from '../engine';
import { BickerComponentType, CreateNodeProps } from '../component';

export interface BickerNode {
  [SYMBOL_NODE_TYPE]: symbol;
  key: string;
  props: Readonly<Record<any, any>>;
  type: BickerComponentType<any>;
  owner: BickerOwner;
}

export function createNode<Props>(
  type: BickerComponentType<Props>,
  componentProps: CreateNodeProps<Props>,
): BickerNode {
  const { key, ...props } = componentProps;
  const entity: BickerNode = { [SYMBOL_NODE_TYPE]: SYMBOL_NODE_TYPE_NODE_ENTITY, key, type, owner: null, props };
  return entity;
}
