<script setup lang="ts">
import { computed, PropType } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  value: {
    type: String,
    default: "",
  },
  variant: {
    type: String as PropType<"default" | "outlined">,
    default: "outlined",
  },
  name: {
    type: String,
    default: "",
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  cy: {
    type: String,
    default: "radio-card",
  },
  errors: {
    type: Array,
    default: () => [],
  },
});

const isSlotDescription = computed(() => !!props.description);
const emit = defineEmits(["update:modelValue"]);
const isRadiobuttonActive = computed(() => props.modelValue === props.value);
const onInput = () => {
  emit("update:modelValue", props.value);
};
const mmRadioCardClassList = computed(() => [
  "mm-radio-card",
  { "mm-radio-card-active": isRadiobuttonActive.value },
]);
</script>
<template>
  <div :class="mmRadioCardClassList" :data-cy="cy" @click="onInput">
    <div class="mm-radio-card-header">
      <m-m-radiobutton
        :model-value="props.modelValue"
        :variant="props.variant"
        :name="name"
        :value="value"
        :errors="props.errors"
        @update:model-value="onInput"
      />
    </div>
    <div class="mm-radio-card-text">
      <span class="mm-radio-card-name">{{ name }}</span>
      <span v-if="isSlotDescription" class="mm-radio-card-description">{{
        props.description
      }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mm-radio-card {
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e5e7eb;

  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 3px;
  min-width: 261px;
  max-width: 261px;
  cursor: pointer;

  &-header {
    display: flex;
    padding-top: 0.2em;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  &-text {
    display: flex;
    flex-direction: column;
    text-align: start;
    gap: 4px;
  }

  &-name {
    color: #344054;
    font-weight: 500;
  }

  &-description {
    color: #475467;
    font-weight: 400;
  }
  &-active {
    border: 1px solid #6c737f;
    background: #f9fafb;
  }
}
</style>
