export function arrayToObjectByKey<
  T extends Record<string, unknown>,
  K extends keyof T
>(array: (T | null | undefined)[], keyField: K) {
  return array.reduce((acc, item) => {
    if (item != null && item[keyField] != null) {
      acc[String(item[keyField])] = item;
    }
    return acc;
  }, {} as Record<string, T>);
}
