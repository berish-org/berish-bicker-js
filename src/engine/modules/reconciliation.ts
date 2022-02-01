import { BickerNode } from '../../node';

export interface MutationMountAction {
  type: 'mount';
  newNode: BickerNode;
}

export interface MutationUpdateAction {
  type: 'update';
  prevNode: BickerNode;
  newNode: BickerNode;
}

export interface MutationUnmountAction {
  type: 'unmount';
  prevNode: BickerNode;
}

export type MutationAction = MutationMountAction | MutationUpdateAction | MutationUnmountAction;

export function reconciliation(prevSnapshotNodes: BickerNode[], newSnapshotNodes: BickerNode[]) {
  let _prevSnapshotNodes = [...prevSnapshotNodes];

  const renderMutations = newSnapshotNodes.map((node) => {
    const mutation = getMutationNode(_prevSnapshotNodes, node);
    _prevSnapshotNodes = _prevSnapshotNodes.filter((node) => {
      if (mutation.type === 'mount') return node !== mutation.newNode;
      if (mutation.type === 'update') return node !== mutation.prevNode;
      return node !== mutation.prevNode;
    });
    return mutation;
  });
  const unmountMutation = _prevSnapshotNodes.map<MutationAction>((prevNode) => ({ type: 'unmount', prevNode }));
  const allMutations = [...renderMutations, ...unmountMutation];

  return allMutations;
}

/**
 * Ищет готовую ноду из предыдущего списка
 * @param list
 * @param currentNode
 */
function getMutationNode(list: BickerNode[], currentNode: BickerNode): MutationAction {
  const cacheNode = list.find((node) => node.key === currentNode.key && node.type === currentNode.type);
  if (cacheNode) {
    return { type: 'update', prevNode: cacheNode, newNode: currentNode };
  } else {
    // Нода не найдена, тогда мутация на создание
    return { type: 'mount', newNode: currentNode };
  }
}
