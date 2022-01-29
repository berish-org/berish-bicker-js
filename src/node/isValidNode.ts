import { SYMBOL_NODE_TYPE, SYMBOL_NODE_TYPE_NODE_ENTITY } from '../const';
import { BickerNode } from './createNode';

export function isValidNode(value: any): value is BickerNode {
  if (value && typeof value === 'object' && value[SYMBOL_NODE_TYPE] === SYMBOL_NODE_TYPE_NODE_ENTITY) return true;
  return false;
}
