import LINQ from '@berish/linq';

export function isPropsUpdated(prevProps: Record<any, any>, newProps: Record<any, any>) {
  return LINQ.from(Object.keys(prevProps).concat(Object.keys(newProps)))
    .distinct()
    .some((key) => !Object.is(prevProps[key], newProps[key]));
}
