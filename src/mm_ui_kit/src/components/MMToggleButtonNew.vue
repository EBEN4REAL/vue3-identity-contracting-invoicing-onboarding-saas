<script lang="ts" setup>
import { ref, watch, computed, ComputedRef, Ref } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  activeColor: {
    type: String,
    default: "#072e51",
  },
  inactiveColor: {
    type: String,
    default: "#c0c0c0",
  },
  required: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "",
  },
  tooltip: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  checked: {
    type: Boolean,
    default: false,
  },
  errors: {
    type: Array,
    default: () => [],
  },
  cy: {
    type: String,
    default: "mm-toggle-button",
  },
});

const emit = defineEmits(["update:modelValue"]);

const isChecked: Ref<boolean> = ref(props.modelValue);

const toggleClassList = computed(() => [
  "mm-toggle-button",
  { "mm-toggle-button--checked": isChecked.value },
  { "mm-toggle-button--disabled": props.disabled },
  { "mm-toggle-button--required": props.required },
  { "mm-toggle-button--error": Boolean(props.errors.length) },
]);

const onToggle = () => {
  isChecked.value = !isChecked.value;
  emit("update:modelValue", isChecked.value);
};

const backgroundColor: ComputedRef<string> = computed(() =>
  isChecked.value ? props.activeColor : props.inactiveColor,
);

const errorsFormatted = computed(() =>
  props.errors?.map((error) => ({
    validator: error.$validator,
    message: error.$message,
  })),
);

watch(
  () => props.modelValue,
  (newValue) => {
    isChecked.value = newValue;
  },
);
</script>

<template>
  <div class="mm-toggle-button-wrapper" @click="onToggle">
    <div :class="toggleClassList">
      <div class="mm-toggle-button-body">
        <div class="mm-toggle-button-knob" />
      </div>
      <m-m-field-label
        :label="label"
        :tooltip-text="tooltip"
        whitespace="nowrap"
        class="mm-mb-auto mm-mt-auto mm-ml-4"
      />
    </div>

    <ul v-if="errors.length" class="mm-toggle-button-errors">
      <li
        v-for="error in errorsFormatted"
        :key="`${error.validator}-${error.message}`"
        class="mm-toggle-button-errors-item"
      >
        {{ error.message }}
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.mm-toggle-button {
  display: flex;
  align-items: center;

  &-body {
    background-color: v-bind(backgroundColor);
    width: 50px;
    height: 25px;
    border-radius: 15px;
    display: flex;
    align-items: center;
    padding: 3px;
    transition: background-color 0.3s ease;
  }

  &--checked {
    .mm-toggle-button-knob {
      transform: translateX(25px);
    }
  }

  &--required {
    &::after {
      content: "*";
      margin-left: 2px;
      color: #f04438;
    }
  }

  &-wrapper {
    user-select: none;
    cursor: pointer;
  }

  &-knob {
    width: 20px;
    height: 20px;
    background-color: #ffffff;
    border-radius: 50%;
    transition: transform 0.3s ease;
  }

  &--required {
    &::after {
      content: "*";
      margin-left: 2px;
      color: #f04438;
    }
  }

  &--error {
    .mm-toggle-button-body {
      box-shadow: 0 0 0 1px #f04438;
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
