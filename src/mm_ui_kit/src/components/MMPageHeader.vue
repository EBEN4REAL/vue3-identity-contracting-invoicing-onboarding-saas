<script setup lang="ts">
import { computed, ComputedRef, PropType, ref } from "vue";
import { TypeBreadcrumbItem } from "../types/breadcrumb.types";
import { useTranslation } from "i18next-vue";
import { useRoute } from "vue-router";
import escapeObjectValuesForHtml from "~/mm_ui_kit/src/helpers/escapeObjectValuesForHtml";

const props = defineProps({
  isInEditMode: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: "",
  },
  iconStroke: {
    type: String,
    default: "#072E51",
  },
  breadcrumbs: {
    type: Array as PropType<TypeBreadcrumbItem[]>,
    default: () => [],
  },
  baseKey: {
    type: String,
    required: true,
    default: "",
  },
  params: {
    type: Object,
    default: () => ({}),
  },
  bannerSettings: {
    type: Object,
    default: () => ({
      showTopBanner: false,
      showTopBannerSecondary: false,
      showHeaderBanner: false,
      showFooterBanner: false,
    }),
  },
  showEllipsis: {
    type: Boolean,
    default: false,
  },
  showConfigBanner: {
    type: Boolean,
    default: true,
  },
  configBannerCmp: {
    type: Object,
    default: null,
  },
});

const route = useRoute();
const { t } = useTranslation();
const configBannerRef = ref(null);
const isConfigurationItem = computed(() => route.path.includes("config"));

const fullBaseKey: ComputedRef<string> = computed(() =>
  isConfigurationItem.value ? `configuration.${props.baseKey}` : props.baseKey,
);

const translatedHeaderBanner: ComputedRef<string> = computed(() =>
  t(`${fullBaseKey.value}.header-banner`),
);
const translatedFooterBanner: ComputedRef<string> = computed(() =>
  t(`${fullBaseKey.value}.footer-banner`),
);
const translatedTopBanner: ComputedRef<string> = computed(() =>
  t(`${fullBaseKey.value}.top-banner`),
);
const translatedTopBannerSecondary: ComputedRef<string> = computed(() =>
  t(`${fullBaseKey.value}.top-banner-secondary`),
);

const translatedTitle: ComputedRef<string> = computed(() =>
  t(`${fullBaseKey.value}.title`, {
    ...escapeObjectValuesForHtml(props.params),
    defaultValue: "",
  }),
);
const translatedSubtitle: ComputedRef<string> = computed(() =>
  t(`${fullBaseKey.value}.subtitle`, {
    ...escapeObjectValuesForHtml(props.params),
    defaultValue: "",
  }),
);

defineExpose({
  configBannerRef,
});
</script>
<template>
  <m-m-teleport
    v-if="bannerSettings.showTopBanner"
    to="common-page-layout-top-banner"
  >
    <m-m-banner :content="translatedTopBanner" class="mm-mb-8" />
  </m-m-teleport>
  <m-m-teleport to="mm-config-banner-section">
    <component
      :is="props.configBannerCmp"
      v-if="props.configBannerCmp && !isInEditMode && showConfigBanner"
      ref="configBannerRef"
    />
  </m-m-teleport>
  <m-m-teleport
    v-if="bannerSettings.showTopBannerSecondary"
    to="common-page-layout-top-banner-secondary"
  >
    <m-m-banner :content="translatedTopBannerSecondary" class="mm-mb-8" />
  </m-m-teleport>

  <m-m-teleport
    v-if="bannerSettings.showHeaderBanner"
    to="common-page-layout-header-banner"
  >
    <m-m-banner :content="translatedHeaderBanner" class="mm-mb-8" />
  </m-m-teleport>
  <m-m-teleport
    v-if="bannerSettings.showFooterBanner"
    to="common-page-layout-footer-banner"
  >
    <m-m-banner :content="translatedFooterBanner" class="mm-mb-8" />
  </m-m-teleport>

  <m-m-teleport v-if="icon" to="common-page-layout-header-icon">
    <m-m-icon :icon="icon" :stroke="iconStroke" />
  </m-m-teleport>
  <m-m-teleport
    v-if="breadcrumbs.length"
    to="common-page-layout-header-breadcrumbs"
  >
    <m-m-breadcrumbs :breadcrumbs="breadcrumbs" />
  </m-m-teleport>
  <m-m-teleport to="common-page-layout-header-title">
    <m-m-text-ellipsis
      v-if="showEllipsis"
      v-sanitize-html="translatedTitle"
      max-width="800px"
    />
    <div v-else v-sanitize-html="translatedTitle" />
  </m-m-teleport>
  <m-m-teleport to="common-page-layout-header-subtitle">
    <div v-sanitize-html="translatedSubtitle" />
  </m-m-teleport>
  <m-m-teleport to="common-page-layout-header-controls">
    <slot name="header-controls"></slot>
  </m-m-teleport>
</template>
<style scoped lang="scss"></style>
