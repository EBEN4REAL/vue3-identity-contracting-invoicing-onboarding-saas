<script setup lang="ts">
import { PropType } from "vue";

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  items: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue"]);

const mmToggleItemClassList = (index: number) => [
  "mm-toggle-item",
  { "mm-toggle-item--active": index === props.modelValue },
];
</script>

<template>
  <div class="mm-toggle">
    <div
      v-for="(item, itemIndex) in items"
      :key="item"
      :class="mmToggleItemClassList(itemIndex)"
      :data-cy="`mm-toggle-item-${item}`"
      @click="emit('update:modelValue', itemIndex)"
    >
      {{ item }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mm-toggle {
  display: flex;
  align-items: center;
  padding: 1px;
  border: 1px solid #d2d6db;
  border-radius: 8px;
  background-color: #f9fafb;

  &-item {
    padding: 2px 16px;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    cursor: pointer;
    color: #6c737f;
    border-radius: 6px;
    transition:
      color 0.3s,
      background-color 0.3s;
    will-change: color, background-color;

    &--active {
      color: #072e51;
      background-color: #d2d6db;
    }
  }
}
</style>
