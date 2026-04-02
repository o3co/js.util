import type { Stringifiable } from "../defined.mjs";

export type ReplaceTokensOptions = {
  useUpperCaseKey?: boolean;
  // a char for both start and end delimiter, or a string of two chars for start and end delimiter respectively. Default is `<>`
  delimiter?: string;
};

const DefaultReplaceTokensOptions = {
  useUpperCaseKey: false,
  delimiter: "<>",
};
/**
 *
 * @param {string} pattern
 * @param {Record<string, Stringifiable> | undefined} tokens
 * @param {ReplaceTokensOptions} options a char for both start and end delimiter, or a string of two chars for start and end delimiter respectively. Default is `<>`
 * @returns {string}
 */
export function replaceTokens(
  pattern: string,
  tokens: Record<string, Stringifiable> | undefined,
  options: ReplaceTokensOptions = DefaultReplaceTokensOptions,
): string {
  const {
    useUpperCaseKey = DefaultReplaceTokensOptions.useUpperCaseKey,
    delimiter = DefaultReplaceTokensOptions.delimiter,
  } = options;

  if (tokens) {
    const [startDelimiter, endDelimiter] = (() => {
      if (delimiter.length === 1) {
        return [delimiter, delimiter];
      } else if (delimiter.length >= 2) {
        return delimiter.split("");
      } else {
        throw new Error(
          "Delimiter must be a single character or a string of two characters",
        );
      }
    })();

    return Object.entries(tokens).reduce(
      (prev, [key, value]: [string, Stringifiable]) => {
        // replace `<${key}>` to value
        return prev.replaceAll(
          `${startDelimiter}${useUpperCaseKey ? key.toUpperCase() : key}${endDelimiter}`,
          value.toString(),
        );
      },
      pattern,
    );
  }

  return pattern;
}
