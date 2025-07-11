<script setup lang="ts">
import { ComputedRef, computed } from "vue";
import { useBrandingConfigStore } from "~/stores/brandingConfig";

const props = defineProps({
  name: { type: String, required: true },
  previous_callable: { type: Function, required: true },
  next_callable: { type: Function, required: true },
});

const next = async () => {
  await props.next_callable();
};

const brandingConfigStore = useBrandingConfigStore();

const logoSrc: ComputedRef<string> = computed(
  () => brandingConfigStore.brandingConfigGetter?.logo_url || "",
);
</script>

<template>
  <m-m-teleport to="onboarding-title">
    <div v-if="logoSrc" class="mm-mb-15 mm-mx-auto">
      <img :src="logoSrc" class="mm-auth-view-logo" />
    </div>
    <span data-cy="onboarding-title">
      Step 2: Almost done! Join your organization
    </span>
  </m-m-teleport>
  <m-m-teleport to="onboarding-subtitle">
    <span data-cy="onboarding-subtitle">
      Congrats, you have joined your colleagues at {{ name }}
    </span>
  </m-m-teleport>
  <m-m-card
    class="mm-flex mm-flex-justify-center mm-flex-align-center mm-py-6 mm-px-7"
  >
    <div class="icon-wrapper mm-mr-8">
      <m-m-icon
        icon="building-library"
        width="17px"
        height="17px"
        stroke="#0F172A"
      />
    </div>
    <div class="mm-page-title-h4 text-align" data-cy="organization-name">
      {{ name }}
    </div>
    <m-m-button
      size="small"
      class="mm-ml-auto continue-button"
      cy="button-continue"
      @click="next()"
    >
      Continue
    </m-m-button>
  </m-m-card>

  <m-m-teleport to="onboarding-previous-button">
    <m-m-button
      id="previous"
      is-full-width
      variant="transparent"
      data-cy="button-previous"
      icon-size="24px"
      prepend-icon="arrow-small-left"
      @click.prevent="previous_callable"
    />
  </m-m-teleport>
</template>

<style scoped lang="scss">
.continue-button {
  background-color: var(--branding-button-background-color);
  border: var(--branding-border);
  color: var(--branding-button-text-color);
}
.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: #d2d6db;
}
.text-align {
  text-align: left;
}
</style>
