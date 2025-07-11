import { watchEffect, isRef, ref, Ref } from "vue";
import { UxBehavior } from "~/service-providers/ConfigurationTabs/Policies/policies.types";
import { toRaw } from "vue";

export const useCategoryConfig = (config: UxBehavior | Ref<UxBehavior>) => {
  const fieldConfig = ref({});

  watchEffect(() => {
    const configMap = {};
    const configValue = isRef(config) ? config.value : config;
    configValue.forEach((item) => {
      configMap[item.entity] = item;
    });
    fieldConfig.value = configMap;
  });

  const isFieldVisible = (fieldName: string): boolean => {
    const rawFieldConfig = toRaw(fieldConfig.value);
    return rawFieldConfig[fieldName]?.show ?? true;
  };

  const isFieldEditable = (fieldName: string): boolean => {
    const rawFieldConfig = toRaw(fieldConfig.value);
    return rawFieldConfig[fieldName]?.editable ?? true;
  };

  const getLabel = (fieldName: string): string => {
    const rawFieldConfig = toRaw(fieldConfig.value);
    return rawFieldConfig[fieldName]?.label;
  };

  const getPlaceholder = (fieldName: string): string => {
    const rawFieldConfig = toRaw(fieldConfig.value);
    return rawFieldConfig[fieldName]?.input_placeholder;
  };

  const getDefaultValue = (fieldName: string): string => {
    const rawFieldConfig = toRaw(fieldConfig.value);
    return rawFieldConfig[fieldName]?.default_value;
  };

  return {
    isFieldVisible,
    isFieldEditable,
    getLabel,
    getDefaultValue,
    getPlaceholder,
  };
};
