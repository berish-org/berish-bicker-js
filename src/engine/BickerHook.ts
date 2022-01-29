import { HookWrongCall } from '../errors';

export interface Hook<T> {
  hookType: string;
  hookData: T;
}

export class BickerHook {
  private _hooks: Hook<any>[] = [];
  private _hookCallIndex: number = 0;
  private _hookInitialized = false;

  get hookInitialized() {
    return this._hookInitialized;
  }

  setInitialized() {
    this._hookInitialized = true;
  }

  resetCallIndex() {
    this._hookCallIndex = 0;
  }

  use<T>(hookType: string, createHook: () => T): T {
    // Хуки еще не проиниализированы
    if (!this._hookInitialized) {
      const hookData = createHook();
      this._hooks.push({ hookType, hookData });
      return hookData;
    }

    // Уже есть понимание, что хуки готовы к повторной работе
    const hook = this._hooks[this._hookCallIndex++];
    if (hook.hookType !== hookType) throw HookWrongCall(hookType);
    return hook.hookData;
  }
}
