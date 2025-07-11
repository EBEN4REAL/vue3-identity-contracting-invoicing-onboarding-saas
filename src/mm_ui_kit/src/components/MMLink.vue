<script setup lang="ts">
import { PropType, computed } from "vue";
import type { TypeColors, TypeAlignX } from "../types/types";

const props = defineProps({
  to: {
    type: String,
    default: "",
  },
  href: {
    type: String,
    default: "",
  },
  target: {
    type: String as PropType<
      "_blank" | "_self" | "_parent" | "_top" | "framename"
    >,
    default: "_self",
  },
  color: {
    type: String as PropType<TypeColors>,
    default: "primary",
  },
  fontSize: {
    type: String,
    default: "14px",
  },
  fontWeigth: {
    type: String,
    default: "600",
  },
  textAlign: {
    type: String as PropType<TypeAlignX>,
    default: "center",
  },
  underline: {
    type: Boolean,
    default: false,
  },
  cy: {
    type: String,
    default: "link",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const classList = computed(() => [
  "mm-link",
  `mm-link-color-${props.color}`,
  `mm-link-text-align-${props.textAlign}`,
  `font-weight-${props.fontWeigth}`,
  `mm-fs-${props.fontSize}`,
  { "mm-link-disabled": props.disabled },
  {
    "mm-link-underline": props.underline,
  },
]);

const handleClick = (event: MouseEvent) => {
  if (props.target === "_blank") {
    event.stopPropagation();
  }
};
</script>

<template>
  <a
    v-if="href || (!href && !to)"
    :href="href"
    :target="target"
    :class="classList"
    :data-cy="cy"
    :download="$attrs.download"
    @click="handleClick"
  >
    <slot />
  </a>
  <router-link v-else :to="to" :class="classList" :data-cy="cy">
    <slot />
  </router-link>
</template>
