import { childrenToArray } from '../children';
import { BickerClassComponent, BickerComponent, BickerComponentType, BickerElement } from '../component';
import { SYMBOL_COMPONENT_OWNER, SYMBOL_COMPONENT_PROPS, SYMBOL_COMPONENT_STATE } from '../const';
import { BickerNode } from '../node';
import { BickerOwner } from './bickerOwner';
import { createOwnerFromNode, getOwnerFromNode, updateOwnerNode } from './methods';
import { isObjectUpdated, reconciliation } from './modules';

export class BickerOwnerClass extends BickerOwner<BickerClassComponent<any>> {
  protected _component: BickerComponent<any, any> = null;

  protected _prevProps: Record<any, any> = null;
  protected _prevState: Record<any, any> = null;

  constructor(node: BickerNode<BickerClassComponent<any>>, parentOwner: BickerOwner<BickerComponentType<any>>) {
    super(node, parentOwner);
  }

  protected _mountProcess(): void {
    if (!this._isInitialized) {
      // Инициализация первичным заничением пропсов
      this._component = new this.node.type(this.node.props);
      this._prevProps = this._component.props;
      this._prevState = this._component.state;

      // Привязка owner к компоненту
      this._component[SYMBOL_COMPONENT_OWNER] = this;

      this._renderProcess();
      if (this._component.componentDidMount) this._component.componentDidMount();
    }
  }

  protected _renderProcess(): void {
    const _prevProps = this._prevProps;
    const _prevState = this._prevState;

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

    if (this._isInitialized && this._component.componentDidUpdate)
      this._component.componentDidUpdate(_prevProps, _prevState);
  }

  protected _unmountProcess(): void {
    if (this._component && this._component.componentWillUnmount) this._component.componentWillUnmount();
    this._prevNodes.forEach((node) => getOwnerFromNode(node).unmount());
  }

  protected _getChildrenNodes(): BickerNode[] {
    // Рендер компонента с новыми параметрами
    const childrenElement: BickerElement = this._component.render && this._component.render();

    // Обновление предыдущих просов и стейтов
    this._prevProps = this._component[SYMBOL_COMPONENT_PROPS];
    this._prevState = this._component[SYMBOL_COMPONENT_STATE];

    if (!this._isInitialized) this._isInitialized = true;

    const childrenNodes = childrenToArray(childrenElement);
    return childrenNodes;
  }

  protected _isNeedToUpdate() {
    this._component[SYMBOL_COMPONENT_PROPS] = this.node.props;

    return (
      isObjectUpdated(this._prevProps, this._component[SYMBOL_COMPONENT_PROPS]) ||
      isObjectUpdated(this._prevState, this._component[SYMBOL_COMPONENT_STATE])
    );
  }

  public get component() {
    return this._component;
  }

  public get prevProps() {
    return this._prevProps;
  }

  public get prevState() {
    return this._prevState;
  }
}
