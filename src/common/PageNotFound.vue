<script setup lang="ts">
import { computed, ComputedRef } from "vue";
import { useBrandingConfigStore } from "~/stores/brandingConfig";

const props = defineProps({
  errorType: {
    type: String,
    default: "404",
  },
  messages: {
    type: Array,
    default: () => [],
  },
  backToLabel: {
    type: String,
    default: "Home",
  },
  backToLink: {
    type: String,
    default: "/",
  },
  showBackButton: {
    type: Boolean,
    default: true,
  },
});

const brandingConfigStore = useBrandingConfigStore();

const logoSrc: ComputedRef = computed(
  () => brandingConfigStore.brandingConfigGetter?.logo_url || "",
);

const onBackTo = () => {
  window.location.href = props.backToLink;
};
</script>

<template>
  <div class="mm-flex mm-flex-align-center page-not-found">
    <div class="mm-flex mm-flex-column mm-flex-align-start">
      <div
        v-if="logoSrc"
        class="mm-mb-15 mm-mx-auto mm-flex mm-flex-justify-center mm-flex-align-center"
      >
        <img :src="logoSrc" class="mm-auth-view-logo" />
      </div>
      <h1
        id="title"
        class="page-not-found-title"
        data-cy="page-not-found-title"
      >
        {{ props.errorType }}
      </h1>
      <div
        v-if="props.messages.length"
        data-cy="message"
        class="mm-page-title--h2 mm-mb-6"
      >
        <div
          v-for="(message, index) in props.messages"
          :key="index"
          data-cy="message"
          class="mm-page-title--h2 mm-mb-6"
        >
          <slot name="message" :message="message">{{ message }}</slot>
        </div>
      </div>
      <div v-else class="mm-mb-6">
        Sorry, you don't have access to this page. Please go back to
        {{ backToLabel }}
      </div>
      <div class="mm-flex mm-flex-justify-end mm-mb-4">
        <m-m-button
          v-if="showBackButton"
          variant="elevated"
          size="small"
          cy="back-to-button"
          min-width="130px"
          class="back-button"
          @click="onBackTo"
        >
          Back to {{ props.backToLabel }}
        </m-m-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-not-found {
  height: 100vh;
  width: 90%;
  margin-left: auto;

  .back-button {
    background-color: var(--branding-button-background-color);
    border: var(--branding-border);
    color: var(--branding-button-text-color);
  }

  &-title {
    font-size: 72px;
    line-height: 90px;
    letter-spacing: -1.4px;
  }
}
</style>
