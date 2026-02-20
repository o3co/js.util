import * as Helper from "./Helper.mjs";

describe("Helper", () => {
  describe(".replaceTokens", () => {
    it("should replace tokens in the string", () => {
      const result = Helper.replaceTokens(
        "Hello, <NAME>",
        { name: "world" },
        { useUpperCaseKey: true },
      );
      expect(result).toBe("Hello, world");
    });

    it("should return the original string if no tokens are found", () => {
      const result = Helper.replaceTokens(
        "Hello, world",
        { name: "world" },
        { useUpperCaseKey: true },
      );
      expect(result).toBe("Hello, world");
    });

    it("should return the original string if the token is not found in the values", () => {
      const result = Helper.replaceTokens(
        "Hello, <NAME>",
        { name: "world" },
        { useUpperCaseKey: false },
      );
      expect(result).toBe("Hello, <NAME>");
    });
  });
});
