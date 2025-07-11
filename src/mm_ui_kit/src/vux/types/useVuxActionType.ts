import { VuxStatus, isVuxStatus } from "./useVuxStatusType";

export type VuxActionList = {
  style?: string;
  [key: string]: VuxAction | string | undefined;
};

export type VuxAction = {
  audience?: string;
  status?: VuxStatus;
  style?: string | VuxActionStyle;
};

export function isActionStyle(
  value: string | VuxActionStyle | unknown,
): value is VuxActionStyle {
  return (
    typeof value === "object" &&
    value !== null &&
    "icon" in value &&
    "variant" in value &&
    typeof value.icon === "string" &&
    typeof value.variant === "string"
  );
}

export function isVuxAction(value: unknown): value is VuxAction {
  return (
    typeof value === "object" &&
    value !== null &&
    (!("audience" in value) || typeof value.audience === "string") &&
    (!("status" in value) ||
      value.status === undefined ||
      isVuxStatus(value.status)) &&
    (!("style" in value) ||
      value.style === undefined ||
      typeof value.style === "string" ||
      isActionStyle(value.style))
  );
}

export function getVuxActionsFromList(
  actionList: VuxActionList,
): Record<string, VuxAction> {
  const result: Record<string, VuxAction> = {};
  for (const key in actionList) {
    const value = actionList[key];
    if (isVuxAction(value)) {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Represents the style configuration for a VUX action.
 */

export type VuxActionStyle = {
  /**
   * The icon associated with the action. (Required)
   */
  icon: string;

  /**
   * The variant of the action style. (Required)
   */
  variant: string;
};
