import { typeValidationError } from "./useTypeValidationErrorHandling";

export type VuxPrimitiveValue = string | number | boolean | null;

export type VuxInputModel = VuxPrimitiveValue;

export type VuxComplexModel = {
  [propertyKey: string]: VuxModel;
};

export type VuxListModel = VuxModel[];

export type VuxModel = VuxInputModel | VuxComplexModel | VuxListModel;

// Utility functions for VuxInputPropertyModel

/**
 * Checks if the provided model is a VuxInputPropertyModel.
 */
export function isVuxInputModel(model: unknown): model is VuxInputModel {
  return (
    typeof model === "string" ||
    typeof model === "number" ||
    typeof model === "boolean" ||
    model === null
  );
}

/**
 * Ensures the provided model is a VuxInputPropertyModel.
 * Throws an error if the check fails.
 */
export function asVuxInputModel(
  model: unknown,
  fieldName?: string,
): VuxInputModel {
  if (fieldName) {
    model = asVuxModel(model, fieldName);
  }

  if (isVuxInputModel(model)) {
    return model;
  }
  throw typeValidationError("VuxInputPropertyModel", model, fieldName);
}

// Utility functions for VuxComplexPropertyModel

/**
 * Checks if the provided model is a VuxComplexPropertyModel.
 */
export function isVuxComplexModel(model: unknown): model is VuxComplexModel {
  return (
    typeof model === "object" &&
    model !== null &&
    !Array.isArray(model) &&
    Object.values(model).every(
      (value) =>
        isVuxInputModel(value) ||
        isVuxComplexModel(value) ||
        isVuxListModel(value),
    )
  );
}

/**
 * Ensures the provided model is a VuxComplexPropertyModel.
 * Throws an error if the check fails.
 */
export function asVuxComplexModel(model: unknown): VuxComplexModel {
  if (isVuxComplexModel(model)) {
    return model;
  }
  throw typeValidationError("VuxComplexPropertyModel", model);
}

// Utility functions for VuxModelArray

/**
 * Checks if the provided model is a VuxModelArray.
 */
export function isVuxListModel(model: unknown): model is VuxListModel {
  return Array.isArray(model) && model.every((item) => isVuxModel(item));
}

/**
 * Ensures the provided model is a VuxModelArray.
 * Throws an error if the check fails.
 */
export function asVuxListModel(model: VuxModel): VuxModel[] {
  if (isVuxListModel(model)) {
    return model;
  }
  throw typeValidationError("VuxModelArray", model);
}

// Utility function for generic VuxModelData

/**
 * Ensures the provided model is a VuxModelData.
 * Throws an error if the check fails.
 * @param model - The model to validate.
 * @param fieldName - The name of the field being validated (optional).
 */
export function asVuxModel(model: unknown, fieldName?: string): VuxModel {
  if (!isVuxModel(model, fieldName)) {
    throw typeValidationError("VuxModelData", model, fieldName);
  }
  return fieldName
    ? (model as VuxComplexModel)[fieldName]
    : (model as VuxModel);
}

/**
 * Checks if the provided model is a VuxModelData.
 * @param model - The model to validate.
 * @param fieldName - The name of the field being validated (optional).
 */
export function isVuxModel(model: unknown, fieldName?: string): boolean {
  if (fieldName) {
    return (
      isVuxComplexModel(model) &&
      isVuxModel((model as VuxComplexModel)[fieldName])
    );
  }
  return (
    isVuxInputModel(model) || isVuxComplexModel(model) || isVuxListModel(model)
  );
}

// OptionValue and OptionsData

/**
 * Represents an option value in the VUX framework.
 */
export type OptionValue = VuxComplexModel & {
  selected: boolean;
  disabled: boolean;
};

/**
 * Checks if the provided model is an OptionValue.
 */
export function isOptionValue(model: unknown): model is OptionValue {
  return (
    isVuxComplexModel(model) &&
    typeof model.selected === "boolean" &&
    typeof model.disabled === "boolean"
  );
}

/**
 * Ensures the provided model is an OptionValue.
 * Throws an error if the check fails.
 */
export function asOptionValue(model: unknown): OptionValue {
  if (isOptionValue(model)) {
    return model;
  }
  throw typeValidationError("OptionValue", model);
}

/**
 * Represents options data in the VUX framework.
 */
export type OptionsData = VuxComplexModel & {
  [optionKey: string]: OptionValue;
};

/**
 * Checks if the provided model is OptionsData.
 */
export function isOptionsData(model: unknown): model is OptionsData {
  return isVuxComplexModel(model) && Object.values(model).every(isOptionValue);
}

/**
 * Ensures the provided model is OptionsData.
 * Throws an error if the check fails.
 */
export function asOptionsData(model: unknown): OptionsData {
  if (isOptionsData(model)) {
    return model;
  }
  throw typeValidationError("OptionsData", model);
}
