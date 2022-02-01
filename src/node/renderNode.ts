import { BickerNode } from '../node';
import { createOwnerFromNode, getOwnerFromNode } from '../engine/methods';

export function renderNode(node: BickerNode) {
  const owner = getOwnerFromNode(node) || createOwnerFromNode(node, null);
  owner.mount();
  return () => owner.unmount();
}
