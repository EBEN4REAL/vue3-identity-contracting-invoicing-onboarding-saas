<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: [Array, Boolean],
    default: () => [],
    required: true,
  },
  value: {
    type: [String, Boolean],
    default: "",
    required: true,
  },
  name: {
    type: String,
    default: "",
    required: true,
  },
  cy: {
    type: String,
    default: "checkbox",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  checked: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  errors: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get() {
    return Array.isArray(props.modelValue)
      ? props.modelValue.includes(props.value)
      : props.modelValue;
  },
  set(checked) {
    if (!Array.isArray(props.modelValue)) {
      emit("update:modelValue", checked);
      return;
    }

    if (checked) {
      emit("update:modelValue", [...props.modelValue, props.value]);
    } else {
      emit(
        "update:modelValue",
        props.modelValue.filter((v) => v !== props.value),
      );
    }
  },
});

const checkboxFakeClassList = computed(() => [
  "mm-checkbox-fake-checkbox",
  { "mm-checkbox-fake-checkbox--checked": model.value || props.checked },
  { disabled: props.disabled },
  "mm-mr-6",
]);

const checkboxClassList = computed(() => [
  "mm-checkbox",
  {
    "mm-checkbox--required": props.required,
  },
  {
    "mm-checkbox--error": Boolean(props.errors.length),
  },
]);

const errorsFormatted = computed(() =>
  props.errors?.map((error) => ({
    validator: error.$validator,
    message: error.$message,
  })),
);
</script>

<template>
  <div class="mm-checkbox-wrapper">
    <label :class="checkboxClassList" :data-cy="cy">
      <span :class="checkboxFakeClassList" :data-cy="`${cy}-input`">
        <m-m-icon v-if="model || checked" icon="check" />
      </span>
      <input
        v-model="model"
        :value="value"
        :name="name"
        :checked="checked"
        :disabled="disabled"
        type="checkbox"
        hidden
        data-cy="checkbox-input"
      />
      <span class="mm-checkbox-label" data-cy="checkbox-label"><slot /></span>
    </label>

    <ul v-if="errors.length" class="mm-checkbox-errors">
      <li
        v-for="error in errorsFormatted"
        :key="`${error.validator}-${error.message}`"
        class="mm-checkbox-errors-item"
        :data-cy="`mm-checkbox-error-${error.validator}-text`"
      >
        {{ error.message }}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.mm-checkbox {
  display: flex;
  align-items: center;
  user-select: none;
  cursor: pointer;

  &--required {
    &::after {
      content: "*";
      margin-left: 2px;
      color: #f04438;
    }
  }

  &-fake-checkbox {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 4px;
    border: 1px solid #d2d6db;
    transition: background-color 0.3s;
    will-change: background-color;

    &--checked {
      background-color: #072e51;
    }

    &.disabled {
      cursor: not-allowed;
      background: #d3d7dc;
      border: 1px solid #d3d7dc;
      opacity: 0.5;
    }
  }

  &-label {
    color: #111927;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    white-space: nowrap;
  }

  &-error {
    input,
    input:focus {
      box-shadow: none;
      border-color: #d92d20;
    }
  }

  &--error {
    .mm-checkbox-fake-checkbox {
      border-color: #d92d20;
    }
  }

  &-errors {
    list-style: none;

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
</style>
