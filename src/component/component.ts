import { SYMBOL_COMPONENT_PROPS, SYMBOL_COMPONENT_STATE, SYMBOL_COMPONENT_OWNER } from '../const';
import { BickerOwnerClass } from '../engine/bickerOwnerClass';
import { BickerElement } from './base';

export interface BickerFunctionComponent<Props> {
  (props: Props): BickerElement;
  displayName?: string;
}

export interface BickerClassComponent<Props> {
  new (props: Props): BickerComponent<Props, any>;
  displayName?: string;
}

export class BickerComponent<Props, State> {
  private [SYMBOL_COMPONENT_PROPS]: Props = null;
  private [SYMBOL_COMPONENT_STATE]: State = null;
  private [SYMBOL_COMPONENT_OWNER]: BickerOwnerClass = null;

  constructor(props: Props) {
    this[SYMBOL_COMPONENT_PROPS] = props;
  }

  get props(): Readonly<Props> {
    return this[SYMBOL_COMPONENT_PROPS];
  }

  get state(): Readonly<State> {
    return this[SYMBOL_COMPONENT_STATE];
  }

  set state(value: State) {
    this[SYMBOL_COMPONENT_STATE] = value;
  }

  componentDidMount(): any {}
  componentWillUnmount(): any {}
  componentDidUpdate(prevProps: Props, prevState: State): any {}
  render(): BickerElement {}

  setState(state: Partial<State>) {
    Object.assign(this[SYMBOL_COMPONENT_STATE], state);
    this[SYMBOL_COMPONENT_OWNER].render();
  }

  forceUpdate() {
    this[SYMBOL_COMPONENT_OWNER].render(true);
  }
}

export type BickerComponentType<Props> = BickerFunctionComponent<Props> | BickerClassComponent<Props>;
