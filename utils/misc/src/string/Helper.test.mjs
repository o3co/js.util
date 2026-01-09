import { replaceTokens } from "@o3co/js.util.misc/string/Helper.mjs";

console.log(
  replaceTokens("Hello, <NAME>", { name: "world" }, { useUpperCaseKey: true }),
);
