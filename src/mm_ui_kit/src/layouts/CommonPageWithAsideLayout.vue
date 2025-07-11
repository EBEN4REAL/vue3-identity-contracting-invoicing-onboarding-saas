<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();
const backTo = computed(
  () => route.meta.backTo as { label: string; link: string },
);
</script>

<template>
  <aside
    data-teleport="common-page-with-aside-layout-aside"
    class="common-page-with-aside-layout-aside"
  />
  <main class="common-page-with-aside-layout-main">
    <header class="common-page-with-aside-layout-header mm-px-16">
      <div
        data-teleport="common-page-with-aside-layout-header-breadcrumbs"
        class="header-breadcrumbs"
      />
      <m-m-link v-if="backTo" :to="backTo.link" class="header-back-to">
        <m-m-icon icon="arrow-left" width="16px" class="mm-mr-1" />
        <span class="font-weight-500"> Back to {{ backTo.label }} </span>
      </m-m-link>
      <div class="header-main">
        <div class="mm-flex">
          <div
            class="header-icon mm-mr-6"
            data-teleport="common-page-with-aside-layout-header-icon"
          />
          <div
            class="header-title-subtitle mm-flex mm-flex-column mm-flex-justify-center"
          >
            <div
              class="header-title"
              data-teleport="common-page-with-aside-layout-header-title"
              data-cy="header-title"
            />
            <div
              class="header-subtitle"
              data-teleport="common-page-with-aside-layout-header-subtitle"
              data-cy="header-subtitle"
            />
          </div>
        </div>
        <div data-teleport="common-page-with-aside-layout-header-controls" />
      </div>
      <div
        class="header-tabs mm-ml-auto"
        data-teleport="common-page-with-aside-layout-header-tabs"
      />
    </header>
    <div class="common-page-with-aside-layout-content mm-px-16 mm-py-12">
      <div class="content">
        <router-view />
      </div>
    </div>
  </main>
</template>
