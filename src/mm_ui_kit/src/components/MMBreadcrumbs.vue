<script setup lang="ts">
import { PropType, computed } from "vue";
import { TypeBreadcrumbItem } from "../types/breadcrumb.types";

const props = defineProps({
  breadcrumbs: {
    type: Array as PropType<TypeBreadcrumbItem[]>,
    default: () => [],
  },
});

const isLastBreadcrumb = computed(
  () => (index: number) => props.breadcrumbs.length - 1 === index,
);

const breadcrumbClassList = computed(() => (index: number) => [
  "mm-breadcrumb",
  { "mm-breadcrumb--active": isLastBreadcrumb.value(index) },
  "mm-px-4",
  "mm-py-2",
  "font-weight-500",
]);
</script>

<template>
  <div class="mm-breadcrumbs" data-cy="breadcrumbs">
    <div
      v-for="(breadcrumb, breadcrumbIndex) in breadcrumbs"
      :key="`${breadcrumb.to}-${breadcrumb.label}`"
      class="mm-breadcrumb-wrapper"
    >
      <m-m-link
        v-if="!isLastBreadcrumb(breadcrumbIndex)"
        :to="breadcrumb.to"
        :class="breadcrumbClassList(breadcrumbIndex)"
        data-cy="breadcrumb-link"
      >
        {{ breadcrumb.label }}
      </m-m-link>
      <div
        v-else
        :class="breadcrumbClassList(breadcrumbIndex)"
        data-cy="breadcrumb"
      >
        {{ breadcrumb.label }}
      </div>
      <m-m-icon
        v-if="!isLastBreadcrumb(breadcrumbIndex)"
        icon="chevron-right"
        class="mm-mx-4"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.mm-breadcrumbs {
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;

  .mm-breadcrumb {
    color: #475467;
    font-size: 14px;

    &-wrapper {
      display: flex;
      align-items: center;
    }

    &--active {
      color: #072e51;
      border-radius: 6px;
      background: rgba(7, 46, 81, 0.1);
    }
  }
}
</style>
