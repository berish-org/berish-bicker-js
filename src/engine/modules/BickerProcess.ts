import defer from 'lodash.defer';
import debounce from 'lodash.debounce';

type Action = 'mount' | 'render' | 'unmount';
type Callback = () => void;

export class BickerProcess {
  // Порядок вызова действий
  private _actions: Action[] = [];

  // Прослушиватели событий, после действия
  private _listeners: [Action, Callback[]][] = [];

  // Действия
  private _processing: [Action, Callback][] = [];

  constructor(processing: [Action, Callback][]) {
    this._processing = processing;
  }

  // Вызов события
  emit(action: Action) {
    this._actions.push(action);
    this._deferProcess();
  }

  // Прослушка события
  on(action: Action, callback: () => void): () => void {
    let tuple = this._listeners.find((m) => m[0] === action);
    if (!tuple) {
      tuple = [action, []];
      this._listeners.push(tuple);
    }
    tuple[1].push(callback);
    return () => (tuple[1] = tuple[1].filter((m) => m !== callback));
  }

  private _process() {
    const processActions = this._actions;
    this._actions = [];

    if (this._processAction(processActions, 'unmount')) {
      this.flush();
      return;
    }

    if (this._processAction(processActions, 'mount')) {
      this._actions = [];
      return;
    }

    if (this._processAction(processActions, 'render')) {
      // AFTER RENDER ACTION
    }
  }

  private _processAction(actions: Action[], currentAction: Action) {
    if (actions.indexOf(currentAction) !== -1) {
      // Нужно размаунтить
      const [, mountCallback] = this._processing.find((m) => m[0] === currentAction) || [];
      if (mountCallback) mountCallback();

      const [, listeners] = this._listeners.find((m) => m[0] === currentAction) || [];
      if (listeners) listeners.forEach((callback) => callback());

      return true;
    }
    return false;
  }

  private _debounceProcess = debounce(this._process.bind(this), 0);

  private _deferProcess() {
    defer(() => this._debounceProcess());
  }

  // Очистка событий
  flush() {
    this._actions = [];
    this._listeners = [];
    this._processing = [];
  }
}
