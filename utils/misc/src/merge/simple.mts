import _deepMerge from "deepmerge";
import { isPlainObject } from "is-plain-object";

export const deepMerge = (source, overwrite) => {
  return _deepMerge(source, overwrite, {
    isMergeableObject: isPlainObject,
  });
};
