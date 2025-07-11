import { computed, ComputedRef, ref, watch } from "vue";
import type { ValidationRule, ValidationRuleWithParams } from "@vuelidate/core";
import { useVuelidate } from "@vuelidate/core";
import * as baseValidators from "@vuelidate/validators";
import { helpers } from "@vuelidate/validators";
import { useTranslationResolver } from "./useVuxTranslationResolver";
import {
  InputMode,
  asVuxInputProperty,
} from "../types/useVuxInputPropertyType";
import { VuxTemplateComponentProps } from "../types/vuxTemplateComponent";

export function useFieldValidation(
  props: VuxTemplateComponentProps,
  fieldValue,
) {
  const { resolveTranslation } = useTranslationResolver();

  // Get field configuration
  const fieldConfig = computed(() => {
    const config = asVuxInputProperty(props.metaData, props.dataFieldName);
    if (!config) {
      throw new Error(
        `Field configuration not found for data field: "${props.dataFieldName}"`,
      );
    }
    return config;
  });

  // Track validation state
  const isValid = ref(true);
  const errors = ref<{ $validator: string; $message: string }[]>([]);

  // Create a validator with custom message from translations
  const createCustomValidator = (validator, validationType) => {
    return helpers.withMessage(() => {
      const translationKey = `${props.resourceKey}.validations.${validationType}`;
      return resolveTranslation(translationKey);
    }, validator);
  };

  // Setup vuelidate rules
  const rules: ComputedRef<{
    value: Record<string, ValidationRule | ValidationRuleWithParams>;
  }> = computed(() => {
    const result: Record<string, ValidationRule | ValidationRuleWithParams> =
      {};

    if (
      fieldConfig.value.validations &&
      Object.keys(fieldConfig.value.validations).length > 0
    ) {
      Object.entries(fieldConfig.value.validations).forEach(([key, value]) => {
        let validator = null;
        switch (key) {
          case "required":
            if (value) {
              if (
                fieldConfig.value.inputMode === InputMode.CHECKBOX ||
                fieldConfig.value.inputMode === InputMode.TOGGLE
              ) {
                validator = baseValidators.sameAs(true);
              } else {
                validator = baseValidators.required;
              }
            }
            break;
          case "minoptions":
            validator = baseValidators.minLength(value as number);
            break;
          case "maxoptions":
            validator = baseValidators.maxLength(value as number);
            break;
          case "maxlength":
            validator = baseValidators.maxLength(value as number);
            break;
          case "minlength":
            validator = baseValidators.minLength(value as number);
            break;
          case "email":
            validator = value ? baseValidators.email : null;
            break;
          case "numeric":
            validator = value ? baseValidators.numeric : null;
            break;
          case "url":
            validator = value ? baseValidators.url : null;
            break;
        }

        if (validator) {
          result[key] = createCustomValidator(validator, key);
        }
      });
    }

    return { value: result };
  });

  // Create a reactive object for vuelidate to validate
  const valueToValidate = computed(() => ({ value: fieldValue.value }));

  // Setup vuelidate
  const v$ = useVuelidate(rules, valueToValidate);

  // Validate the field
  const validateField = async () => {
    // Skip validation if no validation rules
    if (
      !fieldConfig.value.validations ||
      Object.keys(fieldConfig.value.validations).length === 0
    ) {
      isValid.value = true;
      errors.value = [];
      return true;
    }

    // Run vuelidate validation
    await v$.value.$validate();

    // Update validation state
    isValid.value = !v$.value.$invalid;

    // Format errors for MMInput
    errors.value = v$.value.$errors.map((error) => ({
      $validator: error.$validator,
      $message: error.$message,
    }));

    return isValid.value;
  };

  // Reset validation state
  const resetValidation = () => {
    v$.value.$reset();
    isValid.value = true;
    errors.value = [];
  };

  // Touch field to trigger validation
  const touchField = async () => {
    v$.value.$touch();
    await validateField();
  };

  // Required state computed property
  const required = computed(
    () =>
      fieldConfig.value.validations &&
      fieldConfig.value.validations.required === true,
  );

  // Disabled state computed property
  const disabled = computed(() => !!fieldConfig.value.disabled);

  // Reset validation when mode changes
  watch(
    () => props.mode,
    () => {
      resetValidation();
    },
  );

  // Return validation utilities
  return {
    isValid,
    validateField,
    resetValidation,
    touchField,
    errors,
    required,
    disabled,
  };
}
