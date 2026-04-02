import { describe, expect, it } from "vitest";
import { cleanup } from "./cleanup.mjs";

describe("cleanup", () => {
  it("should remove null and undefined values", () => {
    const input = { a: 1, b: null, c: undefined, d: "test" };
    expect(cleanup(input)).toEqual({ a: 1, d: "test" });
  });

  it("should return an empty object if all values are null or undefined", () => {
    const input = { a: null, b: undefined };
    expect(cleanup(input)).toEqual({});
  });

  it("should return the same shape if no null or undefined values", () => {
    const input = { a: 1, b: "test" };
    expect(cleanup(input)).toEqual({ a: 1, b: "test" });
  });

  it("should preserve falsy values: 0, false, empty string", () => {
    const input = { a: 0, b: false, c: "", d: null };
    expect(cleanup(input)).toEqual({ a: 0, b: false, c: "" });
  });

  it("should handle empty object", () => {
    expect(cleanup({})).toEqual({});
  });
});
