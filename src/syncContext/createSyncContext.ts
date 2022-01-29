export interface SyncContext<T> {
  getValue(): T;
  runWith<Result>(value: T, callback: () => Result): Result;
  provide<Args extends any[], Result>(value: T, func: (...args: Args) => Result): (...args: Args) => Result;
  // reduce<U>(values: T[], callback: (prevValue: U, currentValue: T, index: number, array: T[]) => U, initialValue: U): U;
}

export function createSyncContext<T>(value: T): SyncContext<T> {
  const getValue = (): T => {
    return value;
  };

  const runWith = <Result>(runValue: T, callback: () => Result): Result => {
    let prevParent = value;

    value = runValue;
    const callbackResult = callback();
    value = prevParent;
    return callbackResult;
  };

  const provide: SyncContext<T>['provide'] = (runValue: T, func) => {
    return (...args) => runWith(runValue, () => func(...args));
  };

  // const reduce: SyncContext<T>['reduce'] = (values, callback, initialValue) => {};

  return {
    getValue,
    runWith,
    provide,
  };
}

// function reduceSyncContext<T, Result>(values: SyncContext<T>[], callback: () => Result): Result {
//   values.reduce((result, context) => {
//     return context.runWith(null, )
//   });
//   values[0].runWith('hello', () => {
//     values[1].runWith('data', () => {

//     })
//   })
// }
