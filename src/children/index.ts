import { NotValidBickerElement } from '../errors';
import { BickerElement, BickerNode, isValidNode } from '../node';

export function childrenToArray(children: BickerElement): BickerNode[] {
  const array = Array.isArray(children) ? children : [children || null];
  const nodeElements = array.filter(Boolean);

  if (nodeElements.some((element) => !isValidNode(element))) throw NotValidBickerElement();
  return nodeElements;
}
