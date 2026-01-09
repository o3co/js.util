export type ReplaceTokensOptions = {
  useUpperCaseKey: boolean;
};

export function replaceTokens(
  pattern: string,
  tokens: Object,
  options: ReplaceTokensOptions = { useUpperCaseKey: false },
): string {
  const { useUpperCaseKey } = options;

  if (tokens) {
    return Object.entries(tokens).reduce((prev, [key, value]) => {
      // replace `<${key}>` to value
      return prev.replaceAll(
        `<${useUpperCaseKey ? key.toUpperCase() : key.toString()}>`,
        value.toString(),
      );
    }, pattern);
  }

  return pattern;
}
