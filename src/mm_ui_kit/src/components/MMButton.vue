<script setup lang="ts">
import { PropType, computed, ComputedRef } from "vue";
import {
  TypeButtonSize,
  TypeButtonType,
  TypeButtonVariant,
} from "../types/button.types";

const props = defineProps({
  type: {
    type: String as PropType<TypeButtonType>,
    default: "button",
  },
  cy: {
    type: String,
    default: "button",
  },
  value: {
    type: String,
    default: "",
  },
  isOnlyIcon: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String as PropType<TypeButtonVariant>,
    default: "elevated",
  },
  size: {
    type: String as PropType<TypeButtonSize>,
    default: "medium",
  },
  isTile: {
    type: Boolean,
    default: false,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  isFullWidth: {
    type: Boolean,
    default: false,
  },
  prependIcon: {
    type: String,
    default: "",
  },
  appendIcon: {
    type: String,
    default: "",
  },
  minWidth: {
    type: String,
    default: null,
  },
  iconSize: {
    type: String,
    default: "18px",
  },
  iconHeight: {
    type: String,
    default: "",
  },
  iconClass: {
    type: String,
    default: "",
  },
  iconStroke: {
    type: String,
    default: "none",
  },
});

const iconHeight: ComputedRef<string> = computed(() =>
  props.iconHeight ? props.iconHeight : props.iconSize,
);

const classList = computed(() => {
  return [
    "mm-button",
    `mm-button--variant-${props.variant}`,
    `mm-button--size-${props.size}`,
    {
      "mm-button--full-width": props.isFullWidth,
    },
    {
      "mm-button--tile": props.isTile,
    },
    {
      "mm-button--loading": props.loading,
    },
    {
      "mm-button--only-icon": props.isOnlyIcon,
    },
  ];
});

const spinnerColor: ComputedRef<string> = computed(() => {
  if (props.variant === "elevated") return "white";
  if (props.variant === "danger") return "white";
  if (props.variant === "text-danger") return "danger";
  return "primary";
});

const mmIconAppendClass: ComputedRef<string[]> = computed(() => {
  return ["mm-button__icon", props.iconClass || ""];
});
</script>

<template>
  <button
    :type="props.type"
    :class="classList"
    :disabled="isDisabled"
    :data-cy="cy"
  >
    <m-m-spinner v-if="loading" :color="spinnerColor" />
    <m-m-icon
      v-if="prependIcon"
      :icon="prependIcon"
      :width="iconSize"
      :height="iconHeight"
      :stroke="iconStroke"
      class="mm-button__icon"
    />
    <span v-if="$slots.default && !props.isOnlyIcon" class="mm-button__text">
      <slot />
    </span>
    <m-m-icon
      v-if="appendIcon"
      :icon="appendIcon"
      :width="iconSize"
      :height="iconHeight"
      :class="mmIconAppendClass"
      :stroke="iconStroke"
    />
  </button>
</template>

<style scoped lang="scss">
$color-primary: #072e51;
$color-tertiary: #e6eaee;
$color-white: #fff;

$color-danger: #d92d20;
$color-danger-light: #fee4e2;
$color-dark-blue: #072e51;

$color-gray-dark: #9da4ae;
$color-gray: #d2d6db;
$color-gray-light: #e5e7eb;
$color-gray-lighter: #f3f4f6;

$color-shadow: rgba(7, 46, 81, 0.7);
$color-shadow-light: rgba(7, 46, 81, 0.2);
$color-shadow-danger: rgba(217, 54, 32, 0.28);

$padding-y-small: 6px;
$padding-y-medium: 8px;
$padding-x: 16px;
$padding-x-small: 6px;

$border-width: 1px;

.mm-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  gap: 10px;
  border-radius: 67px;
  border-width: $border-width;
  border-style: solid;
  font-family: Haffer, sans-serif;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition:
    box-shadow 0.3s,
    background-color 0.3s;
  will-change: box-shadow, background-color;

  min-width: v-bind(minWidth);

  &__text {
    display: inline-flex;
    align-items: center;

    &:has(.mm-truncate) {
      overflow: hidden;
    }
  }

  &[disabled] {
    cursor: not-allowed;
    box-shadow: none;

    &:hover,
    &:active {
      box-shadow: none;
      outline: none;
    }

    :deep(svg) {
      stroke: $color-gray;
    }

    :deep(path) {
      stroke: $color-gray;
    }
  }

  &--full-width {
    width: 100%;
  }

  &--loading {
    pointer-events: none;
    position: relative;

    * {
      opacity: 0;
    }

    :deep(.mm-spinner) {
      opacity: 1;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      margin: auto;
    }
  }

  &--size-small {
    padding: ($padding-y-small - $border-width) ($padding-x - $border-width);
    font-size: 14px;
    line-height: 20px;

    &.mm-button--only-icon {
      padding: ($padding-y-small - $border-width)
        ($padding-x-small - $border-width);
    }
  }

  &--size-medium {
    padding: ($padding-y-medium - $border-width) ($padding-x - $border-width);
    font-size: 16px;
    line-height: 24px;
  }

  &--size-medium &__icon {
    margin-top: 3px;
    margin-bottom: 3px;
  }

  &--variant-elevated {
    background-color: $color-primary;
    border-color: $color-primary;
    color: $color-white;
    box-shadow: 0 1px 8px 0 $color-shadow-light;

    &:hover {
      box-shadow: 0 1px 8px 0 $color-shadow;
    }

    &:active {
      outline: 2px solid $color-gray;
      box-shadow: 0 1px 8px 0 $color-shadow-light;
    }

    &[disabled] {
      background-color: $color-gray;
      border-color: $color-gray;

      :deep(path) {
        stroke: $color-white;
      }
    }
  }

  &--variant-outlined {
    background-color: $color-white;
    color: $color-primary;
    border-color: $color-primary;

    &:hover {
      border-color: $color-primary;
      background-color: $color-gray-lighter;
    }

    &[disabled] {
      color: $color-gray-light;
      border-color: $color-gray-light;

      &:hover {
        background-color: $color-white;
      }
    }

    &:active {
      outline: 2px solid $color-gray;
    }
  }

  &--variant-outlined-danger {
    background-color: $color-white;
    color: $color-danger;
    border-color: $color-danger;

    &:hover {
      border-color: $color-danger-light;
      background-color: $color-danger-light;
    }

    &[disabled] {
      color: $color-gray-light;
      border-color: $color-gray-light;

      &:hover {
        background-color: $color-white;
      }
    }

    &:active {
      outline: 2px solid $color-gray;
    }
  }

  &--variant-outlined-light {
    background-color: $color-white;
    color: $color-primary;
    border-color: $color-gray-light;

    &:hover {
      border-color: $color-gray-light;
      background-color: $color-gray-lighter;
    }

    &[disabled] {
      color: $color-gray-light;
      border-color: $color-gray-light;

      &:hover {
        background-color: $color-white;
      }
    }

    &:active {
      outline: 2px solid $color-gray-lighter;
    }
  }

  &--variant-text {
    background-color: $color-white;
    color: $color-primary;
    border-color: $color-white;

    &:hover {
      border-color: $color-gray-lighter;
      background-color: $color-gray-lighter;
    }

    &[disabled] {
      color: $color-gray;
      border-color: $color-white;
      background-color: $color-white;

      &:hover {
        background-color: $color-white;
      }
    }

    &:active {
      background-color: $color-white;
      outline: 2px solid $color-gray-lighter;
    }
  }

  &--variant-text-danger {
    background-color: $color-white;
    color: $color-danger;
    border-color: $color-white;

    &:hover {
      border-color: $color-gray-lighter;
      background-color: $color-gray-lighter;
    }

    &[disabled] {
      color: $color-gray;
      border-color: $color-white;
      background-color: $color-white;

      &:hover {
        background-color: $color-white;
      }
    }

    &:active {
      background-color: $color-white;
      outline: 2px solid $color-gray-lighter;
    }
  }

  &--variant-tertiary {
    background-color: $color-tertiary;
    color: $color-primary;
    border-color: $color-tertiary;

    &:hover {
      border-color: $color-gray-light;
      background-color: $color-gray-light;
    }

    &[disabled] {
      color: $color-gray-dark;
      border-color: $color-tertiary;
      background-color: $color-tertiary;
    }

    &:active {
      outline: 2px solid $color-gray-lighter;
    }
  }

  &--variant-danger {
    background-color: $color-danger;
    color: $color-white;
    border-color: $color-danger-light;
    box-shadow: 0 1px 8px 0 $color-shadow-light;

    &:hover {
      box-shadow: 0 1px 8px 0 $color-shadow-danger;
    }

    &[disabled] {
      color: $color-white;
      border-color: $color-danger-light;
      background-color: $color-danger-light;

      :deep(svg) {
        stroke: $color-white;
      }

      :deep(path) {
        stroke: $color-white;
      }
    }

    &:active {
      outline: 2px solid $color-danger-light;
      box-shadow: 0 1px 8px 0 $color-shadow-light;
    }
  }

  &--variant-transparent {
    background-color: none;
    color: $color-dark-blue;
    border: none;

    &[disabled] {
      opacity: 0.5;
    }
  }

  &--variant-inline-in-input {
    background-color: $color-white;
    color: $color-gray;
    border-color: $color-gray;
    border-radius: 0;
    border-left: none;
    padding: 0;

    .mm-button__text {
      padding: 11px 15px;
    }

    &:hover {
      background-color: $color-gray-lighter;
    }

    &[disabled] {
      color: $color-gray-light;
      border-color: $color-gray-light;

      &:hover {
        background-color: $color-white;
      }
    }

    &:last-child {
      border-radius: 0 8px 8px 0;
    }
  }

  &--tile {
    border-radius: 6px;
  }
}
</style>
