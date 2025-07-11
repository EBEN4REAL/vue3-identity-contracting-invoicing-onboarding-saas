<script setup lang="ts">
import { computed, ComputedRef, Ref, ref, watch, withDefaults } from "vue";
import { useFieldValidation } from "../composables/useVuxFieldValidation";
import { useTranslationResolver } from "../composables/useVuxTranslationResolver";
import {
  asVuxInputProperty,
  InputMode,
  VuxInputProperty,
} from "../types/useVuxInputPropertyType";
import { shortcutsForDatepickers } from "~/service-providers/Filters/Filter/Tabs/FilterConditions/constants";
import {
  VuxTemplateComponentEmits,
  VuxTemplateComponentProps,
} from "../types/vuxTemplateComponent";
import MMToggleButtonNew from "../../components/MMToggleButtonNew.vue";
import MMCheckbox from "../../components/MMCheckbox.vue";
import {
  asVuxInputModel,
  VuxComplexModel,
  VuxModel,
} from "../types/useVuxModelType";
import { asVuxMetadata } from "~/mm_ui_kit/src/vux/types/useVuxMetadataType";
import { Vux } from "~/mm_ui_kit/src/vux/types/vuxTemplateComponentLogic";
import { useVux } from "~/mm_ui_kit/src/vux/composables/useVux";
import { useVuxInputActions } from "~/mm_ui_kit/src/vux/composables/useVuxInputActions";
import { asVuxStatus, VuxStatus } from "../types/useVuxStatusType";
import { VuxAction } from "~/mm_ui_kit/src/vux/types/useVuxActionType";
import dayjs from "dayjs";

// Define props using the props interface with withDefaults for default values
const props = withDefaults(defineProps<VuxTemplateComponentProps>(), {
  mode: "view",
  dataFieldName: "",
});

// Define data model
const model = defineModel<VuxModel>({
  default: () => asVuxInputModel(null),
});

const emit = defineEmits<VuxTemplateComponentEmits>();

const vux = ref<Vux>(useVux(props, emit, model));

const isSecretValueRevealed: Ref<boolean> = ref(false);

const { resolveTranslation, resolveTranslationOrNull } =
  useTranslationResolver();

const inputActions = useVuxInputActions(props, emit, model);

const setDefaultsIfFieldUndefined = () => {
  if (!model.value) {
    model.value = asVuxInputModel(null);
    return;
  }

  const field = props.dataFieldName;
  if (!field) return;

  if (
    typeof model.value === "object" &&
    !Array.isArray(model.value) &&
    (model.value as VuxComplexModel)[field] === undefined
  ) {
    let defaultValue = resolveTranslationOrNull(
      `${props.resourceKey}.default.value`,
    );

    if (defaultValue === null || defaultValue === undefined) {
      defaultValue = asVuxMetadata(props.metaData, field)?.default?.value;
    }

    if (defaultValue !== undefined) {
      (model.value as VuxComplexModel)[field] = defaultValue;
    } else {
      (model.value as VuxComplexModel)[field] = null;
    }
  }
};

watch(
  () => [
    model.value,
    props.dataFieldName,
    props.resourceKey,
    asVuxMetadata(props.metaData, props.dataFieldName)?.default?.value,
  ],
  () => {
    setDefaultsIfFieldUndefined();
  },
  { immediate: true },
);

const inputValue = computed({
  get: () => {
    if (props.dataFieldName && model.value && typeof model.value === "object") {
      const modelValue = (model.value as VuxComplexModel)[props.dataFieldName];
      if (isDateSelect.value && modelValue === "now") {
        return dayjs().format("MMMM DD, YYYY HH:mm");
      }
      return modelValue ?? asVuxInputModel(null);
    }
    return model.value ?? asVuxInputModel(null);
  },
  set: (value) => {
    if (props.dataFieldName && model.value && typeof model.value === "object") {
      (model.value as VuxComplexModel)[props.dataFieldName] = value;
    } else {
      model.value = value;
    }
  },
});

// Determine if the component is in edit mode
const isModeEdit: ComputedRef<boolean> = computed(() => props.mode === "edit");

// Use the field validation composable
const {
  isValid: fieldIsValid,
  touchField,
  errors,
  required,
} = useFieldValidation(props, inputValue);

// Create a computed propertyName that combines the base validation with custom logic (if needed)
const isValid: ComputedRef<boolean> = computed(() => {
  // Base validation from useFieldValidation
  return fieldIsValid.value;
});

const inputMetaData: ComputedRef<VuxInputProperty> = computed(() =>
  asVuxInputProperty(props.metaData, props.dataFieldName),
);

const vuxStatus: ComputedRef<VuxStatus> = computed(() =>
  asVuxStatus(inputMetaData.value.status),
);

const vuxStatusCurrent: ComputedRef<string | null> = computed(
  () =>
    Object.keys(vuxStatus.value).find((key) => vuxStatus.value[key] === true) ||
    null,
);

const isHidden: ComputedRef<boolean> = computed(
  () => Boolean(vuxStatus.value.hidden) || false,
);

const isWaiting: ComputedRef<boolean> = computed(
  () => Boolean(vuxStatus.value.waiting) || false,
);

const isDisabled: ComputedRef<boolean> = computed(
  () => Boolean(vuxStatus.value.disabled) || isWaiting.value || false,
);

const isReadyToRender: ComputedRef<boolean> = computed(
  () => isModeEdit.value && vux.value.isReady && !isHidden.value,
);

const inputMode: ComputedRef<InputMode> = computed(
  () => inputMetaData.value.inputMode || InputMode.TEXT,
);

const isReadonly: ComputedRef<boolean> = computed(
  () => inputMode.value === InputMode.READONLY,
);

const isSecret: ComputedRef<boolean> = computed(
  () => inputMode.value === InputMode.SECRET,
);

const isURL: ComputedRef<boolean> = computed(
  () => inputMode.value === InputMode.URL,
);

const isCheckbox: ComputedRef<boolean> = computed(
  () => inputMetaData.value.inputMode === InputMode.CHECKBOX,
);

const isToggle: ComputedRef<boolean> = computed(
  () => inputMetaData.value.inputMode === InputMode.TOGGLE,
);

const isDatepicker: ComputedRef<boolean> = computed(
  () => inputMetaData.value.inputMode === InputMode.DATE,
);

const isTimepicker: ComputedRef<boolean> = computed(
  () => inputMetaData.value.inputMode === InputMode.TIME,
);

const isDatetimepicker: ComputedRef<boolean> = computed(
  () => inputMetaData.value.inputMode === InputMode.DATETIME,
);

const isDateSelect: ComputedRef<boolean> = computed(
  () => isDatepicker.value || isTimepicker.value || isDatetimepicker.value,
);

const dateSelectMetadata: ComputedRef<Record<string, string | boolean | null>> =
  computed(() => {
    const confirmText = resolveTranslationOrNull(
      `${props.resourceKey}.confirm.label`,
    );
    const confirm = Boolean(confirmText);

    switch (inputMode.value) {
      case InputMode.DATE:
      default:
        return {
          format: "MMM D, YYYY",
          type: "date",
          confirm,
          confirmText,
        };
      case InputMode.TIME:
        return {
          format: "HH:mm",
          type: "time",
          confirm,
          confirmText,
        };
      case InputMode.DATETIME:
        return {
          format: "MMMM DD, YYYY HH:mm",
          type: "datetime",
          confirm,
          confirmText,
        };
    }
  });

const inputMaxlength: ComputedRef<number | null> = computed(
  () => inputMetaData.value.validations?.maxlength || null,
);

const isNewItem: ComputedRef<boolean> = computed(
  () => model.value?.status === "new",
);

const isActionsListVisible: ComputedRef<boolean> = computed(() =>
  Boolean(vux.value.groupMetadata.actions && isNewItem.value),
);

const getIsSecretValueRevealed: ComputedRef<boolean> = computed(
  () => isSecretValueRevealed.value || isNewItem.value,
);

// Watch isValid and emit validation-changed event when it changes
watch(isValid, (newValidState) => {
  emit("validation-changed", newValidState);
});

// Handle blur event
const onBlur = () => {
  touchField();
};

// Handle input event
const onInput = () => {
  touchField();
};

// Handle focus event
const onFocus = () => {
  if (!inputValue.value && isURL) inputValue.value = "https://";
};

const vuxInputPropertyClassList = computed(() => [
  "vux-input-property",
  `vux-input-property--${inputMetaData.value.inputMode || InputMode.TEXT}`,
  {
    ["vux-input-property--has-actions"]: isActionsListVisible.value,
  },
]);

const onHandleVuxAction = (
  name: string,
  action: VuxAction,
  actionModel: VuxModel,
) => {
  if (name === "copy") inputActions.onHandleActionCopy();
  if (name === "reveal") {
    inputActions.onHandleActionReveal(isSecretValueRevealed);
  }
  vux.value.handleVuxAction(name, action, actionModel);
};

const getTranslationByElement = (
  element:
    | "label"
    | "label_tooltip"
    | "placeholder"
    | "info_text"
    | "learn_more_url",
) =>
  resolveTranslation(
    isWaiting.value || isDisabled.value
      ? `${props.resourceKey}.status.${vuxStatusCurrent.value}.${element}`
      : `${props.resourceKey}.${element}`,
  );

// Public methods
defineExpose({
  get isValid() {
    return vux.value?.isValid;
  },
  validate: vux.value.validate,
  save: vux.value.save,
  edit: vux.value.edit,
});
</script>

<template>
  <div v-if="isReadyToRender" :class="vuxInputPropertyClassList">
    <m-m-toggle-button-new
      v-if="isToggle"
      v-model="inputValue"
      :errors="errors"
      :required="required"
      :disabled="isDisabled"
      :label="getTranslationByElement('label')"
      :tooltip="getTranslationByElement('label_tooltip')"
      @update:model-value="onInput"
    />
    <m-m-checkbox
      v-else-if="isCheckbox"
      v-model="inputValue"
      :value="inputValue"
      :name="dataFieldName"
      :errors="errors"
      :required="required"
      :disabled="isDisabled"
      @update:model-value="onInput"
    >
      {{ resolveTranslation(`${resourceKey}.label`) }}
    </m-m-checkbox>

    <div v-else-if="isDateSelect">
      <m-m-field-label
        :required="required"
        :hide-asterisk="!required"
        :label="getTranslationByElement('label')"
        :tooltip-text="getTranslationByElement('label_tooltip')"
      />
      <m-m-datepicker
        v-model="inputValue"
        :errors="errors"
        :placeholder="getTranslationByElement('placeholder')"
        :required="required"
        :disabled="isDisabled"
        :datepicker-shortcuts="shortcutsForDatepickers.date"
        :format="dateSelectMetadata.format"
        :type="dateSelectMetadata.type"
        :confirm="dateSelectMetadata.confirm"
        :confirm-text="dateSelectMetadata.confirmText"
        @update:model-value="onInput"
      />
    </div>

    <div v-else class="mm-flex mm-w-10">
      <m-m-input-readonly
        v-if="isReadonly"
        :value="inputValue"
        :label="getTranslationByElement('label')"
        :label-tool-tip-text="getTranslationByElement('label_tooltip')"
        class="mm-w-10"
      />
      <m-m-input-readonly
        v-else-if="isSecret"
        :value="inputValue"
        :label="getTranslationByElement('label')"
        :label-tool-tip-text="getTranslationByElement('label_tooltip')"
        :is-secret-value-revealed="getIsSecretValueRevealed"
        class="mm-w-10"
      />
      <m-m-input
        v-else
        v-model="inputValue"
        :inputmode="inputMode"
        :textarea-rows="inputMetaData.textareaRows"
        :label="getTranslationByElement('label')"
        :label-tool-tip-text="getTranslationByElement('label_tooltip')"
        :required="required"
        :disabled="isDisabled"
        :placeholder="getTranslationByElement('placeholder')"
        :errors="errors"
        :maxlength="inputMaxlength"
        class="mm-w-10"
        @blur="onBlur"
        @focus="onFocus"
        @input="onInput"
      />
      <vux-actions-list
        v-if="isActionsListVisible"
        v-model="inputValue"
        :meta-data="vux.groupMetadata"
        :resource-key="props.resourceKey"
        class="mm-mt-13"
        @vux-action="onHandleVuxAction"
      />
    </div>
    <div
      v-if="getTranslationByElement('info_text')"
      class="mm-flex mm-flex-align-center mm-flex-gap-2 mm-mt-2"
    >
      <div class="mm-page-options-hint">
        <span
          v-sanitize-html="getTranslationByElement('info_text')"
          class="mm-mr-2"
        />
        <m-m-link
          v-if="getTranslationByElement('learn_more_url')"
          :href="getTranslationByElement('learn_more_url')"
        >
          Learn more
        </m-m-link>
      </div>
    </div>
  </div>
  <template v-else>
    <m-m-checkbox
      v-if="isCheckbox"
      :name="model?.[dataFieldName]"
      :model-value="inputValue"
      :required="required"
      disabled
    >
      {{ getTranslationByElement("label") }}
    </m-m-checkbox>
    <vux-data-view-property
      v-else
      :resource-key="`${resourceKey}`"
      :value="model?.[dataFieldName]"
      class="mm-mb-8"
    />
  </template>
</template>

<style scoped lang="scss">
$minWidth: 300px;
$maxWidth: 600px;
$fixed-width-types: date, time, datetime, text, url, textarea, readonly, secret;
$fit-content-width-types: checkbox, toggle;

.vux-input-property {
  @each $type in $fixed-width-types {
    &--#{$type} {
      min-width: $minWidth;
      max-width: $maxWidth;
    }
  }
  @each $type in $fit-content-width-types {
    &--#{$type} {
      width: fit-content;
    }
  }

  @media (max-width: $breakpoint-md) {
    min-width: 100%;
  }

  .vux-actions-list {
    display: flex;
    flex-direction: row;
    gap: 0;
  }

  &--has-actions {
    :deep(input),
    :deep(.input-readonly) {
      border-radius: 8px 0 0 8px !important;
    }
  }
}
</style>
