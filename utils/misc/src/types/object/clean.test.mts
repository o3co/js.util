import { describe, expect, it } from "@jest/globals";
import { cleanup } from "./Helper.mjs";

describe("cleanup", () => {
  it("should remove null and undefined values", () => {
    const input = {
      a: 1,
      b: null,
      c: undefined,
      d: "test",
    };
    const expected = {
      a: 1,
      d: "test",
    };
    expect(cleanup(input)).toEqual(expected);
  });

  it("should return an empty object if all values are null or undefined", () => {
    const input = {
      a: null,
      b: undefined,
    };
    const expected = {};
    expect(cleanup(input)).toEqual(expected);
  });

  it("should return the same object if there are no null or undefined values", () => {
    const input = {
      a: 1,
      b: "test",
    };
    const expected = {
      a: 1,
      b: "test",
    };
    expect(cleanup(input)).toEqual(expected);
  });
});
