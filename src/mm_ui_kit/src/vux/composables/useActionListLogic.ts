import { computed, ModelRef, ComputedRef } from "vue";
import {
  VuxTemplateComponentEmits,
  VuxTemplateComponentProps,
} from "../types/vuxTemplateComponent";
import { VuxModel, asVuxModel } from "../types/useVuxModelType";

import { useTranslationResolver } from "../composables/useVuxTranslationResolver";
import { asVuxComplexProperty } from "../types/useVuxComplexPropertyType";
import {
  VuxAction,
  VuxActionStyle,
  isActionStyle,
  getVuxActionsFromList,
} from "../types/useVuxActionType";

export type VuxReactiveAction = {
  actionMetadata: VuxAction;
  name: string;
  label: string | null;
  tooltip: string | null;
  style: VuxActionStyle;
  isHidden: boolean;
  isDisabled: boolean;
  isWaiting: boolean;
  isPressed: boolean;
};

export function useActionListLogic(
  props: VuxTemplateComponentProps,
  emit: VuxTemplateComponentEmits,
  model: ModelRef<VuxModel | undefined>,
) {
  const { resolveTranslation } = useTranslationResolver();
  const actionsList = computed(() => complexPropertyMetadata.value.actions);
  const modelValue = computed(() =>
    asVuxModel(model.value, props.dataFieldName),
  );

  const complexPropertyMetadata = computed(() =>
    asVuxComplexProperty(props.metaData, props.dataFieldName),
  );

  const reactiveActions = computed(() => {
    if (!actionsList.value) return {} as Record<string, VuxReactiveAction>;

    return Object.entries(getVuxActionsFromList(actionsList.value)).reduce(
      (acc: Record<string, VuxReactiveAction>, [propertyName, action]) => {
        acc[propertyName] = {
          actionMetadata: action,
          name: propertyName,
          label: propertyName,
          tooltip: null,
          style: getActionStyle(propertyName, action),
          isHidden: isRefOrPrimitive(action?.status?.hidden),
          isDisabled: isRefOrPrimitive(action?.status?.disabled),
          isWaiting: isRefOrPrimitive(action?.status?.waiting),
          isPressed: isRefOrPrimitive(action?.status?.pressed),
        };

        acc[propertyName].label = resolveActionTranslation(
          acc[propertyName],
          "label",
        );
        acc[propertyName].tooltip = resolveActionTranslation(
          acc[propertyName],
          "tooltip",
          true,
        );

        return acc;
      },
      {} as Record<string, VuxReactiveAction>,
    );
  });

  /**
   * Helper function to normalize a value that could be a computed ref or a primitive.
   * If the value is a computed ref, it returns the ref's value.
   * If the value is a primitive, it returns the primitive directly.
   */
  function isRefOrPrimitive(
    value: boolean | ComputedRef<boolean> | undefined,
  ): boolean {
    return typeof value === "object" && "value" in value
      ? Boolean(value.value)
      : Boolean(value);
  }

  function getActionStyle(actionName: string, action: VuxAction) {
    // first get the action from metadata, if possible
    if (action.style) {
      if (isActionStyle(action.style)) {
        return action.style;
      } else if (action.style !== "") {
        return getActionStyleByStyleName(action.style);
      } else {
        throw new Error(`Unknown action style: ${action.style}`);
      }
    } else {
      const actionStyleName = getActionStyleByActionName(actionName);
      return getActionStyleByStyleName(actionStyleName);
    }
  }

  function getActionStyleByActionName(actionName: string) {
    switch (actionName) {
      case "deleteIcon":
      case "delete":
        return "delete";
      case "plusIcon":
      case "new":
      case "create":
      case "add":
        return "create";
      case "editIcon":
      case "edit":
        return "edit";
      case "discard":
        return "discard";
      case "save":
        return "save";
      case "read":
        return "read";
      case "disconnect":
        return "disconnect";
      case "publish":
        return "publish";
      case "reveal":
        return "reveal";
      case "hide":
        return "hide";
      case "copy":
        return "copy";
      default:
        return "default";
    }
  }

  function getActionStyleByStyleName(style: string): VuxActionStyle {
    switch (style) {
      case "delete":
        return {
          variant: "outlined-danger",
          icon: "trash",
        };
      case "create":
        return {
          variant: "elevated",
          icon: "plus-white",
        };
      case "edit":
        return {
          variant: "outlined",
          icon: "pencil",
        };
      case "discard":
        return {
          variant: "outlined",
          icon: "",
        };
      case "save":
        return {
          variant: "elevated",
          icon: "",
        };
      case "read":
        return {
          variant: "elevated",
          icon: "",
        };
      case "disconnect":
        return {
          variant: "outlined-danger",
          icon: "trash",
        };
      case "publish":
        return {
          variant: "elevated",
          icon: "",
        };
      case "reveal":
        return {
          variant: "inline-in-input",
          icon: "eye",
        };
      case "hide":
        return {
          variant: "inline-in-input",
          icon: "eye-slash",
        };
      case "copy":
        return {
          variant: "inline-in-input",
          icon: "clipboard-primary",
        };
      case "":
        return {
          variant: "elevated",
          icon: "",
        };
      default:
        throw new Error(`Unknown action style: ${style}`);
    }
  }

  const handleVuxAction = (name: string, action: VuxAction) => {
    emit("vux-action", name, action, modelValue.value);
  };

  const resolveActionTranslation = (
    action: VuxReactiveAction,
    entry: string,
    returnNull: boolean = true,
  ): string | null => {
    let translation: string | null = null;

    if (translation !== "") {
      translation = resolveTranslation(
        `${props.resourceKey}.actions.${action.name}.${entry}`,
      );
    }

    if (action.isWaiting) {
      translation = resolveTranslation(
        `${props.resourceKey}.actions.${action.name}.status.waiting.${entry}`,
      );
    }

    if (action.isDisabled) {
      translation = resolveTranslation(
        `${props.resourceKey}.actions.${action.name}.status.disabled.${entry}`,
      );
    }

    if (action.isPressed) {
      translation = resolveTranslation(
        `${props.resourceKey}.actions.${action.name}.status.pressed.${entry}`,
      );
    }

    return translation || (returnNull ? null : "");
  };

  return {
    handleVuxAction,
    reactiveActions,
    modelValue,
    actionsList,
  };
}
