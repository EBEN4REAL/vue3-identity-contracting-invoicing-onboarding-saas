<script setup lang="ts">
import { ref } from "vue";
import Counter from "./Counter.vue";
import { TypeTab } from "~/mm_ui_kit/src/types/types";

const TABS: TypeTab[] = [
  { label: "Tab 1", name: "Tab 1", isRequired: true },
  { label: "Tab 2 (cached)", name: "Tab 2", isRequired: true },
  { label: "Tab 3", name: "Tab 3", isRequired: false },
  { label: "Tab 4", name: "Tab 4", isRequired: false },
];

const tabActive = ref(TABS[0].name);
</script>

<template>
  <div class="mm-mb-12">
    <h3 class="mm-page-subtitle mm-page-subtitle--h1 mm-mb-4">First level:</h3>
    <m-m-tabs v-model="tabActive" :items="TABS" />
  </div>

  <div class="mm-mb-12">
    <h3 class="mm-page-subtitle mm-page-subtitle--h1 mm-mb-4">
      First level with required:
    </h3>
    <m-m-tabs v-model="tabActive" :items="TABS" is-in-edit-mode />
  </div>

  <div class="mm-mb-12">
    <h3 class="mm-page-subtitle mm-page-subtitle--h1 mm-mb-4">Second level:</h3>
    <m-m-tabs v-model="tabActive" :items="TABS" is-second-level />
  </div>

  <div class="mm-mb-12">
    <m-m-tab-items :current-tab="tabActive">
      <m-m-tab-item :name="TABS[0].name">
        <Counter />
      </m-m-tab-item>
      <m-m-tab-item keep-alive :name="TABS[1].name">
        <Counter />
      </m-m-tab-item>
      <m-m-tab-item :name="TABS[2].name"><p>Tab 3 content</p></m-m-tab-item>
      <m-m-tab-item :name="TABS[3].name"><p>Tab 4 content</p></m-m-tab-item>
    </m-m-tab-items>
  </div>
</template>

<style scoped lang="scss"></style>
