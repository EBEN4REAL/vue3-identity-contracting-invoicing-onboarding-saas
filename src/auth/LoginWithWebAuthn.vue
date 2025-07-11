<script setup lang="ts">
import { useRoute } from "vue-router";
import {
  startRegistration,
  startAuthentication,
} from "@simplewebauthn/browser";
import config from "~/mm.config.json";
import { ref, computed, Ref, ComputedRef, watch, onMounted } from "vue";
import { useBrandingConfigStore } from "~/stores/brandingConfig";
import { ERRORS_LOGIN } from "~/auth/constants";
import { eventBus } from "~/mm_ui_kit/src/helpers/EventBus";
import { AlertTypes } from "~/mm_ui_kit/src/types/alert.types";
import { useRouter } from "vue-router";
import { getUserEmail } from "~/auth/cookies";

const props = defineProps({
  isLogin: {
    type: Boolean,
    default: false,
  },
});

const route = useRoute();
const router = useRouter();
const brandingConfigStore = useBrandingConfigStore();
const { webauthn_options, csrf_token, next_url } = route.query;
const username = getUserEmail();

const signupWithWebAuthnUrl = `${config.idp.url}/signup/webauthn`;
const loginWithWebAuthnUrl = `${config.idp.url}/login-webauthn?next_url=${encodeURIComponent(`${next_url}`)}`;
const hasBiometricsRegistrationFailed: Ref<boolean> = ref(false);

const credential: Ref<string> = ref("");
const loading: Ref<boolean> = ref(false);
const webauthnForm = ref<HTMLFormElement | null>(null);
const isAlertVisible: Ref<boolean> = ref(!!route.query.error);
const errorDescription = route.query.error
  ? ERRORS_LOGIN[route.query.error.toString() as keyof typeof ERRORS_LOGIN]
  : "Something went wrong. Please try again.";

const logoSrc: ComputedRef<string> = computed(
  () => brandingConfigStore.brandingConfigGetter?.logo_url || "",
);

const parsedOptions = computed(() =>
  webauthn_options ? JSON.parse(atob(webauthn_options as string)) : null,
);

const mfaMethods: ComputedRef<string> = computed(
  () => route.query.mfa_methods?.toString() || "",
);

const isChooseDifferentMFAMethod: ComputedRef<boolean> = computed(() =>
  Boolean(mfaMethods.value.split(",").length > 1),
);

const mfa_required: ComputedRef<string> = computed(
  (): string => route.query.mfa_required?.toString() || "",
);

const webAuthnUrl = computed(() =>
  props.isLogin ? loginWithWebAuthnUrl : signupWithWebAuthnUrl,
);

const handleWebAuthnRegistration = async () => {
  if (!parsedOptions.value) return;

  try {
    loading.value = true;
    const regResp = await startRegistration(parsedOptions.value);
    credential.value = JSON.stringify(regResp);
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Biometrics Registration Failed",
      status: "error",
    });
    hasBiometricsRegistrationFailed.value = true;
  } finally {
    loading.value = false;
  }
};

const handleWebAuthentication = async () => {
  if (!parsedOptions.value) return;

  try {
    loading.value = true;
    const authResp = await startAuthentication(parsedOptions.value);
    credential.value = JSON.stringify(authResp);
  } catch (error) {
    eventBus.$emit("onShowToast", {
      text: "Biometrics Verification Failed",
      status: "error",
    });
  } finally {
    loading.value = false;
  }
};

watch(
  () => credential.value,
  (newCredential) => {
    if (newCredential && webauthnForm.value) {
      if (newCredential.trim() !== "") {
        setTimeout(() => {
          webauthnForm.value?.submit();
        }, 1000);
      }
    }
  },
);

const startWebauthnCredentialProcessing = async () => {
  if (props.isLogin) {
    await handleWebAuthentication();
  } else {
    await handleWebAuthnRegistration();
  }
};

const goToMFASelection = () => {
  const path = props.isLogin ? "/login-mfa" : "/signup/mfa";
  router.push({
    path,
    query: {
      next_url,
      mfa_methods: mfaMethods.value,
      username,
      csrf_token,
      mfa_required: mfa_required.value,
    },
  });
};

const onAlertClose = () => {
  isAlertVisible.value = false;
};

onMounted(async () => {
  await startWebauthnCredentialProcessing();
});
</script>

<template>
  <div class="mm-auth-view-web-authn">
    <div
      v-if="logoSrc"
      class="mm-mb-15 mm-mx-auto mm-flex mm-flex-justify-center mm-flex-align-center"
    >
      <img :src="logoSrc" class="mm-auth-view-logo" />
    </div>
    <m-m-alert
      v-if="!isAlertVisible"
      :status="AlertTypes.Info"
      cy="login-form-alert"
      class="mm-mb-12"
    >
      If biometrics fails, please disable any password manager plugin and try
      again
    </m-m-alert>
    <div class="mm-auth-view-content-title mm-mb-6">Biometrics</div>
    <div class="mm-auth-view-content-subtitle mm-mb-12">
      Complete biometrics verification to proceed
    </div>
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
      ref="webauthnForm"
      v-mm-focus-first
      :action="webAuthnUrl"
      method="post"
      class="mm-w-10"
    >
      <input type="hidden" name="username" :value="username" />
      <input type="hidden" name="csrf_token" :value="csrf_token" />
      <input type="hidden" name="credential" :value="credential" />
      <input v-if="!isLogin" type="hidden" name="next_url" :value="next_url" />
    </form>
    <div class="w-100 mm-flex mm-flex-justify-center">
      <m-m-button
        v-if="isChooseDifferentMFAMethod"
        cy="continue"
        variant="elevated"
        size="small"
        class="mm-mx-auto mm-auth-view-button-submit mm-mb-8"
        @click="goToMFASelection"
      >
        Use a different method
      </m-m-button>
    </div>
  </div>
</template>
<style scoped lang="scss">
.mm-auth-view-button-submit {
  background-color: var(--branding-button-background-color);
  border: var(--branding-border);
  color: var(--branding-button-text-color);
}
.mm-auth-view-web-authn {
  min-width: 490px;
  border-radius: 12px;
  background: white;
  padding: 30px 60px 30px;

  &-container {
    min-height: 56px;
    border-radius: 16px;
    background: #f4f5f7;
    padding: 16px;
    cursor: pointer;
  }
}

/* Styles for mobile */
@media (max-width: $breakpoint-xs) {
  .mm-auth-view-web-authn {
    box-shadow: none;
    background: transparent;
    width: calc(100% - 30px);
    padding: 0;
    min-width: auto;
  }
}
</style>
