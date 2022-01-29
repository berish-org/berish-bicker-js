import { BickerNode, CreateNodeProps } from './createNode';

export function cloneNode<Props>(node: BickerNode, componentProps: CreateNodeProps<Props>): BickerNode {
  const { key, ...props } = componentProps;
  const clone = Object.assign<{}, BickerNode>({ props }, node);

  if (typeof key !== 'undefined') clone.key = key;

  return clone;
}
