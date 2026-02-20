export const cleanup = (obj: object) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => (v ?? null) !== null),
  );
};
