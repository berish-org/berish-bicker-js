import { isExtends } from '@berish/class';
import { BickerComponent, BickerComponentType } from '../../component';
import { BickerNode } from '../../node';
import { BickerOwner } from '../bickerOwner';
import { BickerOwnerClass } from '../bickerOwnerClass';
import { BickerOwnerFunction } from '../bickerOwnerFunction';

export function createOwnerFromNode(
  node: BickerNode,
  parentOwner: BickerOwner<BickerComponentType<any>>,
): BickerOwner<BickerComponentType<any>> {
  const ownerClass = isExtends(node.type, BickerComponent) ? BickerOwnerClass : BickerOwnerFunction;
  node.owner = new ownerClass(node as any, parentOwner);
  return getOwnerFromNode(node);
}

export function updateOwnerNode(prevNode: BickerNode, newNode: BickerNode): BickerOwner<BickerComponentType<any>> {
  const owner = getOwnerFromNode(prevNode);
  owner.linkNewNode(newNode);
  return owner;
}

export function getOwnerFromNode(node: BickerNode): BickerOwner<BickerComponentType<any>> {
  return node.owner;
}
