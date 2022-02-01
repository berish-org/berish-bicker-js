import { BickerComponentType, BickerElement, BickerFunctionComponent } from '../component';
import { BickerNode } from '../node';
import { BickerOwnerInSyncContextNotFound } from '../errors';
import { currentBickerOwnerSyncContext } from '../syncContext';
import { childrenToArray } from '../children';

import { BickerHook, isObjectUpdated, reconciliation } from './modules';
import { BickerOwner } from './bickerOwner';
import { createOwnerFromNode, getOwnerFromNode, updateOwnerNode } from './methods';

export class BickerOwnerFunction extends BickerOwner<BickerFunctionComponent<any>> {
  static getOwnerFromSyncContex(): BickerOwner<BickerFunctionComponent<any>> {
    const value = currentBickerOwnerSyncContext.getValue();
    if (!value) throw BickerOwnerInSyncContextNotFound();

    return value;
  }

  protected _prevProps: Record<any, any> = {};

  constructor(node: BickerNode<BickerFunctionComponent<any>>, parentOwner: BickerOwner<BickerComponentType<any>>) {
    super(node, parentOwner);

    this._hook = new BickerHook(() => this._isInitialized);
  }

  protected _mountProcess(): void {
    if (!this._isInitialized) {
      this._renderProcess();
    }
  }

  protected _renderProcess(): void {
    const newNodes = this._getChildrenNodes();
    const mutations = reconciliation(this._prevNodes, newNodes);
    this._prevNodes = newNodes;

    mutations.forEach((mutation) => {
      switch (mutation.type) {
        case 'mount': {
          const owner = createOwnerFromNode(mutation.newNode, this);
          owner.mount();
          break;
        }
        case 'update': {
          const owner = updateOwnerNode(mutation.prevNode, mutation.newNode);
          owner.render();
          break;
        }
        case 'unmount': {
          const owner = getOwnerFromNode(mutation.prevNode);
          owner.unmount();
          break;
        }

        default:
          break;
      }
    });
  }

  protected _unmountProcess(): void {
    this._prevNodes.forEach((node) => getOwnerFromNode(node).unmount());
  }

  protected _getChildrenNodes(): BickerNode[] {
    let childrenElement: BickerElement = null;
    currentBickerOwnerSyncContext.runWith(this, () => {
      childrenElement = this._node.type(this._node.props);
    });
    this._prevProps = this._node.props;

    if (!this._isInitialized) this._isInitialized = true;
    else this._hook.resetCallIndex();

    const childrenNodes = childrenToArray(childrenElement);
    return childrenNodes;
  }

  protected _isNeedToUpdate() {
    return isObjectUpdated(this._prevProps, this._node.props);
  }
}
