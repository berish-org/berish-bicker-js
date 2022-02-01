import { SYMBOL_NODE_TYPE, SYMBOL_NODE_TYPE_NODE_ENTITY } from '../const';
import { BickerOwner } from '../engine';
import { BickerComponentType, CreateNodeProps } from '../component';

export interface BickerNode<ComponentType extends BickerComponentType<any> = BickerComponentType<any>> {
  [SYMBOL_NODE_TYPE]: symbol;
  key: string;
  props: Readonly<Record<any, any>>;
  type: ComponentType;
  owner: BickerOwner<ComponentType>;
}

export function createNode<Props>(
  type: BickerComponentType<Props>,
  componentProps: CreateNodeProps<Props>,
): BickerNode {
  const { key, ...props } = componentProps;
  const entity: BickerNode = {
    [SYMBOL_NODE_TYPE]: SYMBOL_NODE_TYPE_NODE_ENTITY,
    key,
    type,
    owner: null,
    props,
  };
  return entity;
}
