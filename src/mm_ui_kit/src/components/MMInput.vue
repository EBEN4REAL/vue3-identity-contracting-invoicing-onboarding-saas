<script setup lang="ts">
import { PropType, computed, ref } from "vue";
import { TypeAlignX, TypePosition } from "../types/types";
import { ComputedRef } from "vue";

const props = defineProps({
  modelValue: {
    type: String as PropType<string | null>,
    default: "",
  },
  id: {
    type: String,
    default: `input-${crypto.randomUUID()}`,
  },
  type: {
    type: String,
    default: "text",
  },
  name: {
    type: String,
    default: "",
  },
  inputmode: {
    type: String as PropType<
      | "text"
      | "email"
      | "search"
      | "tel"
      | "url"
      | "none"
      | "numeric"
      | "decimal"
      | "textarea"
      | "expandable-textarea"
    >,
    default: "text",
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  labelToolTipText: {
    type: String,
    default: "",
  },
  labelIconAppended: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  iconAppended: {
    type: String,
    default: "",
  },
  buttonAppended: {
    type: String,
    default: "",
  },
  buttonAppendedDisabledReason: {
    type: String,
    default: "",
  },
  iconPrepended: {
    type: String,
    default: "",
  },
  errors: {
    type: Array,
    default: () => [],
  },
  hideAsterisk: {
    type: Boolean,
    default: false,
  },
  cy: {
    type: String,
    default: "input",
  },
  clearButton: {
    type: String,
    default: "",
  },
  errorsPosition: {
    type: String as PropType<TypePosition>,
    default: "relative",
  },
  width: {
    type: String,
    default: null,
  },
  textAlign: {
    type: String as PropType<TypeAlignX>,
    default: "left",
  },
  iconAppendedClickable: {
    type: Boolean,
    default: false,
  },
  isTableControl: { type: Boolean, default: false },
  textAreaHeight: { type: String, default: null },
  isDraggable: { type: Boolean, default: false },
  textareaRows: {
    type: Number,
    default: 4,
  },
  maxlength: {
    type: [Number, null],
    default: null,
  },
});

const emit = defineEmits([
  "click:append",
  "blur",
  "update:modelValue",
  "handleAppendedIconClick",
  "submit",
  "focus",
]);
const inputRef = ref(null);
const classList = computed(() => [
  "mm-input",
  { disabled: props.disabled },
  {
    "mm-input-error": props.errors.length,
  },
  `mm-input--text-align-${props.textAlign}`,
]);

const mmInputErrorsClassList = computed(() => [
  "mm-input-errors",
  `mm-input-errors--position-${props.errorsPosition}`,
]);
const mmInputControlClass = computed(() => [
  `mm-input-${props.isTableControl ? "table-" : ""}control`,
  {
    "mm-input-control--draggable": props.isDraggable,
  },
]);

const onClickAppend = () => {
  emit("click:append");
};
const iconDimensions: ComputedRef<string> = computed(() =>
  props.isTableControl ? "16px" : "20px",
);
const onInput = (event: Event) => {
  const value =
    props.inputmode === "expandable-textarea"
      ? (event.target as HTMLSpanElement).textContent
      : (event.target as HTMLInputElement).value;
  emit("update:modelValue", value);
};

const onBlur = () => {
  emit("blur");
};

const onFocus = () => {
  emit("focus");
};

const onClearInput = () => {
  emit("update:modelValue", "");
};

const isLabelClickable: ComputedRef<boolean> = computed<boolean>(() => {
  return !!(
    props.label &&
    props.labelIconAppended &&
    props.iconAppendedClickable
  );
});

const handleAppendedIconClick = () => {
  emit("handleAppendedIconClick");
};

const errorsFormatted = computed(() =>
  props.errors.map((error) => ({
    validator: error.$validator,
    message: error.$message,
  })),
);

defineExpose({ inputRef });
</script>

<template>
  <div :class="classList" :data-cy="cy">
    <m-m-field-label
      v-if="isLabelClickable"
      :required="required"
      :hide-asterisk="hideAsterisk"
      :label="label"
      :icon-appended="labelIconAppended"
      :tooltip-text="labelToolTipText"
      :icon-clickable="iconAppendedClickable"
      @handle-icon-click="handleAppendedIconClick"
    />
    <m-m-field-label
      v-else-if="label && labelIconAppended"
      :required="required"
      :hide-asterisk="hideAsterisk"
      :label="label"
      :icon-appended="labelIconAppended"
      :tooltip-text="labelToolTipText"
    />

    <m-m-field-label
      v-else
      :required="required"
      :hide-asterisk="hideAsterisk"
      :label="label"
      :icon-appended="labelIconAppended"
      :tooltip-text="labelToolTipText"
    />

    <div class="mm-input-wrapper">
      <m-m-icon
        v-if="iconPrepended"
        :icon="iconPrepended"
        :width="iconDimensions"
        :height="iconDimensions"
        data-cy="prepended-icon"
        class="mm-input-icon-prepended"
      />
      <div v-if="$slots['prepended-icon']" class="mm-input-slot-icon-prepended">
        <slot name="prepended-icon"> </slot>
      </div>
      <textarea
        v-if="inputmode === 'textarea'"
        :id="id"
        :value="props.modelValue"
        :name="name"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        data-cy="input"
        :class="mmInputControlClass"
        :rows="textareaRows"
        @input="onInput"
        @blur="onBlur"
      />
      <span
        v-else-if="inputmode === 'expandable-textarea'"
        :id="id"
        :value="props.modelValue"
        :type="type"
        :name="name"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        data-cy="input"
        :class="mmInputControlClass"
        role="textbox"
        contenteditable
        @input="onInput"
        @blur="onBlur"
        @keydown.enter.stop
      >
      </span>
      <input
        v-else
        :id="id"
        ref="inputRef"
        :value="props.modelValue"
        :type="type"
        :name="name"
        :readonly="readonly"
        :inputmode="inputmode"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :maxlength="maxlength"
        data-cy="input"
        :class="mmInputControlClass"
        @focus="onFocus"
        @input="onInput"
        @blur="onBlur"
        @keyup.enter="emit('submit')"
      />
      <div
        v-if="iconAppended && buttonAppended"
        class="mm-input-appended-group"
      >
        <m-m-icon
          :icon="iconAppended"
          data-cy="appended-icon"
          class="mm-input-appended-group-icon"
          @click="onClickAppend"
        />
        <m-m-button
          data-cy="appended-button"
          class="mm-input-appended-group-button"
          variant="text"
          size="small"
          :is-disabled="!!buttonAppendedDisabledReason"
          @click="onClickAppend"
        >
          {{ buttonAppended }}
          <m-m-tooltip v-if="buttonAppendedDisabledReason" max-width="300px">
            {{ buttonAppendedDisabledReason }}
          </m-m-tooltip>
        </m-m-button>
      </div>
      <template v-else>
        <m-m-icon
          v-if="iconAppended"
          :icon="iconAppended"
          data-cy="appended-icon"
          class="mm-input-icon-appended"
          @click="onClickAppend"
        />
        <m-m-button
          v-if="buttonAppended"
          data-cy="appended-button"
          class="mm-input-button-appended"
          variant="text"
          size="small"
          :is-disabled="!!buttonAppendedDisabledReason"
          @click="onClickAppend"
        >
          {{ buttonAppended }}
          <m-m-tooltip v-if="buttonAppendedDisabledReason" max-width="212px">
            {{ buttonAppendedDisabledReason }}
          </m-m-tooltip>
        </m-m-button>
      </template>

      <m-m-icon
        v-if="clearButton && props.modelValue"
        :icon="clearButton"
        width="16px"
        height="16px"
        fill="#9da4ae"
        class="mm-input-button-clear"
        data-cy="clear-button"
        @click="onClearInput"
      />
      <div class="mm-input-button-clear">
        <slot name="append"></slot>
      </div>
    </div>
    <div
      v-if="$slots['options-helper']"
      class="mm-input-helper"
      data-cy="input-helper"
    >
      <slot name="options-helper" />
    </div>
    <ul :class="mmInputErrorsClassList">
      <li
        v-for="error in errorsFormatted"
        :key="`${error.validator}-${error.message}`"
        class="mm-input-errors-item"
        :data-cy="`mm-input-error-${error.validator}-text`"
      >
        {{ error.message }}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.mm-input {
  width: v-bind(width);
  base-control-styles {
    width: 100%;
    height: v-bind(textAreaHeight);
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    color: #384250;
    border-radius: 8px;
    border: 1px solid #d0d5dd;
    background: #fff;
    box-shadow: 0 1px 2px 0 rgba(16, 24, 40, 0.05);
    outline: none;
    transition:
      border-color 0.3s,
      box-shadow 0.3s;

    &::placeholder {
      color: #6c737f;
    }

    &:focus {
      border-color: #384250;
      box-shadow: 0 0 0 3px rgba(16, 24, 40, 0.1);
    }

    &:read-only {
      cursor: not-allowed;

      &:focus {
        border-color: #d0d5dd;
        box-shadow: 0 1px 2px 0 rgba(16, 24, 40, 0.05);
      }
    }
  }

  &-control {
    @extend base-control-styles;
    padding: 8px 14px;
    font-size: 16px;
    &--draggable {
      cursor: grabbing;
    }
  }

  &-table-control {
    @extend base-control-styles;
    padding: 4px 14px;
    font-size: 14px;

    &::placeholder {
      font-weight: 400;
      line-height: 20px;
    }
  }

  //to handle cases where client secret is too big and overlaps the copy button
  &.client-secret {
    input {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      max-width: 640px;
      padding-right: 100px;
    }
  }

  //disabled
  &.disabled .mm-input-control {
    background: #f9fafb;
    color: #6c737f;

    &::placeholder {
      color: #d2d6db;
    }
  }

  &-wrapper {
    position: relative;
  }

  &-helper {
    color: #6d7480;
    font-size: 14px;
    line-height: 20px;
    display: flex;
    gap: 5px;
    margin-top: 5px;
    align-items: center;
  }

  &-icon-appended {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 14px;
    margin: auto;
    cursor: pointer;
  }

  &-button-appended {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 6px;
    margin: auto;
    cursor: pointer;
  }

  &-icon-prepended,
  &-slot-icon-prepended {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 10px;
    margin: auto;
    cursor: pointer;

    & + .mm-input-control {
      padding-left: 40px;
    }

    & + .mm-input-table-control {
      padding-left: 28px;
    }
  }

  &-slot-icon-prepended {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  &-error {
    .mm-input-control,
    .mm-input-table-control,
    .mm-input-table-control:focus,
    .mm-input-control:focus {
      box-shadow: none;
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

  &-button-clear {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 14px;
    margin: auto;
    cursor: pointer;
  }
  &-appended-group {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
    &-icon {
      @extend .mm-input-icon-appended;
      right: 60px;
    }
    &-button {
      @extend .mm-input-button-appended;
    }
  }

  $xCoords: left, center, right;

  @each $xCoord in $xCoords {
    &--text-align-#{$xCoord} {
      input {
        text-align: $xCoord;
      }
    }
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  [contenteditable] {
    display: block;
    min-height: 60px;
    width: 100%;
    padding: 8px;
    padding-left: 12px;
    border: 1px solid #d0d5dd;
    border-radius: 8px;
    font-size: inherit;
    font-family: inherit;
    line-height: 1.5;
    white-space: pre-wrap;
    word-wrap: break-word;
    outline: none;
    overflow: auto;
  }

  [contenteditable]:empty:before {
    content: attr(placeholder);
    color: #999;
    pointer-events: none;
    display: inline-block;
  }
}
</style>
