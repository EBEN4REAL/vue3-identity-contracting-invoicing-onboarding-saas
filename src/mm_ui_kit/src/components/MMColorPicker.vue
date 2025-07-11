<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  initColor: {
    type: String,
    default: "#072e51",
  },
  isEditMode: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["color-selected", "text-color"]);
const color = ref(props.initColor);
const showPicker = ref(false);

const updateColor = (newColor: string) => {
  if (props.isEditMode) {
    color.value = newColor;
    emit("color-selected", newColor);
    emit("text-color");
  }
};
const closePicker = () => {
  showPicker.value = false;
};

watch(
  () => props.initColor,
  () => {
    color.value = props.initColor;
  },
);
</script>

<template>
  <div class="mm-color-picker">
    <div
      v-if="$slots['color-picker-title']"
      class="mm-color-picker-title"
      data-cy="color-picker-title"
    >
      <slot name="color-picker-title" />
    </div>
    <div
      v-if="$slots['color-picker-subtitle']"
      class="mm-color-picker-subtitle"
      data-cy="color-picker-subtitle"
    >
      <slot name="color-picker-subtitle" />
    </div>
    <div class="mm-flex mm-flex-justify-between mm-flex-gap-10">
      <div class="mm-color-picker-container">
        <button
          data-cy="color-picker-button"
          class="mm-color-picker-button"
          :disabled="!isEditMode"
          @click.stop="showPicker = !showPicker"
        />
        <span v-if="showPicker" v-mm-click-outside="closePicker">
          <v-color-picker
            id="color-picker-selector"
            :model-value="color"
            mode="hex"
            position="absolute"
            :disabled="!isEditMode"
            @update:model-value="updateColor"
          />
        </span>
        <input
          :value="color"
          data-cy="color-picker-text"
          type="text"
          readonly
          :disabled="!isEditMode"
          @click.stop="showPicker = !showPicker"
          @input="updateColor"
        />
      </div>
      <div v-if="$slots['color-picker-content']" data-cy="color-picker-content">
        <slot name="color-picker-content" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mm-color-picker {
  &-container {
    padding: 4px;
    border-radius: 8px;
    border: 1px solid #384250;
    width: 124px;
    height: 40px;
    display: flex;
    align-items: center;
  }

  &-button {
    width: 25px;
    height: 25px;
    border-radius: 4px;
    margin-right: 5px;
    background-color: v-bind(color);
  }

  &-title {
    font-size: 18px;
    font-weight: 600;
    line-height: 28px;
    color: #111927;
  }

  &-subtitle {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #6d7480;
    margin-bottom: 24px;
  }

  input[type="text"] {
    background: transparent;
    border: 0;
    font-size: 16px;
    color: #384250;
    font-weight: 500;
    text-transform: uppercase;
    max-width: 75px;
    cursor: pointer;

    &:focus {
      outline: none;
    }
    &:disabled {
      cursor: not-allowed;
    }
  }
}
</style>
