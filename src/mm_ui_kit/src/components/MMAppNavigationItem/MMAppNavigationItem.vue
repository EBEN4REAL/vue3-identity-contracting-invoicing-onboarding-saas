<script setup lang="ts">
import { computed, ComputedRef } from "vue";
import { useRoute } from "vue-router";

const props = defineProps({
  to: {
    type: String,
    default: null,
  },
  label: {
    type: String,
    default: "",
    required: true,
  },
  iconPrepend: {
    type: String,
    default: null,
  },
  iconPrependSize: {
    type: String,
    default: "20px",
  },
  iconAppend: {
    type: String,
    default: null,
  },
  iconAppendSize: {
    type: String,
    default: "20px",
  },
  isComingSoon: {
    type: Boolean,
    default: false,
  },
  isHidden: {
    type: Boolean,
    default: false,
  },
  isReload: {
    type: Boolean,
    default: false,
  },
});

const route = useRoute();

const isMenuItemActive: ComputedRef<boolean> = computed(
  () => Boolean(props.to) && Boolean(route.path.startsWith(props.to)),
);

const iconColor = computed(() =>
  props.isComingSoon
    ? "#5a6374"
    : isMenuItemActive.value
      ? "#132D4E"
      : "#072E51",
);

const mmAppNavigationItemClassList = computed(() => [
  "mm-app-navigation-item",
  { "mm-app-navigation-item--active": isMenuItemActive.value },
  { "mm-app-navigation-item--coming-soon": props.isComingSoon },
]);

const componentToUse: ComputedRef<string> = computed(() => {
  if (!props.to) return "div";
  if (props.isReload) return "a";
  return "router-link";
});

const href: ComputedRef<string | null> = computed(() =>
  props.isReload ? props.to : null,
);
</script>

<template>
  <component
    :is="componentToUse"
    v-if="!isHidden"
    :to="to"
    :href="href"
    :class="mmAppNavigationItemClassList"
  >
    <m-m-icon
      v-if="iconPrepend"
      :icon="iconPrepend"
      :width="iconPrependSize"
      :height="iconPrependSize"
      :stroke="iconColor"
    />
    <div v-if="label" v-sanitize-html="label" />
    <m-m-badge v-if="isComingSoon">Coming Soon</m-m-badge>
    <m-m-icon
      v-if="iconAppend"
      :icon="iconAppend"
      :width="iconAppendSize"
      :height="iconAppendSize"
      :stroke="iconColor"
      class="mm-ml-auto"
    />
  </component>
</template>

<style scoped lang="scss">
.mm-app-navigation-item {
  display: flex;
  flex: 0;
  align-items: center;
  width: 100%;
  padding: 8px 12px;
  gap: 12px;
  transition: background-color 0.3s;
  will-change: background-color;
  white-space: nowrap;
  text-decoration: none;
  font-size: 16px;
  line-height: 24px;
  color: #072e51;
  border-radius: 60px;
  user-select: none;
  cursor: pointer;

  .link-icon-append {
    transition: transform 0.2s;
  }

  &:hover {
    background-color: rgba(#072e51, 0.045);
  }

  &--active {
    background-color: #132d4e1a;
    color: #132d4e;
    font-weight: 500;

    &:hover {
      background-color: #132d4e1a;
      color: #132d4e;
      font-weight: 500;
    }
  }

  &--coming-soon {
    color: #6d7480;
    cursor: not-allowed;
    pointer-events: none;

    :deep(.mm-badge) {
      background-color: #e7e7e7;
      border-color: #eaecf0;
      color: #5a6374;
      font-style: italic;
    }
  }
}
</style>
