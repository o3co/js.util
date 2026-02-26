import { describe, expect, it } from "@jest/globals";
import { deepMerge, deepMergeAll } from "./merge.mjs";

describe("deepMerge", () => {
  it("should merge two objects", () => {
    const obj1 = { a: 1, b: { c: 2 } };
    const obj2 = { b: { d: 3 }, e: 4 };
    const expected = { a: 1, b: { c: 2, d: 3 }, e: 4 };
    expect(deepMerge<typeof expected>(obj1, obj2)).toEqual(expected);
  });

  it("should overwrite values in the source object", () => {
    const obj1 = { a: 1, b: { c: 2 } };
    const obj2 = { a: 10, b: { c: 20 } };
    const expected = { a: 10, b: { c: 20 } };
    expect(deepMerge<typeof expected>(obj1, obj2)).toEqual(expected);
  });
});

describe("deepMergeAll", () => {
  it("should merge multiple objects", () => {
    const obj1 = { a: 1, b: { c: 2 } };
    const obj2 = { b: { d: 3 }, e: 4 };
    const obj3 = { f: 5 };
    const expected = { a: 1, b: { c: 2, d: 3 }, e: 4, f: 5 };
    expect(deepMergeAll<typeof expected>([obj1, obj2, obj3])).toEqual(expected);
  });
});
