// strategies/useComponentListStrategy.ts
import { computed, ComputedRef, ModelRef } from "vue";
import { VuxAction } from "../types/useVuxActionType";
import { VuxProperty } from "../types/useVuxPropertyType";
import {
  asVuxComplexProperty,
  VuxComplexProperty,
} from "../types/useVuxComplexPropertyType";
import { VuxMetadata } from "../types/useVuxMetadataType";
import { useComponentGroupLogic } from "./useComponentGroupLogic";
import {
  VuxModel,
  VuxComplexModel,
  asVuxListModel,
} from "../types/useVuxModelType";

import {
  VuxTemplateComponentEmits,
  VuxTemplateComponentProps,
} from "../types/vuxTemplateComponent";
import { VuxTemplateComponentLogic } from "../types/vuxTemplateComponentLogic";

export function useComponentListLogic(
  props: VuxTemplateComponentProps,
  emit: VuxTemplateComponentEmits,
  model: ModelRef<VuxModel | undefined>,
): VuxTemplateComponentLogic {
  const strategyName = "useComponentListStrategy";

  const baseStrategy = useComponentGroupLogic(props, emit, model);

  const newAction: VuxAction = {
    style: "create",
    audience: props.resourceKey,
  };

  const groupModel: ComputedRef<VuxComplexModel> = computed(() => {
    const transposedGroupModel: VuxModel = {};
    const values = asVuxListModel(baseStrategy.groupModel.value);

    for (let i = 0; i < values.length; i++) {
      const value = values[i]; // 👈 Vue tracks reactive access by index
      const key = getKey(i, value);
      transposedGroupModel[key] = value;
    }
    return transposedGroupModel;
  });

  const groupMetadata: ComputedRef<VuxMetadata> = computed(() => {
    // Initialize the group metadata object
    const metadata: VuxComplexProperty = {
      type: "vux-component-group",
      layout: { orientation: "vertical", visualSeparation: false },
      actions: {
        style: "sideBySide",
        new: newAction,
      },
    };

    // Iterate over groupProperties and assign each to the nested metadata
    Object.entries(groupProperties.value).forEach(([key, propertyMetadata]) => {
      metadata[key] = propertyMetadata;
    });
    return metadata;
  });

  // Define the getKey function
  function getKey(index: number): string {
    // Implement your logic to generate a key based on index and value
    return `key_${index}`; // Example implementation
  }

  const propertyOrientation: ComputedRef<string> = computed(
    () =>
      asVuxComplexProperty(baseStrategy.groupMetadata.value).layout
        ?.orientation || "horizontal",
  );

  const propertyVisualSeparation: ComputedRef<boolean> = computed(
    () =>
      asVuxComplexProperty(baseStrategy.groupMetadata.value).layout
        ?.visualSeparation || false,
  );

  // Compute groupProperties
  const groupProperties: ComputedRef<{ [key: string]: VuxProperty }> = computed(
    () => {
      console.info(
        "Base Strategy Group Metadata:",
        baseStrategy.groupMetadata.value,
      );
      console.info(
        "Orientation from Base Strategy:",
        asVuxComplexProperty(baseStrategy.groupMetadata.value).layout
          ?.orientation,
      );
      console.info("Computed Property Orientation:", propertyOrientation.value);

      const properties: { [key: string]: VuxComplexProperty } = {};

      const grouped = groupModel.value;

      for (const [key, _] of Object.entries(grouped)) {
        properties[key] = {
          type: "vux-component-group",
          layout: {
            orientation: propertyOrientation.value,
            visualSeparation: propertyVisualSeparation.value,
          },
          resourceKey: props.resourceKey,
          actions: {
            style: "sideBySide",
            delete: {
              audience: props.resourceKey,
            },
          },
          ...baseStrategy.groupProperties.value,
        };

        /*properties[key].actions.delete.status = useVuxStatus(
          getVuxModelData(groupModel.value, key),
          properties[key],
        );*/
      }
      return properties;
    },
  );

  function handleDeleteAction(actionModel: VuxModel) {
    const values = baseStrategy.groupModel.value as VuxModel[];

    const index = values.findIndex((item) => item === actionModel);
    if (index === -1) {
      throw new Error(
        `Could not find matching row to delete for field '${props.dataFieldName}' with data '${JSON.stringify(
          actionModel,
        )}'`,
      );
    }
    values.splice(index, 1);
    emit("update:modelData", groupModel.value);
  }

  function handleNewAction() {
    const values = baseStrategy.groupModel.value as VuxModel[];
    values.push({
      status: "new",
    });
    emit("update:modelData", groupModel.value);
  }

  const handleVuxAction = (
    actionName: string,
    actionMetadata: VuxAction,
    actionModel: VuxModel,
  ) => {
    if (actionMetadata.audience !== props.resourceKey) {
      baseStrategy.handleVuxAction?.(actionName, actionMetadata, actionModel);
      return;
    }

    if (actionName === "delete") {
      handleDeleteAction(actionModel);
    } else if (actionName === "new") {
      handleNewAction();
    } else {
      throw new Error(
        `Unhandled action '${actionName}' on field '${props.dataFieldName}' for audience '${actionMetadata.audience}'`,
      );
    }
  };

  return {
    ...baseStrategy,
    strategyName,
    groupProperties,
    groupMetadata,
    groupModel,
    handleVuxAction,
  };
}
