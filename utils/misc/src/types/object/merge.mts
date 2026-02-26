/**
 * Merge objects
 */
import _deepMerge from "deepmerge";
import { isPlainObject } from "is-plain-object";

type RecursivelyPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivelyPartial<U>[]
    : T[P] extends object
      ? RecursivelyPartial<T[P]>
      : T[P];
};

export const deepMerge = <T extends object>(
  source: RecursivelyPartial<T>,
  overwrite: RecursivelyPartial<T>,
): T => {
  return _deepMerge(source as object, overwrite as object, {
    isMergeableObject: isPlainObject,
  });
};

export const deepMergeAll = <T extends object>(
  arr: RecursivelyPartial<T>[],
): T => {
  return _deepMerge.all(arr, {
    isMergeableObject: isPlainObject,
  }) as T;
};
