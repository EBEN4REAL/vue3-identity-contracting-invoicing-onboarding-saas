/**
 * Escapes HTML-sensitive characters in the string values of an object.
 *
 * @param params - An object where all values are strings to be HTML-escaped.
 * @returns A new object with the same keys, but HTML-escaped string values.
 */
type ObjectWithStrings = Record<string, string>;
const escapeHtml = (str: string): string =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/`/g, "&#96;")
    .replace(/\//g, "&#47;");

export default function escapeObjectValuesForHtml(
  params: ObjectWithStrings,
): ObjectWithStrings {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => [
      key,
      escapeHtml(value || ""),
    ]),
  );
}
