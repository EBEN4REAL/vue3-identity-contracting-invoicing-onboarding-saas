export const groupByField = <T>(
  items: T[],
  field: keyof T,
): Record<string, T[]> => {
  return items.reduce(
    (acc, item) => {
      const key = String(item[field]);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    },
    {} as Record<string, T[]>,
  );
};
