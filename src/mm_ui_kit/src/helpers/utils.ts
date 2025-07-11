import { Ref } from "vue";
import { OnboardingFormData } from "~/onboarding/onboarding.types";

export const labelToKebabCase = (label: string) =>
  label.toLowerCase().replace(/\s/g, "-");

export const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const isColorDark = (selectedColor: string) => {
  const rgb = parseInt(selectedColor.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
};

//button default colours
export const BUTTON_DEFAULT_COLOURS = {
  BACKGROUND_COLOUR: "#072e51",
  TEXT_COLOUR: "white",
};

//SVG Dimensions
export const SVG_DIMENSIONS = {
  WIDTH: window.innerWidth < 600 ? "70px" : "226px",
  HEIGHT: window.innerWidth < 600 ? "70px" : "268px",
};

export const handleResize = (svgWidth: Ref<string>, svgHeight: Ref<string>) => {
  svgWidth.value = window.innerWidth < 600 ? "70px" : "226px";
  svgHeight.value = window.innerWidth < 600 ? "70px" : "268px";
};

export const handleSortAscDescToggle = (sort: string) => {
  if (sort == "asc") {
    return "desc";
  }
  if (sort == "desc") {
    return "asc";
  }
  return "asc";
};

export const currencyDisplaySymbol = (currency: string) => {
  switch (currency) {
    case "USD":
      return "$";
    case "EUR":
      return "€";
    default:
      return currency;
  }
};

export const toCamelCase = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[_\s]+(.)?/g, (match, chr) => (chr ? chr.toUpperCase() : ""))
    .replace(/-/g, "");
};

export const toSnakeCase = (str: string): string => {
  return str
    .replace(/[A-Z]/g, (match) => `${match.toLowerCase()}`)
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/gi, "")
    .toLowerCase();
};

export const convertToSentenceCase = (input: string): string => {
  let spaced = input.replace(/([A-Z])/g, " $1");
  spaced = spaced.toLowerCase().trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

export const isValueFalsy = (str: unknown): boolean =>
  str === null ||
  str === undefined ||
  (typeof str === "string" && str.trim() === "");

export const filterEmptyPropertiesFromObject = <
  T extends Record<string, unknown>,
>(
  obj: T,
): Record<string, unknown> =>
  Object.entries(obj).reduce(
    (acc: Record<string, unknown>, [key, value]) => {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        const filtered = filterEmptyPropertiesFromObject(
          value as Record<string, unknown>,
        );
        if (Object.keys(filtered).length > 0) {
          acc[key] = filtered;
        }
      } else if (
        value !== null &&
        value !== undefined &&
        (typeof value !== "string" || value.trim() !== "")
      ) {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, unknown>,
  );

export const replaceInvalidValues = (
  obj: Record<string, unknown>,
): Record<string, unknown> => {
  for (const key in obj) {
    if (obj[key] === "" || obj[key] === "Invalid Date" || !obj[key]) {
      obj[key] = null;
    }
  }
  return obj;
};

export const pruneNonEditableAttributes = (
  attributesWithValues: Record<string, unknown>,
  formData: OnboardingFormData,
) => {
  // Collect non-editable attribute IDs
  const nonEditableIds = new Set(
    Object.values(formData)
      .filter((attr) => attr?.editable === false)
      .map((attr) => attr?.id),
  );

  // Re-build the object, skipping non-editable attributes IDs
  return Object.fromEntries(
    Object.entries(attributesWithValues).filter(
      ([id]) => !nonEditableIds.has(id),
    ),
  );
};

export const extractCurrencyAmount = (input: string): number | null => {
  if (!input) return null;
  let s = input.trim();
  const negative = /^\(.*\)$/.test(s);
  if (negative) s = s.slice(1, -1);

  // keep only digits / , / . / -
  s = s.replace(/[^\d.,-]/g, "");
  if (!/\d/.test(s)) return null;
  const dec = Math.max(s.lastIndexOf("."), s.lastIndexOf(","));
  const canonical =
    dec === -1
      ? s.replace(/[.,]/g, "")
      : s.slice(0, dec).replace(/[.,]/g, "") + "." + s.slice(dec + 1);

  const n = parseFloat(canonical);
  if (isNaN(n)) return null;

  return negative || /^-/.test(s) ? -n : n;
};
