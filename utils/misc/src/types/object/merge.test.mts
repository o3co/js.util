import { describe, expect, it } from "vitest";
import { deepMerge, deepMergeAll, type RecursivelyPartial } from "./merge.mjs";

describe("deepMerge", () => {
  it("should merge two objects", () => {
    const source = { a: 1, b: { c: 2 } };
    const overwrite = { b: { d: 3 }, e: 4 };
    const expected = { a: 1, b: { c: 2, d: 3 }, e: 4 };
    expect(deepMerge<typeof expected>(source as typeof expected, overwrite)).toEqual(expected);
  });

  it("should overwrite values in the source object", () => {
    const source = { a: 1, b: { c: 2 } };
    const overwrite = { a: 10, b: { c: 20 } };
    expect(deepMerge(source, overwrite)).toEqual({ a: 10, b: { c: 20 } });
  });

  it("should handle nested objects", () => {
    const source = { a: { b: { c: 1, d: 2 } } };
    const overwrite = { a: { b: { c: 10 } } };
    expect(deepMerge(source, overwrite)).toEqual({ a: { b: { c: 10, d: 2 } } });
  });

  it("should replace arrays (not merge elements)", () => {
    const source = { a: [1, 2, 3] };
    const overwrite = { a: [4, 5] };
    expect(deepMerge(source, overwrite)).toEqual({ a: [4, 5] });
  });
});

describe("deepMergeAll", () => {
  it("should merge multiple objects", () => {
    const obj1 = { a: 1, b: { c: 2 } };
    const obj2 = { b: { d: 3 }, e: 4 };
    const obj3 = { f: 5 };
    expect(deepMergeAll<typeof obj1 & typeof obj2 & typeof obj3>([obj1, obj2, obj3]))
      .toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4, f: 5 });
  });

  it("should return empty object for empty array", () => {
    expect(deepMergeAll([])).toEqual({});
  });
});
