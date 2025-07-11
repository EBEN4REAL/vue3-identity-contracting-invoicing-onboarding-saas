export const interpolateString = (
  template: string,
  values: Record<string, string | number>,
): string => {
  return template.replace(/{{(.*?):(.*?)}}/g, (_, key, type) => {
    key = key.trim();
    type = type.trim();

    const isNumber =
      type === "number" &&
      typeof values[key] === "number" &&
      !isNaN(values[key]);

    if (isNumber) {
      return String(values[key]);
    }

    return ""; // Return empty string for mismatched types or missing values
  });
};
