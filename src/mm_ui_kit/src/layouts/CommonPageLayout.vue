<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, ComputedRef } from "vue";
import { useUiStore } from "~/stores/useUiStore";

const route = useRoute();
const uiStore = useUiStore();

const scrimmedClass: ComputedRef<string> = computed(() =>
  uiStore.isScrimmed ? "mm-opacity-40" : "",
);

const backTo = computed(() => {
  const routeBackTo = route.meta.backTo as {
    label: string;
    link: string;
    withParams: boolean | undefined;
  };

  if (routeBackTo?.withParams === undefined || !routeBackTo.withParams) {
    return routeBackTo;
  }

  const map = new Map(Object.entries(route.params));
  let newLink = routeBackTo.link;

  map.forEach((value, key) => {
    newLink = newLink.replace(`:${key}`, value as string);
  });

  return {
    label: routeBackTo.label,
    link: newLink,
  };
});
</script>

<template>
  <main class="common-page-layout-main mm-py-16">
    <header class="common-page-layout-header mm-px-16">
      <div
        data-teleport="common-page-layout-top-banner"
        class="common-page-layout-top-banner"
      />
      <div data-teleport="mm-config-banner-section"></div>
      <div
        data-teleport="common-page-layout-top-banner-secondary"
        class="common-page-layout-top-banner-secondary"
      />
      <div
        v-if="route.meta.hasBreadcrumbs"
        data-teleport="common-page-layout-header-breadcrumbs"
        class="header-breadcrumbs"
      />
      <m-m-link v-if="backTo" :to="backTo.link" class="header-back-to mm-mb-12">
        <m-m-icon
          icon="arrow-left"
          width="16px"
          class="mm-mr-1"
          data-cy="back-link"
        />
        <span class="font-weight-500"> Back to {{ backTo.label }} </span>
      </m-m-link>
      <div class="header-main" :class="scrimmedClass">
        <div class="mm-flex">
          <div v-if="route.meta.hasIcon" class="header-icon mm-mr-6">
            <div data-teleport="common-page-layout-header-icon" />
          </div>
          <div
            class="header-title-subtitle mm-flex mm-flex-column mm-flex-justify-center"
          >
            <div
              class="header-title"
              data-teleport="common-page-layout-header-title"
              data-cy="header-title"
            />
            <div
              class="header-subtitle"
              data-teleport="common-page-layout-header-subtitle"
              data-cy="header-subtitle"
            />
          </div>
        </div>
        <div data-teleport="common-page-layout-header-controls" />
      </div>
      <div
        data-teleport="common-page-layout-header-banner"
        class="common-page-layout-header-banner"
      />
      <div
        class="header-tabs mm-ml-auto"
        :class="scrimmedClass"
        data-teleport="common-page-layout-header-tabs"
      />
    </header>
    <div class="common-page-layout-content mm-px-16 mm-py-12">
      <div class="content">
        <router-view :key="route.fullPath" />
      </div>
    </div>
    <div
      data-teleport="common-page-layout-footer-banner"
      class="common-page-layout-footer-banner mm-px-16"
    />
  </main>
</template>

<style scoped lang="scss">
.common-page-layout-header-banner {
  display: flex;
  width: 100%;
}
</style>
