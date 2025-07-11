<script setup lang="ts">
import { computed, onMounted, ref, Ref } from "vue";
import { useRoute } from "vue-router";
import MMAppBar from "~/common/components/app/MMAppBar.vue";
import MMAppNavigation from "~/common/components/app/MMAppNavigation.vue";
import MMAppView from "~/mm_ui_kit/src/components/MMAppView.vue";
import { authService } from "~/auth/auth.service";
import { UserProfileMM } from "~/auth/auth.types";
import CommonPageLayout from "./CommonPageLayout.vue";
import CommonPageEmptyLayout from "./CommonPageEmptyLayout.vue";
import CommonPageWithAsideLayout from "./CommonPageWithAsideLayout.vue";

const route = useRoute();

type LayoutName =
  | "CommonPageLayout"
  | "CommonPageEmptyLayout"
  | "CommonPageWithAsideLayout";

type LayoutComponent =
  | typeof CommonPageLayout
  | typeof CommonPageEmptyLayout
  | typeof CommonPageWithAsideLayout;

const subLayoutMap: Record<LayoutName, LayoutComponent> = {
  CommonPageLayout: CommonPageLayout,
  CommonPageEmptyLayout: CommonPageEmptyLayout,
  CommonPageWithAsideLayout: CommonPageWithAsideLayout,
};

const subLayout = computed(() => {
  const layoutName = route.meta.layoutName as LayoutName;
  return subLayoutMap[layoutName];
});

const layoutClass = computed(() => {
  return {
    "common-page-layout": route.meta.layoutName === "CommonPageLayout",
    "common-page-empty-layout":
      route.meta.layoutName === "CommonPageEmptyLayout",
    "common-page-with-aside-layout mm-flex":
      route.meta.layoutName === "CommonPageWithAsideLayout",
    "common-page-layout--support": userProfile.value?.aao !== "None",
  };
});

const userProfile: Ref<UserProfileMM | null> = ref(null);

onMounted(async () => {
  userProfile.value = await authService.getProfile();
});
</script>

<template>
  <div v-if="userProfile" :class="[layoutClass, 'mm-app-layout']">
    <!-- display banner if user is logged in as a support partner -->
    <m-m-support-banner
      v-if="userProfile?.aao !== 'None'"
      :own-org="userProfile?.own_org"
    ></m-m-support-banner>
    <m-m-app-bar />
    <m-m-app-navigation />
    <component
      :is="subLayout"
      v-if="subLayout"
      :key="`sub-layout-${route.path}`"
    />
    <m-m-app-view v-else :key="`app-view-${route.path}`" />
  </div>
  <m-m-progress-circular
    v-else
    :size="128"
    :width="12"
    class="loader-centered"
  />
</template>
