<script setup lang="ts">
import { useRoute } from "vue-router";
import config from "~/mm.config.json";
import { ComputedRef, computed } from "vue";
import { useBrandingConfigStore } from "~/stores/brandingConfig";

const route = useRoute();
const status = route.query.status;
const nextUrl = encodeURIComponent(route.query.next_url?.toString() || "");
const isSuccess = status && status === "SUCCESS";
const brandingConfigStore = useBrandingConfigStore();

const logoSrc: ComputedRef<string> = computed(
  () => brandingConfigStore.brandingConfigGetter?.logo_url || "",
);
const titleText = computed(() =>
  isSuccess ? "Your email was verified" : "Your email was not verified",
);
const subtitleText = computed(() =>
  isSuccess
    ? "You can now use your new email to log in to your account."
    : "Verification failed. Please try again.",
);

const loginUrl = `${config.idp.url}/login?next_url=${nextUrl}`;

const login = () => {
  window.location.href = loginUrl;
};
</script>

<template>
  <div class="mm-auth-view-signup-confirmation">
    <div
      v-if="logoSrc"
      class="mm-flex mm-flex-align-center mm-flex-justify-center mm-mb-12 mm-mx-auto"
    >
      <img :src="logoSrc" class="mm-auth-view-logo" />
    </div>
    <div class="mm-auth-view-content-title mm-mb-6">{{ titleText }}</div>
    <div class="mm-auth-view-content-subtitle mm-mb-12" data-cy="success">
      {{ subtitleText }}
    </div>
    <m-m-button
      v-if="isSuccess"
      type="submit"
      is-full-width
      data-cy="button-login"
      @click="login"
    >
      Go to profile
    </m-m-button>
  </div>
</template>

<style scoped></style>
