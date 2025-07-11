<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { computed, ComputedRef, onMounted, ref, Ref } from "vue";
import config from "~/mm.config.json";
import { AlertTypes } from "~/mm_ui_kit/src/types/alert.types";
import { useBrandingConfigStore } from "~/stores/brandingConfig";
import { ERRORS_SIGNUP } from "~/auth/constants";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { getUserEmail } from "~/auth/cookies";
import { signupService } from "~/signup/signup.service";

const route = useRoute();
const router = useRouter();

const twoFactorAuthenticationRef: Ref<{ code: string }> = ref({
  code: "",
});
const qrUrl: Ref<string> = ref("");
const brandingConfigStore = useBrandingConfigStore();
const username = getUserEmail();

const logoSrc: ComputedRef<string> = computed(
  () => brandingConfigStore.brandingConfigGetter?.logo_url || "",
);
const isAlertVisible: Ref<boolean> = ref(!!route.query.error);
const errorDescription = route.query.error
  ? ERRORS_SIGNUP[route.query.error.toString() as keyof typeof ERRORS_SIGNUP]
  : "Something went wrong. Please try again.";

const code: ComputedRef<string> = computed(
  () => twoFactorAuthenticationRef.value.code,
);

const csrf_token: ComputedRef<string> = computed(
  (): string => route.query.csrf_token?.toString() || "",
);

const next_url: ComputedRef<string> = computed(
  (): string => route.query.next_url?.toString() || "",
);

const mfa_methods: ComputedRef<string> = computed(
  (): string => route.query.mfa_methods?.toString() || "",
);

const isChooseDifferentMFAMethod: ComputedRef<boolean> = computed(() =>
  Boolean(mfa_methods.value.split(",").length > 1),
);

const mfa_required: ComputedRef<string> = computed(
  (): string => route.query.mfa_required?.toString() || "",
);

const goToMFASelection = () => {
  router.push({
    path: "/signup/mfa",
    query: {
      next_url: next_url.value,
      mfa_methods: mfa_methods.value,
      username,
      csrf_token: csrf_token.value,
      mfa_required: mfa_required.value,
    },
  });
};

const onAlertClose = () => {
  isAlertVisible.value = false;
};

const getTOTPQrUrl = async () => {
  try {
    const result = await signupService.getTOTPQrUrl(username);
    qrUrl.value = result.qr_url;
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Error fetching TOTP QR Url",
      status: "error",
    });
  }
};

onMounted(async () => {
  await getTOTPQrUrl();
});
</script>

<template>
  <div v-if="logoSrc" class="mm-mx-auto">
    <img :src="logoSrc" class="mm-auth-view-logo" />
  </div>
  <div class="mm-auth-view-content-title">Setup two-factor authentication</div>
  <m-m-alert
    v-if="isAlertVisible"
    :status="AlertTypes.Error"
    cy="login-form-alert"
    class="mm-mb-12"
    @close="onAlertClose"
  >
    {{ errorDescription }}
  </m-m-alert>
  <form
    v-mm-focus-first
    :action="`${config.idp.url}/signup/totp`"
    method="POST"
    class="mm-two-factor-authentication"
  >
    <m-m-two-factor-authentication
      v-if="qrUrl"
      ref="twoFactorAuthenticationRef"
      class="mm-mb-12"
      :qr-url="qrUrl"
    />
    <input type="hidden" name="code" :value="code" />
    <input type="hidden" name="csrf_token" :value="csrf_token" />
    <input type="hidden" name="next_url" :value="next_url" />
    <input type="hidden" name="username" :value="getUserEmail()" />
    <m-m-button is-full-width type="submit" class="verify-button">
      Verify and proceed
    </m-m-button>
  </form>
  <m-m-button
    v-if="isChooseDifferentMFAMethod"
    cy="continue"
    variant="transparent"
    size="small"
    class="mm-mx-auto mm-auth-view-button-submit mm-mb-8"
    @click="goToMFASelection"
  >
    Use a different method
  </m-m-button>
</template>

<style scoped lang="scss">
.verify-button {
  background-color: var(--branding-button-background-color);
  border: var(--branding-border);
  color: var(--branding-button-text-color);
}
.mm-two-factor-authentication {
  max-width: -webkit-fill-available;
}
/* Styles for mobile */
@media (max-width: $breakpoint-xs) {
  .mm-two-factor-authentication {
    width: calc(100% - 30px);
  }
}
</style>
