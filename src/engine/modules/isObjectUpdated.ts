import LINQ from '@berish/linq';

export function isObjectUpdated(prevObject: Record<any, any>, newObject: Record<any, any>) {
  prevObject = prevObject || {};
  newObject = newObject || {};

  return LINQ.from(Object.keys(prevObject).concat(Object.keys(newObject)))
    .distinct()
    .some((key) => !Object.is(prevObject[key], newObject[key]));
}
