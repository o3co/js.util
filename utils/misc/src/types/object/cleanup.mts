export function cleanup<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v != null),
  ) as Partial<T>;
}
