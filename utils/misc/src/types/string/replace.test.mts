import { describe, expect, it } from "vitest";
import { replaceTokens } from "./replace.mjs";

describe("replaceTokens", () => {
  it("should replace tokens with default delimiters", () => {
    const result = replaceTokens("Hello, <name>", { name: "world" });
    expect(result).toBe("Hello, world");
  });

  it("should replace tokens with uppercase key option", () => {
    const result = replaceTokens(
      "Hello, <NAME>",
      { name: "world" },
      { useUpperCaseKey: true },
    );
    expect(result).toBe("Hello, world");
  });

  it("should return original string if no tokens match", () => {
    const result = replaceTokens("Hello, world", { name: "world" });
    expect(result).toBe("Hello, world");
  });

  it("should return original string if token key does not match (case sensitive)", () => {
    const result = replaceTokens("Hello, <NAME>", { name: "world" });
    expect(result).toBe("Hello, <NAME>");
  });

  it("should return original string if tokens is undefined", () => {
    const result = replaceTokens("Hello, <name>", undefined);
    expect(result).toBe("Hello, <name>");
  });

  it("should support custom single-char delimiter", () => {
    const result = replaceTokens("{name}", { name: "world" }, { delimiter: "{}" });
    expect(result).toBe("world");
  });

  it("should support same-char delimiter", () => {
    const result = replaceTokens("%name%", { name: "world" }, { delimiter: "%" });
    expect(result).toBe("world");
  });

  it("should replace multiple tokens", () => {
    const result = replaceTokens("<greeting>, <name>!", {
      greeting: "Hello",
      name: "world",
    });
    expect(result).toBe("Hello, world!");
  });

  it("should throw on empty delimiter", () => {
    expect(() =>
      replaceTokens("test", { a: "b" }, { delimiter: "" }),
    ).toThrow();
  });

  it("should throw on delimiter longer than 2 characters", () => {
    expect(() =>
      replaceTokens("test", { a: "b" }, { delimiter: "<>>" }),
    ).toThrow();
  });
});
