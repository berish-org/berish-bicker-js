import { BickerNode } from '../node';
import { BickerOwner } from '../engine';

export function renderNode(node: BickerNode) {
  const owner = BickerOwner.getOwnerFromNode(node) || BickerOwner.createOwnerFromNode(node, null);
  owner.mount();
  return () => owner.unmount();
}
