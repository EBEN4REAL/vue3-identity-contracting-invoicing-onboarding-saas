<script lang="ts" setup>
import { ref, watch, computed, ComputedRef } from "vue";

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
  cy: {
    type: String,
    default: "mm-toggle-button",
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "toggled", value: boolean): void;
}>();

const isChecked = ref(props.modelValue);

const isCheckedClass: ComputedRef<string> = computed(() =>
  isChecked.value ? "toggle--checked" : "",
);
const enabledDisabledClass: ComputedRef<string> = computed(
  () => `${props.cy}-${isChecked.value ? "enabled" : "disabled"}`,
);

const toggleClasses: ComputedRef<Record<string, boolean>> = computed(() => ({
  [isCheckedClass.value]: isChecked.value,
  [enabledDisabledClass.value]: true,
  disabled: props.isDisabled,
}));

const toggle = () => {
  if (props.isDisabled) return;
  isChecked.value = !isChecked.value;
  emit("update:modelValue", isChecked.value);
  emit("toggled", isChecked.value);
};

watch(
  () => props.modelValue,
  (newValue) => {
    isChecked.value = newValue;
  },
);

const backgroundColor = computed(() =>
  !isChecked.value || props.isDisabled
    ? props.inactiveColor
    : props.activeColor,
);
</script>

<template>
  <div
    class="toggle-btn-container"
    :class="toggleClasses"
    :data-cy="cy"
    @click="toggle"
  >
    <div class="toggle-knob"></div>
  </div>
</template>

<style lang="scss" scoped>
.toggle-btn-container {
  background-color: v-bind(backgroundColor);
  width: 50px;
  height: 25px;
  border-radius: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 3px;
  transition: background-color 0.3s ease;

  &.toggle--checked {
    .toggle-knob {
      transform: translateX(25px);
    }
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .toggle-knob {
    width: 20px;
    height: 20px;
    background-color: #ffffff;
    border-radius: 50%;
    transition: transform 0.3s ease;
  }
}
</style>
