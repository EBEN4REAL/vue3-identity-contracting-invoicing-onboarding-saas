<script setup lang="ts">
import { PropType, Ref, computed, ref } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  value: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
    required: true,
  },
  variant: {
    type: String as PropType<"default" | "outlined">,
    default: "default",
  },
  errors: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  showErrorMessage: {
    type: Boolean,
    default: true,
  },
  cy: {
    type: String,
    default: "radiobutton",
  },
});

const emit = defineEmits(["update:modelValue"]);

const isRadiobuttonActive = computed(() => props.modelValue === props.value);
const isRadioButtonFocused: Ref<boolean> = ref(false);
const mmRadiobuttonClassList = computed(() => [
  "mm-radiobutton",
  { "mm-radiobutton-active": isRadiobuttonActive.value },
  `mm-radiobutton-variant-${props.variant}`,
  {
    "mm-radiobutton-error": props.errors.length,
  },
  {
    "mm-radiobutton-disabled": props.disabled,
  },
]);
const mmRadioButtonIndicator = computed(() => [
  "mm-radiobutton-indicator",
  {
    "mm-radiobutton-indicator-focused": isRadioButtonFocused.value,
  },
]);

const errorsFormatted = computed(() =>
  props.errors.map((error) => ({
    validator: error.$validator,
    message: error.$message,
  })),
);

const onInput = () => {
  emit("update:modelValue", props.value);
};
const onFocusIn = async () => {
  isRadioButtonFocused.value = true;
};
const onFocusOut = async () => {
  isRadioButtonFocused.value = false;
};
const handleEscape = () => {
  isRadioButtonFocused.value = false;
};
const handleEnter = () => {
  emit("update:modelValue", props.value);
};
</script>

<template>
  <label
    :class="mmRadiobuttonClassList"
    tabindex="0"
    :data-cy="`${props.cy}-label`"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
    @keydown.enter="handleEnter"
    @keydown.esc="handleEscape"
  >
    <input
      :value="value"
      type="radio"
      :name="name"
      :data-cy="cy"
      :disabled="disabled"
      hidden
      @click="onInput"
    />
    <span :class="mmRadioButtonIndicator" />
    <span class="mm-radiobutton-label mm-ml-4">
      <slot />
    </span>
  </label>
  <ul
    v-if="errors && errors.length > 0 && showErrorMessage"
    class="mm-radiobutton-errors"
  >
    <span class="mm-flex mm-flex-align-end mm-flex-gap-4">
      <m-m-icon icon="warning" width="16" height="16" />
      <li
        v-for="error in errorsFormatted"
        :key="`${error.validator}-${error.message}`"
        class="mm-radiobutton-errors-item"
        :data-cy="`mm-radiobutton-error-${error.validator}-text`"
      >
        {{ error.message }}
      </li></span
    >
  </ul>
</template>

<style scoped lang="scss">
@mixin afterCheck($width, $height, $background-color) {
  &:after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    width: $width;
    height: $height;
    border-radius: 50%;
    background-color: $background-color;
    opacity: 0;
    transform: scale(0.5);
    transition:
      opacity 0.3s,
      transform 0.3s;
    will-change: opacity, transform;
  }
}

.mm-radiobutton {
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  &-label {
    display: flex;
    align-items: center;
  }

  &-error {
    &.mm-radiobutton-variant-outlined .mm-radiobutton-indicator {
      border: 1px solid #d92d20;
    }
  }

  &-variant {
    &-default {
      .mm-radiobutton {
        &-indicator {
          position: relative;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid #072e51;
          @include afterCheck(8px, 8px, #072e51);
          &-focused {
            box-shadow: 0 0 0 3px rgba(16, 24, 40, 0.1);
          }
        }
      }
    }
    &-outlined {
      .mm-radiobutton {
        &-indicator {
          position: relative;
          width: 20px;
          height: 20px;
          border-radius: 10px;
          border: 1px solid #4d5761;
          &-focused {
            box-shadow: 0 0 0 3px rgba(16, 24, 40, 0.1);
          }

          @include afterCheck(8px, 8px, #4d5761);
        }
      }
    }
  }

  &-active {
    .mm-radiobutton {
      &-indicator {
        &:after {
          opacity: 1;
          transform: scale(1);
        }
      }
    }
  }

  &-errors {
    list-style: none;
    flex-basis: 100%;
    margin-top: 5px;

    &-item {
      margin-top: 6px;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 18px;
      color: #d92d20;
    }
  }

  &-disabled {
    cursor: not-allowed;
    opacity: 0.5;
    user-select: none;
  }
}
</style>
