import { ComputedRef } from "vue";

/**
 * Represents the status of a VUX property.
 */

export type VuxStatus = {
  /**
   * Whether the property is hidden. (Optional)
   */
  hidden?: ComputedRef<boolean> | boolean;

  /**
   * Whether the property is disabled. (Optional)
   */
  disabled?: ComputedRef<boolean> | boolean;

  /**
   * Whether the property is in a waiting state. (Optional)
   */
  waiting?: ComputedRef<boolean> | boolean;

  /**
   * Whether the property has been pressed on. (Optional)
   */
  pressed?: ComputedRef<boolean> | boolean;
};

/**
 * Checks if the input is a valid VuxStatus object.
 * At least one of the properties (hidden, disabled, waiting) must be specified.
 * Each specified property must be a boolean or a ComputedRef<boolean>.
 *
 * @param input - The input to check.
 * @returns True if the input is a valid VuxStatus object, otherwise false.
 */
export function isVuxStatus(input: unknown): input is VuxStatus {
  if (typeof input !== "object" || input === null) {
    return false;
  }

  const isValidProperty = (prop: unknown): boolean =>
    typeof prop === "boolean" ||
    (prop !== null &&
      typeof prop === "object" &&
      "value" in prop &&
      typeof (prop as { value: unknown }).value === "boolean");

  const hasValidHidden = "hidden" in input && isValidProperty(input.hidden);
  const hasValidDisabled =
    "disabled" in input && isValidProperty(input.disabled);
  const hasValidWaiting = "waiting" in input && isValidProperty(input.waiting);
  const hasValidPressed = "pressed" in input && isValidProperty(input.pressed);

  return (
    hasValidHidden || hasValidDisabled || hasValidWaiting || hasValidPressed
  );
}

/**
 * Converts an unknown input into a VuxStatus object if possible.
 * If the input is not a valid VuxStatus, it returns a default VuxStatus object.
 *
 * @param input - The input to convert.
 * @returns A VuxStatus object.
 */
export function asVuxStatus(input: unknown): VuxStatus {
  if (isVuxStatus(input)) {
    return input;
  }

  return {
    hidden: false,
    disabled: false,
    waiting: false,
  };
}
