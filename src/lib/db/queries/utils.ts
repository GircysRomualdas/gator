export function firstOrUndefined<T>(items: T[]): T | undefined {
  return items.length > 0 ? items[0] : undefined;
}
