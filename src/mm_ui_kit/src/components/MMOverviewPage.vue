<script setup lang="ts">
import { computed, PropType, Ref, ref } from "vue";
import { useTranslation } from "i18next-vue";
import { useRoute } from "vue-router";
import { Button } from "../types/overviewPage.types";
import MMPageHeader from "./MMPageHeader.vue";

const props = defineProps({
  resourceId: {
    type: String,
    required: true,
  },
  buttons: {
    type: Array as PropType<Button[]>,
    default: () => [],
  },
  isInEditMode: {
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
  params: {
    type: Object,
    default: () => ({}),
  },
});

const { t } = useTranslation();
const route = useRoute();
const isConfigurationItem = computed(() => route.path.includes("config"));
const pageHeaderRef: Ref<InstanceType<typeof MMPageHeader> | null> = ref(null);

const configBannerRef = computed(
  () => pageHeaderRef.value?.configBannerRef ?? null,
);

defineExpose({ configBannerRef });

const fullBaseKey = computed(() =>
  isConfigurationItem.value
    ? `configuration.${props.resourceId}`
    : props.resourceId,
);

const translatedTopBanner = computed(() =>
  t(`${fullBaseKey.value}.top-banner`, ""),
);
const translatedTopBannerSecondary = computed(() =>
  t(`${fullBaseKey.value}.top-banner-secondary`, ""),
);
const translatedHeaderBanner = computed(() =>
  t(`${fullBaseKey.value}.header-banner`, ""),
);
const translatedFooterBanner = computed(() =>
  t(`${fullBaseKey.value}.footer-banner`, ""),
);
const translatedHelpBanner = computed(() =>
  t(`${fullBaseKey.value}.need_help_banner`, ""),
);

const buttonConfigs = computed(() =>
  props.buttons.map((button) => ({
    key: button.key,
    label: t(`${fullBaseKey.value}.${button.key}.label`, button.key),
    type: t(`${fullBaseKey.value}.${button.key}.type`, "small"),
    variant: t(`${fullBaseKey.value}.${button.key}.variant`, "elevated"),
    prependIcon: t(
      `${fullBaseKey.value}.${button.key}.prependIcon`,
      "plus-white",
    ),
    minWidth: t(`${fullBaseKey.value}.${button.key}.minWidth`, ""),
    appendIcon: t(`${fullBaseKey.value}.${button.key}.appendIcon`, ""),
    isDropdown: button.isDropdown || false,
    isOnlyIcon: button.isOnlyIcon || false,
    dropdownItems: button.dropdownItems || [],
    isVisible: button.isVisible ?? true,
    isLoading: button.isLoading ?? false,
    isDisabled: button.isDisabled ?? false,
    tooltipText: button.tooltipText || "",
    action: button.action,
  })),
);

const dropdownLabels = computed(() => {
  const labels = {};
  buttonConfigs.value.forEach((button) => {
    if (button.isDropdown) {
      labels[button.key] = button.dropdownItems.map((item) => ({
        label: item.key
          ? t(
              `${fullBaseKey.value}.${button.key}.dropdown_items.${item.key}.label`,
              item.key,
            )
          : "",
        action: item.action,
      }));
    }
  });
  return labels;
});
</script>
<template>
  <div>
    <!-- Top banner -->
    <m-m-teleport v-if="translatedTopBanner" to="common-page-layout-top-banner">
      <m-m-banner :content="translatedTopBanner" />
    </m-m-teleport>

    <!-- Top banner Secondary-->
    <m-m-teleport
      v-if="translatedTopBannerSecondary"
      to="common-page-layout-top-banner-secondary"
    >
      <m-m-banner :content="translatedTopBannerSecondary" />
    </m-m-teleport>

    <!-- Header component -->
    <m-m-page-header
      ref="pageHeaderRef"
      :base-key="resourceId"
      :is-in-edit-mode="isInEditMode"
      :show-config-banner="showConfigBanner"
      :config-banner-cmp="configBannerCmp"
      :params="params"
    >
      <template #header-controls>
        <div class="mm-flex mm-flex-gap-6">
          <template v-for="button in buttonConfigs">
            <m-m-button
              v-if="!button.isDropdown && button.isVisible"
              :key="button.key"
              :variant="button.variant"
              :size="button.type"
              :is-disabled="button.isDisabled"
              :loading="button.isLoading"
              :prepend-icon="button.prependIcon"
              :append-icon="button.appendIcon"
              :min-width="button.minWidth"
              @click="button.action"
            >
              {{ button.label }}
              <m-m-tooltip v-if="button.tooltipText" display-position="toLeft">
                {{ button.tooltipText }}
              </m-m-tooltip>
            </m-m-button>
            <m-m-dropdown
              v-if="button.isDropdown"
              :key="button.key"
              list-side="left"
              :items="dropdownLabels[button.key]"
            >
              <template #activator>
                <m-m-button
                  :variant="button.variant"
                  :size="button.type"
                  :is-disabled="button.isDisabled"
                  :prepend-icon="button.prependIcon"
                  :is-only-icon="button.isOnlyIcon"
                  @click="button.action"
                >
                  {{ button.label }}
                  <m-m-tooltip
                    v-if="button.tooltipText"
                    display-position="toLeft"
                  >
                    {{ button.tooltipText }}
                  </m-m-tooltip>
                </m-m-button>
              </template>
            </m-m-dropdown>
          </template>
        </div>
      </template>
    </m-m-page-header>

    <!-- Middle banner -->
    <m-m-banner
      v-if="translatedHeaderBanner"
      :content="translatedHeaderBanner"
    />

    <!-- Slot for overview page content -->
    <slot />

    <!-- Below banner -->
    <m-m-banner
      v-if="translatedFooterBanner"
      :content="translatedFooterBanner"
    />

    <!-- Need help banner -->
    <m-m-teleport
      v-if="translatedHelpBanner"
      to="common-page-layout-footer-banner"
    >
      <MMConfigBanner :content="translatedHelpBanner" />
    </m-m-teleport>
  </div>
</template>
<style scoped lang="scss"></style>
