export interface BickerContextStore {
  [key: string | symbol | number]: any;
}

export class BickerContext {
  private _parentContext: BickerContext = null;
  private _store: BickerContextStore = {};

  constructor(parentContext: BickerContext) {
    this._parentContext = parentContext;
  }

  get currentStore() {
    return this._store;
  }

  getInheritStore(): BickerContextStore {
    let _parentContext = this._parentContext;
    let _store = this._store;
    while (_parentContext) {
      _store = Object.assign({}, _parentContext._store, _store);
      _parentContext = _parentContext._parentContext;
    }
    return _store;
  }
}
