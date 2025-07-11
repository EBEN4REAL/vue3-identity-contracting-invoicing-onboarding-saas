<script setup lang="ts">
import { ref, Ref, PropType, computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Array as PropType<string[]>,
    default: () => [],
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
  errors: {
    type: Array,
    default: () => [],
  },
  type: {
    type: String,
    default: "text",
  },
  cy: {
    type: String,
    default: "tags-input",
  },
});

const inputValue: Ref<string> = ref("");
const inputRef: Ref<HTMLInputElement | null> = ref(null);

const emit = defineEmits(["update:modelValue"]);

const placeholderText = computed(() => {
  if (props.modelValue.length) {
    return "";
  }
  return props.placeholder;
});

const errorsFormatted = computed(() =>
  props.errors.map((error) => ({
    validator: error.$validator,
    message: error.$message,
  })),
);

const inputNewTag = (event: Event) => {
  inputValue.value = (event.target as HTMLInputElement).value;
};

// Add tag to the list (split input by spaces)
const addTag = () => {
  if (inputValue.value) {
    const newTags = inputValue.value
      .split(/\s+/)
      .filter((tag) => tag.trim() !== "");
    emit("update:modelValue", [...props.modelValue, ...newTags]);
    inputValue.value = "";
    inputRef.value?.focus();
  }
};

// Handle Enter or space key to add tag
const addTagOnKey = (event: KeyboardEvent) => {
  if (["Enter", " "].includes(event.key)) {
    event.preventDefault();
    addTag();
  }
};

// Handle paste event for multiple text
const handlePaste = (event: ClipboardEvent) => {
  const clipboardData =
    event.clipboardData || (window as unknown).clipboardData;
  if (clipboardData) {
    const pastedValue = clipboardData.getData("text");
    const items = pastedValue
      .split(/\s+/)
      .filter((item: string) => item.trim() !== "");
    emit("update:modelValue", [...props.modelValue, ...items]);
    inputValue.value = "";
    event.preventDefault();
    inputRef.value?.focus();
  }
};

const removeTag = (index: number) => {
  const newTags = props.modelValue.filter((_, i) => i !== index);
  emit("update:modelValue", newTags);
  inputRef.value?.focus();
};

const removeLastTag = () => {
  if (!inputValue.value && props.modelValue.length) {
    const newTags = props.modelValue.slice(0, -1);
    emit("update:modelValue", newTags);
  }
};
</script>

<template>
  <div
    :class="['mm-tags-input', { 'mm-tags-input--error': errors.length }]"
    :data-cy="cy"
    :data-cy-value="modelValue"
  >
    <div
      :class="[
        'mm-tags-input-label',
        { 'mm-tags-input-label--required': required },
      ]"
    >
      {{ label }}
    </div>
    <div class="mm-tags-input-wrapper">
      <div class="mm-tags-input-tags">
        <div
          v-for="(tag, index) in props.modelValue"
          :key="index"
          class="mm-tags-input-tag"
        >
          {{ tag }}
          <m-m-icon
            icon="close-small"
            width="12px"
            stroke="#98A2B3"
            height="12px"
            class="mm-tags-input-tag-close"
            @click="removeTag(index)"
          />
        </div>
        <input
          ref="inputRef"
          v-model="inputValue"
          class="mm-tags-input-input"
          :placeholder="placeholderText"
          :type="type"
          @input="inputNewTag"
          @keydown="addTagOnKey"
          @keydown.delete="removeLastTag"
          @blur="addTag"
          @paste="handlePaste"
        />
      </div>
    </div>
    <ul class="mm-tags-input-errors">
      <li
        v-for="error in errorsFormatted"
        :key="`${error.validator}-${error.message}`"
        class="mm-tags-input-errors-item"
        :data-cy="`mm-tags-input-error-${error.validator}-text`"
      >
        {{ error.message }}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.mm-tags-input {
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
        content: "*";
        color: #f04438;
      }
    }
  }

  &-wrapper {
    display: flex;
    padding: 8px 14px;
    border-radius: 8px;
    border: 1px solid #d0d5dd;
    background: #fff;
    box-shadow: 0 1px 2px 0 rgba(16, 24, 40, 0.05);
    outline: none;
    transition:
      border-color 0.3s,
      box-shadow 0.3s;

    &:focus-within {
      border-color: #384250;
      box-shadow: 0 0 0 3px rgba(16, 24, 40, 0.1);
    }
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

  &-input {
    outline: none;
    flex-grow: 1;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    color: #667085;

    &::placeholder {
      color: #667085;
    }
  }

  &--error {
    .mm-tags-input-wrapper {
      box-shadow: none;
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
