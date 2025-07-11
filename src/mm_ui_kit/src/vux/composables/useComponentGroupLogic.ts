import { computed, ComputedRef, ModelRef, ref, watch } from "vue";
import { VuxProperty, isVuxProperty } from "../types/useVuxPropertyType";
import { VuxMetadata, asVuxMetadata } from "../types/useVuxMetadataType";
import {
  VuxExposedMethods,
  VuxTemplateComponentEmits,
  VuxTemplateComponentProps,
} from "../types/vuxTemplateComponent";
import { VuxTemplateComponentLogic } from "../types/vuxTemplateComponentLogic";
import { VuxModel, asVuxModel } from "../types/useVuxModelType";
import { VuxAction } from "../types/useVuxActionType";

export function useComponentGroupLogic(
  props: VuxTemplateComponentProps,
  emit: VuxTemplateComponentEmits,
  model: ModelRef<VuxModel | undefined>,
): VuxTemplateComponentLogic {
  const strategyName = "useComponentGroupStrategy";
  const propertyValidationStates = ref<Record<string, boolean>>({});
  const propertyComponents = ref<Record<string, VuxExposedMethods>>({});
  const registerPropertyComponent = (
    el: VuxExposedMethods,
    property: string,
  ) => {
    if (el) propertyComponents.value[property] = el;
  };

  const handlePropertyValidationChange = (
    property: string,
    isValid: boolean,
  ) => {
    propertyValidationStates.value[property] = isValid;
  };

  const isValid = computed(() => {
    return !Object.values(propertyValidationStates.value).includes(false);
  });

  watch(isValid, (newValidState) => {
    emit("validation-changed", newValidState);
  });

  const handleVuxAction = (
    name: string,
    action: VuxAction,
    modelData: VuxModel,
  ) => {
    emit("vux-action", name, action, modelData);
  };

  const validate = async (): Promise<boolean> => {
    const validationPromises: Promise<boolean>[] = [];
    Object.entries(propertyComponents.value).forEach(([, component]) => {
      validationPromises.push(component.validate());
    });

    await Promise.all(validationPromises);
    return isValid.value;
  };

  const save = async (): Promise<void> => {
    console.error(
      `Error saving form data for component type: ${props.metaData.type}, field: ${props.dataFieldName}`,
    );
    throw new Error(
      `Failed to save the form for component type: ${props.metaData.type}, field: ${props.dataFieldName}`,
    );
  };

  const edit = (): void => {
    console.error(
      `Error editing component type: ${props.metaData.type}, field: ${props.dataFieldName}`,
    );
    throw new Error(
      `Failed to edit the form for component type: ${props.metaData.type}, field: ${props.dataFieldName}`,
    );
  };

  const groupModel: ComputedRef<VuxModel> = computed(() =>
    asVuxModel(model.value, props.dataFieldName),
  );

  const groupMetadata: ComputedRef<VuxMetadata> = computed(() =>
    asVuxMetadata(props.metaData, props.dataFieldName),
  );

  const groupProperties: ComputedRef<Record<string, VuxProperty>> = computed(
    () => {
      const result: Record<string, VuxProperty> = {};
      Object.entries(groupMetadata.value).forEach(
        ([propertyName, propertyMetadata]) => {
          if (isVuxProperty(propertyMetadata)) {
            const propertyValue = propertyMetadata;
            if (!propertyValue.resourceKey) {
              propertyValue.resourceKey = `${props.resourceKey}.${propertyName}`;
            }
            result[propertyName] = propertyValue;
          }
        },
      );
      return result;
    },
  );

  return {
    strategyName,
    groupModel,
    groupMetadata,
    groupProperties,
    handlePropertyValidationChange,
    isValid,
    handleVuxAction,
    validate,
    save,
    edit,
    registerPropertyComponent,
  };
}
