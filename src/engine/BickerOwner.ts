import { BickerComponentNotSupportHooks } from '../errors';
import { BickerComponentType } from '../component';
import { BickerNode } from '../node';
import { BickerContext, BickerHook, BickerProcess } from './modules';

export abstract class BickerOwner<NodeType extends BickerComponentType<any>> {
  protected _node: BickerNode<NodeType> = null;
  protected _parentOwner: BickerOwner<BickerComponentType<any>> = null;
  protected _process: BickerProcess = null;
  protected _context: BickerContext = null;
  protected _hook: BickerHook = null;

  protected _prevNodes: BickerNode[] = [];

  protected _isInitialized = false;

  protected abstract _mountProcess(): void;
  protected abstract _renderProcess(): void;
  protected abstract _unmountProcess(): void;
  protected abstract _getChildrenNodes(): BickerNode[];
  protected abstract _isNeedToUpdate(): boolean;

  constructor(node: BickerNode<NodeType>, parentOwner: BickerOwner<BickerComponentType<any>>) {
    this._node = node;
    this._parentOwner = parentOwner;
    this._context = new BickerContext(parentOwner && parentOwner._context);
    this._process = new BickerProcess([
      ['mount', this._mountProcess.bind(this)],
      ['render', this._renderProcess.bind(this)],
      ['unmount', this._unmountProcess.bind(this)],
    ]);

    this.mount = this.mount.bind(this);
    this.render = this.render.bind(this);
    this.unmount = this.unmount.bind(this);
    this.linkNewNode = this.linkNewNode.bind(this);
  }

  get parentOwner() {
    return this._parentOwner;
  }

  get node() {
    return this._node;
  }

  get hook() {
    if (!this._hook) throw BickerComponentNotSupportHooks();
    return this._hook;
  }

  get context() {
    return this._context;
  }

  get process() {
    return this._process;
  }

  public mount() {
    this._process.emit('mount');
  }

  public render(force?: boolean) {
    if (force || this._isNeedToUpdate()) {
      this._process.emit('render');
    }
  }

  public unmount() {
    this._process.emit('unmount');
  }

  public linkNewNode(node: BickerNode<NodeType>) {
    this._node = node;
    node.owner = this;
  }
}
