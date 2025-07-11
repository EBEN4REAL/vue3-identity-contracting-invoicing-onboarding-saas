import { typeValidationError } from "./useTypeValidationErrorHandling";
import { asVuxComplexProperty } from "./useVuxComplexPropertyType";
import { VuxMetadata } from "./useVuxMetadataType";
import { VuxPrimitiveValue } from "./useVuxModelType";
import { VuxProperty, VuxPropertyLayout } from "./useVuxPropertyType";

/**
 * Represents the input modes available for VUX properties.
 */

export enum InputMode {
  TEXT = "text",
  EMAIL = "email",
  SEARCH = "search",
  TEL = "tel",
  URL = "url",
  NONE = "none",
  NUMERIC = "numeric",
  DECIMAL = "decimal",
  TEXTAREA = "textarea",
  READONLY = "readonly",
  SECRET = "secret",
  CHECKBOX = "checkbox",
  TOGGLE = "toggle",
  DATE = "date",
  TIME = "time",
  DATETIME = "datetime",
}
/**
 * Checks if the provided property is a VuxInputProperty.
 */

export function isVuxInputProperty(
  property: object,
): property is VuxInputProperty {
  return hasTypeProperty(
    property,
    "vux-input-property",
    "vux-options-property",
  );
}

export function hasTypeProperty(property: object, ...types: string[]): boolean {
  return (
    typeof property === "object" &&
    property !== null &&
    "type" in property &&
    types.includes(property.type as string)
  );
}
/**
 * Ensures the provided property is a VuxInputProperty.
 * Throws an error if the check fails.
 */

export function asVuxInputProperty(
  vuxMetadata: VuxMetadata | VuxProperty,
  dataFieldName?: string,
): VuxInputProperty {
  if (dataFieldName) {
    const complexField = asVuxComplexProperty(vuxMetadata);
    if (!(dataFieldName in complexField)) {
      throw typeValidationError("VuxInputProperty", vuxMetadata, dataFieldName);
    }
    const metadata = complexField[dataFieldName] as object;
    if (isVuxInputProperty(metadata)) {
      return metadata;
    } else {
      throw typeValidationError("VuxInputProperty", vuxMetadata, dataFieldName);
    }
  } else if (isVuxInputProperty(vuxMetadata)) {
    return vuxMetadata;
  } else {
    throw typeValidationError("VuxInputProperty", vuxMetadata);
  }
}
/**
 * Represents a base input property in the VUX framework.
 */

export type VuxInputProperty = VuxProperty & {
  /**
   * The type of the input property. (Required)
   */
  type: "vux-input-property" | "vux-options-property";
  default?: VuxPrimitiveValue;

  /**
   * The resource key associated with the input property. (Optional)
   */
  resourceKey?: string;

  /**
   * The input mode of the property. (Required)
   */
  inputMode: InputMode;

  /**
   * The layout configuration for the input property. (Optional)
   */
  layout?: VuxInputPropertyLayout;

  /**
   * The validation rules for the input property. (Optional)
   */
  validations?: VuxInputPropertyValidation;
};
/**
 * Represents the layout configuration for an input property.
 */

export type VuxInputPropertyLayout = VuxPropertyLayout & {
  /**
   * Placeholder property to satisfy linting rules. (Optional)
   */
  placeholder?: true;
};
/**
 * Represents validation rules for an input property.
 */

export type VuxInputPropertyValidation = {
  /**
   * Whether the property is required. (Optional)
   */
  required?: boolean;
};
// Text Input Property
/**
 * Checks if the provided property is a VuxTextInputProperty.
 */

export function isVuxTextInputProperty(
  property: VuxInputProperty,
): property is VuxTextInputProperty {
  return (
    isVuxInputProperty(property) &&
    (property.inputMode === InputMode.TEXT ||
      property.inputMode === null ||
      property.inputMode === undefined)
  );
}
/**
 * Ensures the provided property is a VuxTextInputProperty.
 * Throws an error if the check fails.
 */

export function asVuxTextInputProperty(
  property: VuxInputProperty,
): VuxTextInputProperty {
  if (!isVuxTextInputProperty(property)) {
    throw new Error("Property is not a VuxTextInputProperty");
  }
  return property;
}
/**
 * Represents a text input property in the VUX framework.
 */

export type VuxTextInputProperty = VuxInputProperty & {
  /**
   * The input mode for text input. (Required)
   */
  inputMode: InputMode.TEXT;

  default?: string;

  /**
   * The validation rules for the text input property. (Required)
   */
  validations: VuxTextInputPropertyValidation;

  /**
   * The layout configuration for the text input property. (Optional)
   */
  layout?: VuxTextInputPropertyLayout;
};
/**
 * Represents the layout configuration for a text input property.
 */

export type VuxTextInputPropertyLayout = VuxInputPropertyLayout & {
  /**
   * The text alignment for the input property. (Optional)
   */
  textAlignment?: "left" | "center" | "right";
};
/**
 * Represents validation rules for a text input property.
 */

export type VuxTextInputPropertyValidation = VuxInputPropertyValidation & {
  /**
   * The maximum length of the input. (Optional)
   */
  maxlength?: number;

  /**
   * The minimum length of the input. (Optional)
   */
  minlength?: number;

  /**
   * A regex pattern for validating the input. (Optional)
   */
  pattern?: RegExp | string;

  /**
   * Whether the input should be validated as an email. (Optional)
   */
  email?: boolean;
};
// Text Area Input Property
/**
 * Checks if the provided property is a VuxTextAreaInputProperty.
 */

export function isVuxTextAreaInputProperty(
  property: VuxInputProperty,
): property is VuxTextAreaInputProperty {
  return property.inputMode === InputMode.TEXTAREA;
}

export function isVuxTextAreaInputValue(
  property: VuxInputProperty,
  value: unknown,
): property is VuxTextAreaInputProperty & { value: string } {
  return isVuxTextAreaInputProperty(property) && typeof value === "string";
}

/**
 * Ensures the provided property is a VuxTextAreaInputProperty.
 * Throws an error if the check fails.
 */

export function asVuxTextAreaInputProperty(
  property: VuxInputProperty,
): VuxTextAreaInputProperty {
  if (!isVuxTextAreaInputProperty(property)) {
    throw new Error("Property is not a VuxTextAreaInputProperty");
  }
  return property;
}
/**
 * Represents a text area input property in the VUX framework.
 */

export type VuxTextAreaInputProperty = VuxTextInputProperty & {
  /**
   * The input mode for text area input. (Required)
   */
  inputMode: InputMode.TEXTAREA;

  /**
   * The number of rows in the text area. (Optional)
   */
  textareaRows?: number;
};
/**
 * Represents the layout configuration for a text area input property.
 */

export type VuxTextAreaInputPropertyLayout = VuxTextInputPropertyLayout & {
  /**
   * Whether the text area is resizable. (Optional)
   */
  resizable?: boolean;
};
// Additional Derived Types (URL, Email, Numeric, etc.)
/**
 * Checks if the provided property is a VuxUrlInputProperty.
 */

export function isVuxUrlInputProperty(
  property: VuxInputProperty,
): property is VuxUrlInputProperty {
  return property.inputMode === InputMode.URL;
}

export function isVuxUrlInputValue(
  property: VuxInputProperty,
  value: unknown,
): property is VuxUrlInputProperty & { value: string } {
  return isVuxUrlInputProperty(property) && typeof value === "string";
}
/**
 * Ensures the provided property is a VuxUrlInputProperty.
 * Throws an error if the check fails.
 */

export function asVuxUrlInputProperty(
  property: VuxInputProperty,
): VuxUrlInputProperty {
  if (!isVuxUrlInputProperty(property)) {
    throw typeValidationError("isVuxUrlInputProperty", property);
  }
  return property;
}
/**
 * Represents a URL input property in the VUX framework.
 */

export type VuxUrlInputProperty = VuxTextInputProperty & {
  /**
   * The input mode for URL input. (Required)
   */
  inputMode: InputMode.URL;
};
/**
 * Checks if the provided property is a VuxEmailInputProperty.
 */

export function isVuxEmailInputProperty(
  property: VuxInputProperty,
): property is VuxEmailInputProperty {
  return property.inputMode === InputMode.EMAIL;
}

export function isVuxEmailInputValue(
  property: VuxInputProperty,
  value: unknown,
): property is VuxEmailInputProperty & { value: string } {
  return isVuxEmailInputProperty(property) && typeof value === "string";
}

/**
 * Ensures the provided property is a VuxEmailInputProperty.
 * Throws an error if the check fails.
 */

export function asVuxEmailInputProperty(
  property: VuxInputProperty,
): VuxEmailInputProperty {
  if (!isVuxEmailInputProperty(property)) {
    throw typeValidationError("VuxEmailInputProperty", property);
  }
  return property;
}
/**
 * Represents an email input property in the VUX framework.
 */

export type VuxEmailInputProperty = VuxTextInputProperty & {
  /**
   * The input mode for email input. (Required)
   */
  inputMode: InputMode.EMAIL;
};
/**
 * Checks if the provided property is a VuxNumericInputProperty.
 */

export function isVuxNumericInputProperty(
  property: VuxInputProperty,
): property is VuxNumericInputProperty {
  return property.inputMode === InputMode.NUMERIC;
}

export function isVuxNumericInputValue(
  property: VuxInputProperty,
  value: unknown,
): property is VuxNumericInputProperty & { value: number } {
  return isVuxNumericInputProperty(property) && typeof value === "number";
}

/**
 * Ensures the provided property is a VuxNumericInputProperty.
 * Throws an error if the check fails.
 */

export function asVuxNumericInputProperty(
  property: VuxInputProperty,
): VuxNumericInputProperty {
  if (!isVuxNumericInputProperty(property)) {
    throw typeValidationError("VuxInputProperty", property);
  }
  return property;
}
/**
 * Represents a numeric input property in the VUX framework.
 */

export type VuxNumericInputProperty = VuxTextInputProperty & {
  /**
   * The input mode for numeric input. (Required)
   */
  inputMode: InputMode.NUMERIC;
};
/**
 * Checks if the provided property is a VuxDecimalInputProperty.
 */

export function isVuxDecimalInputProperty(
  property: VuxInputProperty,
): property is VuxDecimalInputProperty {
  return property.inputMode === InputMode.DECIMAL;
}

export function isVuxDecimalInputValue(
  property: VuxInputProperty,
  value: unknown,
): property is VuxDecimalInputProperty & { value: number } {
  return isVuxDecimalInputProperty(property) && typeof value === "number";
}

/**
 * Ensures the provided property is a VuxDecimalInputProperty.
 * Throws an error if the check fails.
 */

export function asVuxDecimalInputProperty(
  property: VuxInputProperty,
): VuxDecimalInputProperty {
  if (!isVuxDecimalInputProperty(property)) {
    throw new Error("Property is not a VuxDecimalInputProperty");
  }
  return property;
}
/**
 * Represents a decimal input property in the VUX framework.
 */

export type VuxDecimalInputProperty = VuxTextInputProperty & {
  /**
   * The input mode for decimal input. (Required)
   */
  inputMode: InputMode.DECIMAL;

  default?: number;
};
/**
 * Checks if the provided property is a VuxReadonlyInputProperty.
 */

export function isVuxReadonlyInputProperty(
  property: VuxInputProperty,
): property is VuxReadonlyInputProperty {
  return property.inputMode === InputMode.READONLY;
}

/**
 * Ensures the provided property is a VuxReadonlyInputProperty.
 * Throws an error if the check fails.
 */

export function asVuxReadonlyInputProperty(
  property: VuxInputProperty,
): VuxReadonlyInputProperty {
  if (!isVuxReadonlyInputProperty(property)) {
    throw new Error("Property is not a VuxReadonlyInputProperty");
  }
  return property;
}
/**
 * Represents a readonly input property in the VUX framework.
 */

export type VuxReadonlyInputProperty = VuxTextInputProperty & {
  /**
   * The input mode for readonly input. (Required)
   */
  inputMode: InputMode.READONLY;
};
