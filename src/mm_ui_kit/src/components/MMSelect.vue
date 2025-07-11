<script setup lang="ts">
import { nextTick, ref, Ref, watch } from "vue";
import { PropType, computed } from "vue";
import { TablePagination } from "../types/table.types";
import { ITEMS_PER_PAGE } from "../../../common/constants";
import { TypePosition } from "../types/types";
import checkElementViewport from "../helpers/checkElementViewport";
import { ComputedRef } from "vue";

const props = defineProps({
  modelValue: {
    type: [String, Array] as PropType<
      string | string[] | number | number[] | boolean | null
    >,
    default: null,
  },
  prependLabel: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "",
  },
  isTableControl: {
    type: Boolean,
    default: false,
  },
  labelLeft: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  cy: {
    type: String,
    default: "select",
  },
  items: {
    type: Array as PropType<object[] | number[] | string[]>,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: "Select",
  },
  itemTitle: {
    type: String,
    default: "title",
  },
  itemValue: {
    type: String,
    default: "value",
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  radioOptions: {
    type: Boolean,
    default: false,
  },
  errors: {
    type: Array,
    default: () => [],
  },
  errorsPosition: {
    type: String as PropType<TypePosition>,
    default: "relative",
  },
  minOptionsWidth: {
    type: String,
    default: "100%",
  },
  maxOptionsWidth: {
    type: String,
    default: "initial",
  },
});

const isOptionsVisible: Ref<boolean> = ref(false);

const pagination: Ref<TablePagination> = ref({
  limit: ITEMS_PER_PAGE[0],
  offset: "0",
});
const isFocused: Ref<boolean> = ref(false);
const focusedOption: Ref<object | null> = ref(null);
const mmSelectOptionsElement: Ref<HTMLDivElement | null> = ref(null);
const isBelowBottomViewport: Ref<boolean> = ref(false);

watch(isOptionsVisible, () => {
  if (isOptionsVisible.value) {
    isBelowBottomViewport.value = false;
    nextTick(() => {
      if (mmSelectOptionsElement.value) {
        isBelowBottomViewport.value = checkElementViewport(
          mmSelectOptionsElement.value,
        ).isBelowBottomPartially;
      }
    });
  }
});

const classList = computed(() => [
  "mm-select",
  {
    "mm-select--error": props.errors?.length,
    "mm-select--focused": isFocused.value,
    "mm-select--open": isOptionsVisible.value,
    "mm-select--disabled": props.disabled,
    "mm-select--label-left": props.labelLeft,
  },
]);

const hasModelValue: ComputedRef<boolean> = computed(
  () =>
    props.modelValue !== undefined &&
    props.modelValue !== null &&
    props.modelValue !== "",
);

const hasModelValueForMultiple: ComputedRef<boolean> = computed(() =>
  Boolean(
    hasModelValue.value &&
      Array.isArray(props.modelValue) &&
      props.modelValue.length,
  ),
);

const emit = defineEmits(["update:modelValue", "scrolledToEnd"]);

const findOptionTitle = (value) => {
  const option = props.items.find((item) => item[props.itemValue] === value);

  return option ? option[props.itemTitle] : "";
};

const errorsFormatted = computed(() =>
  props.errors?.map((error) => ({
    validator: error.$validator,
    message: error.$message,
  })),
);

const mmSelectErrorsClassList = computed(() => [
  "mm-select-errors",
  `mm-select-errors--position-${props.errorsPosition}`,
]);

const prependedLabel = computed(() => (props.prependLabel ? props.label : ""));
const displayLabel = computed(() => props.label && !props.prependLabel);
const mmSelectOptionsClassList = computed(() => [
  "mm-select-options",
  { "mm-select-options--top": isBelowBottomViewport.value },
]);

const mmIconClass = computed(() => [
  "mm-select-icon",
  { "mm-select-icon-table": props.isTableControl },
]);
const iconDimensions: ComputedRef<string> = computed(() =>
  props.isTableControl ? "16px" : "22px",
);
const mmSelectWrapperClass = computed(() => [
  "mm-select-wrapper",
  { "mm-select-wrapper-table": props.isTableControl },
]);

const removeTag = (index) => {
  const newValue = [...props.modelValue];
  newValue.splice(index, 1);
  emit("update:modelValue", newValue);
};

const onOptionClick = (option) => {
  if (option.disabled) {
    return;
  }

  if (props.multiple && Array.isArray(props.modelValue)) {
    if (props.modelValue.includes(option[props.itemValue])) {
      const index = props.modelValue.indexOf(option[props.itemValue]);
      const newValue = [...props.modelValue];
      newValue.splice(index, 1);
      emit("update:modelValue", newValue);
    } else {
      emit("update:modelValue", [...props.modelValue, option[props.itemValue]]);
    }
  } else {
    emit("update:modelValue", option[props.itemValue]);
  }
  toggleOptions();
};

const isOptionSelected = (option) => {
  if (props.multiple && Array.isArray(props.modelValue)) {
    return props.modelValue.includes(option[props.itemValue]);
  } else {
    return props.modelValue === option[props.itemValue];
  }
};

const isOptionFocused = (option) => {
  focusedOption.value = option;
};
const handleKeydown = (event, item) => {
  const focusedOptionIndex = props.items.findIndex(
    (element) => element[props.itemTitle] === item[props.itemTitle],
  );

  if (focusedOptionIndex === -1) return;
  if (event.key === "Enter") {
    onOptionClick(props.items[focusedOptionIndex]);
    toggleOptions();
    return;
  }
};

const toggleOptions = () => {
  isOptionsVisible.value = !isOptionsVisible.value;
};
const toggleFocus = () => {
  isFocused.value = !isFocused.value;
};

const onClickOutside = () => {
  isOptionsVisible.value = false;
};
const chevronIcon: ComputedRef<string> = computed(
  () => `chevron-down${props.isTableControl ? "-grey" : ""}`,
);

const onScrollEnd = ({ target: { scrollTop, clientHeight, scrollHeight } }) => {
  if (scrollTop + clientHeight >= scrollHeight - 25) {
    pagination.value.offset = `${+pagination.value.offset + +pagination.value.limit}`;
    emit("scrolledToEnd", pagination.value);
  }
};
</script>

<template>
  <div
    v-mm-click-outside="onClickOutside"
    :class="classList"
    :data-cy="cy"
    tabindex="0"
    @keydown.enter="toggleOptions"
    @keydown.esc="onClickOutside"
    @focusin="toggleFocus"
    @focusout="toggleFocus"
  >
    <div
      v-if="displayLabel"
      :class="['mm-select-label', { 'mm-select-label--required': required }]"
    >
      {{ label }}
    </div>
    <div
      :class="mmSelectWrapperClass"
      data-cy="mm-select-wrapper"
      @click="toggleOptions"
    >
      <div v-if="multiple" class="mm-select-tags">
        <template v-if="hasModelValueForMultiple">
          <div
            v-for="(tag, index) in props.modelValue"
            :key="index"
            class="mm-select-tag"
          >
            {{ findOptionTitle(tag) }}

            <m-m-icon
              icon="x-close"
              width="12px"
              height="12px"
              @click.stop="removeTag(index)"
            />
          </div>
        </template>
        <template v-else>
          <span class="mm-select-placeholder" data-cy="mm-select-placeholder">
            {{ placeholder }}
          </span>
        </template>
      </div>
      <div
        v-else
        class="mm-select-value"
        :data-cy="`mm-select-value-${modelValue}`"
      >
        <template v-if="hasModelValue">
          {{ prependedLabel }}
          <span class="mm-select-value-text">
            {{ findOptionTitle(modelValue) }}
          </span>
          <slot name="selected-option" :value="modelValue" />
        </template>
        <template v-else>
          <span class="mm-select-placeholder" data-cy="mm-select-placeholder">
            {{ placeholder }}
          </span>
        </template>
      </div>
      <m-m-icon
        :icon="chevronIcon"
        :height="iconDimensions"
        :width="iconDimensions"
        :class="mmIconClass"
      />
    </div>
    <div
      v-show="isOptionsVisible"
      ref="mmSelectOptionsElement"
      :class="mmSelectOptionsClassList"
      :style="{ minWidth: minOptionsWidth, maxWidth: maxOptionsWidth }"
    >
      <div class="mm-select-options-list" @scrollend="onScrollEnd">
        <div v-if="props.items.length > 0">
          <div
            v-for="item of items"
            :key="item[itemValue]"
            :class="[
              'mm-select-option',
              { 'mm-select-option--selected': isOptionSelected(item) },
              { 'mm-select-option--disabled': item.disabled },
            ]"
            tabindex="0"
            :data-cy="`mm-select-option-${item[itemValue]}`"
            @focus="isOptionFocused(item)"
            @keydown="(event) => handleKeydown(event, item)"
            @click="onOptionClick(item)"
          >
            <slot name="option" :item="item" />
            <template v-if="!$slots['option']">
              <m-m-icon
                v-if="radioOptions"
                :icon="
                  isOptionSelected(item) ? 'radio-checked' : 'radio-unchecked'
                "
              />
              {{ item[itemTitle] }}
            </template>
          </div>
        </div>
        <div
          v-else
          class="mm-select-empty-content mm-ma-4"
          data-cy="mm-select-empty-content"
        >
          No options available
        </div>
        <div
          v-if="isOptionsVisible && $slots['options-hint']"
          class="mm-select-option-hint"
          data-cy="select-options-hint"
        >
          <slot name="options-hint" class="my-class" />
        </div>
      </div>
    </div>

    <ul :class="mmSelectErrorsClassList">
      <li
        v-for="error in errorsFormatted"
        :key="`${error.validator}-${error.message}`"
        class="mm-select-errors-item"
        :data-cy="`mm-select-error-${error.validator}-text`"
      >
        {{ error.message }}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
$mm-select-options-max-height: 200px;

.mm-select {
  position: relative;
  &:focus {
    outline: none;
  }

  &-label {
    text-align: left;
    color: #384250;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    margin-bottom: 6px;

    &--required {
      &::after {
        content: " *";
        color: #f04438;
      }
    }
  }
  base-control-styles {
    display: flex;
    justify-content: space-between;
    border-radius: 8px;
    border: 1px solid #d0d5dd;
    background: #fff;
    box-shadow: 0 1px 2px 0 rgba(16, 24, 40, 0.05);
    outline: none;
    cursor: pointer;
    transition:
      border-color 0.3s,
      box-shadow 0.3s;
  }
  &-wrapper {
    @extend base-control-styles;
    min-height: 40px;
    padding: 6px 14px;
    line-height: 26px;

    .mm-select-value {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  &-wrapper-table {
    @extend base-control-styles;
    min-height: 32px;
    max-height: 32px;
    padding: 4px 14px;
    line-height: 20px;
    font-size: 14px;

    .mm-select-value-text {
      font-weight: 500;
      font-size: 14px;
      height: 20px;
      line-height: 20px;
    }
  }

  &--focused &-wrapper,
  &-wrapper-table {
    border-color: #384250;
    box-shadow: 0 0 0 3px rgba(16, 24, 40, 0.1);
  }

  &-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    width: 100%;
  }

  &-tag {
    display: flex;
    align-items: center;
    color: #344054;
    border-radius: 6px;
    border: 1px solid #d0d5dd;
    padding: 0 4px 0 5px;
    justify-content: center;
    gap: 3px;
    text-align: center;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px; /* 142.857% */
  }

  &-tag-close {
    cursor: pointer;
    width: 12px;
    height: 12px;
  }

  &-value {
    color: #384250;
  }

  &-empty-content {
    font-style: italic;
    color: #6c737f;
  }

  &-icon {
    font-size: 16px;
    opacity: 1;
    color: #0f172a;
    transition: transform 0.3s;

    &-table {
      margin-left: 8px;
    }
  }

  &--focused &-icon {
    font-size: 16px;
    opacity: 1;
    margin-left: 8px;
    transition: transform 0.3s;
  }

  &--focused &-icon {
    transform: rotate(180deg);
  }

  &--focused &-icon-table {
    transform: rotate(180deg);
    margin-top: 4px;
  }

  &-placeholder {
    color: #667085;
  }

  &-options {
    min-width: v-bind(minOptionsWidth);
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    z-index: 100;
    background: #fff;
    border: 1px solid #eaecf0;
    border-radius: 8px;
    box-shadow:
      0 4px 6px -2px rgba(16, 24, 40, 0.03),
      0px 12px 16px -4px rgba(16, 24, 40, 0.08);
    max-height: $mm-select-options-max-height;

    &--top {
      top: -8px;
      transform: translateY(-100%);
    }
  }

  &-options-list {
    max-height: $mm-select-options-max-height;
    overflow-y: auto;
    padding: 6px;
  }

  &-option {
    display: flex;
    justify-content: start;
    align-items: center;
    gap: 8px;
    padding: 10px;
    color: #344054;
    font-size: 16px;
    line-height: 24px;
    cursor: pointer;
    border-radius: 6px;
    display: block;
    overflow-x: hidden;
    text-overflow: ellipsis;
    text-align: left;

    &:focus {
      outline: none;
      background: #f5f7fa;
    }
    &:hover {
      background: #f5f7fa;
    }

    &--selected {
      background: #f9fafb;
    }

    &--disabled {
      cursor: not-allowed;
    }

    &-hint {
      padding: 16px;
      border-top: 1px solid #e6e8ec;
    }
  }

  &-error {
    input,
    input:focus {
      box-shadow: none;
      border-color: #d92d20;
    }
  }

  &--error {
    .mm-select-wrapper {
      border-color: #d92d20;
    }
  }

  &-errors {
    list-style: none;

    &--position {
      &-static {
        position: static;
      }
      &-relative {
        position: relative;
      }
      &-absolute {
        position: absolute;
      }
      &-fixed {
        position: fixed;
      }
    }

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

  &--disabled {
    pointer-events: none;

    .mm-select-wrapper {
      border-color: #d0d5dd;
      background-color: #f9fafb;
      box-shadow: 0 1px 2px 0 #1018280d;

      .mm-select-value {
        color: #384250;
      }

      .mm-select-placeholder {
        color: #d2d6db;
      }

      .mm-select-icon {
        opacity: 0.5;
      }
    }
  }

  &--label-left {
    display: flex;
    align-items: center;

    .mm-select-label {
      margin: 0;
      margin-right: 12px;
    }
  }
}
</style>
