import { BickerNode } from '../node';
import { BickerElement } from '../component';
import { currentBickerOwnerSyncContext } from '../syncContext';
import { BickerOwnerInSyncContextNotFound } from '../errors';
import { childrenToArray } from '../children';

import { reconciliation } from './reconciliation';
import { isPropsUpdated } from './isPropsUpdated';
import { BickerProcess } from './BickerProcess';
import { BickerHook } from './BickerHook';
import { BickerContext } from './BickerContext';

export class BickerOwner {
  static getOwnerFromSyncContex(): BickerOwner {
    const value = currentBickerOwnerSyncContext.getValue();
    if (!value) throw BickerOwnerInSyncContextNotFound();

    return value;
  }

  static createOwnerFromNode(node: BickerNode, parentOwner: BickerOwner): BickerOwner {
    node.owner = new BickerOwner(node, parentOwner);
    return BickerOwner.getOwnerFromNode(node);
  }

  static updateOwnerNode(prevNode: BickerNode, newNode: BickerNode): BickerOwner {
    const owner = BickerOwner.getOwnerFromNode(prevNode);
    owner._linkNewNode(newNode);
    return owner;
  }

  static getOwnerFromNode(node: BickerNode): BickerOwner {
    return node.owner;
  }

  private _parentOwner: BickerOwner = null;

  private _node: BickerNode = null;
  private _prevNodes: BickerNode[] = [];
  private _prevProps: Record<any, any> = {};

  private _hook: BickerHook = null;
  private _context: BickerContext = null;
  private _process: BickerProcess = null;

  private constructor(node: BickerNode, parentOwner: BickerOwner) {
    this._node = node;
    this._parentOwner = parentOwner;

    this._hook = new BickerHook();
    this._context = new BickerContext(parentOwner && parentOwner._context);
    this._process = new BickerProcess([
      ['mount', this._mountProcess.bind(this)],
      ['render', this._renderProcess.bind(this)],
      ['unmount', this._unmountProcess.bind(this)],
    ]);

    this.unmount = this.unmount.bind(this);
    this.getChildrenNodes = this.getChildrenNodes.bind(this);
    this.render = this.render.bind(this);
    // this.forceRender = this.forceRender.bind(this);
    // this.debounceForceRender = debounce(this.forceRender, 0).bind(this);
  }

  get modules() {
    return {
      hook: this._hook,
      context: this._context,
      process: this._process,
    };
  }

  get parentOwner() {
    return this._parentOwner;
  }

  get node() {
    return this._node;
  }

  // Получение карты нод
  getChildrenNodes() {
    let childrenElement: BickerElement = null;
    currentBickerOwnerSyncContext.runWith(this, () => {
      childrenElement = this._node.type(this._node.props);
    });
    this._prevProps = this._node.props;

    if (!this._hook.hookInitialized) this._hook.setInitialized();
    else this._hook.resetCallIndex();

    const childrenNodes = childrenToArray(childrenElement);
    return childrenNodes;
  }

  private _linkNewNode(node: BickerNode) {
    this._node = node;
    node.owner = this;
  }

  isNeedToUpdate() {
    return isPropsUpdated(this._prevProps, this._node.props);
  }

  mount() {
    this._process.emit('mount');
  }

  render(force?: boolean) {
    // Проверка, надо ли вообще обновлять компонент, были ли изменения
    if (force || this.isNeedToUpdate()) {
      this._process.emit('render');
    }
  }

  // Уничтожение текущей ноды
  unmount() {
    this._process.emit('unmount');
  }
  private _mountProcess() {
    if (!this._hook.hookInitialized) {
      this._renderProcess();
    }
  }

  private _renderProcess() {
    const newNodes = this.getChildrenNodes();
    const mutations = reconciliation(this._prevNodes, newNodes);
    this._prevNodes = newNodes;

    mutations.forEach((mutation) => {
      switch (mutation.type) {
        case 'mount': {
          const owner = BickerOwner.createOwnerFromNode(mutation.newNode, this);
          owner.mount();
          break;
        }
        case 'update': {
          const owner = BickerOwner.updateOwnerNode(mutation.prevNode, mutation.newNode);
          owner.render();
          break;
        }
        case 'unmount': {
          const owner = BickerOwner.getOwnerFromNode(mutation.prevNode);
          owner.unmount();
          break;
        }

        default:
          break;
      }
    });
  }

  private _unmountProcess() {
    this._prevNodes.forEach((node) => BickerOwner.getOwnerFromNode(node).unmount());
  }
}
