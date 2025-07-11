<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";

const props = defineProps({
  icon: {
    type: String,
    default: "",
  },
  iconFolder: {
    type: String,
    default: "icons",
  },
  width: {
    type: String,
    default: "24px",
  },
  height: {
    type: String,
    default: "24px",
  },
  fill: {
    type: String,
    default: "transparent",
  },
  stroke: {
    type: String,
    default: "none",
  },
  hasWrapper: {
    type: Boolean,
    default: false,
  },
  initialsFontSize: {
    type: String,
    default: "18px",
  },
});

const isInitials = computed(() => props.icon.includes("initials"));
const initials = computed(() => props.icon.split("-")[1].toUpperCase());

const SVGIcon = computed(() => {
  const iconName = props.icon;
  const iconFolder = props.iconFolder;
  return defineAsyncComponent(
    () => import(`../assets/${iconFolder}/${iconName}.svg`),
  );
});

const mmIconStyles = computed(() => ({
  width: props.width,
  height: props.height,
  fill: props.fill,
  stroke: props.stroke,
  display: "block",
}));
</script>

<template>
  <div v-if="isInitials" class="mm-icon-initials">{{ initials }}</div>

  <div
    v-else-if="hasWrapper"
    class="mm-icon-wrapper mm-flex mm-flex-align-center mm-flex-justify-center"
  >
    <component :is="SVGIcon" :style="mmIconStyles" />
  </div>

  <component :is="SVGIcon" v-else :style="mmIconStyles" />
</template>

<style lang="scss" scoped>
.mm-icon-initials {
  font-size: v-bind(initialsFontSize);
  font-weight: 500;
  line-height: 28px;
  letter-spacing: 0;
  color: #072e51;
}
.mm-icon-wrapper {
  min-width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f4f5f7;
}
</style>
