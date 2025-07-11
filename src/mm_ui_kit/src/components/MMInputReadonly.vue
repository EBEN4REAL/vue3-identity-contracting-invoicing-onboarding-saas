<script setup lang="ts">
import { computed, ComputedRef } from "vue";

const props = defineProps({
  value: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  labelTooltipText: {
    type: String,
    default: "",
  },
  isSecretValueRevealed: {
    type: Boolean,
    default: true,
  },
});

const inputValue: ComputedRef<string> = computed(() =>
  props.isSecretValueRevealed ? props.value : "*".repeat(props.value.length),
);
</script>

<template>
  <div class="m-m-input-readonly">
    <m-m-field-label
      :label="label"
      :tooltip-text="labelTooltipText"
      class="mm-mb-3"
    />
    <div class="input-readonly">
      {{ inputValue }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.input-readonly {
  position: relative;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #d0d5dd;
  background: #fff;
  box-shadow: 0 1px 2px 0 rgba(16, 24, 40, 0.05);
  padding: 8px 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  color: #384250;
  word-break: break-all;
}
</style>
