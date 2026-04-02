import _deepMerge from "deepmerge";
// @ts-expect-error is-plain-object exports don't resolve under nodenext moduleResolution
import { isPlainObject } from "is-plain-object";

export type RecursivelyPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivelyPartial<U>[]
    : T[P] extends object
      ? RecursivelyPartial<T[P]>
      : T[P];
};

export function deepMerge<T extends object>(
  source: T,
  overwrite: RecursivelyPartial<T>,
): T {
  return _deepMerge(source as object, overwrite as object, {
    isMergeableObject: isPlainObject,
    arrayMerge: (_target, source) => source,
  }) as T;
}

export function deepMergeAll<T extends object>(
  arr: RecursivelyPartial<T>[],
): T {
  return _deepMerge.all(arr, {
    isMergeableObject: isPlainObject,
    arrayMerge: (_target, source) => source,
  }) as T;
}
