<script setup lang="ts">
import {
  computed,
  ComputedRef,
  onMounted,
  ref,
  Ref,
  watch,
  withDefaults,
} from "vue";
import { useFieldValidation } from "../composables/useVuxFieldValidation";
import { useTranslationResolver } from "../composables/useVuxTranslationResolver";
import MMMultiselect from "~/mm_ui_kit/src/components/MMMultiselect.vue";
import { TypeMultiselectOption } from "~/mm_ui_kit/src/types/multiselect.types";
import {
  VuxExposedMethods,
  VuxTemplateComponentEmits,
  VuxTemplateComponentProps,
} from "../types/vuxTemplateComponent";
import { OptionsData, VuxModel } from "../types/useVuxModelType";
import {
  asVuxOptionsProperty,
  isVuxOptionsProperty,
  VuxOptionsProperty,
  VuxOptionsPropertyLayout,
} from "~/mm_ui_kit/src/vux/types/useVuxOptionsType";
import { VuxProperty } from "~/mm_ui_kit/src/vux/types/useVuxPropertyType";

// Define props using the props interface with withDefaults for default values
const props = withDefaults(defineProps<VuxTemplateComponentProps>(), {
  mode: "view",
  dataFieldName: "",
});

// Define data model
const model = defineModel<VuxModel>();

const emit = defineEmits<VuxTemplateComponentEmits>();

const { resolveTranslation } = useTranslationResolver();

// Determine if the component is in edit mode
const isModeEdit: ComputedRef<boolean> = computed(() => props.mode === "edit");

const fieldMetadata: Ref<VuxOptionsProperty | null> = ref(null);

if (isVuxOptionsProperty(props.metaData[props.dataFieldName] as VuxProperty)) {
  fieldMetadata.value = asVuxOptionsProperty(
    props.metaData,
    props.dataFieldName,
  );
}

// Get layout configuration from metadata
const layout: ComputedRef<VuxOptionsPropertyLayout | null> = computed(
  () => fieldMetadata.value?.layout || null,
);

// Get layout renderAs configuration from metadata
const renderAs: ComputedRef<"dropdown" | "radiogroup" | "checkboxgroup"> =
  computed(() => layout.value?.renderAs || "dropdown");

// Get layout orientation configuration from metadata
const orientation: ComputedRef<"horizontal" | "vertical"> = computed(
  () => layout.value?.orientation || "horizontal",
);

const isRenderAsDropdown: ComputedRef<boolean> = computed(
  () => renderAs.value === "dropdown",
);

const isRenderAsRadiogroup: ComputedRef<boolean> = computed(
  () => renderAs.value === "radiogroup",
);

const isRenderAsCheckboxgroup: ComputedRef<boolean> = computed(
  () => renderAs.value === "checkboxgroup",
);

// Detect multiple selection mode
const isMultipleSelect: ComputedRef<boolean> = computed(() => {
  return !!fieldMetadata.value?.multiple;
});

// Get options from metadata
const optionsMetadata = computed(() => {
  // add options from the modeldata and metadata
  const allOptions = {
    ...fieldMetadata.value?.options,
    ...model.value?.[props.dataFieldName],
  };

  const result = {};

  // Go through all options in the metadata
  Object.keys(allOptions).forEach((optionKey) => {
    const option = allOptions[optionKey];
    const isInData =
      (model.value?.[props.dataFieldName] as OptionsData)?.[optionKey] !==
      undefined;
    const isAlwaysIncluded = option.inclusion === "always";

    // Include if option is in data OR if it's marked with inclusion: "always"
    if (isInData || isAlwaysIncluded) {
      result[optionKey] = option;
    }
  });

  return result;
});

// Transform options into the format expected by MMMultiselect
const multiselectOptions: ComputedRef<TypeMultiselectOption[]> = computed(() =>
  Object.keys(optionsMetadata.value).map((optionKey) => ({
    title: resolveTranslation(
      `${props.resourceKey}.options.${optionKey}.label`,
    ),
    value: optionKey,
    $isDisabled:
      model.value?.[props.dataFieldName]?.[optionKey]?.disabled || false,
    disabledText: resolveTranslation(
      `${props.resourceKey}.options.${optionKey}.disabled.label`,
    ),
  })),
);

// Handle default option selection from metadata
const setupDefaultSelection = () => {
  // Only proceed if there's no selected option already
  if (hasSelectedOption.value) {
    return;
  }

  // Find option with default: true in metadata
  const defaultOption = Object.entries(fieldMetadata.value?.options || {}).find(
    ([_, option]) => option.default === true,
  );

  if (defaultOption) {
    const defaultOptionKey = defaultOption[0];
    // Apply the default selection
    selectOption(defaultOptionKey);
  }
};

// Track if any option is selected
const hasSelectedOption: ComputedRef<boolean> = computed(() => {
  if (!model.value || !model.value[props.dataFieldName]) return false;

  return Object.keys(model.value[props.dataFieldName] as OptionsData).some(
    (optionKey) =>
      (model.value[props.dataFieldName] as OptionsData)[optionKey]?.selected,
  );
});

// Get the currently selected option
const selectedOptionKey = computed(() => {
  if (!model.value || !model.value[props.dataFieldName]) return null;

  const selectedKey = Object.keys(
    model.value[props.dataFieldName] as OptionsData,
  ).find(
    (optionKey) =>
      (model.value[props.dataFieldName] as OptionsData)[optionKey]?.selected,
  );

  return selectedKey || null;
});

// Get all selected option keys - for multiple selection support
const selectedOptionKeys = computed(() => {
  if (!model.value || !model.value[props.dataFieldName]) return [];

  return Object.keys(model.value[props.dataFieldName] as OptionsData).filter(
    (optionKey) =>
      (model.value[props.dataFieldName] as OptionsData)[optionKey]?.selected,
  );
});

// Compute the model value for MMMultiselect
const selectModel = computed<
  TypeMultiselectOption | TypeMultiselectOption[] | null
>({
  get: () => {
    if (isRenderAsDropdown.value) {
      if (isMultipleSelect.value) {
        // For multiple selection, return array of selected options
        return selectedOptionKeys.value
          .map((key) =>
            multiselectOptions.value.find((option) => option.value === key),
          )
          .filter(Boolean) as TypeMultiselectOption[];
      } else {
        // Single selection (existing logic)
        if (!selectedOptionKey.value) return null;
        return (
          multiselectOptions.value.find(
            (option) => option.value === selectedOptionKey.value,
          ) || null
        );
      }
    } else if (isRenderAsCheckboxgroup.value) {
      // For checkbox group, return array of selected options
      return selectedOptionKeys.value;
    } else {
      // Default case (e.g., radiogroup)
      return selectedOptionKey.value;
    }
  },
  set: (
    selectedOption: TypeMultiselectOption | TypeMultiselectOption[] | null,
  ) => {
    if (isRenderAsDropdown.value) {
      if (isMultipleSelect.value && Array.isArray(selectedOption)) {
        // Handle multiple selection
        const selectedKeys = selectedOption.map(
          (option) => option.value as string,
        );

        // First, set all options to unselected
        Object.keys(
          (model.value?.[props.dataFieldName] || {}) as OptionsData,
        ).forEach((key) => {
          if ((model.value[props.dataFieldName] as OptionsData)[key]) {
            (model.value[props.dataFieldName] as OptionsData)[key].selected =
              false;
          }
        });

        // Then select all options in the new selection
        selectedKeys.forEach((key) => {
          selectOption(key, true);
        });

        // Trigger validation
        touchField();
      } else if (
        !isMultipleSelect.value &&
        !Array.isArray(selectedOption) &&
        selectedOption
      ) {
        // Handle single selection (existing logic)
        const optionKey = selectedOption.value as string;
        selectOption(optionKey);
      }
    } else if (isRenderAsCheckboxgroup.value) {
      Object.keys(
        (model.value?.[props.dataFieldName] || {}) as OptionsData,
      ).forEach((key) => {
        if ((model.value[props.dataFieldName] as OptionsData)[key]) {
          (model.value[props.dataFieldName] as OptionsData)[key].selected =
            false;
        }
      });
      selectedOption.forEach((key) => {
        selectOption(key, true);
      });
    } else if (isRenderAsRadiogroup.value) {
      // Handle radiogroup selection
      if (selectedOption) {
        selectOption(selectedOption as string);
      }
    }
  },
});

// Handle option selection
const selectOption = (optionKey: string, forceState?: boolean) => {
  if (!model.value) {
    model.value = {};
  }

  if (!model.value[props.dataFieldName]) {
    // Initialize as OptionsData structure
    model.value[props.dataFieldName] = {} as OptionsData;
  }

  // Use type assertion to tell TypeScript this is OptionsData
  const optionsData = model.value[props.dataFieldName] as OptionsData;

  if (!isMultipleSelect.value && !isRenderAsCheckboxgroup.value) {
    // Single select: deselect all other options
    Object.keys(optionsData).forEach((key) => {
      if (optionsData[key]) {
        optionsData[key].selected = false;
      }
    });
  }

  // Create option if it doesn't exist
  if (!optionsData[optionKey]) {
    optionsData[optionKey] = { selected: false, disabled: false };
  }

  // Toggle or set selection state
  const newState =
    forceState !== undefined ? forceState : !optionsData[optionKey].selected;
  optionsData[optionKey].selected = newState;

  // Trigger validation
  touchField();
};

// Use the field validation composable
const {
  isValid: fieldIsValid,
  validateField,
  touchField,
  errors,
  required,
  disabled,
} = useFieldValidation(props, selectModel);

// Create a computed propertyName that combines the base validation with custom logic
const isValid: ComputedRef<boolean> = computed(() => {
  // Base validation from useFieldValidation
  const baseValid = fieldIsValid.value;

  // If required and no option is selected, it's invalid
  if (required.value && !hasSelectedOption.value) {
    return false;
  }

  return baseValid;
});

// Watch isValid and emit validation-changed event when it changes
watch(isValid, (newValidState) => {
  emit("validation-changed", newValidState);
});

// Extend validateField to ensure it emits validation-changed
const validateAndEmit = async () => {
  await validateField();
  emit("validation-changed", isValid.value);
  return isValid.value;
};

// Get display value for view mode
const displayValue = computed(() => {
  if (isMultipleSelect.value) {
    return selectedOptionKeys.value
      .map((key) =>
        resolveTranslation(`${props.resourceKey}.options.${key}.label`),
      )
      .filter(Boolean)
      .join(", ");
  } else {
    if (!selectedOptionKey.value) return "";
    return resolveTranslation(
      `${props.resourceKey}.options.${selectedOptionKey.value}.label`,
    );
  }
});

// Call setupDefaultSelection when component mounts
onMounted(() => {
  setupDefaultSelection();
});

const save = async () => {
  console.error(
    `Error saving form data for component type: ${fieldMetadata.value?.type}, field: ${props.dataFieldName}`,
  );
  throw new Error(
    `Failed to save the form for component type: ${fieldMetadata.value?.type}, field: ${props.dataFieldName}`,
  );
};

const edit = () => {
  console.error(
    `Error editing component type: ${fieldMetadata.value?.type}, field: ${props.dataFieldName}`,
  );
  throw new Error(
    `Failed to edit the form for component type: ${fieldMetadata.value?.type}, field: ${props.dataFieldName}`,
  );
};

const vuxOptionsGroupClassList = computed(() => [
  "vux-optionsgroup",
  `vux-optionsgroup--${orientation.value}`,
  {
    "vux-optionsgroup--disabled": disabled.value,
    "vux-optionsgroup--required": required.value,
  },
]);

// Expose validation methods and state for parent component
defineExpose<VuxExposedMethods>({
  isValid,
  validate: validateAndEmit,
  save,
  edit,
});
</script>

<template>
  <template v-if="isModeEdit">
    <div>
      <m-m-multiselect
        v-if="isRenderAsDropdown"
        v-model="selectModel"
        :options="multiselectOptions"
        :label="resolveTranslation(`${resourceKey}.label`)"
        :label-tool-tip-text="
          resolveTranslation(`${resourceKey}.label_tooltip`)
        "
        :required="required"
        :disabled="disabled"
        :placeholder="
          resolveTranslation(`${resourceKey}.placeholder`) ||
          'Choose an option...'
        "
        :multiple="isMultipleSelect"
        class="vux-options-property"
      />
      <div v-else-if="isRenderAsRadiogroup">
        <m-m-field-label
          v-if="resolveTranslation(`${resourceKey}.label`)"
          :label="resolveTranslation(`${resourceKey}.label`)"
          :tooltip-text="resolveTranslation(`${resourceKey}.label_tooltip`)"
        />
        <div :class="vuxOptionsGroupClassList">
          <div
            v-for="(option, index) in multiselectOptions"
            :key="`${option.value}-${index}`"
            class="mm-flex mm-flex-align-center"
          >
            <m-m-radiobutton
              v-model="selectModel"
              :name="dataFieldName"
              :value="option.value"
              :disabled="option.$isDisabled"
              @update:model-value="touchField"
            >
              <m-m-field-label
                :label="option.title"
                :tooltip-text="
                  resolveTranslation(
                    `${resourceKey}.options.${option.value}.label_tooltip`,
                  )
                "
                class="mm-my-auto"
              />
            </m-m-radiobutton>
          </div>
        </div>
      </div>
      <div v-else-if="isRenderAsCheckboxgroup">
        <m-m-field-label
          v-if="resolveTranslation(`${resourceKey}.label`)"
          :label="resolveTranslation(`${resourceKey}.label`)"
          :tooltip-text="resolveTranslation(`${resourceKey}.label_tooltip`)"
        />
        <div :class="vuxOptionsGroupClassList">
          <m-m-checkbox
            v-for="(option, index) in multiselectOptions"
            :key="`${option.value}-${index}`"
            v-model="selectModel"
            class="mm-flex mm-flex-align-center"
            :name="dataFieldName"
            :value="option.value"
            :disabled="option.$isDisabled"
            @update:model-value="touchField"
          >
            <m-m-field-label
              :label="option.title"
              :tooltip-text="
                resolveTranslation(
                  `${resourceKey}.options.${option.value}.label_tooltip`,
                )
              "
              class="mm-my-auto"
            />
          </m-m-checkbox>
        </div>
      </div>
      <div
        v-if="resolveTranslation(`${resourceKey}.info_text`)"
        class="mm-flex mm-flex-align-center mm-flex-gap-2 mm-mt-2"
      >
        <div class="mm-page-options-hint">
          <span
            v-sanitize-html="resolveTranslation(`${resourceKey}.info_text`)"
            class="mm-mr-2"
          />
          <m-m-link
            v-if="resolveTranslation(`${resourceKey}.learn_more_url`)"
            :href="resolveTranslation(`${resourceKey}.learn_more_url`)"
          >
            Learn more
          </m-m-link>
        </div>
      </div>
      <ul class="vux-options-property-errors">
        <li
          v-for="error in errors"
          :key="`${error.$validator}-${error.$message}`"
          class="vux-options-property-errors-item"
        >
          {{ error.$message }}
        </li>
      </ul>
    </div>
  </template>
  <template v-else>
    <vux-data-view-property
      :resource-key="`${resourceKey}`"
      :value="displayValue"
    />
  </template>
</template>

<style scoped lang="scss">
$minWidth: 300px;
$maxWidth: 600px;

.vux-options-property {
  min-width: $minWidth;
  max-width: $maxWidth;

  @media (max-width: $breakpoint-md) {
    min-width: 100%;
  }

  &-error {
    box-shadow: none;
    border-color: #d92d20;
  }

  &-errors {
    list-style: none;
    position: relative;

    &-item {
      display: flex;
      align-items: center;
      position: relative;
      margin-top: 6px;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 18px; /* 150% */
      color: #d92d20;
    }
  }
}

.vux-optionsgroup {
  display: flex;
  gap: 16px;

  &--horizontal {
    flex-direction: row;
  }

  &--vertical {
    flex-direction: column;
  }
}
</style>
