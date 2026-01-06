/**
 * Default Implementation of merge
 */
import _deepMerge from "deepmerge";
import { isPlainObject } from "is-plain-object";

export const deepMerge = (source, overwrite) => {
  return _deepMerge(source, overwrite, {
    isMergeableObject: isPlainObject,
  });
};

export const deepMergeAll = (arr) => {
  return _deepMerge.all(arr, {
    isMergeableObject: isPlainObject,
  });
};
